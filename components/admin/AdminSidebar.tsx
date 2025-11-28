import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-accent text-white' : 'text-gray-300 hover:bg-brand-secondary hover:text-white'
    }`;
    
    return (
        <div className="w-64 bg-brand-primary text-white flex flex-col">
            <div className="px-4 h-16 flex items-center border-b border-gray-700">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/admin/articles" className={navLinkClass}>Artikel</NavLink>
                <NavLink to="/admin/pages" className={navLinkClass}>Halaman</NavLink>
                <NavLink to="/admin/members" className={navLinkClass}>Member</NavLink>
                {/* FIX: Add NavLink for Merchant management */}
                <NavLink to="/admin/merchants" className={navLinkClass}>Merchant</NavLink>
                <NavLink to="/admin/settings" className={navLinkClass}>Pengaturan Home</NavLink>
            </nav>
            <div className="px-2 py-4">
                <button 
                  onClick={logout}
                  className="w-full text-left flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium text-gray-300 hover:bg-brand-secondary hover:text-white"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
