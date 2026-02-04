import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserWishlist, getWishlistSettings } from '@/lib/wishlist'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const [items, settings] = await Promise.all([
            getUserWishlist(session.user.id),
            getWishlistSettings(session.user.id)
        ])

        return NextResponse.json({
            items,
            isPublic: settings.is_public
        })
    } catch (error) {
        console.error('Error in get wishlist API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}