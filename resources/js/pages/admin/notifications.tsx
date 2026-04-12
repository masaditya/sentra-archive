import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Bell, ArrowRight, Flame, Search, Filter } from 'lucide-react';

interface Notification {
    id: number;
    archive_number: string;
    type: string;
    status: string;
    year: number;
    organization?: { name: string };
}

interface Props {
    notificationsGrouped: Record<string, Notification[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Notifikasi Global', href: '/admin/notifications' },
];

export default function AdminNotifications({ notificationsGrouped }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi Global" />

            <div className="p-6">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-[#223771] mb-1">Notifikasi Global</h1>
                        <p className="text-gray-500">Pantau jadwal pemindahan dan pemusnahan arsip dari seluruh OPD.</p>
                    </div>
                    <div className="flex gap-3">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" className="bg-white border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs w-48 shadow-sm" placeholder="Cari arsip..." />
                        </div>
                        <button className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500"><Filter className="w-4 h-4" /></button>
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
                                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                {notif.year < 2015 ? <Flame className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                            </div>
                                            <div className="grow">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Arsip Nomor: {notif.archive_number}</p>
                                                <h6 className="font-bold text-gray-700">{notif.type}</h6>
                                                <p className="text-[10px] text-amber-600 mt-1">Status: Memasuki masa {notif.status}. Menunggu pemrosesan.</p>
                                            </div>
                                            <button className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-[#223771] hover:text-white transition-all">
                                                Tinjau
                                            </button>
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
                            <button className="w-full bg-[#F4B942] text-[#223771] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-transform">
                                Cetak Rekapitulasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
