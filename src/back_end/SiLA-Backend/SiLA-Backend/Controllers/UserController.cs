using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
using SiLA_Backend.DTOs;
using SiLA_Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace SiLA_Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserInfo(string userId)
        {

            try
            {
                var userDto = await _userService.GetUserInfoAsync(userId);
                return Ok(new { state = "success", data = userDto });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "User not found!" });
            }

        }

        [Authorize]
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserInfo(string userId, UserDTO userDto)
        {
            try
            {
                var (IsSuccess, Message) = await _userService.UpdateUserInfoAsync(userId, userDto);
                if (IsSuccess)
                {
                    return Ok(new { state = "success", message = Message });
                }
                return BadRequest(new { state = "error", message = Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "User not found!" });
            }
        }

        [Authorize(Roles = "Editor")]
        [HttpGet("reviewersinfo")]
        public async Task<IActionResult> GetReviewersInfo()
        {
            try
            {
                var reviewers = await _userService.GetReviewersInfoAsync();
                return Ok(new { state = "success", data = reviewers });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { state = "error", message = ex.Message });
            }

        }

    }
}