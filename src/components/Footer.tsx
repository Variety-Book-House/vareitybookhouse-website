import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="mt-auto shadow-inner uppercase">
      <div className="footer-container mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:grid-rows-4 md:gap-x-6 md:gap-y-0 md:px-8 lg:gap-x-8 lg:gap-y-2">
        <div className="bookstore-desc col-span-2 md:row-span-3">
          <h2 className="my-2 font-main  text-xl font-semibold">
            Variety Book House
          </h2>
          <div className="text-sm">
            <p className="my-1 font-MyFont opacity-80">
              We are an online bookstore that offers a wide selection of books
              in various genres, including fiction, non-fiction, biographies,
              and more.
            </p>
            <p className="my-1 font-MyFont opacity-80">
              We provide a convenient and enjoyable shopping experience while
              offering competitive prices and excellent customer service.
            </p>
          </div>
        </div>

        <div className="about-us opacity-80 md:row-span-4">
          <h2 className="my-1 font-main text-xl font-semibold">Quick Links</h2>

          <Link
            href="/About"
            className="text-link block py-1 font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
          >
            About Us
          </Link>

          <Link
            href="/Contact"
            className="text-link block py-1 font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
          >
            Contact Us
          </Link>

          <Link
            href="/Faq"
            className="text-link block py-1 font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
          >
            FAQ
          </Link>

          <Link
            href="/Policy"
            className="text-link block py-1 font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
          >
            Privacy Policy
          </Link>

          <Link
            href="/Terms"
            className="text-link block py-1 font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
          >
            Terms &amp; Conditions
          </Link>
        </div>

        <div className="services md:row-span-4">
          <h2 className="my-1 font-main text-xl font-semibold">Contact</h2>

          <p className="mb-3 mr-4 text-sm font-MyFont opacity-80">
            Email:
            <Link
              href="mailto:mayankkush0842@gmail.com"
              className="text-link mt-1 block font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
            >
              varietybookhouse@yahoo
              <br className="flex md:hidden" />
              .com
            </Link>
          </p>

          <p className="mb-3 text-sm font-MyFont">
            Phone:
            <Link
              href="tel:+919023373685"
              className="text-link mt-1 block font-MyFont underline decoration-dashed underline-offset-2 hover:decoration-solid"
            >
              +91 9425300670
            </Link>
          </p>

          <p className="mb-3 text-sm font-MyFont">
            Address:
            <span className="mt-1 block font-MyFont">
              Bhopal, Madhya Pradesh, IN
            </span>
          </p>
        </div>

        <div className="social-group col-span-2 md:row-span-1 md:self-center">
          <div className="mt-3 flex flex-row justify-center gap-x-8 opacity-80 md:justify-start !stroke-current stroke-2">

          </div>
        </div>
      </div>

      <div className="copyright-notice-container w-full bg-textgray p-1">
        <div className="copyright-notice mx-auto flex max-w-6xl flex-col items-center px-4 py-1 font-MyFont text-primary md:flex-row md:justify-between md:px-8">
          <span>© Copyright Variety Book House</span>
          <span>
            Crafted by
            Pratul Wadhwa

          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
