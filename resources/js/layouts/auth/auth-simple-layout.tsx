import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-[#223771] p-6">
            {children}
        </div>
    );
}
