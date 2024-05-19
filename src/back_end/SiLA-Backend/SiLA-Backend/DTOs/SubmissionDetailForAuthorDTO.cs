using System.ComponentModel.DataAnnotations;
namespace SiLA_Backend.DTOs
{
    public class SubmissionDetailForAuthorDTO
    {
        public int SubmissionId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string? Declaration { get; set; }
        public string Abstract { get; set; }
        public List<Dictionary<string, string>> AuthorFiles { get; set; }
        public string SubmissionDate { get; set; }
        public string Status { get; set; }
        public List<ReviewerCommentsDTO> ReviewerComments { get; set; }
        public List<ReviewerRecommendationsDTO> ReviewerRecommendations { get; set; }
        public string? RevisedDeadline { get; set; }
        public bool IsRevisedDeadlineConfirmed { get; set; }
    }

    public class ReviewerCommentsDTO
    {
        public int ReviewerIndex { get; set; }
        public Dictionary<string, string>? CommentsToAuthor { get; set; }
        public string ReviewerRecommendation { get; set; }
        public string DocumentUrl { get; set; }
    }

    public class ReviewerRecommendationsDTO
    {
        public int ReviewerIndex { get; set; }
        public string Recommendation { get; set; }
    }
}