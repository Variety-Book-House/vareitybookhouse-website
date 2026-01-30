import { NextRequest, NextResponse } from 'next/server'
import { addToCart } from '@/lib/cart'
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
        const { productId, quantity = 1 } = body

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const result = await addToCart(session.user.id, productId, quantity)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Cart add error:', error)
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        )
    }
}