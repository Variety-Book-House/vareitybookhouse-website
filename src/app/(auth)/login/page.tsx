'use client'

import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* BRAND */}
                <h1 className="mb-12 text-center font-serif text-3xl tracking-widest">
                    VARIETY BOOK HOUSE
                </h1>

                {/* FORM */}
                <form className="space-y-8">

                    {/* EMAIL */}
                    <div className="relative">
                        <label className="absolute -top-3 left-0 bg-white pr-2 text-[10px] tracking-widest text-black">
                            EMAIL
                        </label>
                        <input
                            type="email"
                            required
                            className="
                w-full border-b border-black 
                py-2 text-sm tracking-wide
                focus:outline-none
              "
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <label className="absolute -top-3 left-0 bg-white pr-2 text-[10px] tracking-widest text-black">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            required
                            className="
                w-full border-b border-black 
                py-2 text-sm tracking-wide
                focus:outline-none
              "
                        />
                    </div>

                    {/* FORGOT */}
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-[11px] tracking-widest underline underline-offset-4"
                        >
                            FORGOT PASSWORD?
                        </Link>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="
              w-full border border-black py-3
              text-xs tracking-widest
              transition-all duration-300
              hover:bg-black hover:text-white
            "
                    >
                        LOG IN
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="my-12 h-px w-full bg-black/20" />

                {/* CREATE ACCOUNT */}
                <div className="text-center">
                    <p className="mb-4 text-xs tracking-widest">
                        NEW TO VBH?
                    </p>
                    <Link
                        href="/register"
                        className="
              inline-block border border-black px-10 py-3
              text-xs tracking-widest
              transition-all duration-300
              hover:bg-black hover:text-white
            "
                    >
                        CREATE ACCOUNT
                    </Link>
                </div>

            </div>
        </main>
    )
}
