
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-white mt-12">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ANLOC.ID. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/p/tentang-kami" className="hover:text-brand-accent">Tentang</Link>
            <Link to="/p/kontak" className="hover:text-brand-accent">Kontak</Link>
            <Link to="/admin" className="hover:text-brand-accent">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
