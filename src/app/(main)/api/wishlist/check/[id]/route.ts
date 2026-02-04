import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isInWishlist } from '@/lib/wishlist'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ inWishlist: false })
        }

        const params = await context.params

        const inWishlist = await isInWishlist(session.user.id, params.id)

        return NextResponse.json({ inWishlist })
    } catch (error) {
        console.error('Error checking wishlist status:', error)
        return NextResponse.json({ inWishlist: false })
    }
}