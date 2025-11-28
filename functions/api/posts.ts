interface Env {
  DB: D1Database;
}

// 1. Function untuk MENYIMPAN (POST) - Sudah ada sebelumnya
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // ... (Kode POST yang lama biarkan saja di sini) ...
  // Jika kode lama hilang saat copy-paste, pastikan dikembalikan seperti langkah sebelumnya
  try {
    const data = await request.json() as any;
    if (!data.title || !data.content) return new Response("Error", { status: 400 });
    
    const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    await env.DB.prepare(
      "INSERT INTO posts (slug, title, author, content, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(slug, data.title, data.author || 'Admin', data.content, Date.now()).run();

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// 2. Function BARU untuk MENGAMBIL DATA (GET)
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    // Ambil semua artikel, urutkan dari yang terbaru
    const { results } = await env.DB.prepare(
      "SELECT id, title, slug, author, created_at FROM posts ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}