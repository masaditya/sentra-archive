import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, Upload, Download, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Upload Data', href: '/upload' },
];

export default function UploadData() {
    const { data, setData, post, processing, progress, recentlySuccessful } = useForm({
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/upload');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Data Arsip" />

            <div className="p-6 max-w-4xl mx-auto">
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
                                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                accept=".xls,.xlsx,.csv"
                            />
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FileSpreadsheet className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {data.file ? data.file.name : 'Drag & Drop file data di sini'}
                                </h3>
                                <p className="text-gray-400 mb-6">atau klik area ini untuk memilih file dari komputer</p>
                                
                                <button type="button" className="px-8 py-3 bg-white border-2 border-[#4285F4] text-[#4285F4] rounded-2xl font-bold hover:bg-[#4285F4] hover:text-white transition-colors">
                                    Telusuri File
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-blue-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <Download className="text-[#4285F4] w-6 h-6" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Belum punya format file?</p>
                                    <p className="text-xs text-blue-600">Unduh template Excel untuk memudahkan pengisian data.</p>
                                </div>
                            </div>
                            <button type="button" className="text-sm font-extrabold text-[#4285F4] hover:underline">
                                Download Template
                            </button>
                        </div>

                        <div className="text-center">
                            <button 
                                type="submit" 
                                disabled={processing || !data.file}
                                className="w-full py-4 bg-[#223771] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-[#1A295A] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {processing ? 'Sedang Memproses...' : (
                                    <>
                                        <Upload className="w-5 h-5" /> Mulai Import Data
                                    </>
                                )}
                            </button>
                            
                            {recentlySuccessful && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-bold animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-5 h-5" /> Data berhasil diunggah dan sedang diproses.
                                </div>
                            )}
                        </div>
                    </form>
                </div>

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
            </div>
        </AppLayout>
    );
}
