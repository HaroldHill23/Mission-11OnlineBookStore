import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useCart } from "../context/CartContext";


function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { addToCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  // Sorting State
  const [sortBy] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchBooks = async () => {
  //     const response = await fetch(
  //       `https://localhost:5000/OnlineBook/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&sortDirection=${sortDirection}&category=${category}`
  //     );
  //     const data = await response.json();

  //     setBooks(data.books);

  //     // Fix: Ensure totalPages updates AFTER data is fetched
  //     const calculatedPages = Math.ceil(data.totalNumBooks / pageSize);
  //     setTotalPages(calculatedPages);

  //     // Fix: If current pageNum is too high, reset to last valid page
  //     if (pageNum > calculatedPages) {
  //       setPageNum(Math.max(1, calculatedPages)); // Ensure it's at least 1
  //     }
  //   };

  //   fetchBooks();
  // }, [pageSize, pageNum, sortBy, sortDirection, category]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const response = await fetch(
  //       "https://localhost:5000/OnlineBook/GetCategories"
  //     );
  //     const data = await response.json();
  //     setCategories(data);
  //   };
  //   fetchCategories();
  // }, []);

  return (
    <div className="container mt-4">
      {/* Page Title */}
      <div className="row mb-4">
        <div className="col text-center">
          <h1>Book List</h1>
        </div>
      </div>

      {/* Filter + Sort Bar */}
      <div className="row sticky-top bg-white py-2 border-bottom mb-3">
        <div className="col d-flex align-items-center gap-4">
          {/* Filter by Category */}
          <div className="d-flex align-items-center">
            <label className="me-2"><strong>Filter by Category:</strong></label>
            <select
              className="form-select w-auto"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPageNum(1);
              }}
            >
              <option value="">All</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort by Title */}
          <div className="d-flex align-items-center">
            <label className="me-2"><strong>Sort by Title:</strong></label>
            <select
              className="form-select w-auto"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Table */}
      <div className="row">
        <div className="col">
          <div className="book-table-wrapper table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-light">
                <tr>
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
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author}</td>
                    <td>{b.publisher}</td>
                    <td>{b.isbn}</td>
                    <td>{b.classification}</td>
                    <td>{b.category}</td>
                    <td>{b.pageCount}</td>
                    <td>${Number(b.price).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() =>
                          addToCart({
                            ...b,
                            quantity: 1,
                            subtotal: b.price,
                          })
                        }
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
            onClick={() => setPageNum(pageNum - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn ${pageNum === i + 1 ? "btn-secondary" : "btn-outline-primary"} mx-1`}
              onClick={() => setPageNum(i + 1)}
              disabled={pageNum === i + 1}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-primary ms-2"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)}
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
              setPageSize(Number(e.target.value));
              setPageNum(1);
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
};

export default BookList;

