using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionAbsDTO
    {
        public string Title { get; set; }
        public string Category { get; set; }
        public string Abstract { get; set; }
        public string AuthorName { get; set; }
    }
}