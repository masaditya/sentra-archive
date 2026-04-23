import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, FileText, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Archive {
    id: number;
    archive_number: string;
    series: string;
    sub_series: string;
    classification_code: string;
    description: string;
    status: string;
    year: string;
    start_date: string;
    end_date: string;
    classification?: {
        name: string;
    };
}

interface Props {
    archives: {
        data: Archive[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daftar Arsip', href: '/archives' },
];

export default function ArchivesIndex({ archives }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = archives.data.filter(archive => 
        archive.archive_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.series?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Berkas Arsip" />

            <div className="p-8 bg-[#F0F4F9] min-h-screen">
                <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#223771] tracking-tighter uppercase mb-1">Daftar Berkas Arsip</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            Manajemen koleksi arsip yang telah diinputkan ke dalam sistem.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-300 group-focus-within:text-[#223771] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="CARI NOMOR ATAU SERI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-3.5 bg-white border-none rounded-[20px] shadow-sm text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#223771]/10 w-full lg:w-72 transition-all"
                            />
                        </div>
                        <button className="p-3.5 bg-white rounded-[20px] shadow-sm text-gray-400 hover:text-[#223771] transition-colors border-none ring-0">
                            <Filter className="size-5" />
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8FAFC]">
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100">Info Arsip (Seri/Sub)</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100 w-1/4">Klasifikasi JRA</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100 w-1/4">Deskripsi/Informasi Berkas</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100">Waktu</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-[#223771] uppercase tracking-widest border-b border-gray-100 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredData.length > 0 ? filteredData.map((archive) => (
                                    <tr key={archive.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                    <FileText className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#223771] uppercase tracking-tight">{archive.archive_number}</p>
                                                    <p className="text-[10px] font-bold text-[#F4B942] uppercase mt-0.5 line-clamp-1">{archive.series || 'Tanpa Seri'}</p>
                                                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tight">{archive.sub_series}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Tag className="size-3 text-[#223771]" />
                                                <span className="text-[10px] font-black text-[#223771] uppercase tracking-widest">{archive.classification_code}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-500 mt-1 line-clamp-2 leading-tight uppercase">
                                                {archive.classification?.name || 'Klasifikasi Tidak Ditemukan'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {archive.description || <span className="text-gray-200 italic">Tidak ada deskripsi</span>}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="size-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {archive.start_date ? new Date(archive.start_date).getFullYear() : '-'} 
                                                    {archive.end_date ? ` - ${new Date(archive.end_date).getFullYear()}` : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                                                    ${archive.status === 'Aktif' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-100' : ''}
                                                    ${archive.status === 'Inaktif' ? 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-100' : ''}
                                                    ${archive.status === 'Musnah' ? 'bg-red-100 text-red-700 shadow-sm shadow-red-100' : ''}
                                                    ${archive.status === 'Permanen' ? 'bg-blue-100 text-blue-700 shadow-sm shadow-blue-100' : ''}
                                                `}>
                                                    {archive.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-[#223771] hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                                                <ArrowUpDown className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <ShieldCheck className="size-12 text-gray-100 mx-auto mb-4" />
                                            <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest italic">Belum ada data arsip yang tersedia.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Menampilkan <span className="text-[#223771] font-black">{archives.data.length}</span> Berkas (Halaman {archives.current_page} dari {archives.last_page})
                        </p>
                        <div className="flex items-center gap-1">
                            {archives.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || ''}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`
                                        min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all
                                        ${link.active ? 'bg-[#223771] text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-gray-100'}
                                        ${!link.url ? 'opacity-20 cursor-not-allowed' : ''}
                                        px-3
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
