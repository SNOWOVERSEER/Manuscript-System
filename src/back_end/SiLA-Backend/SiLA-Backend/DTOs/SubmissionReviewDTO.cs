using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionReviewDTO
    {
        public int SubmissionId { get; set; }
        public string ReviewerId { get; set; }
        public string ReviewerName { get; set; }
        public string Recommendation { get; set; }
        public bool WillingToReview { get; set; }
        public string CommentsToEditor { get; set; }
        public string CommentsToAuthor { get; set; }
        public string? FileUrl { get; set; }
    }
}