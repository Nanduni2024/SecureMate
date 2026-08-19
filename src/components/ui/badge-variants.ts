import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary-600 text-white hover:bg-primary-700",
                secondary:
                    "border-transparent bg-slate-700 text-slate-100 hover:bg-slate-700/80",
                destructive:
                    "border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/60",
                outline: "text-slate-100",
                safe: "border-transparent bg-emerald-900/50 text-emerald-200 hover:bg-emerald-900/60",
                warning: "border-transparent bg-amber-900/50 text-amber-200 hover:bg-amber-900/60",
                dangerous: "border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/60",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
