
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import mockApi from '../../services/api';
import { Banner } from '../../types';
import Spinner from '../../components/shared/Spinner';

const AdminSettingsPage: React.FC = () => {
    const { register, handleSubmit, setValue } = useForm<Banner>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            setIsFetching(true);
            try {
                const bannerData = await mockApi.getBanner();
                setValue('imageUrl', bannerData.imageUrl);
                setValue('text', bannerData.text);
                setCurrentBanner(bannerData);
            } catch (error) {
                console.error("Failed to fetch banner", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchBanner();
    }, [setValue]);

    const onSubmit: SubmitHandler<Banner> = async (data) => {
        setIsLoading(true);
        try {
            const updatedBanner = await mockApi.updateBanner(data);
            setCurrentBanner(updatedBanner);
            alert('Banner berhasil diperbarui!');
        } catch (error) {
            console.error('Failed to save banner:', error);
            alert('Gagal menyimpan banner');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pengaturan Halaman Beranda</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Edit Banner</h2>
                    {isFetching ? <Spinner /> : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="imageUrl" className={labelClass}>URL Gambar Banner *</label>
                                <input id="imageUrl" {...register("imageUrl", { required: true })} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="text" className={labelClass}>Teks Banner *</label>
                                <input id="text" {...register("text", { required: true })} className={inputClass} />
                            </div>
                            <div className="text-right">
                                <button type="submit" disabled={isLoading} className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400">
                                    {isLoading ? 'Menyimpan...' : 'Simpan Banner'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Pratinjau Banner</h2>
                    {isFetching ? <Spinner /> : currentBanner && (
                        <div 
                            className="relative bg-cover bg-center h-64 text-white flex items-center justify-center rounded-md" 
                            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}>
                            <div className="absolute inset-0 bg-black opacity-50 rounded-md"></div>
                            <div className="relative z-10 text-center p-4">
                                <h3 className="text-2xl font-bold">{currentBanner.text}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
