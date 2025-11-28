import { defineMiddleware } from 'astro:middleware';

const protectedRoutes = ['/admin'];
const AUTH_SECRET = import.meta.env.AUTH_SECRET;

export const onRequest = defineMiddleware(async (context, next) => {
    // Fail early if the secret is not set in the environment
    if (!AUTH_SECRET) {
        console.error("AUTH_SECRET environment variable is not set. Authentication is disabled.");
        return next();
    }

    const { url, cookies, redirect } = context;

    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (isProtectedRoute) {
        const secret = cookies.get('auth-secret')?.value;
        if (secret !== AUTH_SECRET) {
            return redirect('/login');
        }
    }
    
    return next();
});
