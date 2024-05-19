using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.Models
{
    public class Submission
    {
        public int Id { get; set; }

        [Required]
        public int ManuscriptId { get; set; } // 关联的Manuscript ID

        [Required]
        public string AuthorId { get; set; } // 作者ID
        public ApplicationUser Author { get; set; } // 作者实体

        [Required]
        public string Title { get; set; }

        [Required]
        public string Category { get; set; }

        public string? ReviewerId { get; set; } // 审稿人ID
        public ApplicationUser? Reviewer { get; set; } // 审稿人实体

        public string? EditorId { get; set; } // 编辑ID
        public ApplicationUser? Editor { get; set; } // 编辑实体

        [Required]
        public DateTime SubmissionDate { get; set; }

        [Required]
        public string Status { get; set; }

        public DateTime? RevisedDeadline { get; set; } // 修订截止日期
        public DateTime? ReviewDeadline { get; set; } // 审稿截止日期
        public string? CommentsFromEditor { get; set; }
        public bool IsRevisedDeadlineConfirmed { get; set; }
        public bool CaseCompleted { get; set; }

        // 引用到对应的Manuscript
        [Required]
        public Manuscript Manuscript { get; set; }

        public ICollection<ReviewerSubmission> ReviewerSubmissions { get; set; }
    }
}