import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LayoutDashboard, Shield, FileText, Settings, BookOpen, X } from 'lucide-react';
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
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 md:relative md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
                <div className="flex items-center">
                    <img src={Logo} alt="SecureMate Logo" className="h-8 w-8 mr-2" />
                    <span className="text-xl font-bold text-white tracking-tight">SecureMate</span>
                </div>
                <button
                    className="p-1 text-slate-400 hover:text-white md:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="flex flex-col gap-y-1 p-4 flex-1 overflow-y-auto">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary-600/10 text-primary-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </NavLink>
                ))}
            </div>
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-x-3 px-3 py-2 text-sm text-slate-400 italic">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <span>Secure Environment</span>
                </div>
            </div>
        </aside>
    );
}
