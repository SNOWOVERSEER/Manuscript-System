using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class AuthorResponseDTO
    {
        public int SubmissionId { get; set; }
        public string ResponseFile { get; set; }
    }
}