import SettingsLayout from '@/layouts/settings/layout';
import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { Info } from 'lucide-react';

export default function Appearance() {
    return (
        <SettingsLayout>
            <div className="max-w-2xl">
                <Head title="Tema Visual" />

                <div className="mb-10">
                    <h2 className="text-xl font-black text-[#223771] tracking-tight flex items-center gap-2">
                        TEMA & TAMPILAN
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Personalisasi antarmuka aplikasi sesuai kenyamanan bekerja Anda</p>
                </div>

                <div className="bg-gray-50/50 p-10 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="mb-8">
                        <p className="text-sm font-bold text-[#223771] mb-2 uppercase tracking-tight">Pilih Mode Tampilan</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase leading-relaxed">
                            Pilih antara mode terang yang bersih, mode gelap untuk mengurangi kelelahan mata, <br /> atau ikuti pengaturan sistem perangkat Anda.
                        </p>
                    </div>
                    
                    <AppearanceTabs className="scale-125 my-4" />
                </div>
                
                <div className="mt-16 flex items-center gap-2 text-gray-300 text-[10px] font-black uppercase">
                    <Info className="size-4" /> Pengaturan ini akan disimpan secara lokal pada browser Anda.
                </div>
            </div>
        </SettingsLayout>
    );
}

Appearance.layout = (page: React.ReactNode) => page;
