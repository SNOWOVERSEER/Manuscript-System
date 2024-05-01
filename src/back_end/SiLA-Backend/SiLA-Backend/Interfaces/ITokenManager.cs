namespace SiLA_Backend.Services
{
    public interface ITokenManager
    {
        Task<bool> IsTokenBlacklisted(string token);
        Task AddToBlacklist(string token);
    }
}