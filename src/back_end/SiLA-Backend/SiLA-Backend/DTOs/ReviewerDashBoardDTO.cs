using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.DTOs
{
    public class ReviewerDashBoardDTO
    {
        public int SubmissionId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }

        public string SubmissionDate { get; set; }
        public string? ReviewDeadline { get; set; }
        public string Status { get; set; }
    }
}