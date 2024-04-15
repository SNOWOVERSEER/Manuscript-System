using SiLA_Backend.Models;
using System.Threading.Tasks;

namespace SiLA_Backend.Services
{
    public interface IAuthService
    {
        Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterModel model);
        Task<(bool IsSuccess, string Message, string? Token, string? Id)> LoginAsync(LoginModel model);
        Task<(bool IsSuccess, string Message)> LogoutAsync(string id, string token);


    }
}