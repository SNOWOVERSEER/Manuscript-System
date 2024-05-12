using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.DTOs
{
    public class ReviewerDashBoardDTO
    {
        public int SubmissionId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }

        public DateTime SubmissionDate { get; set; }
        public DateTime? ReviewDeadline { get; set; }
        public string Status { get; set; }
    }
}