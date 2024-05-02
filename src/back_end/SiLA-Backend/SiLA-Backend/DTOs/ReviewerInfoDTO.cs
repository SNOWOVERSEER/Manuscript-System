using System.ComponentModel.DataAnnotations;

namespace SiLA_Backend.DTOs
{
    public class ReviewerInfoDTO
    {
        public string Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Category { get; set; }

        public int NumberOfTasksAssigned { get; set; }

    }



}