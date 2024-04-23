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

namespace SiLA_Backend.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenManager _tokenManager;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public SubmissionService(IWebHostEnvironment hostEnvironment, ApplicationDbContext context, ITokenManager tokenManager)
        {
            _context = context;
            _tokenManager = tokenManager;
            _hostingEnvironment = hostEnvironment;

        }

        public async Task<(bool IsSuccess, string Message)> SubmitAsync(ManuscriptSubmissionModel model)
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
                    FilePath = model.PDFs   //var fileUrl = $"https://{_bucketName}.s3.{_region}.amazonaws.com/{filePath}";
                };

                _context.Manuscripts.Add(manuscript);
                await _context.SaveChangesAsync();


                return (true, "Submission successful");
            }
            catch (Exception ex)
            {
                // Log the error
                return (false, $"An error occurred: {ex.Message}");
            }
        }
    }


}
