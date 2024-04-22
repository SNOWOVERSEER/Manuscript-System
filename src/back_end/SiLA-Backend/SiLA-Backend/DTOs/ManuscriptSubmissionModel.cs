using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class ManuscriptSubmissionModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Abstract { get; set; }

        [Required]
        public string AuthorId { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string AuthorsInfo { get; set; }

        public string? Declaration { get; set; }

        [Required]
        public List<IFormFile> PDFs { get; set; }
    }

}