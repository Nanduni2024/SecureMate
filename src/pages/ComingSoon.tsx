import { Shield } from 'lucide-react';

export function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="bg-slate-900 p-6 rounded-full">
                <Shield className="h-16 w-16 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-200">Coming Soon</h2>
            <p className="text-slate-500 max-w-md">
                This feature is currently under development. Stay tuned for updates in the next release of SecureMate.
            </p>
        </div>
    );
}
