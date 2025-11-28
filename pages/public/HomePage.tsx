
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/api';
import { Article } from '../../types';
import Spinner from '../../components/shared/Spinner';
import ArticleCard from '../../components/public/ArticleCard';
import TrendingNewsTicker from '../../components/public/TrendingNewsTicker';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-brand-accent uppercase">
        {children}
    </h2>
);

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [mainGrid, setMainGrid] = useState<Article[]>([]);
    const [popularNews, setPopularNews] = useState<Article[]>([]);
    const [eventArticles, setEventArticles] = useState<Article[]>([]);
    const [tipsArticles, setTipsArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mainData, popularData, eventData, tipsData] = await Promise.all([
                    mockApi.getArticles({ categoryId: '4', limit: 5 }), // Berita Nasional for main grid
                    mockApi.getArticles({ categoryId: '1', limit: 4 }), // Popular News
                    mockApi.getArticles({ categoryId: '2', limit: 4 }), // Event
                    mockApi.getArticles({ categoryId: '3', limit: 4 }), // Tips & Trik
                ]);
                setMainGrid(mainData.data);
                setPopularNews(popularData.data);
                setEventArticles(eventData.data);
                setTipsArticles(tipsData.data);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mainFeatured = mainGrid[0];
    const mainGridSmall = mainGrid.slice(1, 5);
    const popularFeatured = popularNews[0];
    const popularList = popularNews.slice(1, 4);
    const eventFeatured = eventArticles[0];
    const eventList = eventArticles.slice(1, 4);
    const tipsFeatured = tipsArticles[0];
    const tipsList = tipsArticles.slice(1, 4);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
    
    return (
        <div>
            <TrendingNewsTicker />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Main Grid Section */}
                {mainFeatured && (
                    <section className="grid lg:grid-cols-2 gap-4">
                        <Link to={`/artikel/${mainFeatured.slug}`} className="block group">
                            <div className="relative">
                                <img src={mainFeatured.featureImage} alt={mainFeatured.title} className="w-full h-96 object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-3xl font-extrabold text-white group-hover:text-brand-accent transition-colors">
                                        {mainFeatured.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                        <div className="grid grid-cols-2 grid-rows-2 gap-4">
                            {mainGridSmall.map(article => (
                                <Link to={`/artikel/${article.slug}`} key={article.id} className="block group relative">
                                    <img src={article.featureImage} alt={article.title} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <h4 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                                            {article.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Popular News Section */}
                {popularFeatured && (
                    <section className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <SectionTitle>Popular News</SectionTitle>
                             <Link to={`/artikel/${popularFeatured.slug}`} className="block group">
                                <img src={popularFeatured.featureImage} alt={popularFeatured.title} className="w-full h-80 object-cover" />
                                <div className="bg-white p-4">
                                    <span className="text-sm font-bold text-brand-accent">{popularFeatured.category.name}</span>
                                    <h3 className="text-2xl font-bold my-2 text-gray-800 group-hover:text-brand-accent transition-colors">{popularFeatured.title}</h3>
                                    <p className="text-gray-600 text-sm">{popularFeatured.excerpt}</p>
                                </div>
                             </Link>
                        </div>
                        <div className="space-y-4 pt-12">
                            {popularList.map(article => (
                                <Link to={`/artikel/${article.slug}`} key={article.id} className="flex items-center space-x-3 group">
                                    <img src={article.featureImage} alt={article.title} className="w-24 h-16 object-cover flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-800 group-hover:text-brand-accent transition-colors">{article.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Event & Tips Section */}
                <section className="grid lg:grid-cols-2 gap-8">
                    {eventFeatured && (
                        <div>
                            <SectionTitle>Event</SectionTitle>
                            <Link to={`/artikel/${eventFeatured.slug}`} className="block group mb-4">
                                <img src={eventFeatured.featureImage} alt={eventFeatured.title} className="w-full h-64 object-cover" />
                                <div className="bg-white p-4">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-accent transition-colors">{eventFeatured.title}</h3>
                                </div>
                            </Link>
                            <div className="space-y-4">
                                {eventList.map(article => (
                                     <Link to={`/artikel/${article.slug}`} key={article.id} className="flex items-center space-x-3 group p-2 bg-white">
                                        <img src={article.featureImage} alt={article.title} className="w-20 h-14 object-cover flex-shrink-0" />
                                        <div><h4 className="font-semibold text-sm text-gray-800 group-hover:text-brand-accent transition-colors">{article.title}</h4></div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {tipsFeatured && (
                        <div>
                             <SectionTitle>Tips & Trik</SectionTitle>
                             <Link to={`/artikel/${tipsFeatured.slug}`} className="block group mb-4">
                                <img src={tipsFeatured.featureImage} alt={tipsFeatured.title} className="w-full h-64 object-cover" />
                                <div className="bg-white p-4">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-accent transition-colors">{tipsFeatured.title}</h3>
                                </div>
                            </Link>
                            <div className="space-y-4">
                                {tipsList.map(article => (
                                    <Link to={`/artikel/${article.slug}`} key={article.id} className="flex items-center space-x-3 group p-2 bg-white">
                                        <img src={article.featureImage} alt={article.title} className="w-20 h-14 object-cover flex-shrink-0" />
                                        <div><h4 className="font-semibold text-sm text-gray-800 group-hover:text-brand-accent transition-colors">{article.title}</h4></div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePage;