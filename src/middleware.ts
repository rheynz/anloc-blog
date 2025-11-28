import { defineMiddleware } from 'astro:middleware';

const protectedRoutes = ['/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;

    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (isProtectedRoute) {
        const secret = cookies.get('auth-secret')?.value;
        if (secret !== import.meta.env.AUTH_SECRET) {
            return redirect('/login');
        }
    }
    
    return next();
});
