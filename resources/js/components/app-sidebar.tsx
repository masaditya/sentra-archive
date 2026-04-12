import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Bell, Upload, Building2, Layers } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, Auth } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<Auth>().props;
    const role = auth.user.role;

    const mainNavItems: NavItem[] = role === 'admin' ? [
        {
            title: 'Dashboard Utama',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kelola OPD',
            href: '/admin/organizations',
            icon: Building2,
        },
        {
            title: 'Notifikasi Global',
            href: '/admin/notifications',
            icon: Bell,
        },
    ] : [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Notifikasi',
            href: '/notifications',
            icon: Bell,
        },
        {
            title: 'Upload Data',
            href: '/upload',
            icon: Upload,
        },
    ];

    return (
        <Sidebar collapsible="icon" className="bg-[#223771] border-none">
            <SidebarHeader className="bg-[#223771] p-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href={role === 'admin' ? '/admin/dashboard' : '/dashboard'} prefetch className="group-data-[collapsible=icon]:hidden">
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#223771] px-2 pt-6">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[#223771] p-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
