import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;

            // Routes that require login
            const protectedRoutes = ['/wishlist', '/cart', '/user'];

            const isProtectedRoute = protectedRoutes.some(route =>
                pathname.startsWith(route)
            );

            // If the user is trying to access a protected route
            if (isProtectedRoute) {
                if (isLoggedIn) {
                    return true; // Allow access
                }
                return false; // Not logged in → redirect to /login
            }

            // If user is logged in and hits /login, optionally redirect to home
            if (isLoggedIn && pathname === '/login') {
                return Response.redirect(new URL('/', nextUrl));
            }

            // Otherwise allow
            return true;
        },


        jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },


    },

    providers: [], // add providers here
} satisfies NextAuthConfig;
