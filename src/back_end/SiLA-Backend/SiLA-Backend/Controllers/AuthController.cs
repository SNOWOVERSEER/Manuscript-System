using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
using SiLA_Backend.DTOs;
using SiLA_Backend.Services;
using System.Threading.Tasks;

namespace SiLA_Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
    }
}
