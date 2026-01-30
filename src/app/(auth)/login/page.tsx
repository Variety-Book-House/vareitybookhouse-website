'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/authenticate'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';

export default function LoginForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    return (
        <div className="flex min-h-screen flex-col items-center bg-white py-8">
            <Link
                className="font-main whitespace-nowrap leading-none text-[6vh] sm:text-[7vh] md:text-[8vh] lg:text-[9vh]"
                href="/"
            >
                VARIETY BOOK HOUSE
            </Link>

            {/* Spacer */}
            <div className="h-16 md:h-24" />

            <form
                action={formAction}
                className="w-full max-w-sm space-y-10"
            >
                {/* Heading */}
                <h1 className="text-3xl font-serif font-light tracking-wide text-black">
                    Sign in
                </h1>

                {/* Email */}
                <div className="space-y-1">
                    <label
                        htmlFor="email"
                        className="block text-[11px] uppercase tracking-widest text-black"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none placeholder:text-gray-400"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label
                        htmlFor="password"
                        className="block text-[11px] uppercase tracking-widest text-black"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none placeholder:text-gray-400"
                    />
                </div>

                <input type="hidden" name="redirectTo" value={callbackUrl} />

                {/* Button */}
                <button
                    type="submit"
                    aria-disabled={isPending}
                    className="w-full border border-black py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white disabled:opacity-50"
                >
                    {isPending ? 'Signing in…' : 'Log in'}
                </button>

                {/* Error */}
                {errorMessage && (
                    <p className="text-xs text-black tracking-wide">
                        {errorMessage}
                    </p>
                )}
            </form>
        </div>
    )
}
