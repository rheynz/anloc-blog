import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import mockApi from '../../services/api';
import { Article, Category } from '../../types';
import Spinner from '../../components/shared/Spinner';
import ArticleCard from '../../components/public/ArticleCard';
import Pagination from '../../components/public/Pagination';

const ARTICLES_PER_PAGE = 8;

const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articleData, cats] = await Promise.all([
          mockApi.getArticles({ 
            page: currentPage, 
            limit: ARTICLES_PER_PAGE, 
            categoryId: currentCategory,
            searchQuery: searchQuery 
          }),
          mockApi.getCategories()
        ]);

        setArticles(articleData.data);
        setTotalPages(Math.ceil(articleData.total / ARTICLES_PER_PAGE));
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentCategory, searchQuery]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo(0, 0);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const pageTitle = searchQuery 
    ? `Hasil Pencarian untuk: "${searchQuery}"`
    : "Semua Artikel";

  const pageDescription = searchQuery
    ? `Menampilkan artikel yang cocok dengan pencarian Anda.`
    : "Temukan berita terbaru, tips, dan cerita dari komunitas kami.";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">{pageTitle}</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">{pageDescription}</p>
      
      {/* Category Filters */}
      {!searchQuery && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              currentCategory === '' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                currentCategory === cat.id ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-gray-500">Tidak ada artikel yang ditemukan.</p>
      )}
    </div>
  );
};

export default ArticleListPage;