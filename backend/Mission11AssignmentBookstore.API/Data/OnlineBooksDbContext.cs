using Microsoft.EntityFrameworkCore;

namespace Mission11AssignmentBookstore.API.Data
{
    public class OnlineBooksDbContext : DbContext 
    {
        public OnlineBooksDbContext(DbContextOptions<OnlineBooksDbContext> options) : base (options) 
        {

        }

        public DbSet<Book> Books { get; set; }
    }
}
