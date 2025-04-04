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
            string? sortDirection = "asc",
            string? category = null) 
        {
            var books = _bookContext.Books.AsQueryable();

            // Filter by category
            if (!string.IsNullOrEmpty(category))
            {
                books = books.Where(b => b.Category == category);
            }

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

            // Get total after filtering
            var totalNumBooks = await books.CountAsync();

            // Apply pagination
            var pagedBooks = await books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

           

            var result = new
            {
                books = pagedBooks,
                totalNumBooks = totalNumBooks
            };

            return Ok(result);

        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }


        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook); 
        }

        [HttpPut("UpdateBook/{bookID}")]

        public IActionResult updateBook( int bookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteBook(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if(book ==null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();

        }

    }
}
