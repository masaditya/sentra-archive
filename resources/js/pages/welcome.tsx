import { Head, Link } from '@inertiajs/react';
import { Layers, FileSignature, QrCode, Clock } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#F0F4F9] font-poppins selection:bg-[#F4B942] selection:text-[#223771]">
            <Head title="SENTRA - Sistem Notifikasi Retensi Arsip" />

            {/* Navbar */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/90 backdrop-blur-md px-10 py-4 rounded-full shadow-2xl shadow-blue-900/10 flex items-center gap-8 border border-white/50">
                    <Link href="/" className="text-[#223771] font-black text-sm uppercase tracking-widest hover:text-[#F4B942] transition-colors">Beranda</Link>
                    <Link href="/login" className="text-[#223771] font-black text-sm uppercase tracking-widest hover:text-[#F4B942] transition-colors border-l-2 border-gray-100 pl-8">Login Dashboard</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-linear-to-br from-[#223771] to-[#1A295A] flex items-center overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/10 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-12 md:px-24">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-3/5 text-white">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-[#F4B942]/20 rounded-lg">
                                    <Layers className="w-6 h-6 text-[#F4B942]" />
                                </div>
                                <span className="text-[#F4B942] font-black tracking-widest text-sm uppercase">SENTRA V1.0</span>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
                                Kelola Arsip <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F4B942] to-amber-200">Tanpa Batas</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-xl mb-12 leading-relaxed font-medium">
                                Sistem Notifikasi Retensi Arsip Pemerintah Kabupaten Bojonegoro. Modern, Cepat, dan Terautomasi untuk efisiensi birokrasi masa depan.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link 
                                    href="/login" 
                                    className="w-full sm:w-auto bg-[#F4B942] text-[#223771] px-12 py-5 rounded-full font-black text-xl shadow-2xl shadow-amber-500/20 hover:scale-105 hover:bg-white active:scale-95 transition-all text-center"
                                >
                                    Login Dashboard
                                </Link>
                                <div className="flex items-center gap-4 text-white/40 group">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-black tracking-widest">Waktu Sekarang</p>
                                        <p className="text-sm font-bold text-white/80">{new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/5 relative group">
                            <div className="absolute inset-0 bg-blue-400 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            {/* Hero Image Container */}
                            <div className="relative rounded-[40px] overflow-hidden border-8 border-white/5 shadow-2xl shadow-black/50 rotate-3 transform group-hover:rotate-0 transition-transform duration-700">
                                <img 
                                    src="/archive_system_hero_1775974826584.png" 
                                    alt="SENTRA Hero" 
                                    className="w-full h-auto object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#223771]/80 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-4xl font-black mb-1">SENTRA</p>
                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Archive Management Elite</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
