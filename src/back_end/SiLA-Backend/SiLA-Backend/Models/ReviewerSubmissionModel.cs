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

        public string Comment { get; set; }

        public string Status { get; set; }

    }
}