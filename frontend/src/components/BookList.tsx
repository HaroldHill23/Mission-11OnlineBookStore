// Importing React hooks (useState and useEffect) and other necessary imports
import { useEffect, useState } from "react";  // Used for managing state and side effects
import { Book } from "../types/Book";  // Importing Book type to enforce type checking on book data
import { useCart } from "../context/CartContext";  // Importing custom hook to access cart context

// The BookList component is where the list of books is fetched and displayed
function BookList() {
  // Declare state variables
  const [books, setBooks] = useState<Book[]>([]); // State to store the list of books
  const [pageSize, setPageSize] = useState<number>(10); // State to store the number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // State to store the current page number
  const [totalPages, setTotalPages] = useState<number>(0); // State to store the total number of pages
  const { addToCart } = useCart(); // Access the addToCart function from the cart context
  const [error, setError] = useState<string | null>(null); // State to store errors (if any)
  const [loading, setLoading] = useState(true); // State to indicate if the books are still being loaded

  // Sorting state
  const [sortBy] = useState<string>("title"); // Sorting is hardcoded to be by title
  const [sortDirection, setSortDirection] = useState<string>("asc"); // Sorting direction, default is ascending

  // Category filter state
  const [category, setCategory] = useState<string>(""); // State for the selected category
  const [categories, setCategories] = useState<string[]>([]); // State to store categories for filtering

  // Fetch books when certain states change (e.g., page size, page number, sort order, etc.)
  useEffect(() => {
    // Define the asynchronous function to fetch books
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/OnlineBook/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&sortDirection=${sortDirection}&category=${category}`
        );
        const data = await response.json(); // Parse the response into JSON

        // Update the books state with the fetched data
        setBooks(data.books);

        // Calculate total pages based on the number of books and the page size
        const calculatedPages = Math.ceil(data.totalNumBooks / pageSize);
        setTotalPages(calculatedPages);

        // If the current page number exceeds the calculated pages, reset to the last valid page
        if (pageNum > calculatedPages) {
          setPageNum(Math.max(1, calculatedPages)); // Ensure page number is at least 1
        }
      } catch (err) {
        // Handle any errors that might occur during the fetch
        setError("Error fetching books, please try again later.");
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false); // Mark the loading as complete
      }
    };

    fetchBooks(); // Call the fetchBooks function
  }, [pageSize, pageNum, sortBy, sortDirection, category]); // Dependencies: fetch again if any of these state values change

  // Fetch categories to populate the category filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:5000/OnlineBook/GetCategories");
        const data = await response.json(); // Parse the response into JSON
        setCategories(data); // Set the categories state
      } catch (err) {
        setError("Error fetching categories, please try again later.");
        console.error(err); // Log the error for debugging
      }
    };

    fetchCategories(); // Call the fetchCategories function
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div className="container mt-4">
      {/* Page Title */}
      <div className="row mb-4">
        <div className="col text-center">
          <h1>Book List</h1>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="row sticky-top bg-white py-2 border-bottom mb-3">
        <div className="col d-flex align-items-center gap-4">
          {/* Filter by Category */}
          <div className="d-flex align-items-center">
            <label className="me-2"><strong>Filter by Category:</strong></label>
            <select
              className="form-select w-auto"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value); // Update category state on selection change
                setPageNum(1); // Reset to first page when the category changes
              }}
            >
              <option value="">All</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option> // Render category options
              ))}
            </select>
          </div>

          {/* Sort by Title */}
          <div className="d-flex align-items-center">
            <label className="me-2"><strong>Sort by Title:</strong></label>
            <select
              className="form-select w-auto"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)} // Update sorting direction on change
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Books Table */}
      <div className="row">
        <div className="col">
          <div className="book-table-wrapper table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-light">
                <tr>
                  {/* Table headers */}
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Classification</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.bookID}>
                    {/* Table rows for each book */}
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author}</td>
                    <td>{b.publisher}</td>
                    <td>{b.isbn}</td>
                    <td>{b.classification}</td>
                    <td>{b.category}</td>
                    <td>{b.pageCount}</td>
                    <td>${Number(b.price).toFixed(2)}</td>
                    <td>
                      {/* Add to Cart Button */}
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => addToCart({
                          ...b,
                          quantity: 1,
                          subtotal: b.price,
                        })}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="row mt-4">
        <div className="col d-flex justify-content-center">
          <button
            className="btn btn-primary me-2"
            disabled={pageNum === 1}
            onClick={() => setPageNum(pageNum - 1)} // Go to the previous page
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn ${pageNum === i + 1 ? "btn-secondary" : "btn-outline-primary"} mx-1`}
              onClick={() => setPageNum(i + 1)} // Go to the selected page
              disabled={pageNum === i + 1}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-primary ms-2"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)} // Go to the next page
          >
            Next
          </button>
        </div>
      </div>

      {/* Page Size Selector */}
      <div className="row mt-3">
        <div className="col d-flex justify-content-center">
          <label className="me-2"><strong>Results per page:</strong></label>
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value)); // Update page size on selection change
              setPageNum(1); // Reset to first page when the page size changes
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default BookList; // Export the BookList component
