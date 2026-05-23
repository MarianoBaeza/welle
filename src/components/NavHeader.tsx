'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WelleButton } from './ui/welle-button';

interface CtaProps {
    label: string;
    onAction: () => void;
    loading?: boolean;
    accentColor?: string;
}

interface Props {
    cta?: CtaProps;
}

export function NavHeader({ cta }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY < 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-between px-6 md:px-12 py-4 transition-[background-color,backdrop-filter] duration-300 ${
                !visible ? 'backdrop-blur-md bg-black/30' : ''
            }`}
        >
            <Link href="/">
                <Image src="/logo-welle.png" alt="Welle" width={42} height={42} priority />
            </Link>
            {cta ? (
                <WelleButton
                    variant="outline-accent"
                    accentColor={cta.accentColor ?? '#ffffff'}
                    onClick={cta.onAction}
                    disabled={cta.loading}
                    className="flex-none"
                >
                    {cta.label}
                </WelleButton>
            ) : (
                <p
                    className="text-zinc-400 text-sm md:text-xl font-light tracking-wide whitespace-nowrap"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                        transition: visible ? 'opacity 200ms, transform 200ms' : 'none',
                        pointerEvents: visible ? 'auto' : 'none',
                    }}
                >
                    Make your creativity heard.
                </p>
            )}
        </header>
    );
}
