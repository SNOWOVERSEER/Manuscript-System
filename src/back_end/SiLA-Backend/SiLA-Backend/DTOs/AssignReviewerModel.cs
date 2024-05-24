using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.DTOs
{
    public class AssignReviewersModel
    {
        [Required]
        public int SubmissionId { get; set; }

        [Required]
        public List<string> ReviewerIds { get; set; }
    }
}