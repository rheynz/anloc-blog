import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  slug: string;
  author: string;
  created_at: number;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Panggil API GET yang baru kita buat
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        // Cek jika data berupa array (hasil query D1 biasanya di dalam properti results atau langsung array)
        if (Array.isArray(data)) {
          setArticles(data);
        } else if (data.results) {
           // Kadang D1 return object { results: [...] }
          setArticles(data.results);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 border-b pb-4">Berita Komunitas</h1>

        {loading ? (
          <p className="text-gray-500">Memuat artikel...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-500">Belum ada artikel. Coba tulis di Admin!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post) => (
              <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="p-6">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {new Date(post.created_at).toLocaleDateString()} • {post.author}
                  </span>
                  <h2 className="text-xl font-bold mt-2 mb-4 leading-tight">
                    {post.title}
                  </h2>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="inline-block bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}