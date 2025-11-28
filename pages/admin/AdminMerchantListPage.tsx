import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Merchant } from '../../types';
import Spinner from '../../components/shared/Spinner';

const AdminMerchantListPage: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAdminMerchants();
      setMerchants(data);
    } catch (error) {
      console.error("Failed to fetch merchants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus merchant ini?')) {
      try {
        await mockApi.deleteMerchant(id);
        fetchMerchants(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete merchant:", error);
        alert('Gagal menghapus merchant.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Merchant</h1>
        <Link 
          to="/admin/merchants/new"
          className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          + Tambah Merchant
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alamat</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map(merchant => (
                <tr key={merchant.id}>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{merchant.name}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{merchant.category}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{merchant.address}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/admin/merchants/edit/${merchant.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(merchant.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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

export default AdminMerchantListPage;
