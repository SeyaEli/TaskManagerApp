using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BoardsController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetBoards()
        {
            var boards = await _db.Boards.ToListAsync();
            return Ok(boards);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] Board board)
        {
            _db.Boards.Add(board);
            await _db.SaveChangesAsync();
            return Ok(board);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBoard(int id, [FromBody] Board board)
        {
            var existing = await _db.Boards.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = board.Name;
            existing.Color = board.Color;
            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoard(int id)
        {
            var board = await _db.Boards.FindAsync(id);
            if (board == null) return NotFound();

            _db.Boards.Remove(board);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
