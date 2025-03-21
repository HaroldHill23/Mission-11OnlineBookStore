import { useEffect, useState } from "react";
import { Book } from './types/Book';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Sorting State
    const [sortBy, setSortBy] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<string>("asc");

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/OnlineBook/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
            const data = await response.json();
    
            setBooks(data.books);
    
            // Fix: Ensure totalPages updates AFTER data is fetched
            const calculatedPages = Math.ceil(data.totalNumBooks / pageSize);
            setTotalPages(calculatedPages);
    
            // Fix: If current pageNum is too high, reset to last valid page
            if (pageNum > calculatedPages) {
                setPageNum(Math.max(1, calculatedPages)); // Ensure it's at least 1
            }
        };
    
        fetchBooks();
    }, [pageSize, pageNum, sortBy, sortDirection]);
    
    return (
        <div className="container mt-4">
            <h1 className="text-center">Book List</h1>
            <br />

            {/* Sorting Dropdown */}
            <div className="d-flex justify-content-end mb-3">
                {/* Sort By Dropdown */}
                <label className="me-2"><strong>Sort By:</strong></label>
                <select
                    className="form-select w-auto me-2"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="title">Title</option>
                </select>

                {/* Sort Order Dropdown */}
                <label className="me-2"><strong>Sort Order:</strong></label>
                <select
                    className="form-select w-auto"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {/* Book Cards */}
            <div className="row row-cols-1 row-cols-md-3 g-4 d-flex flex-wrap">
                {books.map((b) => (
                    <div className="col d-flex" key={b.bookID}>
                        <div className="card shadow-sm h-100 w-100">
                            <div className="card-body">
                                <h5 className="card-title">{b.title}</h5>
                                <ul className="list-unstyled">
                                    <li><strong>Author:</strong> {b.author}</li>
                                    <li><strong>Publisher:</strong> {b.publisher}</li>
                                    <li><strong>ISBN:</strong> {b.isbn}</li>
                                    <li><strong>Classification:</strong> {b.classification}</li>
                                    <li><strong>Category:</strong> {b.category}</li>
                                    <li><strong>Pages:</strong> {b.pageCount}</li>
                                    <li><strong>Price:</strong> ${Number(b.price).toFixed(2)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
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
                        className={`btn ${pageNum === (i + 1) ? "btn-secondary" : "btn-outline-primary"} mx-1`}
                        onClick={() => setPageNum(i + 1)}
                        disabled={pageNum === (i + 1)}
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

            {/* Results Per Page */}
            <div className="d-flex justify-content-center mt-3">
                <label className="me-2"><strong>Results per page:</strong></label>
                <select 
                    className="form-select w-auto"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1);
                    }}
                >
                    <option value="4">4</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
}

export default BookList;
