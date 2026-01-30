import { NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { Book } from 'lucide-react'

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT DISTINCT genre 
       FROM products 
       WHERE genre IS NOT NULL
       ORDER BY genre ASC`
        )

        const genres = result.rows.map((row: { genre: String }) => row.genre)

        return NextResponse.json({ genres })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch genres' },
            { status: 500 }
        )
    }
}