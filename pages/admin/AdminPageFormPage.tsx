
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import mockApi from '../../services/api';
import Spinner from '../../components/shared/Spinner';

type FormInputs = { title: string; content: string; };

const AdminPageFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchPage = async () => {
                setIsFetching(true);
                try {
                    const page = await mockApi.getAdminPageById(id);
                    if (page) {
                        setValue('title', page.title);
                        setValue('content', page.content);
                    }
                } catch (error) {
                    console.error("Failed to fetch page", error);
                } finally {
                    setIsFetching(false);
                }
            };
            fetchPage();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            if (isEditMode && id) {
                await mockApi.updatePage(id, data);
            } else {
                await mockApi.createPage(data);
            }
            navigate('/admin/pages');
        } catch (error) {
            console.error('Failed to save page:', error);
            alert('Gagal menyimpan halaman');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    if (isFetching) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditMode ? 'Edit Halaman' : 'Tambah Halaman Baru'}
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className={labelClass}>Judul *</label>
                        <input id="title" {...register("title", { required: true })} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="content" className={labelClass}>Konten *</label>
                        <textarea id="content" {...register("content", { required: true })} rows={15} className={inputClass}></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('/admin/pages')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400">
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPageFormPage;
