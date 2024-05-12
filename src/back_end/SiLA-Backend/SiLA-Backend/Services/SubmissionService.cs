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

namespace SiLA_Backend.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenManager _tokenManager;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;

        public SubmissionService(IWebHostEnvironment hostEnvironment, ApplicationDbContext context, ITokenManager tokenManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _tokenManager = tokenManager;
            _hostingEnvironment = hostEnvironment;
            _userManager = userManager;
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

        // public async Task<List<SubmissionDetailForReviewerDTO>> GetReviewerDashBoardAsync(string reviewerId)
        // {
        //     var user = await _userManager.FindByIdAsync(reviewerId);
        //     if (user == null)
        //         throw new KeyNotFoundException("User not found");

        //     var submissions = await _context.Submissions
        //     .Where(s => s.Status == SubmissionStatus.Submitted.ToString())
        //     .Include(s => s.Manuscript)
        //     .Select(s => new SubmissionDetailForReviewerDTO
        //     {
        //         Id = s.Id,
        //         Title = s.Title,
        //         Category = s.Manuscript.Category,

        //     }

        //     ).ToListAsync();
        //     return submissions;

        // }

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
                            CommentsToEditor = "[{}]",
                            CommentsToAuthor = "[{}]",

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
                ReviewDeadline = s.Deadline.Value.ToString("yyyy-MM-dd HH:mm:ss"),
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
    }
}
