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
                SubmissionDate = s.SubmissionDate,
                Status = s.Status // Convert the enum to string
            })
            .ToListAsync();

            return submissions;
        }


    }


}
