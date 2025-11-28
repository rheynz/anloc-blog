
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Article } from '../../types';
import Spinner from '../../components/shared/Spinner';
import { formatDate } from '../../utils/helpers';

const AdminArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAdminArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        await mockApi.deleteArticle(id);
        fetchArticles(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert('Gagal menghapus artikel.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Artikel</h1>
        <Link 
          to="/admin/articles/new"
          className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          + Tambah Artikel
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{article.title}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{article.category.name}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(article.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/admin/articles/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminArticleListPage;
