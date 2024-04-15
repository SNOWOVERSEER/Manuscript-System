using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace SiLA_Backend.Services
{
    public class TokenManager : ITokenManager
    {
        // Using a concurrent dictionary to simulate storage for simplicity.
        private static readonly ConcurrentDictionary<string, bool> InvalidTokens = new ConcurrentDictionary<string, bool>();

        public Task<bool> DeactivateTokenAsync(string token)
        {
            // Mark the token as invalid
            InvalidTokens[token] = true;
            return Task.FromResult(true);
        }

        public static bool IsTokenActive(string token)
        {
            return !InvalidTokens.ContainsKey(token);
        }
    }
}