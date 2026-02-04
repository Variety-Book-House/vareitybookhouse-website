import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import pool from '@/neonSetup'
import { z } from 'zod'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                const result = await pool.query(
                    `SELECT * FROM users WHERE email = $1`,
                    [email]
                )

                const user = result.rows[0]
                if (!user) return null

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!passwordMatch) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (
                account?.provider === 'google' ||
                account?.provider === 'facebook'
            ) {
                const existingUser = await pool.query(
                    `SELECT * FROM users WHERE email = $1`,
                    [user.email]
                )

                if (existingUser.rows.length === 0) {
                    // Create new user
                    const newUser = await pool.query(
                        `INSERT INTO users (email, name, email_verified)
             VALUES ($1, $2, TRUE)
             RETURNING id`,
                        [user.email, user.name]
                    )

                    const userId = newUser.rows[0].id

                    await pool.query(
                        `INSERT INTO social_accounts (user_id, provider, provider_account_id)
             VALUES ($1, $2, $3)`,
                        [userId, account.provider, account.providerAccountId]
                    )

                    await pool.query(
                        `INSERT INTO user_preferences (user_id)
             VALUES ($1)`,
                        [userId]
                    )
                } else {
                    const userId = existingUser.rows[0].id

                    await pool.query(
                        `INSERT INTO social_accounts (user_id, provider, provider_account_id)
             VALUES ($1, $2, $3)
             ON CONFLICT (provider, provider_account_id) DO NOTHING`,
                        [userId, account.provider, account.providerAccountId]
                    )
                }
            }

            return true
        },

        async session({ session, token }) {
            if (token.sub) {
                const result = await pool.query(
                    `SELECT id FROM users WHERE id = $1`,
                    [token.sub]
                )

                if (result.rows[0]) {
                    session.user.id = result.rows[0].id
                }
            }

            return session
        },
    },

    pages: {
        signIn: '/login',
    },
})
