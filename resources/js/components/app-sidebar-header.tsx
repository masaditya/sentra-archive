import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppSidebarHeader() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const formattedDate = currentTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 transition-all duration-300">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-gray-400 hover:text-[#223771] transition-colors" />
                <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
                <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status Sistem</span>
                    <span className="text-xs font-bold text-green-500 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Clock Section */}
                <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                    <Clock className="w-4 h-4 text-[#223771]" />
                    <div className="flex flex-col text-right">
                        <span className="text-[14px] font-black text-[#223771] leading-none tabular-nums">{formattedTime}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">{formattedDate}</span>
                    </div>
                </div>

                {/* Notification Bell */}
                <button className="relative p-3 bg-blue-50 text-[#223771] rounded-2xl hover:bg-[#F4B942] hover:scale-110 active:scale-95 transition-all shadow-sm">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
