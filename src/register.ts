'use server'

import { z } from 'zod'
import bcrypt from 'bcrypt'
import pool from '@/neonSetup'
import { redirect } from 'next/navigation'

const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function register(
    _prevState: string | undefined,
    formData: FormData
) {
    const parsed = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!parsed.success) {
        return parsed.error.message
    }

    const { name, email, password } = parsed.data

    // Check if user exists
    const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    )

    if (existing.rows.length > 0) {
        return 'User already exists'
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    await pool.query(
        `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    `,
        [name, email, hashedPassword]
    )

    // Redirect to login after successful register
    redirect('/login')
}
