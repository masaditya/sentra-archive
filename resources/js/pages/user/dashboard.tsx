import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Folder, FolderOpen, Archive as ArchiveIcon, Star, Bell, Search, Info } from 'lucide-react';

interface Stats {
    total: number;
    aktif: number;
    inaktif: number;
    permanen: number;
}

interface Archive {
    id: number;
    archive_number: string;
    type: string;
    status: string;
    year: number;
}

interface Props {
    stats: Stats;
    recentArchives: Archive[];
    notificationsCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, recentArchives, notificationsCount }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard OPD" />
            
            <div className="p-6 bg-[#F0F4F9] min-h-screen">
                {/* Brand Title Area */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-[#223771] tracking-tight">KONTROL PANEL OPD</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sistem Notifikasi Retensi Arsip</p>
                    </div>
                </div>

                {/* KPI Cards - Matching Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group hover:scale-[1.02] transition-transform cursor-pointer">
                        <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Arsip</div>
                            <div className="text-3xl font-black text-[#223771]">{stats.total.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Folder className="w-6 h-6 border-none" />
                        </div>
                    </div>
                    
                    <div className="bg-linear-to-br from-[#4285F4] to-[#2A65D1] p-6 rounded-3xl shadow-xl shadow-blue-500/20 flex justify-between items-center text-white hover:scale-[1.02] transition-transform cursor-pointer">
                        <div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Arsip Aktif</div>
                            <div className="text-3xl font-black">{stats.aktif.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <FolderOpen className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#8B5CF6] to-[#6D28D9] p-6 rounded-3xl shadow-xl shadow-purple-500/20 flex justify-between items-center text-white hover:scale-[1.02] transition-transform cursor-pointer">
                        <div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Arsip Inaktif</div>
                            <div className="text-3xl font-black">{stats.inaktif.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <ArchiveIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#F4B942] to-[#D9A22E] p-6 rounded-3xl shadow-xl shadow-amber-500/20 flex justify-between items-center text-[#223771] hover:scale-[1.02] transition-transform cursor-pointer">
                        <div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Arsip Permanen</div>
                            <div className="text-3xl font-black">{stats.permanen.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Chart Area */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-[#223771] text-lg">RINGKASAN TAHUNAN</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Aktif</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Inaktif</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm">
                                [ VISUALISASI STATISTIK ]
                            </div>
                        </div>

                        {/* Recent Archives Table */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-[#223771] text-lg uppercase tracking-tight">Data Terbaru</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari arsip..." 
                                        className="bg-gray-50 border border-gray-100 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-blue-100 outline-none w-48 font-medium" 
                                    />
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#223771] text-white">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Nomor Arsip</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Jenis Arsip</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-center">Tahun</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentArchives.map((archive) => (
                                        <tr key={archive.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-5 text-sm font-bold text-[#223771]">{archive.archive_number}</td>
                                            <td className="px-8 py-5 text-sm text-gray-600 font-medium">{archive.type}</td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                                    archive.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {archive.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-center font-black text-gray-400">{archive.year}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-black text-[#223771] text-sm uppercase tracking-widest">Aksi Mendatang</h4>
                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg animate-pulse">
                                    {notificationsCount}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-black text-[#223771] text-sm">Pemusnahan Terjadwal</div>
                                        <div className="text-[10px] font-bold text-amber-600 mt-0.5">Berkas Tahun 2013-2015</div>
                                    </div>
                                </div>

                                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <ArchiveIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-black text-[#223771] text-sm">Pindah Inaktif</div>
                                        <div className="text-[10px] font-bold text-blue-600 mt-0.5">Berkas Kepegawaian</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <a href="/notifications" className="w-full bg-[#223771] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1A295A] transition-colors">
                                    Semua Tindakan <Bell className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div className="bg-[#F4B942] p-8 rounded-3xl shadow-lg shadow-amber-500/20">
                            <h5 className="font-black text-[#223771] mb-2 leading-tight">BUTUH BANTUAN?</h5>
                            <p className="text-[#223771]/60 text-xs font-bold leading-relaxed mb-6 italic">Lihat panduan penggunaan aplikasi untuk mempermudah pengerjaan digitalisasi arsip Anda.</p>
                            <button className="bg-white/30 hover:bg-white/50 text-[#223771] px-6 py-2 rounded-full text-[10px] font-black uppercase transition-colors">
                                Panduan Sistem
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
