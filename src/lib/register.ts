// lib/register.ts
'use server'

import { z } from 'zod'
import bcrypt from 'bcrypt'
import pool from '@/neonSetup'
import { redirect } from 'next/navigation'

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    favoriteGenres: z.string(),
    readingLevel: z.string(),
    preferredFormat: z.string(),
    emailNotifications: z.string().optional(),
    promotionalEmails: z.string().optional(),
    newArrivalsAlert: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export async function register(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        /* ---------- VALIDATION ---------- */
        const validatedFields = registerSchema.safeParse({
            name: formData.get('name') ?? '',
            email: formData.get('email') ?? '',
            phone: formData.get('phone') ?? '',
            password: formData.get('password') ?? '',
            confirmPassword: formData.get('confirmPassword') ?? '',
            favoriteGenres: formData.get('favoriteGenres') ?? '[]',
            readingLevel: formData.get('readingLevel') ?? '',
            preferredFormat: formData.get('preferredFormat') ?? '',
            emailNotifications: formData.get('emailNotifications') ?? undefined,
            promotionalEmails: formData.get('promotionalEmails') ?? undefined,
            newArrivalsAlert: formData.get('newArrivalsAlert') ?? undefined,
        })


        if (!validatedFields.success) {
            return validatedFields.error.message
        }

        const {
            name,
            email,
            phone,
            password,
            favoriteGenres,
            readingLevel,
            preferredFormat,
            emailNotifications,
            promotionalEmails,
            newArrivalsAlert,
        } = validatedFields.data

        /* ---------- CHECK EXISTING USER ---------- */
        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        )

        if (existingUser.rowCount && existingUser.rowCount > 0) {
            return 'An account with this email already exists'
        }

        /* ---------- HASH PASSWORD ---------- */
        const hashedPassword = await bcrypt.hash(password, 10)

        /* ---------- PARSE GENRES ---------- */
        const genresArray = JSON.parse(favoriteGenres)

        /* ---------- TRANSACTION ---------- */
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            /* ---------- INSERT USER ---------- */
            const userResult = await client.query(
                `
        INSERT INTO users (name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
                [name, email, phone || null, hashedPassword]
            )

            const userId = userResult.rows[0].id

            /* ---------- INSERT USER PREFERENCES ---------- */
            await client.query(
                `
        INSERT INTO user_preferences (
          user_id,
          favorite_genres,
          reading_level,
          preferred_format,
          email_notifications,
          promotional_emails,
          new_arrivals_alert
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
                [
                    userId,
                    genresArray,
                    readingLevel,
                    preferredFormat,
                    emailNotifications === 'on',
                    promotionalEmails === 'on',
                    newArrivalsAlert === 'on',
                ]
            )

            await client.query('COMMIT')
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }

    } catch (error) {
        console.error('Registration error:', error)
        return 'An error occurred during registration. Please try again.'
    }

    redirect('/login?registered=true')
}
