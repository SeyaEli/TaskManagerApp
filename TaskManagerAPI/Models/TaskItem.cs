using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerAPI.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public string Priority { get; set; } = "Medium";

        [Column(TypeName = "timestamp without time zone")]
        public DateTime? DueDate { get; set; }

        public int Position { get; set; }

        public int? AssignedUserId { get; set; }

        [ForeignKey("Board")]
        public int BoardId { get; set; }

        public Board? Board { get; set; }

        public User? AssignedUser { get; set; }
    }
}
