using Microsoft.AspNetCore.Mvc;
using SiLA_Backend.Models;
using SiLA_Backend.DTOs;
using SiLA_Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.S3.Model;



namespace SiLA_Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ManuscriptsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        private readonly IAmazonS3 _amazonS3;
        private readonly string _bucketName = "sila-storage";
        private readonly string _region = "ap-southeast-2";
        private readonly IConfiguration _configuration;

        public ManuscriptsController(ISubmissionService submissionService, IAmazonS3 amazonS3, IConfiguration configuration)
        {
            _submissionService = submissionService;
            _amazonS3 = amazonS3;
            _configuration = configuration;
        }

        [Authorize(Roles = "Author , Reviewer, Editor")]
        [HttpPost("uploadfile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { state = "error", message = "No file uploaded." });
            var filePath = $"uploads/{Guid.NewGuid()}_{file.FileName}";
            try
            {
                using (var fileTransferUtility = new TransferUtility(_amazonS3))
                {
                    await fileTransferUtility.UploadAsync(file.OpenReadStream(), _bucketName, filePath);
                }
                return Ok(new { state = "success", message = "File uploaded successfully", path = filePath }); //$"https://{_bucketName}.s3.{_region}.amazonaws.com/{filePath}"
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading file to S3: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Server error: {ex.Message}");
            }
        }

        [Authorize(Roles = "Author")]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit(ManuscriptSubmissionModel model)
        {
            var (IsSuccess, Message) = await _submissionService.SubmitAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }


        [Authorize]
        [HttpGet("AuthorSubmissions/{userId}")]
        public async Task<IActionResult> GetAuthorDashboard(string userId)
        {
            try
            {
                var dashboardData = await _submissionService.GetAuthorDashBoardAsync(userId);
                return Ok(new { state = "success", data = dashboardData });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "User not found!" });
            }
        }

        [Authorize(Roles = "Reviewer")]
        [HttpGet("ReviewerSubmissions/{reviewerId}")]
        public async Task<IActionResult> GetReviewerDashboard(string reviewerId)
        {
            try
            {
                var dashboardData = await _submissionService.GetReviewerDashBoardAsync(reviewerId);
                return Ok(new { state = "success", data = dashboardData });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "User not found!" });
            }
        }


        [Authorize(Roles = "Editor")]
        [HttpGet("EditorSubmissions/{editorId}")]
        public async Task<IActionResult> GetEditorDashboard(string editorId)
        {
            try
            {
                var dashboardData = await _submissionService.GetEditorDashBoardAsync(editorId);
                return Ok(new { state = "success", data = dashboardData });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "User not found!" });
            }
        }



        [Authorize(Roles = "Editor")]
        [HttpPost("assignreviewers")]
        public async Task<IActionResult> AssignReviewers(AssignReviewersModel model)
        {
            var (IsSuccess, Message) = await _submissionService.AssignReviewersAsync(model.SubmissionId, model.ReviewerIds);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [Authorize(Roles = "Editor")]
        [HttpGet("submissionabstract/{submissionId}")]
        public async Task<IActionResult> GetSubmissionAbstract(int submissionId)
        {
            try
            {
                var submissionAbstract = await _submissionService.GetSubmissionAbstractAsync(submissionId);
                return Ok(new { state = "success", data = submissionAbstract });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "Submission not found!" });
            }
        }

        [Authorize(Roles = "Reviewer")]
        [HttpGet("submissiondetail/{submissionId}")]
        public async Task<IActionResult> GetSubmissionDetailForReviewer(int submissionId)
        {
            try
            {
                var submissionDetail = await _submissionService.GetSubmissionDetailForReviewerAsync(submissionId);
                return Ok(new { state = "success", data = submissionDetail });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "Submission not found!" });
            }
        }

        [Authorize(Roles = "Editor")]
        [HttpGet("submissiondetailforeditor/{submissionId}")]
        public async Task<IActionResult> GetSubmissionDetailForEditor(int submissionId)
        {
            try
            {
                var submissionDetail = await _submissionService.GetSubmissionDetailForEditorAsync(submissionId);
                return Ok(new { state = "success", data = submissionDetail });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "Submission not found!" });
            }
        }

        [Authorize]
        [HttpGet("GetSubmissionDetailForAuthor/{submissionId}")]
        public async Task<IActionResult> GetSubmissionDetailForAuthor(int submissionId)
        {
            try
            {
                var submissionDetail = await _submissionService.submissionDetailForAuthorDTO(submissionId);
                return Ok(new { state = "success", data = submissionDetail });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { state = "error", message = "Submission not found!" });
            }
        }

        [Authorize(Roles = "Editor")]
        [HttpPost("submiteditordecision")]
        public async Task<IActionResult> SubmitEditorDecision(EditorDecisionDTO model)
        {
            var (IsSuccess, Message) = await _submissionService.SubmitEditorDecisionAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [Authorize(Roles = "Reviewer")]
        [HttpPost("submitreview")]
        public async Task<IActionResult> SubmitReview(SubmissionReviewDTO model)
        {
            var (IsSuccess, Message) = await _submissionService.SubmitReviewAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [Authorize]
        [HttpPost("submitrevision")]
        public async Task<IActionResult> SubmitRevision(AuthorResponseDTO model)
        {
            var (IsSuccess, Message) = await _submissionService.SubmitAuthorResponseAsync(model);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [Authorize]
        [HttpPost("withdraw/{submissionId}")]
        public async Task<IActionResult> Withdraw(int submissionId)
        {
            var (IsSuccess, Message) = await _submissionService.WithdrawAsync(submissionId);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }

        [Authorize]
        [HttpPost("requestextension/{submissionId}")]
        public async Task<IActionResult> RequestExtension(int submissionId)
        {
            var (IsSuccess, Message) = await _submissionService.RequestExtensionAsync(submissionId);
            if (IsSuccess)
            {
                return Ok(new { state = "success", message = Message });
            }
            return BadRequest(new { state = "error", message = Message });
        }



    }
}