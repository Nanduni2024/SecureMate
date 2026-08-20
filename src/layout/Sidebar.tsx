import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LayoutDashboard, Shield, FileText, Settings, BookOpen, X, LockKeyhole, Circle } from 'lucide-react';
import Logo from '../assets/Logo.png';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cyber Vault', href: '/vault', icon: Shield },
    { name: 'Awareness Learning', href: '/learning', icon: BookOpen },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#09171b] transition-transform duration-300 md:relative md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center">
                    <img src={Logo} alt="SecureMate Logo" className="h-8 w-8 mr-2" />
                    <div><span className="text-lg font-bold text-white tracking-tight">SecureMate</span><span className="block text-[10px] uppercase tracking-[0.22em] text-teal-400/80">Personal defense</span></div>
                </div>
                <button
                    className="p-1 text-slate-400 hover:text-white md:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="flex flex-col gap-y-1 p-4 flex-1 overflow-y-auto">
                <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-teal-400/10 text-teal-300 shadow-[inset_3px_0_0_#2dd4bf]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </NavLink>
                ))}
            </div>
            <div className="p-4 border-t border-white/10">
                <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-3">
                    <div className="flex items-center gap-x-2 text-xs font-semibold text-teal-300"><LockKeyhole className="h-4 w-4" />Secure environment</div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500"><Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />All systems operational</div>
                </div>
            </div>
        </aside>
    );
}
