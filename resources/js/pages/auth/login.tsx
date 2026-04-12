import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Loader2, Layers } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in - SENTRA" />

            <div className="bg-white rounded-[20px] p-10 w-full max-w-[450px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-[#F4B942]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Layers className="size-10 text-[#F4B942]" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#223771] tracking-tight">SENTRA</h2>
                    <p className="text-gray-500 text-sm font-medium mt-1">Login Pengguna / OPD</p>
                </div>

                {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    <div className="text-left">
                        <label className="block text-sm font-semibold text-gray-500 mb-2 ml-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            autoFocus
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] py-3 px-4 text-sm font-medium text-[#223771] focus:ring-2 focus:ring-[#F4B942]/20 focus:border-[#F4B942] transition-all outline-none"
                            placeholder="Masukkan Username"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        {errors.username && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.username}</p>}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-semibold text-gray-500 mb-2 ml-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] py-3 px-4 text-sm font-medium text-[#223771] focus:ring-2 focus:ring-[#F4B942]/20 focus:border-[#F4B942] transition-all outline-none"
                            placeholder="Masukkan Password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center gap-2 mb-4 ml-1">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#F4B942] focus:ring-[#F4B942]"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-xs text-gray-500 font-medium">Ingat saya</span>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#F4B942] text-white py-3 rounded-[10px] font-bold text-base shadow-lg shadow-amber-500/20 hover:bg-[#e5a930] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {processing ? <Loader2 className="size-5 animate-spin" /> : 'Login Dashboard'}
                    </button>
                    
                    <div className="pt-4">
                        <a href="/" className="text-gray-400 text-xs font-bold hover:text-[#223771] transition-colors">
                            Kembali ke Beranda
                        </a>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
