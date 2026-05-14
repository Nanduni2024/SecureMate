import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
        variants: {
            variant: {
                default: 'bg-primary-600 text-white hover:bg-primary-700',
                destructive: 'bg-red-500 text-white hover:bg-red-600',
                outline: 'border border-slate-700 hover:bg-slate-800 text-slate-200',
                secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-800',
                ghost: 'hover:bg-slate-800 text-slate-200',
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
