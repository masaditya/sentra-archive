import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Flame, ArrowRight, Star, FileSignature, CheckCircle2, Upload, X, Archive, Handshake, Calendar, Timer } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: number;
    archive_number: string;
    archive_id: number;
    action_type: 'Musnah' | 'Inaktif' | 'Permanen';
    action_date: string;
    notif_description: string;
    type: string;
}

interface Props {
    notifications: Notification[];
    simulationDate: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifikasi', href: '/notifications' },
];

export default function Notifications({ notifications = [], simulationDate }: Props) {
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
        action_type: '',
    });

    const musnahList = notifications.filter(n => n.action_type === 'Musnah');
    const inaktifList = notifications.filter(n => n.action_type === 'Inaktif');
    const permanenList = notifications.filter(n => n.action_type === 'Permanen');

    const triggerAction = (notif: Notification) => {
        setSelectedNotif(notif);
        setData('action_type', `Berita Acara ${notif.action_type}`);
        setStep(1);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNotif) return;

        post(`/archives/${selectedNotif.archive_id}/follow-up`, {
            onSuccess: () => {
                reset();
                setSelectedNotif(null);
                alert('Tindakan berhasil dikirim!');
            },
        });
    };

    const handleSimulationDateChange = (date: string) => {
        router.get('/notifications', { simulation_date: date }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi Retensi" />

            <div className="p-8 bg-[#F0F4F9] min-h-screen">
                <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#223771] tracking-tighter uppercase mb-1">Notifikasi Retensi</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pemberitahuan jadwal retensi arsip yang jatuh tempo beserta tindak lanjutnya.</p>
                    </div>

                    {/* Simulation Picker */}
                    <div className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="size-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                            <Timer className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Simulasi Waktu Sekarang</label>
                            <input 
                                type="date" 
                                value={simulationDate}
                                onChange={(e) => handleSimulationDateChange(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-[#223771] font-black uppercase text-xs cursor-pointer"
                            />
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl space-y-12">
                    
                    {/* 1. Musnah Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-red-500 pl-4 py-1">
                            <h2 className="text-sm font-black text-[#223771] uppercase tracking-widest">AKAN DIMUSNAHKAN</h2>
                            <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{musnahList.length}</span>
                        </div>
                        <div className="space-y-4 ml-5">
                            {musnahList.length > 0 ? musnahList.map((notif) => (
                                <NotificationCard 
                                    key={notif.id} 
                                    notif={notif} 
                                    icon={<Flame className="size-6" />} 
                                    iconBg="bg-red-50 text-red-500"
                                    actionIcon={<FileSignature className="size-4" />}
                                    actionLabel="Upload Berita Acara Pemusnahan"
                                    actionBtnClass="border-red-200 text-red-500 hover:bg-red-500 hover:text-white"
                                    onAction={() => triggerAction(notif)}
                                />
                            )) : <EmptyState message="Tidak ada jadwal pemusnahan." />}
                        </div>
                    </div>

                    {/* 2. Inaktif Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-[#4285F4] pl-4 py-1">
                            <h2 className="text-sm font-black text-[#223771] uppercase tracking-widest">PINDAH KE INAKTIF</h2>
                            <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-full">{inaktifList.length}</span>
                        </div>
                        <div className="space-y-4 ml-5">
                            {inaktifList.length > 0 ? inaktifList.map((notif) => (
                                <NotificationCard 
                                    key={notif.id} 
                                    notif={notif} 
                                    icon={<ArrowRight className="size-6" />} 
                                    iconBg="bg-blue-50 text-blue-500"
                                    actionIcon={<Archive className="size-4" />}
                                    actionLabel="Upload Berita Acara Inaktif"
                                    actionBtnClass="border-blue-200 text-blue-500 hover:bg-blue-500 hover:text-white"
                                    onAction={() => triggerAction(notif)}
                                />
                            )) : <EmptyState message="Tidak ada jadwal pemindahan inaktif." />}
                        </div>
                    </div>

                    {/* 3. Permanen Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-green-500 pl-4 py-1">
                            <h2 className="text-sm font-black text-[#223771] uppercase tracking-widest">MENJADI PERMANEN</h2>
                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full">{permanenList.length}</span>
                        </div>
                        <div className="space-y-4 ml-5">
                            {permanenList.length > 0 ? permanenList.map((notif) => (
                                <NotificationCard 
                                    key={notif.id} 
                                    notif={notif} 
                                    icon={<Star className="size-6" />} 
                                    iconBg="bg-green-50 text-green-500"
                                    actionIcon={<Handshake className="size-4" />}
                                    actionLabel="Upload Berita Acara Statis"
                                    actionBtnClass="border-green-200 text-green-600 hover:bg-green-600 hover:text-white"
                                    onAction={() => triggerAction(notif)}
                                />
                            )) : <EmptyState message="Tidak ada jadwal penyerahan permanen." />}
                        </div>
                    </div>

                </div>
            </div>

            {/* Premium Workflow Modal */}
            {selectedNotif && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#223771]/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setSelectedNotif(null)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors">
                            <X className="size-6" />
                        </button>

                        {step === 1 ? (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/10">
                                    <FileSignature className="size-8" />
                                </div>
                                <h3 className="text-2xl font-black text-[#223771] mb-2 uppercase tracking-tight">KONFIRMASI TINDAKAN</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed px-6">
                                    APAKAH ANDA INGIN MENINDAKLANJUTI PROSES <span className="text-amber-500">{data.action_type}</span> UNTUK BERKAS <span className="text-[#223771]">{selectedNotif.archive_number}</span>?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setSelectedNotif(null)} className="px-8 py-4 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">
                                        BATALKAN
                                    </button>
                                    <button onClick={() => setStep(2)} className="px-8 py-4 rounded-2xl bg-[#223771] font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 hover:scale-105 transition-all">
                                        LANJUT UPLOAD
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                                        <Upload className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#223771] leading-none uppercase tracking-tight">Unggah Berkas</h3>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Lampirkan Berita Acara (PDF/JPG/PNG)</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="group relative">
                                        <div className="border-4 border-dashed border-gray-50 rounded-[32px] p-12 text-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                                accept=".pdf,.jpg,.png"
                                            />
                                            <Upload className="size-10 text-gray-200 mx-auto mb-4 group-hover:text-blue-300 transition-colors" />
                                            <p className="text-xs font-black text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest leading-relaxed">
                                                {data.file ? data.file.name : 'KLIK ATAU TARIK FILE DISINI'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button type="button" onClick={() => setStep(1)} className="px-8 py-4 rounded-2xl border border-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">
                                            KEMBALI
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.file} 
                                            className="px-8 py-4 rounded-2xl bg-green-500 font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-green-500/20 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {processing ? 'UPLOADING...' : 'SELESAIKAN'}
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

function NotificationCard({ notif, icon, iconBg, actionIcon, actionLabel, actionBtnClass, onAction }: any) {
    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-6 group hover:translate-x-1 transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-gray-200/50 ${iconBg}`}>
                {icon}
            </div>
            <div className="grow text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2 lg:mb-0">
                   <h6 className="font-black text-[#223771] text-base leading-none uppercase tracking-tight">{notif.type}</h6>
                   <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full w-fit mx-auto lg:mx-0">
                      <Calendar className="size-3" />
                      JATUH TEMPO: {new Date(notif.action_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                </div>
                <p className="text-gray-500 text-xs font-bold leading-relaxed mt-1 italic">{notif.notif_description}</p>
            </div>
            <button 
                onClick={onAction}
                className={cn(
                    "px-6 py-3 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 shrink-0 active:scale-95",
                    actionBtnClass
                )}
            >
                {actionIcon}
                {actionLabel}
            </button>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[32px] py-12 px-8 text-center">
            <CheckCircle2 className="size-10 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest italic">{message}</p>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
