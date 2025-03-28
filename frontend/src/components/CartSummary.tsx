import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = Number(totalAmount).toFixed(2);
  
  return (
    <div
      onClick={() => navigate("/cart")}
      style={{
        position: "fixed",
        top: "30px",
        right: "20px",
        background: "#f8f9fa",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        fontSize: "16px",
      }}
    >
      🛒 {totalQuantity} items | <strong>${formattedTotal}</strong>
    </div>
  );
  
  
};

export default CartSummary;
