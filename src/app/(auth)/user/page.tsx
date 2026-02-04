import { ChevronRight, PowerIcon, MapPin, CreditCard, Package } from 'lucide-react'
import { signOut, auth } from '@/auth'
import pool from '@/neonSetup'
import Link from 'next/link'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

async function getUserData(userId: string) {
    const [
        userResult,
        addressesResult,
        ordersResult,
        preferencesResult,
    ] = await Promise.all([
        pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        ),
        pool.query(
            `SELECT * FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
            [userId]
        ),
        pool.query(
            `SELECT id, order_number, status, total, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
            [userId]
        ),
        pool.query(
            `SELECT * FROM user_preferences WHERE user_id = $1`,
            [userId]
        ),
    ])

    return {
        user: userResult.rows[0],
        addresses: addressesResult.rows,
        orders: ordersResult.rows,
        preferences: preferencesResult.rows[0],
    }
}

export default async function UserAccountPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div>Please log in</div>
    }

    const { user, addresses, orders, preferences } =
        await getUserData(session.user.id)

    const defaultAddress =
        addresses.find((addr: any) => addr.is_default) || addresses[0]

    return (
        <div className="min-h-screen bg-white text-black px-6 md:px-24 py-20">
            {/* Header */}
            <header className="mb-24">
                <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight">
                    My Account
                </h1>
            </header>

            <div className="space-y-24 max-w-5xl">
                {/* Profile */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Profile</h2>

                    <div className="border-t border-black pt-8 space-y-6">
                        <div className="flex justify-between text-sm">
                            <span className="uppercase tracking-widest text-gray-500">Name</span>
                            <span className="font-light">{user.name}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="uppercase tracking-widest text-gray-500">Email</span>
                            <span className="font-light">{user.email}</span>
                        </div>

                        {user.phone && (
                            <div className="flex justify-between text-sm">
                                <span className="uppercase tracking-widest text-gray-500">Phone</span>
                                <span className="font-light">{user.phone}</span>
                            </div>
                        )}

                        <Link
                            href="/account/edit-profile"
                            className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60"
                        >
                            Edit profile
                        </Link>
                    </div>
                </section>

                {/* Reading Preferences */}
                {preferences && (
                    <section className="space-y-8">
                        <h2 className="font-serif text-2xl font-light">
                            Reading Preferences
                        </h2>

                        <div className="border-t border-black pt-8 space-y-6">
                            {preferences.favorite_genres?.length > 0 && (
                                <div>
                                    <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
                                        Favorite Genres
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {preferences.favorite_genres.map((genre: string) => (
                                            <span
                                                key={genre}
                                                className="px-3 py-1 bg-gray-100 text-xs"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="uppercase tracking-widest text-gray-500">
                                    Reading Level
                                </span>
                                <span className="font-light">
                                    {preferences.reading_level}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="uppercase tracking-widest text-gray-500">
                                    Preferred Format
                                </span>
                                <span className="font-light">
                                    {preferences.preferred_format}
                                </span>
                            </div>

                            <Link
                                href="/account/preferences"
                                className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60"
                            >
                                Update preferences
                            </Link>
                        </div>
                    </section>
                )}

                {/* Orders */}
                <section className="space-y-8">
                    <h2 className="font-serif text-2xl font-light">Recent Orders</h2>

                    <div className="border-t border-black divide-y">
                        {orders.length > 0 ? (
                            orders.map((order: { id: Key | null | undefined; order_number: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; created_at: string | number | Date; total: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.order_number}`}
                                    className="flex w-full items-center justify-between py-6 text-sm font-light hover:opacity-60"
                                >
                                    <div className="flex items-center gap-4">
                                        <Package className="h-4 w-4" />
                                        <div>
                                            <p>Order {order.order_number}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p>₹{order.total}</p>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">
                                            {order.status}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ))
                        ) : (
                            <p className="py-6 text-sm text-gray-500">No orders yet</p>
                        )}
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
                        <button className="flex items-center gap-3 text-xs uppercase tracking-widest hover:opacity-60">
                            <PowerIcon className="h-4 w-4" />
                            Sign out
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
