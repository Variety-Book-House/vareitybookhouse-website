import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { addToWishlist } from '@/lib/wishlist'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId, productDetails } = body

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const result = await addToWishlist(
            session.user.id,
            productId,
            productDetails
        )

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to add to wishlist' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in add to wishlist API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}