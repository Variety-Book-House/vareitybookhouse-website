'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/authenticate'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
        try {
            await signIn(provider, { callbackUrl })
        } catch (error) {
            console.error('Social sign-in error:', error)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-white py-8 px-6">
            <Link
                className="font-main whitespace-nowrap leading-none text-[6vh] sm:text-[7vh] md:text-[8vh] lg:text-[9vh]"
                href="/"
            >
                VARIETY BOOK HOUSE
            </Link>

            <div className="h-16 md:h-24" />

            <div className="w-full max-w-sm space-y-10">
                <h1 className="text-3xl font-serif font-light tracking-wide text-black">
                    Sign in
                </h1>

                {/* Social Sign-in Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleSocialSignIn('google')}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 text-sm hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span className="text-xs uppercase tracking-widest">Continue with Google</span>
                    </button>

                    <button
                        onClick={() => handleSocialSignIn('facebook')}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 text-sm hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-xs uppercase tracking-widest">Continue with Facebook</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 uppercase tracking-widest text-xs">
                            Or continue with email
                        </span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form action={formAction} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-1">
                        <label
                            htmlFor="email"
                            className="block text-[11px] uppercase tracking-widest"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label
                            htmlFor="password"
                            className="block text-[11px] uppercase tracking-widest"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none"
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Redirect */}
                    <input type="hidden" name="redirectTo" value={callbackUrl} />

                    <button
                        type="submit"
                        aria-disabled={isPending}
                        className="w-full border border-black py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white disabled:opacity-50"
                    >
                        {isPending ? 'Signing in…' : 'Sign in'}
                    </button>

                    {errorMessage && (
                        <p className="text-xs tracking-wide text-red-600">
                            {errorMessage}
                        </p>
                    )}
                </form>

                {/* Sign Up Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link
                        href="/register"
                        className="text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60"
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    )
}