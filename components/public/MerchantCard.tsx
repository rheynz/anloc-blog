import React from 'react';
import { Merchant } from '../../types';

interface MerchantCardProps {
  merchant: Merchant;
}

const MerchantCard: React.FC<MerchantCardProps> = ({ merchant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-40 bg-gray-200">
        <img className="w-full h-full object-contain p-4" src={merchant.logoUrl} alt={`${merchant.name} logo`} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full self-start">{merchant.category}</span>
        <h3 className="text-lg font-bold text-gray-900 mt-2">{merchant.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{merchant.address}</p>
        <div className="mt-4 pt-4 border-t border-gray-200 flex-grow flex items-end">
            <p className="text-sm font-bold text-brand-accent">{merchant.discountInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;