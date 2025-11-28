import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './pages/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ArticleListPage from './pages/public/ArticleListPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';
import StaticPage from './pages/public/StaticPage';
import RegisterPage from './pages/public/RegisterPage';
import MemberListPage from './pages/public/MemberListPage';
import MerchantListPage from './pages/public/MerchantListPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminArticleListPage from './pages/admin/AdminArticleListPage';
import AdminArticleFormPage from './pages/admin/AdminArticleFormPage';
import AdminPageListPage from './pages/admin/AdminPageListPage';
import AdminPageFormPage from './pages/admin/AdminPageFormPage';
import AdminMemberListPage from './pages/admin/AdminMemberListPage';
import AdminMemberFormPage from './pages/admin/AdminMemberFormPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminMerchantListPage from './pages/admin/AdminMerchantListPage';
import AdminMerchantFormPage from './pages/admin/AdminMerchantFormPage';
import CreatePost from './pages/admin/CreatePost'; // Import halaman baru

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="artikel" element={<ArticleListPage />} />
            <Route path="artikel/:slug" element={<ArticleDetailPage />} />
            <Route path="p/:slug" element={<StaticPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="merchants" element={<MerchantListPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="/admin/dashboard" replace />} />
             <Route path="dashboard" element={<DashboardPage />} />
             <Route path="articles" element={<AdminArticleListPage />} />
             <Route path="articles/new" element={<AdminArticleFormPage />} />
             <Route path="articles/edit/:id" element={<AdminArticleFormPage />} />
             <Route path="pages" element={<AdminPageListPage />} />
             <Route path="pages/new" element={<AdminPageFormPage />} />
             <Route path="pages/edit/:id" element={<AdminPageFormPage />} />
             <Route path="members" element={<AdminMemberListPage />} />
             <Route path="members/edit/:id" element={<AdminMemberFormPage />} />
             <Route path="merchants" element={<AdminMerchantListPage />} />
             <Route path="merchants/new" element={<AdminMerchantFormPage />} />
             <Route path="merchants/edit/:id" element={<AdminMerchantFormPage />} />
             <Route path="settings" element={<AdminSettingsPage />} />
	     <Route path="/admin/tulis" element={<CreatePost />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
