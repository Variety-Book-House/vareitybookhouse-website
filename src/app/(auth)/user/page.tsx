import { ChevronRight, PowerIcon } from 'lucide-react'
import { signOut } from '@/auth'

export default function UserAccountPage() {
    return (
        <div className="min-h-screen bg-white text-black px-6 md:px-24 py-20">
            {/* Header */}
            <header className="mb-24">
                <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight">
                    My Account
                </h1>
            </header>

            {/* Content */}
            <div className="space-y-24 max-w-5xl">
                {/* Profile */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Profile</h2>

                    <div className="border-t border-black pt-8 space-y-6">
                        <div className="flex justify-between text-sm">
                            <span className="uppercase tracking-widest text-gray-500">Name</span>
                            <span className="font-light">Pratul Wadhwa</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="uppercase tracking-widest text-gray-500">Email</span>
                            <span className="font-light">user@email.com</span>
                        </div>

                        <button className="text-xs uppercase tracking-widest underline underline-offset-4">
                            Edit profile
                        </button>
                    </div>
                </section>

                {/* Orders */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Orders</h2>

                    <div className="border-t border-black divide-y">
                        {['#23901', '#23877'].map(order => (
                            <button
                                key={order}
                                className="flex w-full items-center justify-between py-6 text-sm font-light hover:opacity-60 transition"
                            >
                                <span>Order {order}</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Address */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Address Book</h2>

                    <div className="border-t border-black pt-8 space-y-6 text-sm font-light leading-relaxed">
                        <p>
                            21 Minimal Street <br />
                            New Delhi, IN 110001
                        </p>

                        <button className="text-xs uppercase tracking-widest underline underline-offset-4">
                            Manage addresses
                        </button>
                    </div>
                </section>

                {/* Settings */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Settings</h2>

                    <div className="border-t border-black divide-y text-sm">
                        {[
                            'Change password',
                            'Payment methods',
                        ].map(item => (
                            <button
                                key={item}
                                className="flex w-full items-center justify-between py-6 font-light hover:opacity-60 transition"
                            >
                                <span>{item}</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sign out */}
                <section className="pt-12 border-t border-black">
                    <form
                        action={async () => {
                            'use server'
                            await signOut({ redirectTo: '/' })
                        }}
                    >
                        <button className="flex items-center gap-3 text-xs uppercase tracking-widest hover:opacity-60 transition">
                            <PowerIcon className="h-4 w-4" />
                            Sign out
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
