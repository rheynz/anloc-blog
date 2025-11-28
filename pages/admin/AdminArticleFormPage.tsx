
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import mockApi from '../../services/api';
import { Article, Category } from '../../types';
import Spinner from '../../components/shared/Spinner';

// Define a specific type for the form data, where keywords is a string.
type ArticleFormInputs = Omit<Article, 'id' | 'slug' | 'createdAt' | 'author' | 'category' | 'keywords'> & { 
  categoryId: string;
  keywords: string; // Treat keywords as a single string in the form
};

const AdminArticleFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ArticleFormInputs>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            try {
                const cats = await mockApi.getCategories();
                setCategories(cats);

                if (isEditMode && id) {
                    const article = await mockApi.getAdminArticleById(id);
                    if (article) {
                        setValue('title', article.title);
                        setValue('content', article.content);
                        setValue('excerpt', article.excerpt);
                        setValue('featureImage', article.featureImage);
                        setValue('images', article.images);
                        // Convert array to comma-separated string for the input field
                        setValue('keywords', Array.isArray(article.keywords) ? article.keywords.join(', ') : '');
                        setValue('categoryId', article.category.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [id, isEditMode, setValue]);

    const onSubmit: SubmitHandler<ArticleFormInputs> = async (data) => {
        setIsLoading(true);
        const selectedCategory = categories.find(c => c.id === data.categoryId);
        if (!selectedCategory) {
            alert('Kategori tidak valid');
            setIsLoading(false);
            return;
        }

        // Convert the keywords string back to an array before sending to the API
        const keywordsArray = data.keywords.split(',').map(k => k.trim()).filter(Boolean);

        const articleData = { 
            ...data, 
            keywords: keywordsArray,
            category: selectedCategory 
        };

        try {
            if (isEditMode && id) {
                await mockApi.updateArticle(id, articleData);
            } else {
                await mockApi.createArticle(articleData);
            }
            navigate('/admin/articles');
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Gagal menyimpan artikel');
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
                {isEditMode ? 'Edit Artikel' : 'Tambah Artikel Baru'}
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className={labelClass}>Judul *</label>
                        <input id="title" {...register("title", { required: true })} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="featureImage" className={labelClass}>URL Gambar Utama *</label>
                        <input id="featureImage" {...register("featureImage", { required: true })} className={inputClass} placeholder="https://picsum.photos/800/400" />
                    </div>
                     <div>
                        <label htmlFor="categoryId" className={labelClass}>Kategori *</label>
                        <select id="categoryId" {...register("categoryId", { required: true })} className={inputClass}>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="excerpt" className={labelClass}>Ringkasan (Excerpt) *</label>
                        <textarea id="excerpt" {...register("excerpt", { required: true })} rows={3} className={inputClass}></textarea>
                    </div>
                    <div>
                        <label htmlFor="content" className={labelClass}>Konten (Markdown) *</label>
                        <textarea id="content" {...register("content", { required: true })} rows={10} className={inputClass}></textarea>
                    </div>
                    <div>
                        <label htmlFor="keywords" className={labelClass}>Keywords (pisahkan dengan koma)</label>
                        {/* Removed the problematic setValueAs transformer */}
                        <input id="keywords" {...register("keywords")} className={inputClass} />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('/admin/articles')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
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

export default AdminArticleFormPage;
