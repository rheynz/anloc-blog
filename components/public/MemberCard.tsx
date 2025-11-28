import React from 'react';
import { Member } from '../../types';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
      <div className="mx-auto bg-gray-200 h-24 w-24 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900">{member.fullName}</h3>
      <p className="text-gray-500">"{member.nickname}"</p>
      {member.chapter && (
          <p className="text-sm font-semibold text-brand-accent mt-1">{member.chapter}</p>
      )}
      {(member.car || member.carYear || member.carColor) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700">{[member.car, member.carColor, member.carYear].filter(Boolean).join(' ')}</p>
        </div>
      )}
    </div>
  );
};

export default MemberCard;