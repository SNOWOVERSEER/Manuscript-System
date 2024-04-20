using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }

        public string? Address { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public string? Bio { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Education { get; set; }


        public ICollection<Manuscript> Manuscripts { get; set; }  // 作者的稿件
        public ICollection<Submission> EditSubmissions { get; set; }  // 编辑的编辑任务
        public ICollection<ReviewerSubmission> ReviewSubmissions { get; set; }


    }
}