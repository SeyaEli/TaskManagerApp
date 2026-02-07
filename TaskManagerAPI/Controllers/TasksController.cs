using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Hubs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<TaskHub> _hub;

        public TasksController(AppDbContext db, IHubContext<TaskHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        [HttpGet("{boardId}")]
        public async Task<IActionResult> GetTasks(int boardId)
        {
            var tasks = await _db.Tasks
                .Where(t => t.BoardId == boardId)
                .OrderBy(t => t.Position)
                .Include(t => t.AssignedUser)
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            var maxPosition = await _db.Tasks
                .Where(t => t.BoardId == task.BoardId)
                .MaxAsync(t => (int?)t.Position) ?? -1;
            task.Position = maxPosition + 1;

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem task)
        {
            var existing = await _db.Tasks.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.Priority = task.Priority;
            existing.DueDate = task.DueDate;
            existing.AssignedUserId = task.AssignedUserId;

            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok(existing);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteTask(int id)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok(task);
        }

        [HttpPut("{id}/position")]
        public async Task<IActionResult> UpdatePosition(int id, [FromBody] int newPosition)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            var oldPosition = task.Position;
            var tasks = await _db.Tasks
                .Where(t => t.BoardId == task.BoardId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            if (newPosition < oldPosition)
            {
                foreach (var t in tasks.Where(t => t.Position >= newPosition && t.Position < oldPosition))
                    t.Position++;
            }
            else
            {
                foreach (var t in tasks.Where(t => t.Position > oldPosition && t.Position <= newPosition))
                    t.Position--;
            }

            task.Position = newPosition;
            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok();
        }

        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            var comments = await _db.TaskComments
                .Where(c => c.TaskId == id)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
            return Ok(comments);
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] TaskComment comment)
        {
            comment.TaskId = id;
            comment.CreatedAt = DateTime.UtcNow;
            _db.TaskComments.Add(comment);
            await _db.SaveChangesAsync();
            
            var savedComment = await _db.TaskComments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == comment.Id);
            
            await _hub.Clients.All.SendAsync("ReceiveTaskUpdate");
            return Ok(savedComment);
        }
    }
}
