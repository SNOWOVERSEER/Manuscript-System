
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
using System.Globalization;
using SiLA_Backend.Utilities;
using Microsoft.EntityFrameworkCore;

namespace SiLA_Backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
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
                BirthDate = user.BirthDate.ToString(),
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
            if (DateOnly.TryParseExact(userDto.BirthDate, "dd/MM/yyyy", null, DateTimeStyles.None, out DateOnly parsedDate))
            {
                user.BirthDate = parsedDate;
            }
            else
            {
                return (false, "Invalid birth date format");
            }
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

        public async Task<List<ReviewerInfoDTO>> GetReviewersInfoAsync()
        {
            try
            {
                var reviewers = await _userManager.GetUsersInRoleAsync("Reviewer");
                var reviewerIds = reviewers.Select(r => r.Id).ToList();
                var reviewSubmissions = await _context.ReviewerSubmissions
                    .Where(rs => reviewerIds.Contains(rs.ReviewerId) && rs.Status == SubmissionStatus.ToBeReviewed.ToString())
                    .ToListAsync();

                // 构建每个 Reviewer 的任务数量
                var reviewerInfoList = reviewers.Select(r => new ReviewerInfoDTO
                {
                    Id = r.Id,
                    Email = r.Email,
                    Name = r.FirstName + " " + r.LastName,
                    Category = r.Category ?? "N/A",
                    NumberOfTasksAssigned = reviewSubmissions.Count(rs => rs.ReviewerId == r.Id)
                }).ToList();

                return reviewerInfoList;
            }
            catch (Exception ex)
            {
                throw new KeyNotFoundException($"No reviewers found,{ex.Message}");
            }
        }
    }
}