import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Bell, ArrowRight, Flame, Search, Filter, Timer, CheckCircle2 } from 'lucide-react';

interface Notification {
    id: number;
    archive_number: string;
    series?: string;
    sub_series?: string;
    status: string;
    due_type: string;
    due_date: string;
    is_followed_up: boolean;
    latest_action?: {
        action_type: string;
        file_path: string;
        created_at: string;
    };
    organization?: { name: string };
}

interface Props {
    notificationsGrouped: Record<string, Notification[]>;
    simulationDate: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Notifikasi Global', href: '/admin/notifications' },
];

export default function AdminNotifications({ notificationsGrouped, simulationDate }: Props) {
    const [tempDate, setTempDate] = useState(simulationDate);

    const handleSimulationDateChange = () => {
        router.get('/admin/notifications', { simulation_date: tempDate }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi Global" />

            <div className="p-6">
                <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#223771] tracking-tighter uppercase mb-1">Notifikasi Global</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pantau kepatuhan jadwal retensi seluruh OPD di sistem.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Simulation Picker */}
                        <div className="bg-white p-2 pl-6 rounded-[32px] shadow-xl shadow-blue-900/5 border border-gray-100 flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                                    <Timer className="size-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Simulasi Waktu</label>
                                    <input 
                                        type="date" 
                                        value={tempDate}
                                        onChange={(e) => setTempDate(e.target.value)}
                                        className="bg-transparent border-none p-0 focus:ring-0 text-[#223771] font-black uppercase text-sm cursor-pointer"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleSimulationDateChange}
                                disabled={tempDate === simulationDate}
                                className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tempDate === simulationDate ? 'bg-gray-50 text-gray-300' : 'bg-[#223771] text-white shadow-lg'}`}
                            >
                                Perbarui
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {Object.entries(notificationsGrouped).length > 0 ? Object.entries(notificationsGrouped).map(([orgId, items]) => (
                            <div key={orgId} className="space-y-4">
                                <h3 className="font-extrabold text-gray-800 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
                                    {items[0]?.organization?.name} 
                                    <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-lg ml-2">{items.length} Menunggu</span>
                                </h3>
                                <div className="space-y-3">
                                    {items.map((notif) => (
                                        <div key={notif.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${notif.is_followed_up ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                {notif.due_type === 'Musnah' ? <Flame className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                                            </div>
                                            <div className="grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.archive_number}</p>
                                                    {notif.is_followed_up ? (
                                                        <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Sudah Ditindaklanjuti</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Belum Merespon</span>
                                                    )}
                                                </div>
                                                <h6 className="font-black text-[#223771] uppercase text-sm leading-tight">
                                                    {notif.due_type} ARSIP: {notif.series || 'Tanpa Seri'}
                                                </h6>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                                                    Jatuh Tempo: {new Date(notif.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            {notif.is_followed_up ? (
                                                <a 
                                                    href={`/storage/${notif.latest_action?.file_path}`} 
                                                    target="_blank"
                                                    className="px-6 py-3 bg-green-500 text-white text-[10px] font-black rounded-2xl hover:bg-green-600 transition-all uppercase tracking-widest shadow-lg shadow-green-500/20"
                                                >
                                                    Lihat BA
                                                </a>
                                            ) : (
                                                <div className="px-6 py-3 bg-gray-50 text-gray-400 text-[10px] font-black rounded-2xl uppercase tracking-widest cursor-not-allowed">
                                                    Menunggu
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-gray-400 font-bold">Tidak ada notifikasi aktif untuk saat ini.</h3>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[#223771] text-white rounded-3xl p-8 text-center shadow-2xl shadow-blue-900/30 sticky top-6">
                            <Bell className="w-16 h-16 text-[#F4B942] mx-auto mb-6 drop-shadow-lg" />
                            <h2 className="text-2xl font-black mb-2">Total {Object.values(notificationsGrouped).flat().length} Tindakan</h2>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed">Terdapat tindakan arsip yang memerlukan tinjauan pemindahan atau pemusnahan dari berbagai OPD pada bulan ini.</p>
                            <a 
                                href={`/admin/notifications/export?simulation_date=${simulationDate}`}
                                target="_blank"
                                className="w-full bg-[#F4B942] text-[#223771] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-transform shadow-xl shadow-[#F4B942]/20"
                            >
                                <CheckCircle2 className="size-5" />
                                Cetak Rekapitulasi
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
