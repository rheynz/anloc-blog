
import React, { useState, useEffect } from 'react';
import mockApi from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/shared/Spinner';

interface Stats {
    articles: number;
    members: number;
    pages: number;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string, value: number, icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-brand-accent text-white p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await mockApi.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const ArticleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const MemberIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.197m-3-1.197A4 4 0 1112 4.354" /></svg>;
    const PageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-8">Selamat datang kembali, {user?.name}!</p>
            {loading ? <Spinner /> : stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Artikel" value={stats.articles} icon={<ArticleIcon />} />
                    <StatCard title="Total Member" value={stats.members} icon={<MemberIcon />} />
                    <StatCard title="Total Halaman" value={stats.pages} icon={<PageIcon />} />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;