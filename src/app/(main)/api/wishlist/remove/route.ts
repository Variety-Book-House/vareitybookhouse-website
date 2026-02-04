import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { removeFromWishlist } from '@/lib/wishlist'

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId } = body

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const result = await removeFromWishlist(session.user.id, productId)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to remove from wishlist' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in remove from wishlist API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}