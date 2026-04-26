import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Plus, Search, Edit2, Trash2, BookOpen, ChevronRight, Check, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Pagination from '@/components/pagination';

interface RetentionSchedule {
    id: number;
    code: string;
    name: string;
    active_retention: number;
    inactive_retention: number;
    final_disposition: string;
    is_classification: boolean;
}

interface Props {
    schedules: {
        data: RetentionSchedule[];
        links: any[];
        total: number;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Jadwal Retensi Arsip', href: '/admin/jra' },
];

export default function JRAManagement({ schedules, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<RetentionSchedule | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        code: '',
        name: '',
        active_retention: 0,
        inactive_retention: 0,
        final_disposition: 'Musnah',
        is_classification: false,
    });

    const openCreateModal = () => {
        setEditingSchedule(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (schedule: RetentionSchedule) => {
        setEditingSchedule(schedule);
        setData({
            code: schedule.code,
            name: schedule.name,
            active_retention: schedule.active_retention,
            inactive_retention: schedule.inactive_retention,
            final_disposition: schedule.final_disposition,
            is_classification: schedule.is_classification,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSchedule) {
            put(`/admin/jra/${editingSchedule.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('JRA berhasil diperbarui');
                },
            });
        } else {
            post('/admin/jra', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('JRA baru berhasil ditambahkan');
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus JRA ini?')) {
            destroy(`/admin/jra/${id}`, {
                onSuccess: () => toast.success('JRA berhasil dihapus'),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/jra', { search: searchTerm }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen JRA" />

            <div className="p-8 bg-[#F0F4F9] min-h-screen">
                <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="size-5 text-[#223771]" />
                            <h1 className="text-3xl font-black text-[#223771] tracking-tighter uppercase leading-none">Jadwal Retensi Arsip (JRA)</h1>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Atur parameter retensi dan klasifikasi arsip pusat.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Cari Kode atau Nama..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white border-none rounded-2xl py-4 pl-12 pr-6 text-xs w-64 shadow-xl shadow-blue-900/5 focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                            />
                        </form>
                        <button 
                            onClick={openCreateModal}
                            className="bg-[#223771] text-white p-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus className="size-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest pr-2">Tambah JRA</span>
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kode Klasifikasi</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Uraian / Masalah</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aktif</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Inaktif</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Penyusutan Akhir</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {schedules.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-[#223771] leading-tight mb-1">{item.name}</p>
                                            {item.is_classification ? (
                                                <span className="text-[8px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full uppercase">Klasifikasi</span>
                                            ) : (
                                                <span className="text-[8px] font-black text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Item Retensi</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <p className="text-xs font-black text-[#223771]">{item.active_retention} Thn</p>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <p className="text-xs font-black text-[#223771]">{item.inactive_retention} Thn</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`
                                                text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter
                                                ${item.final_disposition === 'Musnah' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}
                                            `}>
                                                {item.final_disposition}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <Pagination links={schedules.links} />
                </div>
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#223771]/20 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[48px] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition-colors">
                            <X className="size-8" />
                        </button>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/10">
                                <Plus className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#223771] uppercase tracking-tight">{editingSchedule ? 'Perbarui JRA' : 'Tambah JRA Baru'}</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Konfigurasi parameter retensi arsip nasional.</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kode Klasifikasi</label>
                                    <input 
                                        type="text" 
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-[24px] py-4 px-6 text-sm font-bold text-[#223771] focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: HK.01"
                                    />
                                    {errors.code && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.code}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jenis JRA</label>
                                    <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-[24px]">
                                        <button 
                                            type="button"
                                            onClick={() => setData('is_classification', true)}
                                            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${data.is_classification ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                                        >
                                            Klasifikasi
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setData('is_classification', false)}
                                            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${!data.is_classification ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                                        >
                                            Item Retensi
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama / Uraian Masalah</label>
                                <textarea 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-[24px] py-4 px-6 text-sm font-bold text-[#223771] focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                    placeholder="Masukkan uraian lengkap masalah arsip..."
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Masa Aktif (Tahun)</label>
                                    <input 
                                        type="number" 
                                        value={data.active_retention}
                                        onChange={e => setData('active_retention', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 border-none rounded-[24px] py-4 px-6 text-sm font-bold text-[#223771] focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Masa Inaktif (Tahun)</label>
                                    <input 
                                        type="number" 
                                        value={data.inactive_retention}
                                        onChange={e => setData('inactive_retention', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 border-none rounded-[24px] py-4 px-6 text-sm font-bold text-[#223771] focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Penyusutan Akhir</label>
                                    <select 
                                        value={data.final_disposition}
                                        onChange={e => setData('final_disposition', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-[24px] py-4 px-6 text-sm font-bold text-[#223771] focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="Musnah">MUSNAH</option>
                                        <option value="Permanen">PERMANEN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-5 rounded-[24px] border border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Batalkan
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-1 py-5 rounded-[24px] bg-[#223771] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
