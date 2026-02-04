import { NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { Book } from 'lucide-react'

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT DISTINCT type 
       FROM products 
       WHERE type IS NOT NULL
       ORDER BY type ASC`
        )

        const genres = result.rows.map((row: { type: String }) => row.type)
        return NextResponse.json({ genres })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch genres' },
            { status: 500 }
        )
    }
}