import { NextRequest, NextResponse } from 'next/server'
import { updateCartItemQuantity } from '@/lib/cart'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId, quantity } = body

        if (!productId || quantity === undefined) {
            return NextResponse.json(
                { error: 'Product ID and quantity are required' },
                { status: 400 }
            )
        }

        const result = await updateCartItemQuantity(session.user.id, productId, quantity)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Cart update error:', error)
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        )
    }
}