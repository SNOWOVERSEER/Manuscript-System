using SiLA_Backend.Models;
using System.Threading.Tasks;
using SiLA_Backend.DTOs;


namespace SiLA_Backend.Services
{
    public interface IUserService
    {
        Task<UserDTO> GetUserInfoAsync(string userId);
        Task<(bool IsSuccess, string Message)> UpdateUserInfoAsync(string userId, UserDTO userDto);
        Task<List<ReviewerInfoDTO>> GetReviewersInfoAsync();
    }
}