'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Instagram,
  Facebook,
  Send,
  Mail,
} from 'lucide-react';
import { CartIcon } from './icons/CartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WIshlistContext';

export interface CartItem {
  id: string;
  // add more fields if needed
}

export interface WishlistItem {
  id: string;
  // add more fields if needed
}import { useContext } from 'react'
import { ScrollContext } from '../../context/ScrollContext'




const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const section = useContext(ScrollContext)
  const isAtTop = section === 0
  const { cartItems } = useCart() as { cartItems: CartItem[] };
  const { WishlistItems } = useWishlist() as { WishlistItems: WishlistItem[] };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!navRef.current) return

    const updateHeight = () => {
      const h = navRef.current!.offsetHeight
      console.log("updating")
      document.documentElement.style.setProperty('--navbar-h', `${h}px`)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(navRef.current)

    window.addEventListener('resize', updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [])





  const colorClass = isAtTop ? 'text-white' : 'text-black';

  return (
    <div className="sticky top-0 z-30">
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:block">
        <div
          ref={navRef}
          className={`fixed top-0 left-0 right-0 z-20 flex transition-all duration-700 ease-in-out items-center
            ${isAtTop
              ? 'flex-col gap-2 py-2 shadow-none justify-center bg-transparent'
              : 'flex-row py-4 justify-between  px-8 bg-white bg-opacity-5'
            }
          `}
        >
          <Link
            className={`font-main transition-all duration-700 ease-in-out whitespace-nowrap leading-none ${isAtTop ? 'text-8xl' : 'text-5xl space-between'
              } ${colorClass}`}
            href="/"
          >
            VARIETY BOOK HOUSE
          </Link>

          {!isAtTop && (
            <div className={`flex font-MyFont items-center gap-x-8 ${colorClass}`}>
              <SearchIcon label="SEARCH" className={colorClass} />
              <CartIcon label="CART" className={colorClass} />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div
        className={`sticky top-0 z-20 flex justify-between px-4 transition-all duration-300 md:hidden
          items-center ${isAtTop ? 'py-7' : 'py-4 shadow-lg'} bg-transparent backdrop-blur-md ${colorClass}`}
      >
        <motion.div whileTap={{ scale: 0.8 }}>
          <Menu size={24} className={colorClass} onClick={openModal} />
        </motion.div>
        <Link className={`font-main text-2xl ${colorClass}`} href="/">
          Variety Book House
        </Link>
        <div className="flex gap-x-5 items-center">
          <Link href="/Cart" className={`relative ${colorClass}`}>
            <ShoppingBag size={20} />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div id="modal">
        <div
          className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={closeModal}
        ></div>
        <div
          className={`fixed top-0 left-0 z-40 flex h-screen w-10/12 flex-col bg-transparent p-6 backdrop-blur-md transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${colorClass}`}
        >
          <X
            size={24}
            strokeWidth={1.5}
            onClick={closeModal}
            className="self-end cursor-pointer mb-8"
          />

          <nav className="flex flex-col gap-y-6 text-2xl font-MyFont">
            <Link href="/" onClick={closeModal}>
              Home
            </Link>
            <Link href="/Dashboard" onClick={closeModal} className="flex items-center gap-3">
              Dashboard <User size={20} />
            </Link>
            <Link href="/Wishlist" onClick={closeModal} className="flex items-center gap-3">
              Wishlist <Heart size={20} />
            </Link>
            <Link href="/About" onClick={closeModal}>
              About Us
            </Link>
            <Link href="/Contact" onClick={closeModal}>
              Contact Us
            </Link>
          </nav>

          <div className="mt-auto flex gap-x-6 py-6 border-t border-gray-100">
            <Facebook size={20} strokeWidth={1.5} />
            <Instagram size={20} strokeWidth={1.5} />
            <Send size={20} strokeWidth={1.5} />
            <Mail size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
