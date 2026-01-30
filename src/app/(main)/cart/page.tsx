import { auth } from '@/auth'
import CartClient from './Cart'
import { getUserCartItems } from '@/lib/cart'
import { redirect } from 'next/navigation'

export default async function CartPage() {
    const session = await auth()

    if (!session || !session.user?.id) {
        redirect('/login') // Redirect to login if not authenticated
    }

    const cartItems = await getUserCartItems(session.user.id)

    return <CartClient initialCartItems={cartItems} userId={session.user.id} />
}