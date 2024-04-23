using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
using SiLA_Backend.DTOs;
using SiLA_Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon.S3.Transfer;



namespace SiLA_Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ManuscriptsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        private readonly IAmazonS3 _amazonS3;
        private readonly string _bucketName = "sila-storage";

        public ManuscriptsController(ISubmissionService submissionService, IAmazonS3 amazonS3)
        {
            _submissionService = submissionService;
            _amazonS3 = amazonS3;
        }

        [Authorize]
        [HttpPost("uploadfile")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var filePath = $"uploads/{Guid.NewGuid()}_{file.FileName}";
            using (var fileTransferUtility = new TransferUtility(_amazonS3))
            {
                await fileTransferUtility.UploadAsync(file.OpenReadStream(), _bucketName, filePath);
            }

            return Ok($"File uploaded successfully: {Guid.NewGuid()}_{file.FileName}");
        }


        [HttpPost("submit")]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> Submit(ManuscriptSubmissionModel model)
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