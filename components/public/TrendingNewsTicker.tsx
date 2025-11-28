
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Article } from '../../types';

const TrendingNewsTicker: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await mockApi.getArticles({ limit: 5 });
                setArticles(data);
            } catch (error) {
                console.error("Failed to fetch trending articles:", error);
            }
        };
        fetchTrending();
    }, []);

    if (articles.length === 0) return null;

    return (
        <div className="bg-white border-b-2 border-t-2 border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10">
                <div className="bg-brand-primary text-white text-sm font-bold px-4 py-2 flex-shrink-0">
                    TRENDING NEWS
                </div>
                <div className="overflow-hidden flex-grow h-full">
                    <div className="animate-ticker flex items-center h-full whitespace-nowrap">
                        {articles.map(article => (
                            <Link key={article.id} to={`/artikel/${article.slug}`} className="text-gray-700 hover:text-brand-accent mx-4 text-sm">
                                {article.title}
                            </Link>
                        ))}
                         {articles.map(article => ( // Duplicate for seamless loop
                            <Link key={`${article.id}-clone`} to={`/artikel/${article.slug}`} className="text-gray-700 hover:text-brand-accent mx-4 text-sm">
                                {article.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <style>
                {`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 40s linear infinite;
                }
                `}
            </style>
        </div>
    );
};

export default TrendingNewsTicker;
