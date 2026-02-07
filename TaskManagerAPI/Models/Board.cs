using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{
    public class Board
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        public string? Color { get; set; }
    }
}
