'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function NavHeader() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textOpacity = Math.max(0, 1 - scrollY / 80);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-between px-12 py-4">
            <Image src="/logo-welle.png" alt="Welle" width={42} height={42} priority />
            <p
                className="text-zinc-400 text-xl font-light tracking-wide transition-opacity duration-75"
                style={{ opacity: textOpacity }}
            >
                Make your creativity heard.
            </p>
        </header>
    );
}
