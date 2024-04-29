using System.Threading.Tasks;
using SiLA_Backend.DTOs;

namespace SiLA_Backend.Services
{
    public interface ISubmissionService
    {
        Task<(bool IsSuccess, string Message)> SubmitAsync(ManuscriptSubmissionModel model);
        Task<List<AuthorDashBoardDTO>> GetAuthorDashBoardAsync(string userId);
    }
}
