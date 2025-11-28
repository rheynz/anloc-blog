interface Env {
  IMAGES: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    // Validasi sederhana
    if (!file || typeof file === 'string') {
      return new Response("No file uploaded", { status: 400 });
    }

    // Generate nama file unik
    const filename = `mobil-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Upload ke R2
    // Pastikan di dashboard Cloudflare Pages > Settings > Functions, binding R2 bernama 'IMAGES'
    await env.IMAGES.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // Return URL
    // Ganti domain di bawah ini dengan domain project Anda nanti
    const url = `https://cdn.anloc.id/${filename}`; 

    return new Response(JSON.stringify({ url }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}