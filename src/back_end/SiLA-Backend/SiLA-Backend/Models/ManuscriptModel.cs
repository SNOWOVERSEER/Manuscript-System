using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.Models
{
    public class Manuscript
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Abstract { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string AuthorsInfo { get; set; }

        [Required]
        public string FilePath { get; set; } // 存储文件位置

        // 添加作者的ID和关联
        [Required]
        public string AuthorId { get; set; }
        public ApplicationUser Author { get; set; }

        // 关联到对应的Submission
        public Submission Submission { get; set; }
    }
}