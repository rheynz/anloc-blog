
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Page } from '../../types';
import Spinner from '../../components/shared/Spinner';
import { formatDate } from '../../utils/helpers';

const AdminPageListPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAdminPages();
      setPages(data);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus halaman ini?')) {
      try {
        await mockApi.deletePage(id);
        fetchPages();
      } catch (error) {
        console.error("Failed to delete page:", error);
        alert('Gagal menghapus halaman.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Halaman</h1>
        <Link 
          to="/admin/pages/new"
          className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          + Tambah Halaman
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Update Terakhir</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{page.title}</p>
                  </td>
                   <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">/p/{page.slug}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(page.updatedAt)}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/admin/pages/edit/${page.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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

export default AdminPageListPage;
