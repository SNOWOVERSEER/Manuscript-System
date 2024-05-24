using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class EditorDecisionDTO
    {
        public int SubmissionId { get; set; }
        public string? RevisedDeadline { get; set; }
        public string Decision { get; set; }
        public string CommentsFromEditor { get; set; }
    }
}