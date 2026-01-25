import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className=" w-full overflow-hidden border-t border-black/10 uppercase">
      {/* MAIN FOOTER */}
      <div className=" w-full max-w-6xl px-3 py-5 sm:px-4 md:px-8">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">

          {/* BRAND */}
          <div className="md:col-span-2">
            <h2 className="mb-1 break-words font-main text-lg sm:text-xl font-semibold">
              Variety Book House
            </h2>
            <p className="mb-2 break-words font-MyFont text-sm opacity-80">
              We are an online bookstore offering a wide selection of books
              across fiction, non-fiction, biographies, and more.
            </p>
            <p className="break-words font-MyFont text-sm opacity-80">
              Enjoy a smooth shopping experience with competitive prices and
              great customer service.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="min-w-0">
            <h2 className="mb-1 font-main text-lg sm:text-xl font-semibold">
              Quick Links
            </h2>
            <div className="space-y-1 font-MyFont text-sm opacity-80">
              {[
                ["About Us", "/About"],
                ["Contact Us", "/Contact"],
                ["FAQ", "/Faq"],
                ["Privacy Policy", "/Policy"],
                ["Terms & Conditions", "/Terms"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block max-w-full break-words underline decoration-dashed underline-offset-2 transition-all duration-300 hover:decoration-solid"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="min-w-0">
            <h2 className="mb-2 font-main text-lg sm:text-xl font-semibold">
              Contact
            </h2>

            <p className="mb-1 font-MyFont text-sm opacity-80 break-words">
              Email:
              <Link
                href="mailto:mayankkush0842@gmail.com"
                className="mt-1 block break-all underline decoration-dashed underline-offset-2 transition-all duration-300 hover:decoration-solid"
              >
                varietybookhouse@yahoo.com
              </Link>
            </p>

            <p className="mb-1 font-MyFont text-sm opacity-80 break-words">
              Phone:
              <Link
                href="tel:+919423300670"
                className="mt-1 block break-words underline decoration-dashed underline-offset-2 transition-all duration-300 hover:decoration-solid"
              >
                +91 94253 00670
              </Link>
            </p>

            <p className="font-MyFont text-sm opacity-80 break-words">
              Address:
              <span className="mt-1 block">
                Bhopal, Madhya Pradesh, IN
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full border-t border-black/10" />

      {/* COPYRIGHT */}
      <div className="w-full bg-textgray overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 px-3 py-3 font-MyFont text-xs sm:text-sm text-primary md:flex-row md:justify-between md:px-8">
          <span className="break-words text-center md:text-left">
            © Variety Book House
          </span>
          <span className="break-words text-center md:text-right">
            Crafted by <span className="font-medium">Pratul Wadhwa</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
