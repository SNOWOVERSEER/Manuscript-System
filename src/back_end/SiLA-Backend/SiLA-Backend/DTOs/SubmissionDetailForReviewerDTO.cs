using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionDetailForReviewerDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string? Declaration { get; set; }
        public string PDFs { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string Status { get; set; }
    }
}