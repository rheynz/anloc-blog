
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import mockApi from '../../services/api';
import { Member, ShirtSize } from '../../types';

type FormInputs = Omit<Member, 'id' | 'registeredAt'>;

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await mockApi.registerMember(data);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-green-600">Pendaftaran Berhasil!</h1>
        <p className="mt-4 text-lg">Terima kasih telah bergabung. Kami akan segera menghubungi Anda untuk informasi lebih lanjut.</p>
      </div>
    );
  }
  
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Pendaftaran Member</h1>
        <p className="text-gray-600 mb-6">Isi data di bawah ini untuk menjadi bagian dari komunitas kami.</p>
        
        {submitError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{submitError}</div>}
        
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="birthPlace" className={labelClass}>Tempat Lahir</label>
                    <input id="birthPlace" {...register("birthPlace")} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="birthDate" className={labelClass}>Tanggal Lahir</label>
                    <input id="birthDate" type="date" {...register("birthDate")} className={inputClass} />
                </div>
            </div>
            
            <div>
                <label htmlFor="address" className={labelClass}>Alamat *</label>
                <textarea id="address" {...register("address", { required: "Alamat wajib diisi" })} className={inputClass}></textarea>
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>

            <div>
                <label htmlFor="phone" className={labelClass}>No Telp *</label>
                <input id="phone" type="tel" {...register("phone", { required: "No. telp wajib diisi" })} className={inputClass} />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="car" className={labelClass}>Jenis Mobil</label>
                    <input id="car" {...register("car")} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="carYear" className={labelClass}>Tahun</label>
                    <input id="carYear" type="number" {...register("carYear")} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="carColor" className={labelClass}>Warna</label>
                    <input id="carColor" {...register("carColor")} className={inputClass} />
                </div>
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

            <div>
                <label htmlFor="joinReason" className={labelClass}>Alasan Bergabung *</label>
                <textarea id="joinReason" {...register("joinReason", { required: "Alasan bergabung wajib diisi" })} className={inputClass}></textarea>
                {errors.joinReason && <p className={errorClass}>{errors.joinReason.message}</p>}
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400">
                {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
