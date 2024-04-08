using SiLA_Backend.Models;
using System.Threading.Tasks;

namespace SiLA_Backend.Services
{
    public interface IAuthService
    {
        Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterModel model);
        Task<(bool IsSuccess, string Message)> LoginAsync(LoginModel model);
    }
}