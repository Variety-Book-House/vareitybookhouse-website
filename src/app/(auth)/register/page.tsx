'use client'

import { useActionState } from 'react'
import { register } from '@/register'

export default function RegisterForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined
    )

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl">
                    Create an account
                </h1>

                <div className="w-full">
                    {/* NAME */}
                    <div>
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            Name
                        </label>
                        <input
                            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                            name="name"
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                            name="email"
                            type="email"
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                        />
                    </div>
                </div>

                <button
                    className="mt-6 w-full rounded-md bg-black py-2 text-sm text-white"
                    aria-disabled={isPending}
                >
                    Create account
                </button>

                {errorMessage && (
                    <p className="mt-3 text-sm text-red-500">
                        {errorMessage}
                    </p>
                )}
            </div>
        </form>
    )
}
