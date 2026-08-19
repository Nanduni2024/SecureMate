import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { ChatWidget } from '../components/chat/ChatWidget';
import { Onboarding } from '../components/Onboarding';

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();

    return (
        <div className={cn(
            "flex min-h-screen font-sans selection:bg-primary-500/30 transition-colors duration-300",
            theme === 'dark' ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
        )}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex flex-1 flex-col min-w-0">
                <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
                <footer className="border-t border-slate-800 p-6 text-center text-sm text-slate-500">
                    &copy; 2025 SecureMate. All rights reserved.
                </footer>
            </div>

            {/* AI Chatbot Widget */}
            <ChatWidget />

            {/* Onboarding for new users */}
            <Onboarding />
        </div>
    );
}
