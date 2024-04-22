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
    public class ManuscriptsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public ManuscriptsController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }




        [HttpPost("submit")]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> Submit([FromForm] ManuscriptSubmissionModel model)
        {
            var (IsSuccess, Message) = await _submissionService.SubmitAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }
    }
}