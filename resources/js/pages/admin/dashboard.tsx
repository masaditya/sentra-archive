import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Building2, FolderKanban, Archive, Star, Info } from 'lucide-react';
import { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Stats {
    totalArchives: number;
    totalOrganizations: number;
    aktifInaktif: number;
    permanen: number;
}

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Utama', href: '/admin/dashboard' },
];

export default function AdminDashboard({ stats }: Props) {
    // Mock data for years
    const yearlyData = {
        labels: ['2023', '2024', '2025', '2026', '2027'],
        datasets: {
            aktif: [1200, 1800, 2400, 3000, 1500],
            inaktif: [1200, 1500, 1500, 3600, 4500],
            musnah: [600, 1200, 1500, 900, 600],
            permanen: [600, 750, 900, 750, 900]
        }
    };

    const [selectedStats, setSelectedStats] = useState({
        archives: stats.totalArchives,
        orgs: stats.totalOrganizations,
        active: stats.aktifInaktif,
        perm: stats.permanen,
        year: 'Global'
    });

    const chartData = {
        labels: yearlyData.labels,
        datasets: [
            { label: 'Aktif', data: yearlyData.datasets.aktif, backgroundColor: '#4285F4', borderRadius: 4, barPercentage: 0.8, categoryPercentage: 0.8 },
            { label: 'Inaktif', data: yearlyData.datasets.inaktif, backgroundColor: '#8B5CF6', borderRadius: 4, barPercentage: 0.8, categoryPercentage: 0.8 },
            { label: 'Musnah', data: yearlyData.datasets.musnah, backgroundColor: '#F4B942', borderRadius: 4, barPercentage: 0.8, categoryPercentage: 0.8 },
            { label: 'Permanen', data: yearlyData.datasets.permanen, backgroundColor: '#047857', borderRadius: 4, barPercentage: 0.8, categoryPercentage: 0.8 },
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12, weight: 'bold' as any }
                }
            },
            tooltip: {
                padding: 12,
                backgroundColor: '#223771',
                titleFont: { size: 14, weight: 'bold' as any },
                bodyFont: { size: 13 },
                cornerRadius: 12,
            }
        },
        scales: {
            x: {
                stacked: false,
                grid: { display: false },
                ticks: { font: { weight: 'bold' as any } }
            },
            y: {
                stacked: false,
                beginAtZero: true,
                grid: { color: '#F8FAFC' }
            }
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const year = yearlyData.labels[index];
                const totalYear = yearlyData.datasets.aktif[index] + yearlyData.datasets.inaktif[index] + yearlyData.datasets.musnah[index] + yearlyData.datasets.permanen[index];
                
                setSelectedStats({
                    archives: totalYear,
                    orgs: stats.totalOrganizations,
                    active: yearlyData.datasets.aktif[index] + yearlyData.datasets.inaktif[index],
                    perm: yearlyData.datasets.permanen[index],
                    year: year
                });
            } else {
                setSelectedStats({
                    archives: stats.totalArchives,
                    orgs: stats.totalOrganizations,
                    active: stats.aktifInaktif,
                    perm: stats.permanen,
                    year: 'Global'
                });
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />

            <div className="p-6 bg-[#F0F4F9] min-h-screen">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black text-[#223771] tracking-tight">
                            OVERVIEW STATISTIK <span className="text-[#F4B942] uppercase text-sm ml-2 tracking-widest">{selectedStats.year}</span>
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sistem Notifikasi Retensi Arsip</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer group">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase font-black text-gray-400 mb-1 group-hover:text-blue-500 transition-colors">Arsip Pemkab</p>
                                <p className="text-3xl font-black text-[#223771]">{selectedStats.archives.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#4285F4] to-[#2A65D1] p-6 rounded-3xl shadow-xl text-white shadow-blue-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase font-black opacity-60 mb-1">Total OPD</p>
                                <p className="text-3xl font-black">{selectedStats.orgs}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Building2 className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#8B5CF6] to-[#6D28D9] p-6 rounded-3xl shadow-xl text-white shadow-purple-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase font-black opacity-60 mb-1">Aktif & Inaktif</p>
                                <p className="text-3xl font-black">{selectedStats.active.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Archive className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#10B981] to-[#047857] p-6 rounded-3xl shadow-xl text-white shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group text-right">
                        <div className="flex justify-between items-center flex-row-reverse">
                            <div>
                                <p className="text-[10px] uppercase font-black opacity-60 mb-1">Permanen</p>
                                <p className="text-3xl font-black">{selectedStats.perm.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-[144deg] transition-all duration-700">
                                <Star className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h5 className="text-xl font-black text-[#223771]">DISTRIBUSI STATISTIK TAHUNAN</h5>
                            <p className="text-gray-400 text-xs font-bold leading-none mt-1">Data akumulasi seluruh OPD dilingkungan Pemerintah Kabupaten Bojonegoro</p>
                        </div>
                        <div className="flex gap-4">
                            {['Aktif', 'Inaktif', 'Musnah', 'Permanen'].map((label, i) => (
                                <div key={label} className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${['bg-[#4285F4]', 'bg-[#8B5CF6]', 'bg-[#F4B942]', 'bg-[#047857]'][i]}`}></span>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="h-[400px]">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center gap-3 text-gray-400 text-xs font-bold">
                        <Info className="w-5 h-5 text-blue-400" />
                        KLIK BATANG GRAFIK UNTUK MEMFILTER DETAIL METRIK DI ATAS BERDASARKAN TAHUN YANG DIPILIH.
                        {selectedStats.year !== 'Global' && (
                            <button 
                                onClick={() => setSelectedStats({
                                    archives: stats.totalArchives,
                                    orgs: stats.totalOrganizations,
                                    active: stats.aktifInaktif,
                                    perm: stats.permanen,
                                    year: 'Global'
                                })}
                                className="ml-auto text-blue-500 hover:underline"
                            >
                                Reset ke Global
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
