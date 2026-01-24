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
import { useNavbarTheme } from '../../context/NavbarThemeContext'



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
  const mobileNavRef = useRef<HTMLDivElement>(null)

  const section = useContext(ScrollContext)
  const isAtTop = section === 0
  const { cartItems } = useCart() as { cartItems: CartItem[] };
  const { WishlistItems } = useWishlist() as { WishlistItems: WishlistItem[] };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const desktopNavRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    let currentEl: HTMLDivElement | null = null

    const getActiveNav = () =>
      window.innerWidth >= 768
        ? desktopNavRef.current
        : mobileNavRef.current

    const updateHeight = () => {
      const el = getActiveNav()
      if (!el) return

      // Switch observer if element changed
      if (currentEl !== el) {
        if (currentEl) ro.unobserve(currentEl)
        ro.observe(el)
        currentEl = el
      }

      document.documentElement.style.setProperty(
        '--navbar-h',
        `${el.offsetHeight}px`
      )
    }

    const ro = new ResizeObserver(updateHeight)

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      if (currentEl) ro.unobserve(currentEl)
      ro.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [])








  const { isDark } = useNavbarTheme()

  const colorClass =
    isAtTop
      ? isDark ? 'text-white' : 'text-black'
      : 'text-black'
  return (
    <div className="sticky top-0 z-30">
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:flex">
        <div
          ref={desktopNavRef}
          className={`fixed top-0 left-0 right-0 z-20 flex transition-all duration-700 ease-in-out items-center
            ${isAtTop
              ? 'flex-col gap-2 py-2 shadow-none justify-center bg-transparent'
              : 'flex-row py-4 justify-between  px-8 bg-white bg-opacity-5'
            }
          `}
        >
          <Link
            className={`font-main transition-all duration-700 ease-in-out whitespace-nowrap leading-none ${isAtTop ? 'text-8xl' : 'text-7xl space-between'
              } ${colorClass}`}
            href="/"
          >
            VARIETY BOOK HOUSE
          </Link>

          {!isAtTop && (
            <div className={`flex font-MyFont items-center gap-x-10 ${colorClass}`}>
              {/* NAV LINKS */}
              <Link href="/books" className="
    font-MyFont
    font-light
    relative
    inline-block
    bg-[linear-gradient(currentColor,currentColor)]
    bg-[length:0%_1px]
    bg-left-bottom
    bg-no-repeat
    transition-[background-size]
    duration-300
    hover:bg-[length:100%_1px]
  "
              >

                BOOKS
              </Link>
              <Link href="/books" className="
    font-MyFont
    font-light
    relative
    inline-block
    bg-[linear-gradient(currentColor,currentColor)]
    bg-[length:0%_1px]
    bg-left-bottom
    bg-no-repeat
    transition-[background-size]
    duration-300
    hover:bg-[length:100%_1px]
  "
              >
                MAGAZINES
              </Link>
              <Link href="/pens" className="
    font-MyFont
    font-light
    relative
    inline-block
    bg-[linear-gradient(currentColor,currentColor)]
    bg-[length:0%_1px]
    bg-left-bottom
    bg-no-repeat
    transition-[background-size]
    duration-300
    hover:bg-[length:100%_1px]
  "
              >                PENS
              </Link>




              {/* ACTION ICONS */}
              <SearchIcon label="" className={colorClass} />
              <CartIcon label="" className={colorClass} />
            </div>
          )}

        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div
        ref={mobileNavRef}
        className={` md:hidden px-2 py-5 w-full fixed justify-between top-0  z-20 flex transition-all duration-700 ease-in-out items-center
            ${isAtTop
            ? 'flex-row gap-2 py-3 shadow-none justify-center bg-transparent'
            : 'flex-row gap-2 py-3 justify-center bg-white bg-opacity-5'
          }
          `}
      >
        <motion.div whileTap={{ scale: 0.8 }}>
          <Menu className={`${colorClass} transition-all duration-700`} onClick={openModal} />
        </motion.div>
        <Link
          className={`font-main w-full text-center transition-all duration-700 ease-in-out whitespace-nowrap leading-none text-[31px] ${colorClass}`}
          href="/"
        >
          VARIETY BOOK HOUSE
        </Link>
        <SearchIcon label="" size={24} className={colorClass} />

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
            <nav className="flex flex-col gap-y-6 text-2xl font-MyFont">
              <Link href="/" onClick={closeModal}>
                Home
              </Link>
              <Link href="/books" className='font-MyFont  font-light hover:underline underline-offset-4' onClick={closeModal}>

                MAGAZINES
              </Link>
              <Link href="/books" className='hover:underline underline-offset-4
' onClick={closeModal}>
                Books
              </Link>

              <Link href="/pens" className='hover:underline underline-offset-4
' onClick={closeModal}>
                Pens
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
