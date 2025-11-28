import type { APIRoute } from 'astro';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	const formData = await request.formData();
	const file = formData.get("image") as File;

	if (!file) {
		return new Response(JSON.stringify({ message: "No file uploaded" }), { status: 400 });
	}

	const runtime = locals.runtime;
	if (!runtime) {
		return new Response(JSON.stringify({ message: "Runtime environment not available" }), { status: 500 });
	}

	const env = runtime.env as {
		R2_BUCKET_NAME: string;
		R2_ACCOUNT_ID: string;
		R2_ACCESS_KEY_ID: string;
		R2_SECRET_ACCESS_KEY: string;
		PUBLIC_R2_URL: string;
	};

	const s3 = new S3Client({
		region: "auto",
		endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		},
	});

	const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;

	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: uniqueFileName,
				Body: await file.arrayBuffer(),
				ContentType: file.type,
			})
		);

		const imageUrl = `${env.PUBLIC_R2_URL}/${uniqueFileName}`;

		return new Response(JSON.stringify({ url: imageUrl }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});

	} catch (error) {
		console.error("Error uploading to R2:", error);
		return new Response(JSON.stringify({ message: "Failed to upload image" }), { status: 500 });
	}
};
