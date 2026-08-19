import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-slate-950 active:scale-[0.98]',
    {
        variants: {
            variant: {
                default: 'bg-primary-600 text-white hover:bg-primary-500 shadow-sm shadow-black/20 border border-primary-500/50',
                destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-black/20 border border-red-500/50',
                outline: 'border border-slate-700 bg-transparent hover:bg-slate-800 hover:text-slate-100 text-slate-300',
                secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50',
                ghost: 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-300',
                link: 'underline-offset-4 hover:underline text-primary-500',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
