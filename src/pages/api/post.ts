import type { APIRoute } from 'astro';
import { createPost, updatePost } from '../../services/posts';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { id, title, content, tags, excerpt } = await request.json();

        if (!title || !content) {
            return new Response(JSON.stringify({ message: 'Title and content are required' }), { status: 400 });
        }

        if (id) {
            // Update existing post
            await updatePost(id, { title, content, tags, excerpt });
            // updatePost returns void, so assume success if no error was thrown
            return new Response(JSON.stringify({ message: 'Post updated' }), { status: 200 });
        } else {
            // Create new post
            const newPost = await createPost({ title, content, tags, excerpt });
            return new Response(JSON.stringify(newPost), { status: 201 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'An error occurred on the server.' }), { status: 500 });
    }
};
