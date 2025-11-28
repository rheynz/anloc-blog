
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
