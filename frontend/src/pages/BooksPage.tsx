import BookList from "../components/BookList";
import CartSummary from "../components/CartSummary";

function BooksPage() {
  return (
    <div className="container mt-4">
      <CartSummary />
      <BookList />
    </div>
  );
}

export default BooksPage;
