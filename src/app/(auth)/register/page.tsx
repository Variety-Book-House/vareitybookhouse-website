'use client'

import { useActionState, useState } from 'react'
import { register } from '@/lib/register'
import Link from 'next/link'

const GENRES = [
    'Fiction',
    'Non-Fiction',
    'Mystery & Thriller',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Poetry',
    'Horror',
    'Young Adult',
    'Children',
]

const READING_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const BOOK_FORMATS = ['Paperback', 'Hardcover', 'eBook', 'Audiobook']

export default function RegisterForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined
    )

    const [step, setStep] = useState(1) // 1: Basic Info, 2: Preferences
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [selectedFormat, setSelectedFormat] = useState('Paperback')
    const [readingLevel, setReadingLevel] = useState('Intermediate')

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        )
    }

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault()
        setStep(2)
    }

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault()
        setStep(1)
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

            <div className="w-full max-w-md">
                <h1 className="text-3xl font-serif font-light tracking-wide text-black mb-2">
                    Create Account
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                    Step {step} of 2
                </p>

                <form action={formAction} className="space-y-6">
                    {/* STEP 1: Basic Information */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="name"
                                    className="block text-[11px] uppercase tracking-widest"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none"
                                />
                            </div>

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

                            {/* Phone (Optional) */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="phone"
                                    className="block text-[11px] uppercase tracking-widest"
                                >
                                    Phone (Optional)
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
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
                                    minLength={6}
                                    required
                                    className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimum 6 characters
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-[11px] uppercase tracking-widest"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    minLength={6}
                                    required
                                    className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full border border-black py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white"
                            >
                                Next: Preferences
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Preferences */}
                    {step === 2 && (
                        <div className="space-y-8">
                            {/* Favorite Genres */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest mb-4">
                                    Favorite Genres (Select up to 5)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {GENRES.map(genre => (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => toggleGenre(genre)}
                                            disabled={
                                                !selectedGenres.includes(genre) &&
                                                selectedGenres.length >= 5
                                            }
                                            className={`
                                                py-2 px-3 text-xs border transition
                                                ${selectedGenres.includes(genre)
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                                }
                                                disabled:opacity-30 disabled:cursor-not-allowed
                                            `}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="hidden"
                                    name="favoriteGenres"
                                    value={JSON.stringify(selectedGenres)}
                                />
                            </div>

                            {/* Reading Level */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest mb-4">
                                    Reading Level
                                </label>
                                <div className="flex gap-2">
                                    {READING_LEVELS.map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setReadingLevel(level)}
                                            className={`
                                                flex-1 py-2 px-3 text-xs border transition
                                                ${readingLevel === level
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                                }
                                            `}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="hidden"
                                    name="readingLevel"
                                    value={readingLevel}
                                />
                            </div>

                            {/* Preferred Format */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest mb-4">
                                    Preferred Format
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {BOOK_FORMATS.map(format => (
                                        <button
                                            key={format}
                                            type="button"
                                            onClick={() => setSelectedFormat(format)}
                                            className={`
                                                py-2 px-3 text-xs border transition
                                                ${selectedFormat === format
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                                }
                                            `}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="hidden"
                                    name="preferredFormat"
                                    value={selectedFormat}
                                />
                            </div>

                            {/* Email Notifications */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="emailNotifications"
                                        defaultChecked
                                        className="w-4 h-4"
                                    />
                                    <span className="text-xs uppercase tracking-widest">
                                        Send me email notifications
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="promotionalEmails"
                                        defaultChecked
                                        className="w-4 h-4"
                                    />
                                    <span className="text-xs uppercase tracking-widest">
                                        Send me promotional offers
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="newArrivalsAlert"
                                        defaultChecked
                                        className="w-4 h-4"
                                    />
                                    <span className="text-xs uppercase tracking-widest">
                                        Notify me about new arrivals
                                    </span>
                                </label>
                            </div>

                            {errorMessage && (
                                <p className="text-xs tracking-wide text-red-600">
                                    {errorMessage}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 border border-gray-300 py-3 text-xs uppercase tracking-widest transition hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    aria-disabled={isPending}
                                    className="flex-1 border border-black py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white disabled:opacity-50"
                                >
                                    {isPending ? 'Creating account…' : 'Create Account'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Sign In Link */}
                <div className="text-center text-sm mt-8">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                        href="/login"
                        className="text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}