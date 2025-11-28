import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../../types';
import mockApi from '../../services/api';
import Spinner from '../../components/shared/Spinner';
import { formatDate } from '../../utils/helpers';
import Breadcrumb from '../../components/public/Breadcrumb';
import Seo from '../../components/shared/Seo';

// Simple Markdown-like renderer
const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div className="prose lg:prose-xl max-w-none text-gray-700">
            {content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
            ))}
        </div>
    );
};


const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await mockApi.getArticleBySlug(slug);
        if (data) {
          setArticle(data);
        } else {
          // Handle not found
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-20">Artikel tidak ditemukan.</div>;
  }

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Artikel', href: '/artikel' },
    { label: article.title, href: `/artikel/${article.slug}` },
  ];

  // Placeholder for SEO Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.featureImage,
    "author": {
      "@type": "Person",
      "name": article.author.name
    },
    "datePublished": article.createdAt,
    "description": article.excerpt || article.content.substring(0, 160)
  };

  return (
    <>
      <Seo
        title={article.title}
        description={articleSchema.description}
        keywords={article.keywords.join(', ')}
      />
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
            <Breadcrumb items={breadcrumbItems} />
          
            <header className="my-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
                <div className="flex items-center text-gray-500">
                    <img src={article.author.avatar} alt={article.author.name} className="w-10 h-10 rounded-full mr-3" />
                    <span>Oleh {article.author.name}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{formatDate(article.createdAt)}</span>
                </div>
            </header>

            <img src={article.featureImage} alt={article.title} className="w-full h-auto rounded-lg shadow-lg mb-8" />
            
            <article>
                <ContentRenderer content={article.content} />
            </article>

            {article.images.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-4">Galeri Gambar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {article.images.map((img, index) => (
                            <img key={index} src={img} alt={`${article.title} gallery image ${index+1}`} className="w-full h-auto rounded-lg" />
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;