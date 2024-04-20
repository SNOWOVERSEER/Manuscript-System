using SiLA_Backend.Models;
using SiLA_Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SiLA_Backend.Services
{
    public class TokenManager : ITokenManager
    {
        private readonly ApplicationDbContext _context;

        public TokenManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddToBlacklist(string token)
        {
            var blacklistedToken = new BlacklistedToken
            {
                Token = token,
                DateBlacklisted = DateTime.UtcNow
            };
            _context.BlacklistedTokens.Add(blacklistedToken);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsTokenBlacklisted(string token)
        {
            return await _context.BlacklistedTokens.AnyAsync(t => t.Token == token);
        }

    }
}