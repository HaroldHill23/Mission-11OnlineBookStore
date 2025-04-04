import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";
import Pagination from "../components/Pagination";
import { deleteBook, fetchBooks } from "../api/BooksAPI";

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10); //default value ten here as well
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [sortBy] = useState<string>("title"); // Sorting is hardcoded to be by title
  const [sortDirection, setSortDirection] = useState<string>("asc"); // Sorting direction, default is ascending
  const [category, setCategory] = useState<string>(""); // State for the selected category (single category string)


useEffect(() => {
  const loadBooks = async () => {
    try {
      // Pass the selected category as a string, and empty array for selectedCategories
      const data = await fetchBooks(pageSize, pageNum, sortBy, sortDirection, category);

      setBooks(data.books); // Set the books from the response
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Set the total pages based on the total number of books
    } catch (error) {
      setError((error as Error).message); // Set error state if the fetch fails
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  };

  loadBooks(); // Call the function to load books
}, [pageSize, pageNum, sortBy, sortDirection, category]); // Add all relevant state variables as dependencies


  const handleDelete = async (bookID: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookID);
      setBooks(books.filter((b) => b.bookID !== bookID));
    } catch (error) {
      alert("Failed to delete book. Please try again.");
    }
  };

  if (loading) return <p> Loading Books...</p>;
  if (error) return <p className="text-red-500"> Error: {error}</p>;

  return (
    <div>
      <h1> Admin-Books</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, sortBy, sortDirection, category).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, sortBy, sortDirection, category).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Page Count</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>{b.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick= {() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminBooksPage;
