import { useState, useEffect } from "react";

const CART_STORAGE_KEY = "bolaji_marketplace_cart";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from local storage", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const updateLocalStorage = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prevItems; // Product already in cart
      } else {
        const newItems = [...prevItems, { ...product, quantity: 1 }];
        updateLocalStorage(newItems);
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };
};
