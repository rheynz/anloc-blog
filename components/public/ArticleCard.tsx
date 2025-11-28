
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link to={`/artikel/${article.slug}`} className="block group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={article.featureImage} alt={article.title} />
        <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded">
          {article.category.name}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-accent transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          {formatDate(article.createdAt)} oleh {article.author.name}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
