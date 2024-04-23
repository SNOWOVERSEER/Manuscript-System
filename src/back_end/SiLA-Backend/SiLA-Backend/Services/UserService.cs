
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SiLA_Backend.Data;
using SiLA_Backend.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using SiLA_Backend.DTOs;

namespace SiLA_Backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task<UserDTO> GetUserInfoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                Gender = user.Gender,
                Address = user.Address,
                Phone = user.Phone,
                Bio = user.Bio,
                ProfilePicture = user.ProfilePicture,
                Education = user.Education
            };

        }

        public async Task<(bool IsSuccess, string Message)> UpdateUserInfoAsync(string userId, UserDTO userDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.BirthDate = userDto.BirthDate;
            user.Gender = userDto.Gender;
            user.Address = userDto.Address;
            user.Phone = userDto.Phone;
            user.Bio = userDto.Bio;
            user.ProfilePicture = userDto.ProfilePicture;
            user.Education = userDto.Education;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
                return (true, "User info updated successfully");
            else
                return (false, $"Failed to update user info: {string.Join("; ", result.Errors.Select(e => e.Description))}");


        }
    }
}