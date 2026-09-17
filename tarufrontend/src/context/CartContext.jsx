import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("taru_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("taru_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addToCart = (product, requestedQty = 1) => {
    if (product.status !== "AVAILABLE" || Number(product.quantity) <= 0) {
      toast.error("This item is currently sold out.");
      return false;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);

      if (product.productType === "UNIQUE") {
        if (existing) {
          toast.info("Unique handcrafted items are limited to 1 piece per buyer.");
          return prev;
        }
        toast.success(`"${product.name}" added to bag.`);
        return [
          ...prev,
          {
            productId: product.productId,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            productType: product.productType,
            quantity: 1,
            maxStock: 1,
          },
        ];
      }

      // Regular product
      const currentCartQty = existing ? existing.quantity : 0;
      const newQty = currentCartQty + requestedQty;
      const maxAvailable = Number(product.quantity);

      if (newQty > maxAvailable) {
        toast.error(`Only ${maxAvailable} units available in stock.`);
        return prev;
      }

      toast.success(`Added to bag.`);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.productId,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            productType: product.productType,
            quantity: requestedQty,
            maxStock: maxAvailable,
          },
        ];
      }
    });

    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;

        if (item.productType === "UNIQUE" && newQuantity > 1) {
          toast.info("Unique handcrafted items are limited to 1 piece.");
          return { ...item, quantity: 1 };
        }

        if (newQuantity > item.maxStock) {
          toast.error(`Maximum available stock is ${item.maxStock}`);
          return { ...item, quantity: item.maxStock };
        }

        return { ...item, quantity: newQuantity };
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info("Item removed from bag.");
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalItemsCount = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

