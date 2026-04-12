import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Building2, PlusCircle, Search, Edit3, Trash2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Pagination from '@/components/pagination';

interface User {
    username: string;
    role: string;
}

interface Organization {
    id: number;
    name: string;
    users: User[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrganizations {
    data: Organization[];
    links: PaginationLink[];
    total: number;
    current_page: number;
}

interface Props {
    organizations: PaginatedOrganizations;
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Kelola OPD', href: '/admin/organizations' },
];

export default function Organizations({ organizations, filters }: Props) {
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        username: '',
        password: '',
    });

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/admin/organizations', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOrg) {
            put(`/admin/organizations/${editingOrg.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingOrg(null);
                },
            });
        } else {
            post('/admin/organizations', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (org: Organization) => {
        setEditingOrg(org);
        setData({
            name: org.name,
            username: org.users[0]?.username || '',
            password: '', 
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus OPD ini?')) {
            router.delete(`/admin/organizations/${id}`);
        }
    };

    const cancelEdit = () => {
        setEditingOrg(null);
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola OPD" />

            <div className="p-6 bg-[#F0F4F9] min-h-screen">
                <header className="mb-8">
                    <h1 className="text-2xl font-black text-[#223771] mb-1">DATA MASTER OPD</h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Manajemen Akses Dan Akun Instansi Terdaftar</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-6">
                            <h2 className="text-lg font-black text-[#223771] mb-6 flex items-center gap-2">
                                {editingOrg ? (
                                    <div className="w-8 h-8 bg-blue-50 text-[#4285F4] rounded-lg flex items-center justify-center"><Edit3 className="size-4" /></div>
                                ) : (
                                    <div className="w-8 h-8 bg-amber-50 text-[#F4B942] rounded-lg flex items-center justify-center"><PlusCircle className="size-4" /></div>
                                )}
                                {editingOrg ? 'EDIT DATA OPD' : 'TAMBAH OPD'}
                            </h2>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Instansi / OPD</label>
                                    <input 
                                        type="text" 
                                        className={`w-full bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all`}
                                        placeholder="Ketik nama instansi..."
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 mt-2 font-black italic">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Username Akun</label>
                                    <input 
                                        type="text" 
                                        className={`w-full bg-gray-50 border ${errors.username ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all`}
                                        placeholder="Username login..."
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                    />
                                    {errors.username && <p className="text-[10px] text-red-500 mt-2 font-black italic">{errors.username}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                        Password {editingOrg && <span className="text-[9px] text-gray-400 italic lowercase font-medium">(Optional)</span>}
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`w-full bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all`}
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={!editingOrg}
                                    />
                                    {errors.password && <p className="text-[10px] text-red-500 mt-2 font-black italic">{errors.password}</p>}
                                </div>
                                
                                <div className="space-y-3 pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`w-full ${editingOrg ? 'bg-[#223771] text-white shadow-blue-900/10' : 'bg-[#F4B942] text-[#223771] shadow-amber-500/20'} font-black py-4 rounded-2xl shadow-xl transition-all text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 disabled:opacity-50`}
                                    >
                                        {processing ? 'Proses...' : (editingOrg ? 'Update Data' : 'Simpan Data')}
                                    </button>
                                    {editingOrg && (
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all text-[10px] tracking-widest uppercase"
                                        >
                                            Batalkan Perubahan
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                                <div>
                                    <h3 className="font-black text-[#223771] uppercase tracking-tight text-sm">Daftar Instansi</h3>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-0.5">TERDAPAT TOTAL {organizations.total} DATA</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Cari nama OPD..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#223771] text-white">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Instansi / OPD</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Username</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {organizations.data.length > 0 ? organizations.data.map((org) => (
                                            <tr key={org.id} className={`hover:bg-blue-50/30 transition-colors ${editingOrg?.id === org.id ? 'bg-blue-50/50' : ''}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${editingOrg?.id === org.id ? 'bg-[#223771] text-white shadow-lg shadow-blue-950/20' : 'bg-blue-50 text-[#4285F4]'}`}>
                                                            {org.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className={`font-black text-sm tracking-tight ${editingOrg?.id === org.id ? 'text-[#223771]' : 'text-gray-700'}`}>{org.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="bg-gray-100/80 text-gray-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter">
                                                        {org.users[0]?.username || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(org)}
                                                            className={`size-10 flex items-center justify-center transition-all rounded-xl ${editingOrg?.id === org.id ? 'bg-[#223771] text-white' : 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-[#4285F4]'}`}
                                                            title="Edit Instansi"
                                                        >
                                                            <Edit3 className="size-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(org.id)}
                                                            className="size-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all rounded-xl"
                                                            title="Hapus Link"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-20 text-center">
                                                    <XCircle className="size-12 text-gray-100 mx-auto mb-4" />
                                                    <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">Data tidak ditemukan</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={organizations.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
