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
                // Process PDFs
                foreach (var file in model.PDFs)
                {
                    if (file.Length > 0)
                    {
                        var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", Path.GetRandomFileName());
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                    }

                }

                var manuscript = new Manuscript
                {
                    Title = model.Title,
                    Abstract = model.Abstract,
                    AuthorId = model.AuthorId,
                    Category = model.Category,
                    AuthorsInfo = model.AuthorsInfo, // Directly store the JSON string
                    Declaration = model.Declaration,
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
