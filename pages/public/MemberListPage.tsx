
import React, { useState, useEffect } from 'react';
import mockApi from '../../services/api';
import { Member } from '../../types';
import Spinner from '../../components/shared/Spinner';
import MemberCard from '../../components/public/MemberCard';

const MemberListPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        // Re-using admin endpoint for mock data
        const data = await mockApi.getAdminMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Anggota ANLOC Indonesia</h1>
      <p className="text-lg text-gray-600 mb-10 text-center">Kenali sesama anggota dari seluruh chapter.</p>

      {loading ? (
        <Spinner />
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Belum ada anggota yang terdaftar.</p>
      )}
    </div>
  );
};

export default MemberListPage;
