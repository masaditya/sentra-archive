import SettingsLayout from '@/layouts/settings/layout';
import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { edit } from '@/routes/profile';
import { Info } from 'lucide-react';

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <SettingsLayout>
            <div className="max-w-2xl">
                <Head title="Profil Saya" />

                <div className="mb-10">
                    <h2 className="text-xl font-black text-[#223771] tracking-tight flex items-center gap-2">
                        INFORMASI PERSONAL
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Update nama lengkap dan alamat email instansi Anda</p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3" htmlFor="name">Nama Lengkap</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={auth.user.name}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    <InputError className="mt-2 text-[10px] font-black italic" message={errors.name} />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3" htmlFor="email">Alamat Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={auth.user.email}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all"
                                        placeholder="email@instansi.go.id"
                                        required
                                    />
                                    <InputError className="mt-2 text-[10px] font-black italic" message={errors.email} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#223771] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-900/20 text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="mt-20 pt-10 border-t border-gray-100">
                    <div className="bg-red-50 p-8 rounded-[32px] border border-red-100">
                        <h3 className="text-red-600 font-black text-sm uppercase tracking-tight flex items-center gap-2 mb-2">
                            BAHAYA: Hapus Akun
                        </h3>
                        <p className="text-red-400 text-xs font-bold leading-relaxed mb-6">
                            Menghapus akun akan menghilangkan seluruh data arsip dan riwayat yang terkait secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <DeleteUser />
                    </div>
                </div>
                
                <div className="mt-10 flex items-center gap-2 text-gray-300 text-[10px] font-black uppercase">
                    <Info className="size-4" /> Pastikan data yang anda masukkan valid untuk keperluan korespondensi sistem.
                </div>
            </div>
        </SettingsLayout>
    );
}

Profile.layout = (page: React.ReactNode) => page;
