import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import mockApi from '../../services/api';
import { Merchant } from '../../types';
import Spinner from '../../components/shared/Spinner';

type FormInputs = Omit<Merchant, 'id'>;

const AdminMerchantFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchMerchant = async () => {
                setIsFetching(true);
                try {
                    const merchant = await mockApi.getAdminMerchantById(id);
                    if (merchant) {
                        setValue('name', merchant.name);
                        setValue('category', merchant.category);
                        setValue('logoUrl', merchant.logoUrl);
                        setValue('address', merchant.address);
                        setValue('discountInfo', merchant.discountInfo);
                    }
                } catch (error) {
                    console.error("Failed to fetch merchant", error);
                } finally {
                    setIsFetching(false);
                }
            };
            fetchMerchant();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            if (isEditMode && id) {
                await mockApi.updateMerchant(id, data);
            } else {
                await mockApi.createMerchant(data);
            }
            navigate('/admin/merchants');
        } catch (error) {
            console.error('Failed to save merchant:', error);
            alert('Gagal menyimpan merchant');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-red-500 text-xs mt-1";

    if (isFetching && isEditMode) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditMode ? 'Edit Merchant' : 'Tambah Merchant Baru'}
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className={labelClass}>Nama Merchant *</label>
                        <input id="name" {...register("name", { required: "Nama wajib diisi" })} className={inputClass} />
                        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="category" className={labelClass}>Kategori *</label>
                        <input id="category" {...register("category", { required: "Kategori wajib diisi" })} className={inputClass} placeholder="cth: Kuliner, Otomotif" />
                        {errors.category && <p className={errorClass}>{errors.category.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="logoUrl" className={labelClass}>URL Logo *</label>
                        <input id="logoUrl" {...register("logoUrl", { required: "URL Logo wajib diisi" })} className={inputClass} placeholder="https://..." />
                        {errors.logoUrl && <p className={errorClass}>{errors.logoUrl.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="address" className={labelClass}>Alamat *</label>
                        <input id="address" {...register("address", { required: "Alamat wajib diisi" })} className={inputClass} />
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="discountInfo" className={labelClass}>Info Diskon *</label>
                        <input id="discountInfo" {...register("discountInfo", { required: "Info diskon wajib diisi" })} className={inputClass} placeholder="cth: Diskon 15% untuk member" />
                        {errors.discountInfo && <p className={errorClass}>{errors.discountInfo.message}</p>}
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('/admin/merchants')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
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

export default AdminMerchantFormPage;
