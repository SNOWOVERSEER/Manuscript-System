using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionDetailForReviewerDTO
    {
        public int SubmissionId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string? Declaration { get; set; }
        public Dictionary<string, string> File { get; set; }
        public string SubmissionDate { get; set; }
        public string ReviewDeadline { get; set; }
        public string Status { get; set; }
    }
}