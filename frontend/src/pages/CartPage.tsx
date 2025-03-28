import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  return (
    <div>
      <h2> Your Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.bookID}>
                {item.title} (x{item.quantity}) — ${item.subtotal.toFixed(2)}{" "}
                <button
                  onClick={() => removeFromCart(item.bookID)}
                  className="btn btn-sm btn-danger ms-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>
        Total: ${cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
      </h3>
      <button onClick={() => navigate(-1)}>Continue Shopping</button>
    </div>
  );
}

export default CartPage;
