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

        public SubmissionService(IWebHostEnvironment hostEnvironment, ApplicationDbContext context, ITokenManager tokenManager, UserManager<ApplicationUser> userManager, IAmazonS3 amazonS3)
        {
            _context = context;
            _tokenManager = tokenManager;
            _hostingEnvironment = hostEnvironment;
            _userManager = userManager;
            _amazonS3 = amazonS3;
        }

        public async Task<(bool IsSuccess, string Message)> SubmitAsync(ManuscriptSubmissionModel model)
        {

            using (var transaction = _context.Database.BeginTransaction())
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
                        SubmissionDate = DateTime.UtcNow,
                        Status = SubmissionStatus.Submitted.ToString(),
                        Title = model.Title,
                        Category = model.Category
                    };

                    _context.Submissions.Add(submission);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();


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
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var submission = await _context.Submissions.FindAsync(submissionId);
                    if (submission == null)
                        throw new KeyNotFoundException("Submission not found");

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
                            Deadline = DateTime.UtcNow.AddDays(7),
                            IsRevision = false,
                            IsReviewComplete = false,
                            CommentsToEditor = JsonSerializer.Serialize(new Dictionary<string, string>()),
                            CommentsToAuthor = JsonSerializer.Serialize(new Dictionary<string, string>())
                        };

                        _context.ReviewerSubmissions.Add(reviewerSubmission);
                    }
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

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
                    DocumentUrl = rs.FileUrl != null ? GeneratePreSignedURLAsync(rs.FileUrl).Result : "N/A"
                })
                .ToList();

            var commentsFromReviewers = submission.ReviewerSubmissions
                .Select(rs => JsonSerializer.Deserialize<Dictionary<string, string>>(rs.CommentsToEditor ?? "{}"))
                .ToList();

            var submissionDetail = new SubmissionDetailForEditorDTO
            {
                SubmissionId = submission.Id,
                Title = submission.Manuscript.Title,
                Category = submission.Manuscript.Category,
                Files = new List<Dictionary<string, string>> { preSignedUrls },
                Declaration = submission.Manuscript.Declaration,
                SubmissionDate = submission.SubmissionDate.ToString("yyyy-MM-dd HH:mm:ss"),
                Status = submission.Status,
                Reviewers = reviewers,
                CommentsFromReviewers = commentsFromReviewers!

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
                        .Where(rs => rs.SubmissionId == model.SubmissionId && rs.ReviewerId == model.ReviewerId)
                        .FirstOrDefaultAsync();

                    if (reviewerSubmission == null)
                        throw new KeyNotFoundException("Reviewer Submission not found");

                    reviewerSubmission.Recommendation = model.Recommendation;
                    reviewerSubmission.IsReviewComplete = true;
                    reviewerSubmission.FileUrl = model.FileUrl;
                    reviewerSubmission.Status = SubmissionStatus.Reviewed.ToString();
                    reviewerSubmission.CommentsToEditor = JsonSerializer.Serialize(
                        new Dictionary<string, string>
                        {
                            { "Reviewer", model.ReviewerName },
                            { "ReviewerId", model.ReviewerId },
                            { "LastEditDate", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")},
                            { "Comments", model.CommentsToEditor }
                        }
                    );
                    reviewerSubmission.CommentsToAuthor = JsonSerializer.Serialize(
                        new Dictionary<string, string>
                        {
                            { "Reviewer", model.ReviewerName },
                            { "ReviewerId", model.ReviewerId },
                            { "LastEditDate", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")},
                            { "Comments", model.CommentsToAuthor }
                        }
                    );

                    await _context.SaveChangesAsync();

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


        public async Task<string> GeneratePreSignedURLAsync(string objectKey)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Expires = DateTime.UtcNow.AddMinutes(60)
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
    }
}
