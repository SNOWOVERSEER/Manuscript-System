using System.Threading.Tasks;
using SiLA_Backend.DTOs;

namespace SiLA_Backend.Services
{
    public interface ISubmissionService
    {
        Task<(bool IsSuccess, string Message)> SubmitAsync(ManuscriptSubmissionModel model);
        Task<List<AuthorDashBoardDTO>> GetAuthorDashBoardAsync(string userId);
        Task<List<ReviewerDashBoardDTO>> GetReviewerDashBoardAsync(string ReviewerId);
        Task<List<EditorDashBoardDTO>> GetEditorDashBoardAsync(string EditorId);
        Task<(bool IsSuccess, string Message)> AssignReviewersAsync(int submissionId, List<string> reviewerIds);
        Task<SubmissionAbsDTO> GetSubmissionAbstractAsync(int submissionId);
        Task<SubmissionDetailForReviewerDTO> GetSubmissionDetailForReviewerAsync(int submissionId);

    }
}
