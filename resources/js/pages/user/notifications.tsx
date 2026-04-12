import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Flame, ArrowRight, Star, FileSignature, CheckCircle2, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: number;
    archive_number: string;
    type: string;
    status: string;
    year: number;
}

interface Props {
    notifications: Notification[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifikasi', href: '/notifications' },
];

export default function Notifications({ notifications }: Props) {
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
        action_type: '',
    });

    const triggerAction = (notif: Notification, action: string) => {
        setSelectedNotif(notif);
        setData('action_type', action);
        setStep(1);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNotif) return;

        post(`/archives/${selectedNotif.id}/follow-up`, {
            onSuccess: () => {
                reset();
                setSelectedNotif(null);
                alert('Tindakan berhasil dikirim!');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi Retensi" />

            <div className="p-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[#223771] mb-1">Notifikasi Retensi</h1>
                    <p className="text-gray-500">Pemberitahuan jadwal retensi arsip yang jatuh tempo beserta tindak lanjutnya.</p>
                </header>

                <div className="max-w-4xl space-y-8">
                    {/* Groups based on status/action */}
                    <div className="space-y-4">
                        <div className="border-l-4 border-amber-400 pl-4">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Tindakan Retensi</h2>
                            
                            <div className="space-y-4">
                                {notifications.length > 0 ? notifications.map((notif) => (
                                    <div key={notif.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                            notif.status === 'Inaktif' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {notif.year < 2015 ? <Flame className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                                        </div>
                                        <div className="grow">
                                            <h6 className="font-bold text-gray-800">{notif.type} - {notif.archive_number}</h6>
                                            <p className="text-xs text-gray-500">Jadwal retensi JRA telah habis dan memerlukan tindakan {notif.year < 2015 ? 'Pemusnahan' : 'Pemindahan'}.</p>
                                        </div>
                                        <button 
                                            onClick={() => triggerAction(notif, notif.year < 2015 ? 'Berita Acara Pemusnahan' : 'Berita Acara Pemindahan')}
                                            className="px-4 py-2 border border-[#4285F4] text-[#4285F4] text-xs font-bold rounded-xl hover:bg-[#4285F4] hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <FileSignature className="w-4 h-4" />
                                            {notif.year < 2015 ? 'Pemusnahan' : 'Pindah Inaktif'}
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">Semua tindakan retensi telah selesai.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedNotif && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
                        <button onClick={() => setSelectedNotif(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>

                        {step === 1 ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Flame className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Tindakan</h3>
                                <p className="text-gray-500 text-sm mb-8">
                                    Apakah Anda ingin menindaklanjuti proses <span className="font-bold text-gray-700">{data.action_type}</span> untuk arsip <span className="font-bold text-gray-700">{selectedNotif.archive_number}</span>?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setSelectedNotif(null)} className="px-6 py-3 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                        Abaikan
                                    </button>
                                    <button onClick={() => setStep(2)} className="px-6 py-3 rounded-2xl bg-[#4285F4] font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors">
                                        Tindak Lanjut
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Upload className="text-[#4285F4] w-5 h-5" /> Upload Dokumen
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">Silakan unggah dokumen PDF / Image yang telah disetujui dan ditandatangani.</p>
                                
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                            accept=".pdf,.jpg,.png"
                                        />
                                        <p className="text-sm font-bold text-gray-500">
                                            {data.file ? data.file.name : 'Pilih File (PDF, JPG, PNG)'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                            Kembali
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.file} 
                                            className="px-6 py-3 rounded-2xl bg-green-500 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-600 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Uploading...' : 'Upload Berkas'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
