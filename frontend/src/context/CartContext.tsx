import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
}

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((b) => b.bookID === item.bookID);

      if (existingItem) {
        return prevCart.map((b) => {
          if (b.bookID === item.bookID) {
            const newQuantity = b.quantity + 1;
            const newSubtotal = Number(b.price) * newQuantity;

            return {
              ...b,
              quantity: newQuantity,
              subtotal: newSubtotal,
            };
          }
          return b;
        });
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            subtotal: Number(item.price),
          },
        ];
      }
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.bookID !== bookID)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <cartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
