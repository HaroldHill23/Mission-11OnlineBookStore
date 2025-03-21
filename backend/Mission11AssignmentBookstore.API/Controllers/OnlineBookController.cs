using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11AssignmentBookstore.API.Data;

namespace Mission11AssignmentBookstore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OnlineBookController : ControllerBase
    {
        private readonly OnlineBooksDbContext _bookContext;

        public OnlineBookController(OnlineBooksDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public async Task<IActionResult> GetBooks(
            int pageSize = 10,
            int pageNum = 1,
            string? sortBy = "title",
            string? sortDirection = "asc")
        {
            var books = _bookContext.Books.AsQueryable();

            // Apply sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                books = sortBy.ToLower() switch
                {
                    "title" => sortDirection.ToLower() == "desc"
                        ? books.OrderByDescending(b => b.Title)
                        : books.OrderBy(b => b.Title),
                    _ => books
                };
            }

            // Apply pagination
            var pagedBooks = await books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalNumBooks = await _bookContext.Books.CountAsync();

            var result = new
            {
                books = pagedBooks,
                totalNumBooks = totalNumBooks
            };

            return Ok(result);
        }
    }
}
