import SettingsLayout from '@/layouts/settings/layout';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, Info, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <SettingsLayout>
            <div className="max-w-2xl">
                <Head title="Keamanan Akun" />

                {/* Password Update Section */}
                <div className="mb-16">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-[#223771] tracking-tight flex items-center gap-2 uppercase">
                            GANTI PASSWORD
                        </h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Gunakan kombinasi password yang kuat untuk mengamankan akses sistem</p>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3" htmlFor="current_password">Password Saat Ini</label>
                                    <input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <InputError message={errors.current_password} className="mt-2 text-[10px] font-black italic" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3" htmlFor="password">Password Baru</label>
                                        <input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all"
                                            placeholder="Min. 8 karakter"
                                            autoComplete="new-password"
                                        />
                                        <InputError message={errors.password} className="mt-2 text-[10px] font-black italic" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3" htmlFor="password_confirmation">Konfirmasi Baru</label>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#223771] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all"
                                            placeholder="Ketik ulang password"
                                            autoComplete="new-password"
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-2 text-[10px] font-black italic" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#223771] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-900/20 text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Lock className="size-4" /> {processing ? 'Memproses...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>

                {/* 2FA Section */}
                {canManageTwoFactor && (
                    <div className="pt-16 border-t border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-[#223771] tracking-tight flex items-center gap-2 uppercase">
                                OTENTIKASI 2 FAKTOR (2FA)
                            </h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Tambahkan lapisan keamanan ekstra dengan kode verifikasi dari perangkat seluler</p>
                        </div>

                        <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50">
                            {twoFactorEnabled ? (
                                <div className="space-y-6">
                                    <p className="text-sm font-bold text-[#223771] leading-relaxed">
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] uppercase mr-2 tracking-tighter">Status: Aktif</span>
                                        2FA sedang AKTIF pada akun Anda. Gunakan aplikasi Google Authenticator atau sejenisnya.
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-red-500 text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                                                >
                                                    Nonaktifkan 2FA
                                                </button>
                                            )}
                                        </Form>

                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-sm font-bold text-[#223771]/60 leading-relaxed italic">
                                        Sangat disarankan untuk mengaktifkan 2FA demi mencegah akses yang tidak sah ke dokumen rahasia instansi Anda.
                                    </p>

                                    <div>
                                        {hasSetupData ? (
                                            <button
                                                onClick={() => setShowSetupModal(true)}
                                                className="bg-[#223771] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 text-xs tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <ShieldCheck className="size-5 text-[#F4B942]" /> Lanjutkan Setup 2FA
                                            </button>
                                        ) : (
                                            <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                                {({ processing }) => (
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-[#223771] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 text-xs tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                                                    >
                                                        <ShieldCheck className="size-5 text-[#F4B942]" /> Aktifkan Verifikasi 2FA
                                                    </button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </div>
                )}
                
                <div className="mt-10 flex items-center gap-2 text-gray-300 text-[10px] font-black uppercase">
                    <Info className="size-4" /> Gunakan password yang unik dan simpan kode recovery 2FA di tempat yang aman.
                </div>
            </div>
        </SettingsLayout>
    );
}

Security.layout = (page: React.ReactNode) => page;
