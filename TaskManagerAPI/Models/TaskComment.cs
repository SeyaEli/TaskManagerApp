using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerAPI.Models
{
    public class TaskComment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TaskId { get; set; }

        public int UserId { get; set; }

        public TaskItem? Task { get; set; }
        public User? User { get; set; }
    }
}
