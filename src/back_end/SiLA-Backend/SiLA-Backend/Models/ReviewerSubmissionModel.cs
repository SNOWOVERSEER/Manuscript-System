using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.Models
{
    public class ReviewerSubmission
    {
        [Required]
        public string ReviewerId { get; set; }
        public ApplicationUser Reviewer { get; set; }

        [Required]
        public int SubmissionId { get; set; }
        public Submission Submission { get; set; }
        public string? FileUrl { get; set; }
        public string? Recommendation { get; set; }
        public bool IsRevision { get; set; }
        public bool IsReviewComplete { get; set; }
        public bool IsTicketClosed { get; set; }
        public DateTime Deadline { get; set; }

        public string? CommentsToEditor { get; set; }
        public string? CommentsToAuthor { get; set; }

        public string Status { get; set; }

    }
}