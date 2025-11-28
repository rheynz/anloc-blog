import type { APIRoute } from 'astro';
import { deletePost } from '../../../services/posts';

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ message: 'Post ID is required' }), { status: 400 });
    }

    const wasDeleted = await deletePost(id);

    if (wasDeleted) {
        return new Response(null, { status: 204 }); // No Content
    } else {
        return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }
};
