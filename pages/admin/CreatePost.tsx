import React, { useState } from 'react';
// Perhatikan path ini: Mundur 2 langkah (../../) untuk keluar dari pages/admin
// Sesuaikan jika PostEditor Anda letakkan di dalam components/admin
import PostEditor from '../../components/PostEditor'; 

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { title, slug, author, content };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan');
      }

      alert('✅ Artikel Berhasil Diterbitkan!');
      // Reset Form
      setTitle('');
      setSlug('');
      setContent('');
    } catch (error: any) {
      console.error(error);
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tulis Artikel Baru</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul */}
          <div>
            <label className="block text-sm font-semibold mb-1">Judul</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Slug & Author (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Slug URL (Opsional)</label>
              <input 
                type="text" 
                placeholder="auto-generate-jika-kosong"
                className="w-full border p-2 rounded"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Penulis</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          {/* Editor Text + Gambar */}
          <div>
            <label className="block text-sm font-semibold mb-1">Konten</label>
            {/* Ini komponen yang kita buat sebelumnya */}
            <PostEditor value={content} onChange={setContent} />
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 mt-4 text-white font-bold rounded transition ${
              loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? 'Menyimpan ke Cloudflare...' : 'Publish Artikel'}
          </button>
        </form>
      </div>
    </div>
  );
}