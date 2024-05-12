
using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.DTOs
{
    public class UserDTO
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        public string? BirthDate { get; set; }
        public string? Gender { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public string? Bio { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Education { get; set; }

    }
}