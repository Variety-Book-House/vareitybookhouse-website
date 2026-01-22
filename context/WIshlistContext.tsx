"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

/* -------------------- Types -------------------- */

export interface WishlistItem {
  id: string;
  title: string;
  authors?: string[];
  price: number;
  image?: string;
  preview?: string;
}

interface WishlistContextValue {
  WishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

interface WishlistProviderProps {
  children: ReactNode;
}

/* -------------------- Context -------------------- */

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const useWishlist = (): WishlistContextValue => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

/* -------------------- Provider -------------------- */

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { token } = parseCookies();
  const [WishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  /* -------------------- Load Wishlist -------------------- */

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching wishlist:", res.statusText);
          return;
        }

        const data: WishlistItem[] = await res.json();
        setWishlistItems(data);
      } catch (error) {
        console.error(
          "Unexpected error while fetching wishlist:",
          (error as Error).message
        );
      }
    })();
  }, [token]);

  /* -------------------- Add -------------------- */

  const addToWishlist = async (item: WishlistItem) => {
    try {
      const exists = WishlistItems.some(
        (wishlistItem) => wishlistItem.id === item.id
      );

      if (exists) return;

      const updatedWishlist = [...WishlistItems, item];

      const res = await fetch("api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: updatedWishlist }),
      });

      if (res.ok) {
        toast.success("Book added to wishlist");
        setWishlistItems(updatedWishlist);
      } else {
        console.error("Error adding item to wishlist");
      }
    } catch (error) {
      console.error(
        "Error adding item to wishlist:",
        (error as Error).message
      );
    }
  };

  /* -------------------- Remove -------------------- */

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch("api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        console.error("Error removing wishlist item:", res.statusText);
        return;
      }

      const data: { items: WishlistItem[] } = await res.json();
      setWishlistItems(data.items);
    } catch (error) {
      console.error(
        "Error removing wishlist item:",
        (error as Error).message
      );
    }
  };

  /* -------------------- Provider -------------------- */

  return (
    <WishlistContext.Provider
      value={{
        WishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
