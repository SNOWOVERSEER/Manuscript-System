using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
using SiLA_Backend.DTOs;
using SiLA_Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace SiLA_Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;



        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var (IsSuccess, Message) = await _authService.RegisterAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [HttpGet]
        [Route("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            if (token == null || email == null)
            {
                return BadRequest("Invalid email confirmation request.");
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Invalid email confirmation request.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return Ok("Email confirmed successfully!");
            }
            else
            {
                return BadRequest("Error confirming your email.");
            }
        }

        [Authorize(Roles = "Editor")]
        [HttpPost("register/reviewer")]
        public async Task<IActionResult> RegisterReviewer(RegisterModel model)
        {
            var (IsSuccess, Message) = await _authService.RegisterReviewerAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var (IsSuccess, Message, Token, Id) = await _authService.LoginAsync(model);
            if (IsSuccess)
            {
                return Ok(new
                {
                    state = "success",
                    data = new { token = Token, id = Id },
                    message = Message
                });
            }
            return Unauthorized(new { state = "error", message = Message });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(string id, string token)
        {
            var (IsSuccess, Message) = await _authService.LogoutAsync(id, token);

            return Ok(new { state = "success", message = "User logged out successfully!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            if (string.IsNullOrEmpty(model.UserId) && string.IsNullOrEmpty(model.Email))
            {
                return BadRequest("Either userId or email must be provided");
            }

            var result = await _authService.ForgotPasswordAsync(model.UserId, model.Email);
            if (result.IsSuccess)
            {
                return Ok(result.Message);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
        {
            var result = await _authService.ResetPasswordAsync(model);
            if (result.IsSuccess)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }


    }
}
