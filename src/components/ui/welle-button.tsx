import React from 'react';
import { cn } from '@/lib/utils';

interface WelleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'solid' | 'outline-accent' | 'white';
    accentColor?: string;
}

export function WelleButton({
    variant = 'solid',
    accentColor,
    className,
    style,
    children,
    ...props
}: WelleButtonProps) {
    const accentStyle =
        variant === 'outline-accent' && accentColor
            ? { '--accent': accentColor, borderColor: accentColor, ...style } as React.CSSProperties
            : variant === 'solid' && accentColor
                ? { backgroundColor: accentColor, ...style }
                : style;


    return (
        <button
            className={cn(
                'text-sm uppercase tracking-widest transition-transform duration-200 cursor-pointer',
                variant === 'solid' &&
                'font-black px-10 py-3.5 rounded-xl text-black hover:scale-105 active:scale-95',
                variant === 'white' &&
                'font-black px-10 py-3.5 rounded-xl bg-white text-black hover:scale-105 active:scale-95',
                variant === 'outline-accent' &&
                'flex-1 text-center py-2.5 rounded-lg border text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black hover:scale-105 active:scale-95',
                className
            )}
            style={accentStyle}
            {...props}
        >
            {children}
        </button>
    );
}
