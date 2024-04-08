using Microsoft.AspNetCore.Identity;
using SiLA_Backend.Data;
using SiLA_Backend.Models;
using System.Threading.Tasks;

namespace SiLA_Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                return (false, "User already exists!");
            }
            Console.WriteLine("User check passed");

            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };
            Console.WriteLine("User created");

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Author");
                return (true, "User registered successfully!");
            }

            return (false, "User registration failed!");
        }

        public async Task<(bool IsSuccess, string Message)> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    // if password is correct, check if user has the selected role
                    var hasRole = await _userManager.IsInRoleAsync(user, model.Role);
                    if (hasRole)
                    {
                        // if user has the selected role, return success message
                        return (true, $"Logged in successfully as {model.Role}.");
                    }
                    else
                    {
                        // if user does not have the selected role, return failure message
                        return (false, "Login failed. The user does not have the selected role.");
                    }
                }
            }

            return (false, "Invalid login attempt.");
        }
    }
}
