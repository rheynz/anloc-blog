import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import mockApi from '../../services/api';
import { Member, ShirtSize } from '../../types';
import Spinner from '../../components/shared/Spinner';

type FormInputs = Omit<Member, 'id' | 'registeredAt'>;

const AdminMemberFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchMember = async () => {
                setIsFetching(true);
                try {
                    const member = await mockApi.getAdminMemberById(id);
                    if (member) {
                        reset(member);
                    }
                } catch (error) {
                    console.error("Failed to fetch member", error);
                } finally {
                    setIsFetching(false);
                }
            };
            fetchMember();
        }
    }, [id, reset]);
    
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!id) return;
        setIsLoading(true);
        try {
            await mockApi.updateMember(id, data);
            navigate('/admin/members');
        } catch (error) {
            console.error('Failed to save member:', error);
            alert('Gagal menyimpan data member');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent bg-gray-50";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-red-500 text-xs mt-1";

    if (isFetching) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Data Member</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className={labelClass}>Email Address *</label>
                        <input id="email" type="email" {...register("email", { required: "Email wajib diisi" })} className={inputClass} />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className={labelClass}>Nama Lengkap *</label>
                            <input id="fullName" {...register("fullName", { required: "Nama lengkap wajib diisi" })} className={inputClass} />
                            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                        </div>
                         <div>
                            <label htmlFor="nickname" className={labelClass}>Nama Panggilan *</label>
                            <input id="nickname" {...register("nickname", { required: "Nama panggilan wajib diisi" })} className={inputClass} />
                            {errors.nickname && <p className={errorClass}>{errors.nickname.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="chapter" className={labelClass}>Chapter</label>
                        <input id="chapter" {...register("chapter")} className={inputClass} placeholder="cth: Banten Jawara" />
                    </div>
                     <div>
                        <label htmlFor="address" className={labelClass}>Alamat *</label>
                        <textarea id="address" {...register("address", { required: "Alamat wajib diisi" })} className={inputClass}></textarea>
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                    </div>
                    {/* ... other fields from registration form ... */}
                    <div>
                        <label htmlFor="phone" className={labelClass}>No Telp *</label>
                        <input id="phone" type="tel" {...register("phone", { required: "No. telp wajib diisi" })} className={inputClass} />
                        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="licensePlate" className={labelClass}>Plat Nomor Mobil *</label>
                        <input id="licensePlate" {...register("licensePlate", { required: "Plat nomor wajib diisi" })} className={inputClass} />
                        {errors.licensePlate && <p className={errorClass}>{errors.licensePlate.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="shirtSize" className={labelClass}>Ukuran Kemeja *</label>
                        <select id="shirtSize" {...register("shirtSize", { required: "Ukuran kemeja wajib dipilih" })} className={inputClass}>
                            {Object.values(ShirtSize).map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        {errors.shirtSize && <p className={errorClass}>{errors.shirtSize.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/admin/members')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400">
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMemberFormPage;