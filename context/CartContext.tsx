"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

/* -------------------- Types -------------------- */

export interface CartItem {
  id: string;
  title: string;
  author?: string[];
  price: number;
  image?: string;
  preview?: string;
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (item: CartItem, productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  incrementQuantity: (productId: string) => Promise<void>;
  decrementQuantity: (productId: string) => Promise<void>;
  calculateTotalPrice: () => number;
}

interface CartProviderProps {
  children: ReactNode;
}

/* -------------------- Context -------------------- */

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

/* -------------------- Provider -------------------- */

export function CartProvider({ children }: CartProviderProps) {
  const token = Cookies.get("token");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  /* -------------------- Load Cart -------------------- */

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching cart:", res.statusText);
          return;
        }

        const data: CartItem[] = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error(
          "Unexpected error while fetching cart:",
          (error as Error).message
        );
      }
    })();
  }, [token]);

  /* -------------------- Add To Cart -------------------- */

  const addToCart = async (item: CartItem, productId: string) => {
    try {
      const updatedCart = [...cartItems];
      const existingIndex = updatedCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingIndex !== -1) {
        updatedCart[existingIndex].quantity += item.quantity;
      } else {
        updatedCart.push(item);
      }

      const newTotal = updatedCart.reduce(
        (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
        0
      );

      setCartItems(updatedCart);
      setTotal(newTotal);

      const res = await fetch("api/cart", {
        method: existingIndex !== -1 ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: updatedCart,
          total: newTotal,
          productId,
        }),
      });

      if (res.ok) {
        toast.success("Book Added To Cart successfully");
      } else {
        console.error("Error adding item to cart");
      }
    } catch (error) {
      console.error(
        "Error while adding item to cart:",
        (error as Error).message
      );
    }
  };

  /* -------------------- Remove -------------------- */

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch("api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        console.error("Error removing item:", res.statusText);
        return;
      }

      const data: { items: CartItem[]; total: number } = await res.json();
      setCartItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        (error as Error).message
      );
    }
  };

  /* -------------------- Quantity -------------------- */

  const incrementQuantity = async (productId: string) => {
    await updateQuantity("api/cart", productId);
  };

  const decrementQuantity = async (productId: string) => {
    await updateQuantity("api/decrement", productId);
  };

  const updateQuantity = async (url: string, productId: string) => {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        console.error("Error updating quantity:", res.statusText);
        return;
      }

      const data: { items: CartItem[]; total: number } = await res.json();
      setCartItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error(
        "Error updating quantity:",
        (error as Error).message
      );
    }
  };

  /* -------------------- Total -------------------- */

  const calculateTotalPrice = (): number => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  /* -------------------- Provider -------------------- */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        calculateTotalPrice,
      }
      }
    >
      {children}
    </CartContext.Provider>
  );
}
