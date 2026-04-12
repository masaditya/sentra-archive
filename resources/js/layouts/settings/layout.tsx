import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';
import { User, Shield, Palette, Settings as SettingsIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

const sidebarNavItems: (NavItem & { icon: any })[] = [
    {
        title: 'Profil Saya',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan Akun',
        href: editSecurity(),
        icon: Shield,
    },
    {
        title: 'Tema Visual',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AppLayout>
            <div className="p-6 bg-[#F0F4F9] min-h-screen">
                <header className="mb-10">
                    <h1 className="text-2xl font-black text-[#223771] tracking-tight uppercase flex items-center gap-3">
                        <SettingsIcon className="size-7 text-[#F4B942]" /> PENGATURAN SISTEM
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Kelola informasi profil dan konfigurasi keamanan akun Anda</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Internal Settings Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm sticky top-6">
                            <nav className="flex flex-col space-y-2" aria-label="Settings">
                                {sidebarNavItems.map((item, index) => {
                                    const isActive = isCurrentOrParentUrl(item.href);
                                    return (
                                        <Link
                                            key={`${toUrl(item.href)}-${index}`}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                                                isActive 
                                                    ? 'bg-[#223771] text-white shadow-lg shadow-blue-900/10' 
                                                    : 'text-gray-400 hover:bg-gray-50 hover:text-[#223771]'
                                            )}
                                        >
                                            <item.icon className={cn("size-5", isActive ? "text-[#F4B942]" : "text-gray-300")} />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                            
                            <div className="mt-6 pt-6 border-t border-gray-50 px-4 pb-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed italic">
                                    Perubahan data sensitif mungkin memerlukan verifikasi ulang.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm min-h-[500px]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
