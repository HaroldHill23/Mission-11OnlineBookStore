using System.ComponentModel.DataAnnotations;

namespace Mission11AssignmentBookstore.API.Data
{
    public class Book
    {
        [Key]
        public string BookID { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Publisher { get; set; }

        [Required]
        public string ISBN { get; set; }   //what type should this be

        [Required]
        public string Classification { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string PageCount { get; set; }

        [Required]
        public string Price { get; set; }  //need to be int? 

    }
}
