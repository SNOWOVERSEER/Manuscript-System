namespace SiLA_Backend.Services
{
    public interface ITokenManager
    {
        Task<bool> DeactivateTokenAsync(string token);
    }
}