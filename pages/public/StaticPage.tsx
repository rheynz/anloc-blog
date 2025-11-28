import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../types';
import mockApi from '../../services/api';
import Spinner from '../../components/shared/Spinner';
import Seo from '../../components/shared/Seo';

const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await mockApi.getPageBySlug(slug);
        if (data) {
          setPage(data);
        }
      } catch (error) {
        console.error("Failed to fetch page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!page) {
    return <div className="text-center py-20">Halaman tidak ditemukan.</div>;
  }

  return (
    <>
      <Seo
        title={page.title}
        description={page.content.substring(0, 160).replace(/\n/g, ' ')}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{page.title}</h1>
          <div className="prose max-w-none text-gray-700">
              {page.content}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticPage;