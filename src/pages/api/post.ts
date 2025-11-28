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
            const updatedPost = await updatePost(id, { title, content, tags, excerpt });
            if (updatedPost) {
                return new Response(JSON.stringify(updatedPost), { status: 200 });
            } else {
                return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
            }
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
