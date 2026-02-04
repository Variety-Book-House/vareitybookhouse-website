import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateWishlistVisibility } from '@/lib/wishlist'

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { isPublic } = body

        if (typeof isPublic !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid visibility value' },
                { status: 400 }
            )
        }

        const result = await updateWishlistVisibility(session.user.id, isPublic)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to update visibility' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, isPublic })
    } catch (error) {
        console.error('Error in update visibility API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}