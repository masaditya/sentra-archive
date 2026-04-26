import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, FileText, Calendar, Tag, ShieldCheck, Edit2, Trash2, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCallback } from 'react';

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
        code: string;
        name: string;
        active_retention: number;
        inactive_retention: number;
        final_disposition: string;
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
    retentionSchedules: {
        code: string;
        name: string;
        active_retention: number;
        inactive_retention: number;
        final_disposition: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daftar Arsip', href: '/archives' },
];

export default function ArchivesIndex({ archives, retentionSchedules }: Props) {
    const { props } = usePage() as any;
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
    
    // Searchable Select State
    const [retentionSearch, setRetentionSearch] = useState('');
    const [isRetentionDropdownOpen, setIsRetentionDropdownOpen] = useState(false);
    const [options, setOptions] = useState(retentionSchedules);
    const [isSearching, setIsSearching] = useState(false);

    const fetchSchedules = useCallback(async (search: string) => {
        setIsSearching(true);
        try {
            const response = await fetch(`/api/retention-schedules?search=${encodeURIComponent(search)}`);
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        if (!isRetentionDropdownOpen) return;

        const timer = setTimeout(() => {
            fetchSchedules(retentionSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [retentionSearch, fetchSchedules, isRetentionDropdownOpen]);

    // Ensure selected option is in the options list when opening edit
    useEffect(() => {
        if (isEditModalOpen) {
            setOptions(retentionSchedules);
            setRetentionSearch('');
        }
    }, [isEditModalOpen, retentionSchedules]);

    const { data, setData, put, processing, reset, errors } = useForm({
        archive_number: '',
        series: '',
        sub_series: '',
        classification_code: '',
        description: '',
        status: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    const handleEdit = (archive: Archive) => {
        setSelectedArchive(archive);
        setData({
            archive_number: archive.archive_number || '',
            series: archive.series || '',
            sub_series: archive.sub_series || '',
            classification_code: archive.classification_code || '',
            description: archive.description || '',
            status: archive.status || 'Aktif',
            start_date: archive.start_date || '',
            end_date: archive.end_date || '',
        });

        // Add the current classification to options if it's not there
        if (archive.classification && !options.find(o => o.code === archive.classification_code)) {
            setOptions(prev => [archive.classification!, ...prev]);
        }

        setIsEditModalOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArchive) return;

        put(`/archives/${selectedArchive.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (archive: Archive) => {
        setSelectedArchive(archive);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedArchive) return;

        router.delete(`/archives/${selectedArchive.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedArchive(null);
            },
        });
    };

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
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(archive)}
                                                    className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(archive)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                                <button className="p-2 text-gray-300 hover:text-[#223771] hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                                                    <ArrowUpDown className="size-4" />
                                                </button>
                                            </div>
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

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
                    <form onSubmit={submitEdit}>
                        <DialogHeader className="p-8 bg-[#F8FAFC] border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-[#223771] rounded-2xl flex items-center justify-center">
                                    <Edit2 className="size-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-black text-[#223771] uppercase tracking-tight">Edit Data Arsip</DialogTitle>
                                    <DialogDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Perbarui informasi berkas arsip.</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Nomor Arsip</Label>
                                    <Input 
                                        value={data.archive_number}
                                        onChange={e => setData('archive_number', e.target.value)}
                                        className="rounded-xl border-gray-100 focus:ring-[#223771]/10 focus:border-[#223771]"
                                        placeholder="Contoh: 001/ARS/2023"
                                    />
                                    {errors.archive_number && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.archive_number}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Status</Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={value => setData('status', value)}
                                    >
                                        <SelectTrigger className="rounded-xl border-gray-100">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                            <SelectItem value="Aktif">Aktif</SelectItem>
                                            <SelectItem value="Inaktif">Inaktif</SelectItem>
                                            <SelectItem value="Musnah">Musnah</SelectItem>
                                            <SelectItem value="Permanen">Permanen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Kode Klasifikasi (Beserta Sub Klasifikasi)</Label>
                                <div className="relative">
                                    <div 
                                        onClick={() => setIsRetentionDropdownOpen(!isRetentionDropdownOpen)}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl cursor-pointer flex items-center justify-between group hover:border-[#223771]/30 transition-all shadow-sm"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-[#223771] uppercase tracking-tight">
                                                {data.classification_code || 'PILIH KLASIFIKASI'}
                                            </span>
                                            {data.classification_code && (
                                                <span className="text-[9px] font-bold text-gray-400 uppercase line-clamp-1">
                                                    {retentionSchedules.find(s => s.code === data.classification_code)?.name}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className={`size-4 text-gray-400 group-hover:text-[#223771] transition-transform ${isRetentionDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isRetentionDropdownOpen && (
                                        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
                                                    <input 
                                                        autoFocus
                                                        placeholder="Cari kode atau nama klasifikasi..."
                                                        value={retentionSearch}
                                                        onChange={e => setRetentionSearch(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-white border-none rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#223771]/10 outline-none"
                                                    />
                                                    {isSearching && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <Loader2 className="size-3 text-blue-500 animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                                                {options.length > 0 ? options.map((s) => (
                                                    <div 
                                                        key={s.code}
                                                        onClick={() => {
                                                            setData('classification_code', s.code);
                                                            setIsRetentionDropdownOpen(false);
                                                            setRetentionSearch('');
                                                        }}
                                                        className={`
                                                            p-3 rounded-xl cursor-pointer transition-all hover:bg-blue-50 group
                                                            ${data.classification_code === s.code ? 'bg-blue-50' : ''}
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-[10px] font-black text-[#223771] uppercase tracking-widest">{s.code}</span>
                                                            {data.classification_code === s.code && <div className="size-1.5 bg-[#F4B942] rounded-full"></div>}
                                                        </div>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight group-hover:text-gray-500">
                                                            {s.name}
                                                        </p>
                                                    </div>
                                                )) : (
                                                    <div className="p-8 text-center">
                                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                                            {isSearching ? 'Mencari...' : 'Tidak ada hasil ditemukan'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.classification_code && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.classification_code}</p>}
                            </div>

                            {/* Readonly Retention Info */}
                            {data.classification_code && (
                                <div className="grid grid-cols-3 gap-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100 animate-in fade-in zoom-in duration-300">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Retensi Aktif</p>
                                        <p className="text-xs font-black text-[#223771]">
                                            {(options.find(s => s.code === data.classification_code)?.active_retention ?? selectedArchive?.classification?.active_retention) ?? '-'} Tahun
                                        </p>
                                    </div>
                                    <div className="space-y-1 border-x border-gray-200 px-4">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Retensi Inaktif</p>
                                        <p className="text-xs font-black text-[#223771]">
                                            {(options.find(s => s.code === data.classification_code)?.inactive_retention ?? selectedArchive?.classification?.inactive_retention) ?? '-'} Tahun
                                        </p>
                                    </div>
                                    <div className="space-y-1 pl-4 text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Penyusutan Akhir</p>
                                        <span className={`
                                            px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter
                                            ${(options.find(s => s.code === data.classification_code)?.final_disposition ?? selectedArchive?.classification?.final_disposition) === 'Musnah' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                                        `}>
                                            {(options.find(s => s.code === data.classification_code)?.final_disposition ?? selectedArchive?.classification?.final_disposition) ?? '-'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Seri</Label>
                                    <Input 
                                        value={data.series}
                                        onChange={e => setData('series', e.target.value)}
                                        className="rounded-xl border-gray-100 focus:ring-[#223771]/10 focus:border-[#223771]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Sub Seri / Masalah</Label>
                                    <Input 
                                        value={data.sub_series}
                                        onChange={e => setData('sub_series', e.target.value)}
                                        className="rounded-xl border-gray-100 focus:ring-[#223771]/10 focus:border-[#223771]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Deskripsi / Informasi Berkas</Label>
                                <textarea 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full min-h-[100px] p-3 text-sm rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#223771]/10 focus:border-[#223771] outline-none transition-all"
                                    placeholder="Masukkan detail informasi berkas..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Tanggal Mulai</Label>
                                    <Input 
                                        type="date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="rounded-xl border-gray-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#223771] uppercase tracking-widest ml-1">Tanggal Selesai</Label>
                                    <Input 
                                        type="date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="rounded-xl border-gray-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-8 bg-[#F8FAFC] border-t border-gray-100 gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditModalOpen(false)}
                                className="rounded-xl border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-widest px-6 h-12"
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="rounded-xl bg-[#223771] hover:bg-[#1A295A] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-lg shadow-blue-900/20"
                            >
                                {processing ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[450px] bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden text-center">
                    <div className="p-10">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="size-10" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-[#223771] uppercase tracking-tighter mb-2">Hapus Arsip?</DialogTitle>
                        <DialogDescription className="text-sm font-bold text-gray-400 leading-relaxed px-4">
                            Apakah Anda yakin ingin menghapus arsip <span className="text-[#223771]">{selectedArchive?.archive_number}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </div>

                    <div className="flex gap-2 p-6 bg-gray-50/50 border-t border-gray-100">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 rounded-xl border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-widest h-12"
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDelete}
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-red-900/20"
                        >
                            Ya, Hapus Data
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
