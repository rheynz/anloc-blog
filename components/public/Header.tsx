import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors uppercase ${
      isActive ? 'text-brand-accent' : 'text-white hover:text-brand-accent'
    }`;
    
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/artikel?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-brand-primary shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-gray-400 text-xs">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1">
              <span>{today}</span>
              <Link to="/register" className="hover:text-white">Pendaftaran Member</Link>
          </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
              <div className="flex-shrink-0">
                  <Link to="/" className="text-white">
                      <h1 className="text-4xl font-extrabold text-brand-accent tracking-wider">ANLOC.ID</h1>
                      <p className="text-xs font-light tracking-[.25em]">OFFICIAL WEBSITE</p>
                  </Link>
              </div>
              <div className="hidden md:block">
                  <img src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Header Banner" className="h-20" />
              </div>
          </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-brand-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-12">
                  <div className="flex items-center space-x-2">
                     <NavLink to="/" className={navLinkClass}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></NavLink>
                      <NavLink to="/p/tentang-kami" className={navLinkClass}>Tentang Kami</NavLink>
                      <NavLink to="/artikel" className={navLinkClass}>Artikel</NavLink>
                      <NavLink to="/artikel?category=2" className={navLinkClass}>Event</NavLink>
                      <NavLink to="/members" className={navLinkClass}>Member ANLOC Indonesia</NavLink>
                      <NavLink to="/merchants" className={navLinkClass}>Daftar Merchant</NavLink>
                  </div>
                   <div className="flex items-center">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <input 
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari..."
                                    className="bg-brand-primary text-white text-sm rounded-md pl-3 pr-8 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                                />
                                <button type="submit" className="absolute inset-y-0 right-0 px-2 text-gray-400 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
              </div>
          </div>
      </nav>
    </header>
  );
};

export default Header;