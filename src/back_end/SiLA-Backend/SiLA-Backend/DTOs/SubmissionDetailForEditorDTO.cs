using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionDetailForEditorDTO
    {
        public int SubmissionId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string? Declaration { get; set; }
        public List<Dictionary<string, string>> Files { get; set; }
        public string? RevisedFileUrl { get; set; }
        public string SubmissionDate { get; set; }
        public string Status { get; set; }
        public string ReviewDeadline { get; set; }
        public string? RevisedDeadline { get; set; }
        public List<ReviewerDTO> Reviewers { get; set; }
        public List<Dictionary<string, string>>? CommentsFromReviewers { get; set; }
        public List<Dictionary<string, string>>? CommentsToAuthor { get; set; }
        public string? EditorComment { get; set; }
    }

    public class ReviewerDTO
    {
        public string ReviewerId { get; set; }
        public string ReviewerName { get; set; }

        [EmailAddress]
        public string ReviewerContact { get; set; }

        public string ReviewerRecommendation { get; set; }
        public bool IsRevision { get; set; }
        public bool IsReviewComplete { get; set; }
        public string ReviewerStatus { get; set; }
        public string DocumentUrl { get; set; }
    }
}