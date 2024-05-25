using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SiLA_Backend.Data;
using SiLA_Backend.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using SiLA_Backend.DTOs;
using SiLA_Backend.Utilities;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon.S3.Model;
using System.Text.Json;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Newtonsoft.Json.Linq;
using Mailjet.Client.Resources;

namespace SiLA_Backend.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenManager _tokenManager;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAmazonS3 _amazonS3;
        private readonly string _bucketName = "sila-storage";
        private readonly string _region = "ap-southeast-2";
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MailService _mailService;


        public SubmissionService(MailService mailService, IWebHostEnvironment hostEnvironment, ApplicationDbContext context, ITokenManager tokenManager, UserManager<ApplicationUser> userManager, IAmazonS3 amazonS3, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _tokenManager = tokenManager;
            _hostingEnvironment = hostEnvironment;
            _userManager = userManager;
            _amazonS3 = amazonS3;
            _httpContextAccessor = httpContextAccessor;
            _mailService = mailService;
        }
        public async Task<(bool IsSuccess, string Message)> SubmitAsync(ManuscriptSubmissionModel model)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var manuscript = new Manuscript
                    {
                        Title = model.Title,
                        Abstract = model.Abstract,
                        AuthorId = model.AuthorId,
                        Category = model.Category,
                        AuthorsInfo = model.AuthorsInfo, // Directly store the JSON string
                        Declaration = model.Declaration,
                        FilePath = model.PDFs
                    };

                    _context.Manuscripts.Add(manuscript);
                    await _context.SaveChangesAsync();

                    var submission = new Submission
                    {
                        ManuscriptId = manuscript.Id,
                        AuthorId = manuscript.AuthorId,
                        SubmissionDate = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow),
                        Status = SubmissionStatus.Submitted.ToString(),
                        Title = model.Title,
                        Category = model.Category
                    };

                    _context.Submissions.Add(submission);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    var user = await _userManager.FindByIdAsync(model.AuthorId);
                    if (user == null)
                        throw new KeyNotFoundException("User not found");

                    var editors = await _userManager.GetUsersInRoleAsync("Editor");
                    var editorEmails = editors.Select(editor => new
                    {
                        editor.Email,
                        editor.FirstName,
                        editor.LastName
                    }).ToList();

                    var submissionsToAssignCount = await _context.Submissions.CountAsync(s => s.Status == SubmissionStatus.Submitted.ToString());
                    var submissionsToDecisionCount = await _context.Submissions.CountAsync(s => s.Status == SubmissionStatus.WaitingForDecision.ToString());

                    // 异步发送邮件给作者
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            Console.WriteLine("Sending email to author");
                            var variables = new JObject
                            {
                                { "name", $"{user.FirstName} {user.LastName}" },
                                { "Title", model.Title },
                                { "SubmissionDate", UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).ToString("yyyy-MM-dd") },
                                { "ManucriptId", manuscript.Id.ToString() }
                            };

                            await _mailService.SendEmailAsync(new Email_Model
                            {
                                To = user.Email!,
                                ToName = $"{user.FirstName} {user.LastName}",
                                Subject = "Dear [[data:name:\"\"]], you have new notification on SILA",
                                TemplateId = 5984828, // Template ID
                                Variables = variables
                            });
                        }
                        catch (Exception ex)
                        {
                            // Log the error if needed
                            Console.WriteLine($"Error sending email to author: {ex.Message}");
                        }
                    });

                    // 异步发送邮件给编辑
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            foreach (var editor in editorEmails)
                            {
                                var variables = new JObject
                                {
                                    { "name", $"{editor.FirstName} {editor.LastName}" },
                                    { "needToAssign", submissionsToAssignCount.ToString() },
                                    { "needToDecision", submissionsToDecisionCount.ToString() }
                                };

                                await _mailService.SendEmailAsync(new Email_Model
                                {
                                    To = editor.Email!,
                                    ToName = $"{editor.FirstName} {editor.LastName}",
                                    Subject = "Dear [[data:name:\"\"]], you have new notification on SILA",
                                    TemplateId = 5984505, // Template ID
                                    Variables = variables
                                });
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log the error if needed
                            Console.WriteLine($"Error sending email to editors: {ex.Message}");
                        }
                    });

                    return (true, "Submission successful");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Log the error
                    return (false, $"An error occurred: {ex.Message}");
                }
            }
        }



        public async Task<List<AuthorDashBoardDTO>> GetAuthorDashBoardAsync(string authorId)
        {

            var user = await _userManager.FindByIdAsync(authorId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            var submissions = await _context.Submissions
            .Where(s => s.AuthorId == authorId)
            .Include(s => s.Manuscript)
            .Select(s => new AuthorDashBoardDTO
            {
                Id = s.Id,
                Title = s.Title,
                Category = s.Manuscript.Category,
                SubmissionDate = s.SubmissionDate,
                Status = s.Status // Convert the enum to string
            })
            .ToListAsync();

            return submissions;
        }

        public async Task<(bool IsSuccess, string Message)> AssignReviewersAsync(int submissionId, List<string> reviewerIds)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var userId = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var submission = await _context.Submissions.FindAsync(submissionId);
                    if (submission == null)
                        throw new KeyNotFoundException("Submission not found");

                    if (submission.Status != SubmissionStatus.Submitted.ToString())
                        return (false, "Submission is not in submitted status");

                    if (submission.Status == SubmissionStatus.Withdrawn.ToString())
                        return (false, "Submission has been withdrawn");

                    if (submission.CaseCompleted)
                        return (false, "Submission has been completed");

                    submission.Status = SubmissionStatus.ToBeReviewed.ToString();
                    submission.ReviewDeadline = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).AddDays(7); // Set review deadline to 7 days from now
                    submission.EditorId = userId;

                    var reviewerSubmissions = new List<ReviewerSubmission>();

                    foreach (var reviewerId in reviewerIds)
                    {
                        var reviewer = await _userManager.FindByIdAsync(reviewerId);
                        if (reviewer == null)
                            throw new KeyNotFoundException("One or several Reviewer(s) not found");

                        var reviewerSubmission = new ReviewerSubmission
                        {
                            SubmissionId = submissionId,
                            ReviewerId = reviewerId,
                            Status = SubmissionStatus.ToBeReviewed.ToString(),
                            Deadline = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).AddDays(7),
                            IsRevision = false,
                            IsReviewComplete = false,
                            CommentsToEditor = JsonSerializer.Serialize(new Dictionary<string, string>()),
                            CommentsToAuthor = JsonSerializer.Serialize(new Dictionary<string, string>())
                        };

                        reviewerSubmissions.Add(reviewerSubmission);
                        _context.ReviewerSubmissions.Add(reviewerSubmission);
                    }
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var author = await _userManager.FindByIdAsync(submission.AuthorId);
                    var authorVariables = new JObject
                        {
                            { "name", $"{author.FirstName} {author.LastName}"},
                            { "Title", submission.Title },
                            { "Status", SubmissionStatus.ToBeReviewed.ToString()}
                        };

                    // 异步发送邮件给作者
                    _ = Task.Run(async () =>
                    {
                        if (author != null)
                        {
                            await _mailService.SendEmailAsync(new Email_Model
                            {
                                To = author.Email!,
                                ToName = $"{author.FirstName} {author.LastName}",
                                Subject = $"Hi {author.FirstName}, your submission has been assigned to reviewers",
                                TemplateId = 5984821, // Template ID
                                Variables = authorVariables
                            });
                        }
                    });

                    // 获取每个审稿人的任务数量并发送邮件
                    foreach (var reviewerId in reviewerIds)
                    {
                        var reviewer = await _userManager.FindByIdAsync(reviewerId);
                        if (reviewer != null)
                        {
                            var reviewerTasks = reviewerSubmissions.Where(rs => rs.ReviewerId == reviewerId && rs.Status == SubmissionStatus.ToBeReviewed.ToString()).ToList();
                            var reviewerVariables = new JObject
                            {
                                { "name", $"{reviewer.FirstName} {reviewer.LastName}"},
                                { "NumberOfTask", reviewerTasks.Count.ToString()},
                            };

                            _ = Task.Run(async () =>
                            {
                                await _mailService.SendEmailAsync(new Email_Model
                                {
                                    To = reviewer.Email!,
                                    ToName = $"{reviewer.FirstName} {reviewer.LastName}",
                                    Subject = "New review tasks assigned to you",
                                    TemplateId = 5984822, // Template ID
                                    Variables = reviewerVariables
                                });
                            });
                        }
                    }

                    return (true, "Reviewers assigned successfully");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return (false, $"An error occurred: {ex.Message}");
                }
            }
        }


        public async Task<List<ReviewerDashBoardDTO>> GetReviewerDashBoardAsync(string ReviewerId)
        {
            var user = await _userManager.FindByIdAsync(ReviewerId);
            if (user == null)
                throw new KeyNotFoundException("Reviewer not found");

            var submissions = await _context.ReviewerSubmissions
                .Where(s => s.ReviewerId == ReviewerId)
                .Select(s => new ReviewerDashBoardDTO
                {
                    SubmissionId = s.SubmissionId,
                    Title = s.Submission.Title,
                    Category = s.Submission.Category,
                    SubmissionDate = s.Submission.SubmissionDate.ToString("yyyy-MM-dd HH:mm:ss"),
                    ReviewDeadline = s.Deadline.ToString("yyyy-MM-dd HH:mm:ss"),
                    Status = s.Status
                })
                .ToListAsync();

            return submissions;
        }

        public async Task<List<EditorDashBoardDTO>> GetEditorDashBoardAsync(string EditorId)
        {
            var user = await _userManager.FindByIdAsync(EditorId);
            if (user == null)
                throw new KeyNotFoundException("Editor not found");

            var submissions = await _context.Submissions
            .Select(s => new EditorDashBoardDTO
            {
                SubmissionId = s.Id,
                Title = s.Title,
                Category = s.Manuscript.Category,
                SubmissionDate = s.SubmissionDate,
                Status = s.Status // Convert the enum to string
            })
            .ToListAsync();

            return submissions;
        }

        public async Task<SubmissionAbsDTO> GetSubmissionAbstractAsync(int submissionId)
        {


            var submissionAbs = await _context.Submissions
            .Where(s => s.Id == submissionId)
            .Include(s => s.Manuscript)
            .Include(s => s.Author)
            .Select(s => new SubmissionAbsDTO
            {

                Title = s.Title,
                Category = s.Category,
                Abstract = s.Manuscript.Abstract,
                AuthorName = $"{s.Author.FirstName} {s.Author.LastName}"
            })
            .FirstOrDefaultAsync();

            if (submissionAbs == null)
                throw new KeyNotFoundException("Submission not found");

            return submissionAbs;

        }

        public async Task<SubmissionDetailForReviewerDTO> GetSubmissionDetailForReviewerAsync(int submissionId)
        {
            var submissionDetail = await _context.Submissions
                .Where(s => s.Id == submissionId)
                .Include(s => s.Manuscript)
                .Select(s => new
                {
                    Submission = s,
                    s.Manuscript
                }).FirstOrDefaultAsync();

            if (submissionDetail == null)
                throw new KeyNotFoundException("Submission not found");

            if (submissionDetail.Submission.Status == SubmissionStatus.Withdrawn.ToString())
                throw new InvalidOperationException("Submission has been withdrawn");

            if (submissionDetail.Submission.CaseCompleted)
                throw new InvalidOperationException("Submission has been completed");

            var filePaths = JsonSerializer.Deserialize<Dictionary<string, string>>(submissionDetail.Manuscript.FilePath);

            Dictionary<string, string> preSignedUrls = new Dictionary<string, string>();

            if (filePaths.ContainsKey("body"))
            {
                string presignedUrl = await GeneratePreSignedURLAsync(filePaths["body"]);
                preSignedUrls.Add("body", presignedUrl);
            }

            return new SubmissionDetailForReviewerDTO
            {
                SubmissionId = submissionDetail.Submission.Id,
                Title = submissionDetail.Submission.Title,
                Category = submissionDetail.Submission.Category,
                File = preSignedUrls,
                Declaration = submissionDetail.Manuscript.Declaration,
                SubmissionDate = submissionDetail.Submission.SubmissionDate.ToString("yyyy-MM-dd HH:mm:ss"),
                ReviewDeadline = submissionDetail.Submission.ReviewDeadline!.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                Status = submissionDetail.Submission.Status
            };
        }

        public async Task<SubmissionDetailForEditorDTO> GetSubmissionDetailForEditorAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .Where(s => s.Id == submissionId)
                .Include(s => s.Manuscript)
                .Include(s => s.ReviewerSubmissions)
                    .ThenInclude(rs => rs.Reviewer)
                .FirstOrDefaultAsync();

            if (submission == null)
                throw new KeyNotFoundException("Submission not found");

            var filePaths = JsonSerializer.Deserialize<Dictionary<string, string>>(submission.Manuscript.FilePath);

            Dictionary<string, string> preSignedUrls = new Dictionary<string, string>();
            foreach (var file in filePaths!)
            {
                string presignedUrl = await GeneratePreSignedURLAsync(file.Value);
                preSignedUrls.Add(file.Key, presignedUrl);
            }

            var reviewers = submission.ReviewerSubmissions
                .Select(rs => new ReviewerDTO
                {
                    ReviewerId = rs.Reviewer.Id,
                    ReviewerName = $"{rs.Reviewer.FirstName} {rs.Reviewer.LastName}",
                    ReviewerContact = rs.Reviewer.Email!,
                    ReviewerRecommendation = rs.Recommendation ?? "N/A", //rs.Recommendation
                    IsRevision = rs.IsRevision, //rs.IsRevision
                    IsReviewComplete = rs.IsReviewComplete, //rs.IsReviewComplete
                    ReviewerStatus = rs.Status,
                    DocumentUrl = !string.IsNullOrEmpty(rs.FileUrl) ? GeneratePreSignedURLAsync(rs.FileUrl).Result : "N/A"
                })
                .ToList();

            var commentsFromReviewers = submission.ReviewerSubmissions
                .Select(rs => JsonSerializer.Deserialize<Dictionary<string, string>>(rs.CommentsToEditor ?? "{}"))
                .ToList();
            var commentsToAuthor = submission.ReviewerSubmissions
                .Select(rs => JsonSerializer.Deserialize<Dictionary<string, string>>(rs.CommentsToAuthor ?? "{}"))
                .ToList();

            var submissionDetail = new SubmissionDetailForEditorDTO
            {
                SubmissionId = submission.Id,
                Title = submission.Manuscript.Title,
                Category = submission.Manuscript.Category,
                Files = new List<Dictionary<string, string>> { preSignedUrls },
                Declaration = submission.Manuscript.Declaration,
                SubmissionDate = submission.SubmissionDate.ToString("yyyy-MM-dd HH:mm:ss"),
                ReviewDeadline = submission.ReviewDeadline != null ? submission.ReviewDeadline.Value.ToString("yyyy-MM-dd HH:mm:ss") : "N/A",
                RevisedDeadline = submission.RevisedDeadline != null ? submission.RevisedDeadline.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                Status = submission.Status,
                Reviewers = reviewers,
                CommentsFromReviewers = commentsFromReviewers!,
                CommentsToAuthor = commentsToAuthor!,
                EditorComment = submission.CommentsFromEditor ?? null

            };
            return submissionDetail;
        }

        public async Task<(bool IsSuccess, string Message)> SubmitReviewAsync(SubmissionReviewDTO model)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var reviewerSubmission = await _context.ReviewerSubmissions
                        .Include(rs => rs.Submission)
                        .FirstOrDefaultAsync(rs => rs.SubmissionId == model.SubmissionId && rs.ReviewerId == model.ReviewerId);
                    if (reviewerSubmission == null)
                        throw new KeyNotFoundException("Reviewer Submission not found");
                    if (reviewerSubmission.Status != SubmissionStatus.ToBeReviewed.ToString())
                        return (false, "Submission has already been reviewed");
                    if (reviewerSubmission.Submission.Status == SubmissionStatus.Withdrawn.ToString())
                        return (false, "Submission has been withdrawn");
                    if (reviewerSubmission.Deadline < UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow))
                    {
                        reviewerSubmission.Status = SubmissionStatus.Expired.ToString();
                        return (false, "Review deadline has passed or submission has been closed");
                    }
                    if (reviewerSubmission.Submission.CaseCompleted)
                        return (false, "Submission has been completed");
                    reviewerSubmission.Recommendation = model.Recommendation;
                    reviewerSubmission.IsReviewComplete = true;
                    reviewerSubmission.FileUrl = model.FileUrl;
                    reviewerSubmission.Status = SubmissionStatus.Reviewed.ToString();
                    reviewerSubmission.CommentsToEditor = JsonSerializer.Serialize(
                        new Dictionary<string, string>
                        {
                            { "Reviewer", model.ReviewerName },
                            { "ReviewerId", model.ReviewerId },
                            { "LastEditDate", UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).ToString("yyyy-MM-dd HH:mm:ss")},
                            { "Comments", model.CommentsToEditor }
                        }
                    );
                    reviewerSubmission.CommentsToAuthor = JsonSerializer.Serialize(
                        new Dictionary<string, string>
                        {
                            { "Reviewer", model.ReviewerName },
                            { "ReviewerId", model.ReviewerId },
                            { "LastEditDate", UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).ToString("yyyy-MM-dd HH:mm:ss")},
                            { "Comments", model.CommentsToAuthor }
                        }
                    );
                    await _context.SaveChangesAsync();
                    await UpdateSubmissionStatusIfNeeded(model.SubmissionId);
                    await transaction.CommitAsync();


                    return (true, "Review submitted successfully");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return (false, $"An error occurred: {ex.Message}");
                }
            }
        }


        private async Task<string> GeneratePreSignedURLAsync(string objectKey)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Expires = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).AddMinutes(60)
            };

            try
            {
                string preSignedURL = _amazonS3.GetPreSignedURL(request);
                return preSignedURL;
            }
            catch (Exception ex)
            {
                throw new Exception("Error generating pre-signed URL: " + ex.Message);
            }
        }

        public async Task UpdateSubmissionStatusIfNeeded(int submissionId)
        {
            var reviewerSubmissions = await _context.ReviewerSubmissions
                .Where(rs => rs.SubmissionId == submissionId)
                .ToListAsync();

            if (reviewerSubmissions.All(rs => rs.Status != SubmissionStatus.ToBeReviewed.ToString()))
            {
                var submission = await _context.Submissions
                    .FirstOrDefaultAsync(s => s.Id == submissionId);

                if (submission != null && submission.Status != SubmissionStatus.WaitingForDecision.ToString())
                {
                    submission.Status = SubmissionStatus.WaitingForDecision.ToString();
                    _context.Submissions.Update(submission);
                    await _context.SaveChangesAsync();

                    // 获取编辑和作者的数据并计算所需的变量
                    var editors = await _userManager.GetUsersInRoleAsync("Editor");
                    var editorEmails = editors.Select(editor => new
                    {
                        editor.Email,
                        editor.FirstName,
                        editor.LastName
                    }).ToList();

                    var author = await _userManager.FindByIdAsync(submission.AuthorId);
                    var needToAssignCount = await _context.Submissions.CountAsync(s => s.Status == SubmissionStatus.Submitted.ToString());
                    var needToDecisionCount = await _context.Submissions.CountAsync(s => s.Status == SubmissionStatus.WaitingForDecision.ToString());

                    // 异步发送邮件给编辑
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            foreach (var editor in editorEmails)
                            {
                                var variables = new JObject
                                {
                                    { "name", $"{editor.FirstName} {editor.LastName}" },
                                    { "needToAssign", needToAssignCount.ToString() },
                                    { "needToDecision", needToDecisionCount.ToString() }
                                };

                                await _mailService.SendEmailAsync(new Email_Model
                                {
                                    To = editor.Email!,
                                    ToName = $"{editor.FirstName} {editor.LastName}",
                                    Subject = $"Hi Editor {editor.FirstName}, you have new notification on SILA",
                                    TemplateId = 5984505, // Template ID
                                    Variables = variables
                                });
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log the error if needed
                            Console.WriteLine($"Error sending email to editors: {ex.Message}");
                        }
                    });

                    // 异步发送邮件给作者
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            if (author != null)
                            {
                                var variables = new JObject
                                {
                                    { "name", $"{author.FirstName} {author.LastName}" },
                                    { "Title", submission.Title },
                                    { "Status", SubmissionStatus.WaitingForDecision.ToString() }
                                };

                                await _mailService.SendEmailAsync(new Email_Model
                                {
                                    To = author.Email!,
                                    ToName = $"{author.FirstName} {author.LastName}",
                                    Subject = $"Dear {author.FirstName}, your submission status has been updated",
                                    TemplateId = 5984821, // Template ID
                                    Variables = variables
                                });
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log the error if needed
                            Console.WriteLine($"Error sending email to author: {ex.Message}");
                        }
                    });
                }
            }
        }



        public async Task<SubmissionDetailForAuthorDTO> submissionDetailForAuthorDTO(int submissionId)
        {
            try
            {
                var submission = await _context.Submissions
                .Where(s => s.Id == submissionId)
                .Include(s => s.Manuscript)
                .Include(s => s.ReviewerSubmissions)
                .ThenInclude(rs => rs.Reviewer)
                .AsNoTracking()
                .FirstOrDefaultAsync();

                if (submission == null)
                {
                    throw new KeyNotFoundException("Submission not found.");
                }

                if (submission.AuthorId != _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier))
                {
                    throw new UnauthorizedAccessException("Unauthorized to view this submission.");
                }

                // if (submission.Status == SubmissionStatus.Withdrawn.ToString())
                // {
                //     throw new InvalidOperationException("Submission has been withdrawn.");
                // }

                var filePaths = JsonSerializer.Deserialize<Dictionary<string, string>>(submission.Manuscript.FilePath);

                Dictionary<string, string> preSignedUrls = new Dictionary<string, string>();
                foreach (var file in filePaths!)
                {
                    string presignedUrl = await GeneratePreSignedURLAsync(file.Value);
                    preSignedUrls.Add(file.Key, presignedUrl);
                }

                var dto = new SubmissionDetailForAuthorDTO
                {
                    SubmissionId = submission.Id,
                    Title = submission.Manuscript.Title,
                    Category = submission.Manuscript.Category,
                    Declaration = submission.Manuscript.Declaration,
                    Abstract = submission.Manuscript.Abstract,
                    AuthorFiles = new List<Dictionary<string, string>> { preSignedUrls },
                    SubmissionDate = submission.SubmissionDate.ToString("yyyy-MM-dd"),
                    Status = submission.Status,
                    RevisedDeadline = submission.RevisedDeadline != null ? submission.RevisedDeadline.Value.ToString("yyyy-MM-dd HH:mm:ss") : "N/A",
                    IsExtensionChanceUsed = submission.IsExtensionChanceUsed,
                    ReviewerComments = submission.ReviewerSubmissions.Select((rs, index) => new ReviewerCommentsDTO
                    {
                        ReviewerIndex = index + 1,
                        CommentsToAuthor = JsonSerializer.Deserialize<Dictionary<string, string>>(rs.CommentsToAuthor ?? "{}"),
                        DocumentUrl = !string.IsNullOrEmpty(rs.FileUrl) ? GeneratePreSignedURLAsync(rs.FileUrl).Result : "N/A"
                    }).ToList(),
                    ReviewerRecommendations = submission.ReviewerSubmissions.Select((rs, index) => new ReviewerRecommendationsDTO
                    {
                        ReviewerIndex = index + 1,
                        Recommendation = rs.Recommendation!
                    }).ToList(),
                    CommentsFromEditor = submission.CommentsFromEditor?.ToString() ?? "N/A"
                };

                return dto;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred: {ex.Message}");
            }

        }

        public async Task<(bool IsSuccess, string Message)> SubmitEditorDecisionAsync(EditorDecisionDTO model)
        {
            try
            {
                var submission = await _context.Submissions
                    .Where(s => s.Id == model.SubmissionId)
                    .FirstOrDefaultAsync();

                if (submission == null)
                    throw new KeyNotFoundException("Submission not found");

                if (submission.Status == SubmissionStatus.Withdrawn.ToString())
                {
                    return (false, "Submission has been withdrawn");
                }

                if (submission.CaseCompleted)
                {
                    return (false, "Submission has been completed");
                }

                if (model.Decision == SubmissionStatus.Revised.ToString())
                {
                    submission.RevisedDeadline = DateTime.Parse(model.RevisedDeadline!);
                }
                else if (model.Decision == SubmissionStatus.Accepted.ToString() || model.Decision == SubmissionStatus.Rejected.ToString())
                {
                    submission.CaseCompleted = true;
                }

                submission.Status = model.Decision;
                submission.CommentsFromEditor = model.CommentsFromEditor;
                await _context.SaveChangesAsync();

                var author = await _userManager.FindByIdAsync(submission.AuthorId);

                // 异步发送邮件给作者
                _ = Task.Run(async () =>
                {
                    try
                    {
                        if (author != null)
                        {
                            string sendingstatus = model.Decision == SubmissionStatus.Revised.ToString() ? $"Revised by {model.RevisedDeadline}" : model.Decision;
                            var variables = new JObject
                            {
                                { "name", $"{author.FirstName} {author.LastName}" },
                                { "Title", submission.Title },
                                { "Status", sendingstatus }
                            };

                            await _mailService.SendEmailAsync(new Email_Model
                            {
                                To = author.Email!,
                                ToName = $"{author.FirstName} {author.LastName}",
                                Subject = $"Hi {author.FirstName}, your submission status has been updated",
                                TemplateId = 5984828, // Template ID
                                Variables = variables
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log the error if needed
                        Console.WriteLine($"Error sending email to author: {ex.Message}");
                    }
                });

                return (true, "Editor decision submitted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }


        public async Task<(bool IsSuccess, string Message)> SubmitAuthorResponseAsync(AuthorResponseDTO model)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userId = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var submission = await _context.Submissions
                    .Include(s => s.Manuscript)
                    .Include(s => s.ReviewerSubmissions)
                    .FirstOrDefaultAsync(s => s.Id == model.SubmissionId) ?? throw new KeyNotFoundException("Submission not found");

                if (submission.AuthorId != userId)
                {
                    return (false, "Unauthorized to modify this submission");
                }

                if (submission.Status == SubmissionStatus.Withdrawn.ToString())
                {
                    return (false, "Submission has been withdrawn");
                }

                if (submission.CaseCompleted)
                {
                    return (false, "Submission has been completed");
                }

                if (submission.Status != SubmissionStatus.Revised.ToString())
                {
                    return (false, "Submission is not in revised status");
                }

                if (UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow) > submission.RevisedDeadline)
                {
                    return (false, "Revised deadline has passed");
                }

                submission.Manuscript.RevisedFilePaths = model.ResponseFile;
                submission.Status = SubmissionStatus.ToBeReviewed.ToString();
                foreach (var rs in submission.ReviewerSubmissions)
                {
                    rs.Status = SubmissionStatus.ToBeReviewed.ToString();
                    rs.Deadline = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).AddDays(7);
                    rs.IsReviewComplete = false;
                    rs.IsRevision = true;
                    rs.CommentsToAuthor = "{}";
                    rs.CommentsToEditor = "{}";
                    rs.Recommendation = null;
                    rs.FileUrl = null;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // 获取审稿人数据
                var reviewerIds = submission.ReviewerSubmissions.Select(rs => rs.ReviewerId).Distinct().ToList();
                var reviewers = await _userManager.Users
                    .Where(u => reviewerIds.Contains(u.Id))
                    .ToListAsync();

                foreach (var reviewer in reviewers)
                {
                    var reviewerTasks = submission.ReviewerSubmissions
                        .Where(rs => rs.ReviewerId == reviewer.Id && rs.Status == SubmissionStatus.ToBeReviewed.ToString())
                        .ToList();

                    var reviewerVariables = new JObject
                    {
                        { "name", $"{reviewer.FirstName} {reviewer.LastName}" },
                        { "NumberOfTask", reviewerTasks.Count.ToString() }
                    };

                    _ = Task.Run(async () =>
                    {
                        await _mailService.SendEmailAsync(new Email_Model
                        {
                            To = reviewer.Email!,
                            ToName = $"{reviewer.FirstName} {reviewer.LastName}",
                            Subject = $"Hi {reviewer.FirstName}, new review tasks assigned to you",
                            TemplateId = 5984822, // Template ID
                            Variables = reviewerVariables
                        });
                    });
                }
                return (true, "Author response submitted successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool IsSuccess, string Message)> RequestExtensionAsync(int submissionId)
        {

            try
            {

                var userId = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var submission = await _context.Submissions
                    .Include(s => s.Manuscript)
                    .Include(s => s.ReviewerSubmissions)
                    .FirstOrDefaultAsync(s => s.Id == submissionId) ?? throw new KeyNotFoundException("Submission not found");
                if (submission.AuthorId != userId)
                {
                    return (false, "Unauthorized to modify this submission");
                }

                if (submission.Status == SubmissionStatus.Withdrawn.ToString())
                {
                    return (false, "Submission has been withdrawn");
                }

                if (submission.CaseCompleted)
                {
                    return (false, "Submission has been completed");
                }

                if (submission.Status != SubmissionStatus.Revised.ToString())
                {
                    return (false, "Submission is not in revised status");
                }

                if (submission.IsExtensionChanceUsed)
                {
                    return (false, "Extension has already been requested");
                }

                if (UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow) > submission.RevisedDeadline)
                {
                    submission.Status = SubmissionStatus.Expired.ToString();
                    submission.CaseCompleted = true;
                    return (false, "Revised deadline has passed");
                }

                submission.IsExtensionChanceUsed = true;
                submission.RevisedDeadline = submission.RevisedDeadline!.Value.AddDays(5); // Extend by 5 days

                await _context.SaveChangesAsync();
                return (true, "Extension requested successfully");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool IsSuccess, string Message)> WithdrawAsync(int submissionId)
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var submission = await _context.Submissions
                    .Include(s => s.Manuscript)
                    .Include(s => s.ReviewerSubmissions)
                    .FirstOrDefaultAsync(s => s.Id == submissionId) ?? throw new KeyNotFoundException("Submission not found");
                if (submission.AuthorId != userId)
                {
                    return (false, "Unauthorized to modify this submission");
                }
                submission.Status = SubmissionStatus.Withdrawn.ToString();
                submission.CaseCompleted = true;
                foreach (var rs in submission.ReviewerSubmissions)
                {
                    rs.Status = SubmissionStatus.Expired.ToString();
                }
                _context.SaveChanges();
                return (true, "Submission withdrawn successfully");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }
    }
}
