import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ cookies, redirect }) => {
    cookies.delete('auth-secret', { path: '/' });
    return redirect('/login');
};
