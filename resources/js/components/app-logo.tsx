import { Layers } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#F4B942] rounded-xl flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-[#223771]" />
            </div>
            <div className="text-left">
                <div className="font-black text-lg text-white leading-none tracking-tight uppercase">SENTRA</div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1">Retensi Arsip</div>
            </div>
        </div>
    );
}
