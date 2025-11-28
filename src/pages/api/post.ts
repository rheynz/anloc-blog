import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { title, content } = await request.json();

        if (!title || !content) {
            return new Response(JSON.stringify({ message: 'Title and content are required' }), { status: 400 });
        }

        return new Response(
            JSON.stringify({
                message:
                    'Create/update posts not supported in this environment. Use git-based workflow or external write API (R2/S3).',
            }),
            { status: 501 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'An error occurred on the server.' }), { status: 500 });
    }
};
