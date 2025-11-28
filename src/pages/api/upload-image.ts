import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return new Response(JSON.stringify({ message: 'No image provided' }), { status: 400 });
        }
        
        // Create a unique filename
        const filename = `${Date.now()}-${image.name}`;
        const uploadDir = path.resolve(process.cwd(), 'public/uploads');
        const imagePath = path.join(uploadDir, filename);

        // Ensure the upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Write the file to the filesystem
        await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));

        const imageUrl = `/uploads/${filename}`;

        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
        
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'An error occurred during upload.' }), { status: 500 });
    }
};
