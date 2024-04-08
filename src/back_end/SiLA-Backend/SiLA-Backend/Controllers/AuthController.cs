using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
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
                return Ok(new { Message });
            }
            return BadRequest(new { Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var (IsSuccess, Message) = await _authService.LoginAsync(model);
            if (IsSuccess)
            {
                return Ok(new { Message });
            }
            return Unauthorized(new { Message });
        }
    }
}
