import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Member } from '../../types';
import Spinner from '../../components/shared/Spinner';

const AdminMemberListPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAdminMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      try {
        await mockApi.deleteMember(id);
        fetchMembers(); // Refresh
      } catch (error) {
        console.error("Failed to delete member:", error);
        alert('Gagal menghapus member.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Member</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chapter</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plat Nomor</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{member.fullName}</p>
                  </td>
                   <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{member.chapter || '-'}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{member.email}</p>
                  </td>
                   <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{member.licensePlate}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/admin/members/edit/${member.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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

export default AdminMemberListPage;