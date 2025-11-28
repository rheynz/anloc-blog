import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password === import.meta.env.ADMIN_PASSWORD) {
        cookies.set('auth-secret', import.meta.env.AUTH_SECRET, {
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return redirect('/admin');
    }

    return redirect('/login?error=1');
};
