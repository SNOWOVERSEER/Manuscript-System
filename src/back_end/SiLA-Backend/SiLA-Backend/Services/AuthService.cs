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
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace SiLA_Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ITokenManager _tokenManager;
        private readonly MailService _mailService;
        private readonly IUrlHelperFactory _urlHelperFactory;
        private readonly IActionContextAccessor _actionContextAccessor;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            IHttpContextAccessor httpContextAccessor,
            IUrlHelperFactory urlHelperFactory,
            IActionContextAccessor actionContextAccessor,
            MailService mailService,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ITokenManager tokenManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenManager = tokenManager;
            _mailService = mailService;
            _urlHelperFactory = urlHelperFactory;
            _actionContextAccessor = actionContextAccessor;
            _httpContextAccessor = httpContextAccessor;

        }

        public async Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                return (false, "User already exists!");
            }

            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Author");
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var scheme = _httpContextAccessor.HttpContext?.Request.Scheme;
                var host = _httpContextAccessor.HttpContext?.Request.Host.Value;

                var urlHelper = _urlHelperFactory.GetUrlHelper(_actionContextAccessor.ActionContext);
                var confirmationLink = urlHelper.Action(
                    "ConfirmEmail",
                    "Auth",
                    new { token, email = user.Email },
                    scheme,
                    host);
                // Send email to user
                _ = Task.Run(async () =>
                {
                    await _mailService.SendEmailAsync(new Email_Model
                    {
                        To = user.Email,
                        ToName = $"{user.FirstName} {user.LastName}",
                        Subject = "Welcome to SiLA!",
                        TemplateId = 5992833,
                        Variables = new JObject
                        {
                            { "name", $"{user.FirstName} {user.LastName}"},
                            { "username", user.Email},
                            { "role", "Author"},
                            { "confirmationLink", confirmationLink}
                        }
                    });

                });
                return (true, "User registered successfully!");
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description);
                return (false, $"User registration failed! Errors: {string.Join(", ", errors)}");
            }
        }


        public async Task<(bool IsSuccess, string Message)> RegisterReviewerAsync(RegisterModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                if (await _userManager.IsInRoleAsync(userExists, "Reviewer"))
                {
                    return (false, "This User is already a Reviewer!");
                }
                await _userManager.AddToRoleAsync(userExists, "Reviewer");
                return (true, "User is now a Reviewer!");
            }

            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Reviewer");
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var scheme = _httpContextAccessor.HttpContext?.Request.Scheme;
                var host = _httpContextAccessor.HttpContext?.Request.Host.Value;

                var urlHelper = _urlHelperFactory.GetUrlHelper(_actionContextAccessor.ActionContext);
                var confirmationLink = urlHelper.Action(
                    "ConfirmEmail",
                    "Auth",
                    new { token, email = user.Email },
                    scheme,
                    host);
                Console.WriteLine(confirmationLink);
                // Send email to user
                _ = Task.Run(async () =>
                {
                    await _mailService.SendEmailAsync(new Email_Model
                    {
                        To = user.Email,
                        ToName = $"{user.FirstName} {user.LastName}",
                        Subject = "Welcome to SiLA!",
                        TemplateId = 5992833,
                        Variables = new JObject
                        {
                            { "name", $"{user.FirstName} {user.LastName}"},
                            { "username", user.Email},
                            { "role", "Reviewer"},
                            { "confirmationLink", confirmationLink}
                        }
                    });

                });
                return (true, "New Reviewer User registered successfully!");
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description);
                return (false, $"Reviewer User registration failed! Errors: {string.Join(", ", errors)}");
            }
        }

        public async Task<(bool IsSuccess, string Message, string? Token, string? Id)> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(user.Email!, model.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var hasRole = await _userManager.IsInRoleAsync(user, model.Role);
                    if (hasRole)
                    {
                        var token = GenerateJwtToken(user, model.Role);
                        return (true, $"Logged in successfully as {model.Role}.", token, user.Id);
                    }
                    else
                    {
                        return (false, "Login failed. The user does not have the selected role.", null, null);
                    }
                }
            }

            return (false, "Invalid login attempt.", null, null);
        }

        public async Task<(bool IsSuccess, string Message)> LogoutAsync(string id, string token)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null)
            {
                await _signInManager.SignOutAsync();
                await _tokenManager.AddToBlacklist(token);
                return (true, "User logged out successfully!");
            }

            return (false, "User not found!");
        }


        private string GenerateJwtToken(ApplicationUser user, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? string.Empty));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = UtilitiesFunctions.ConvertUtcToAest(DateTime.UtcNow).AddDays(1),   // Token expires after 1 day
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<(bool IsSuccess, string Message)> ForgotPasswordAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return (false, "User not found");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var scheme = _httpContextAccessor.HttpContext?.Request.Scheme;
            var host = _httpContextAccessor.HttpContext?.Request.Host.Value;

            var urlHelper = _urlHelperFactory.GetUrlHelper(_actionContextAccessor.ActionContext);
            var resetLink = $"http://ec2-3-106-139-56.ap-southeast-2.compute.amazonaws.com/resetpassword?token={token}&email={user.Email}";

            // Send email to user
            _ = Task.Run(async () =>
            {
                await _mailService.SendEmailAsync(new Email_Model
                {
                    To = user.Email,
                    ToName = $"{user.FirstName} {user.LastName}",
                    Subject = "Please reset your SiLA account password",
                    TemplateId = 6029750, // Mailjet template ID
                    Variables = new JObject
                    {
                { "name", $"{user.FirstName} {user.LastName}" },
                { "resetLink", resetLink }
                    }
                });
            });

            return (true, "Password reset link sent successfully");
        }

        public async Task<(bool IsSuccess, string Message)> ResetPasswordAsync(ResetPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return (false, "User not found");
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {
                return (true, "Password has been reset successfully");
            }

            var errors = result.Errors.Select(e => e.Description);
            return (false, $"Password reset failed! Errors: {string.Join(", ", errors)}");
        }
    }
}
