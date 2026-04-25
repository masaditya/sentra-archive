import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, Upload, Download, CheckCircle2, ChevronDown, ChevronRight, Table as TableIcon, Loader2, Trash2, AlertCircle, ShieldCheck } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Upload Data', href: '/upload' },
];

export default function UploadData() {
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationResult, setValidationResult] = useState<{ valid: any[], duplicates: any[] } | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    
    // Pagination logic
    const totalPages = Math.ceil(parsedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = parsedData.slice(startIndex, startIndex + itemsPerPage);
    
    const { props } = usePage() as any;
    const { data, setData, post, processing, progress, recentlySuccessful, errors } = useForm({
        archives: [] as any[],
    });

    useEffect(() => {
        if (props.flash.success) {
            toast.success(props.flash.success);
        }
        if (props.flash.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        
        if (file) {
            setFileName(file.name);
            parseExcel(file);
        }
    };

    const parseExcel = (file: File) => {
        setIsParsing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            const workbook = XLSX.read(binaryData, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            
            const results: any[] = [];
            let currentParent: any = null;

            rows.forEach((row, index) => {
                // We skip some header rows. Headers are usually in row 0 and 1.
                // data[2] is the first data row.
                if (index < 2) return;

                const noDefinitif = row[0] ? String(row[0]).trim() : null;
                const kodeKlasifikasi = row[5] ? String(row[5]).trim() : null;

                // Parent Detection: If it has both noDefinitif and kodeKlasifikasi
                if (noDefinitif && kodeKlasifikasi && !isNaN(Number(noDefinitif))) {
                    if (currentParent) results.push(currentParent);
                    
                    currentParent = {
                        noDefinitif: noDefinitif,
                        noArsipSementara: row[1] || '',
                        namaArsiparis: row[2] || '',
                        seri: row[3] || '',
                        masalah: row[4] || '',
                        kodeKlasifikasi: kodeKlasifikasi,
                        noBerkas: row[6] || '',
                        berkasInformasi: row[7] || '',
                        children: []
                    };
                    
                    // Also add the first child data if it's on the parent row
                    if (row[9]) {
                        currentParent.children.push({
                            noBerkas: row[8] || '',
                            berkasInformasi: row[9] || '',
                            tanggal: row[10] || row[11]
                        });
                    }
                } else if (currentParent && row[9]) {
                    // Child row: Subsequent rows that have data in child info column (index 9)
                    currentParent.children.push({
                        noBerkas: row[8] || '',
                        berkasInformasi: row[9] || '',
                        tanggal: row[10] || row[11]
                    });
                }
            });

            if (currentParent) results.push(currentParent);

            // Post-process: Get dates from children as per user request
            results.forEach(p => {
                if (p.children.length > 0) {
                    // Tanggal Tertua from first child
                    p.tanggalTertua = p.children[0].tanggal;
                    // Tanggal Termuda from last child
                    p.tanggalTermuda = p.children[p.children.length - 1].tanggal;
                    
                    // Format dates if they are Excel serial numbers
                    const formatDate = (val: any) => {
                        if (typeof val === 'number') {
                            // If it's a small number, it's likely just a year (e.g. 2013)
                            if (val < 3000) return String(val);
                            
                            const date = new Date((val - 25569) * 86400 * 1000);
                            return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                        }
                        return val;
                    };
                    
                    p.tanggalTertua = formatDate(p.tanggalTertua);
                    p.tanggalTermuda = formatDate(p.tanggalTermuda);
                }
            });

            setParsedData(results);
            setData('archives', results);
            setCurrentPage(1); // Reset to first page on new file
            setIsParsing(false);
        };
        reader.readAsBinaryString(file);
    };

    const removeItem = (index: number) => {
        const actualIndex = startIndex + index;
        const newData = [...parsedData];
        newData.splice(actualIndex, 1);
        setParsedData(newData);
        setData('archives', newData);
        
        // Adjust current page if needed
        const newTotalPages = Math.ceil(newData.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    };

    const handleStartImport = async () => {
        if (parsedData.length === 0) return;
        
        setIsValidating(true);
        try {
            const response = await fetch('/api/archives/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ archives: parsedData }),
            });
            const result = await response.json();
            setValidationResult(result);
            setIsValidationModalOpen(true);
        } catch (error) {
            console.error('Validation failed:', error);
            toast.error('Gagal memvalidasi data. Silakan coba lagi.');
        } finally {
            setIsValidating(false);
        }
    };

    const submit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Use only valid data if validation result exists
        const dataToSubmit = validationResult ? validationResult.valid : parsedData;
        
        if (dataToSubmit.length === 0) {
            toast.error('Tidak ada data valid untuk diimpor.');
            return;
        }

        router.post('/upload', { archives: dataToSubmit }, {
            onSuccess: () => {
                setIsValidationModalOpen(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Data Arsip" />

            <div className="p-6 max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#223771] mb-2 text-center">Upload Data Arsip</h1>
                    <p className="text-gray-500">Unggah daftar arsip OPD Anda sekaligus menggunakan file Excel (.xls, .xlsx) atau CSV.</p>
                </header>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100">
                    <form onSubmit={submit} className="space-y-8">
                        <div 
                            className="border-4 border-dashed border-gray-100 rounded-3xl p-16 text-center hover:bg-gray-50 transition-all cursor-pointer relative group"
                        >
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept=".xls,.xlsx,.csv"
                            />
                            <div className={`flex flex-col items-center transition-all duration-300 ${isParsing ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FileSpreadsheet className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {fileName ? fileName : 'Drag & Drop file data di sini'}
                                </h3>
                                <p className="text-gray-400 mb-6">atau klik area ini untuk memilih file dari komputer</p>
                                
                                <button type="button" className="px-8 py-3 bg-white border-2 border-[#4285F4] text-[#4285F4] rounded-2xl font-bold hover:bg-[#4285F4] hover:text-white transition-colors">
                                    Telusuri File
                                </button>
                                
                                {errors.archives && (
                                    <p className="mt-4 text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.archives}
                                    </p>
                                )}
                            </div>

                            {isParsing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl animate-in fade-in duration-300">
                                    <div className="p-4 bg-white rounded-2xl shadow-xl shadow-blue-900/10 flex flex-col items-center gap-4">
                                        <Loader2 className="w-10 h-10 text-[#4285F4] animate-spin" />
                                        <div className="text-center">
                                            <p className="font-black text-[#223771] uppercase tracking-widest text-[10px] mb-1">Processing</p>
                                            <p className="text-sm font-bold text-gray-800">Membaca data Excel...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center bg-blue-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <Download className="text-[#4285F4] w-6 h-6" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Belum punya format file?</p>
                                    <p className="text-xs text-blue-600">Unduh template Excel untuk memudahkan pengisian data.</p>
                                </div>
                            </div>
                            <a 
                                href="/Template_Format_Daftar_Arsip.xlsx" 
                                download 
                                className="text-sm font-extrabold text-[#4285F4] hover:underline flex items-center gap-1"
                            >
                                Download Template
                            </a>
                        </div>

                        <div className="text-center">
                            <button 
                                type="button"
                                onClick={handleStartImport}
                                disabled={processing || isValidating || parsedData.length === 0}
                                className="w-full py-4 bg-[#223771] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-[#1A295A] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isValidating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Memvalidasi Data...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" /> Mulai Import Data
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {parsedData.length > 0 && (
                    <div className="mt-8 bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-linear-to-r from-blue-50/50 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-[#4285F4] rounded-2xl shadow-inner">
                                    <TableIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-gray-800">Pratinjau Data</h3>
                                    <p className="text-sm text-gray-500">Sistem mendeteksi <span className="font-bold text-blue-600">{parsedData.length}</span> baris arsip siap impor.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold ring-1 ring-green-100">
                                <CheckCircle2 className="w-4 h-4" /> Format Valid
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">No. Definitif</th>
                                        <th className="px-6 py-5">Arsiparis & Seri</th>
                                        <th className="px-6 py-5">Klasifikasi</th>
                                        <th className="px-6 py-5">Informasi Berkas</th>
                                        <th className="px-6 py-5">Rentang Waktu</th>
                                        <th className="px-8 py-5 text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {currentItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/40 transition-all text-sm group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 group-hover:text-[#4285F4] transition-colors">{item.noDefinitif}</span>
                                                    {item.noArsipSementara && <span className="text-[10px] text-gray-400 font-bold">Sim: {item.noArsipSementara}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-700">{item.namaArsiparis}</span>
                                                    <span className="text-xs text-gray-400 italic">{item.seri}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="inline-flex items-center px-3 py-1 bg-white border border-blue-100 text-[#223771] rounded-lg font-mono text-xs font-bold shadow-sm">
                                                    {item.kodeKlasifikasi}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 max-w-sm">
                                                <div className="font-semibold text-gray-800 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{item.berkasInformasi}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                                                    {item.masalah}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                                                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase mb-1">
                                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div> Periode Arsip
                                                    </div>
                                                    <div className="text-gray-700 font-bold flex items-center gap-2">
                                                        <span className="text-blue-500">
                                                            {item.tanggalTertua ? item.tanggalTertua.split(' ').pop() : '-'}
                                                        </span>
                                                        <span className="text-gray-300">—</span>
                                                        <span className="text-blue-700">
                                                            {item.tanggalTermuda ? item.tanggalTermuda.split(' ').pop() : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button 
                                                    onClick={() => removeItem(idx)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Hapus baris ini"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="px-8 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Halaman <span className="text-gray-900">{currentPage}</span> dari <span className="text-gray-900">{totalPages}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            const pageNum = i + 1; // Simplistic pagination numbers
                                            return (
                                                <button
                                                    key={pageNum}
                                                    type="button"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-[#223771] text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-50 text-gray-400'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        {totalPages > 5 && <span className="text-gray-300 px-2 font-black">...</span>}
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">Pastikan data di atas sudah sesuai sebelum menekan tombol <b>Mulai Import Data</b></p>
                        </div>
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-600">1</div>
                        <h4 className="font-bold text-gray-800 mb-1">Siapkan File</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Gunakan format file Excel atau CSV yang sesuai dengan template sistem.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-600">2</div>
                        <h4 className="font-bold text-gray-800 mb-1">Upload Data</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Pastikan kolom Nama Arsip, Tahun, dan Jenis terisi dengan benar.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-600">3</div>
                        <h4 className="font-bold text-gray-800 mb-1">Cek Notifikasi</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Sistem akan otomatis menghitung jadwal retensi dan memberi notifikasi.</p>
                    </div>
                </div>

                {/* Validation Modal */}
                <Dialog open={isValidationModalOpen} onOpenChange={setIsValidationModalOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-white rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
                        <div className="p-10">
                            <div className="w-20 h-20 bg-blue-50 text-[#223771] rounded-[24px] flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="size-10" />
                            </div>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-[#223771] uppercase tracking-tighter text-center mb-2">Konfirmasi Import Data</DialogTitle>
                                <DialogDescription className="text-center text-sm font-bold text-gray-400 leading-relaxed">
                                    Sistem telah memvalidasi data Anda. Berikut adalah ringkasan hasilnya:
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm">
                                            <CheckCircle2 className="size-5" />
                                        </div>
                                        <span className="text-sm font-black text-green-700 uppercase tracking-widest">Siap Import</span>
                                    </div>
                                    <span className="text-xl font-black text-green-700">{validationResult?.valid.length || 0}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                                            <AlertCircle className="size-5" />
                                        </div>
                                        <span className="text-sm font-black text-red-700 uppercase tracking-widest">Duplikat (Lewati)</span>
                                    </div>
                                    <span className="text-xl font-black text-red-700">{validationResult?.duplicates.length || 0}</span>
                                </div>
                            </div>

                            {validationResult?.duplicates.length ? (
                                <p className="mt-6 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Data duplikat terdeteksi berdasarkan Nomor Definitif yang sudah ada di sistem untuk organisasi Anda.
                                </p>
                            ) : null}
                        </div>

                        <div className="flex gap-2 p-6 bg-gray-50/50 border-t border-gray-100">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsValidationModalOpen(false)}
                                className="flex-1 rounded-2xl border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-widest h-12"
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={() => submit()}
                                disabled={processing || !validationResult?.valid.length}
                                className="flex-2 rounded-2xl bg-[#223771] hover:bg-[#1A295A] text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-blue-900/20"
                            >
                                {processing ? <Loader2 className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                                Lanjutkan Import ({validationResult?.valid.length || 0})
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
