import React, { useState, useEffect } from 'react';
import mockApi from '../../services/api';
import { Merchant } from '../../types';
import Spinner from '../../components/shared/Spinner';
import MerchantCard from '../../components/public/MerchantCard';

const MerchantListPage: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getMerchants();
        setMerchants(data);
      } catch (error) {
        console.error("Failed to fetch merchants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Rekan Merchant ANLOC</h1>
      <p className="text-lg text-gray-600 mb-10 text-center">Nikmati berbagai keuntungan eksklusif dari rekanan kami.</p>

      {loading ? (
        <Spinner />
      ) : merchants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {merchants.map(merchant => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Belum ada merchant rekanan yang terdaftar.</p>
      )}
    </div>
  );
};

export default MerchantListPage;