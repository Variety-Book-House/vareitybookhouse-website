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
import { usePathname } from 'next/navigation'



export interface CartItem {
  id: string;
  // add more fields if needed
}

export interface WishlistItem {
  id: string;
  // add more fields if needed
}import { useContext } from 'react'
import { ScrollContext } from '../../context/ScrollContext'
import { UserIcon } from './icons/UserIcon';




const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mobileNavRef = useRef<HTMLDivElement>(null)

  const [isAtTop, setIsAtTop] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    const isHome = pathname === '/'

    const update = () => {
      if (!isHome) {
        setIsAtTop(false)
        return
      }

      setIsAtTop(container.scrollTop < 10)
    }

    update()
    container.addEventListener('scroll', update)

    return () => container.removeEventListener('scroll', update)
  }, [pathname])

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    const onScroll = () => {
      setIsAtTop(container.scrollTop < 10)
    }

    onScroll()
    container.addEventListener('scroll', onScroll)

    return () => container.removeEventListener('scroll', onScroll)
  }, [])



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
            className={`font-main transition-all duration-500 ease-in whitespace-nowrap leading-none 
              
              ${isAtTop ? '  text-[6vh] sm:text-[7vh] md:text-[8vh] lg:text-[9vh] ' : ' text-[4vh] sm:text-[5vh] md:text-[4vh] lg:text-[5vh] xl:text-[7vh]   space-between'
              } ${colorClass}`}
            href="/"
          >
            VARIETY BOOK HOUSE
          </Link>

          {!isAtTop && (
            <div className={`flex font-MyFont text-[12px] md:text-[14px] lg:text-[16px] items-center gap-x-5 ${colorClass}`}>
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
              <Link href="/search" ><SearchIcon label="" className={colorClass} /></Link>
              <Link href="/cart" ><CartIcon label="" className={colorClass} /></Link>
              <Link href="/login" ><UserIcon className={colorClass} /></Link>

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
            : 'flex-row gap-2 py-[clamp(0.8rem,2vh,5rem)] justify-center bg-white bg-opacity-5'
          }
          `}
      >
        <motion.div whileTap={{ scale: 0.8 }}>
          {isAtTop ? null : <Menu className={`${colorClass}  transition-all duration-700 h-[16px] sm:h-[18px] md:h-[20px] w-[16px] sm:w-[18px] md:w-[20px] `} onClick={openModal} />}
        </motion.div>
        <Link
          className={`font-main w-full text-center transition-all duration-700 ease-in-out whitespace-nowrap leading-none  ${isAtTop ? '  text-[4vh] sm:text-[4vh] md:text-[5vh] lg:text-[6vh] ' : ' text-[3vh] sm:text-[4vh] md:text-[4vh] lg:text-[5vh] space-between'
            }  ${colorClass}`}
          href="/"
        >
          VARIETY BOOK HOUSE
        </Link>
        {isAtTop ? null : (<SearchIcon label="" className={` w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px] ${colorClass}`} />)}


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
                HOME
              </Link>

              <Link href="/books" className='hover:underline underline-offset-4
' onClick={closeModal}>
                BOOKS
              </Link>

              <Link href="/pens" className='hover:underline underline-offset-4
' onClick={closeModal}>
                PENS
              </Link>

              <Link href="/Dashboard" onClick={closeModal} className="flex items-center gap-3">
                LOGIN <User size={20} />
              </Link>

              {/* <Link href="/Wishlist" onClick={closeModal} className="flex items-center gap-3">
                WISHLIST <Heart size={20} />
              </Link> */}

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
