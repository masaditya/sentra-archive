import { Link } from '@inertiajs/react';

interface LinkProp {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Pagination({ links }: { links: LinkProp[] }) {
    if (links.length === 3) return null; // Only prev, 1, next labels

    return (
        <div className="flex flex-wrap items-center gap-1 p-6 bg-gray-50/50 border-t border-gray-100">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-xs font-bold text-gray-300 bg-white border border-gray-100 rounded-xl cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            link.active 
                                ? 'bg-[#223771] text-white border-[#223771] shadow-lg shadow-blue-900/10' 
                                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-[#223771]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
