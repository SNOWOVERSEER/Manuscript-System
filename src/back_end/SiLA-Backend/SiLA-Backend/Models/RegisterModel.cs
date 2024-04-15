using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.Models
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public required string Password { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }
    }
}