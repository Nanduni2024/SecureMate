import { type HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from './badge-variants';
import { cn } from '../../lib/utils';


export type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { };
