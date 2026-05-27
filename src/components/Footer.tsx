import Image from 'next/image';
import Link from 'next/link';
import { libraries } from '@/data/products';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-zinc-950">

            {/* Mobile */}
            <div className="md:hidden px-6 py-12 flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Image src="/logo-welle.png" alt="Welle" width={56} height={56} />
                    <p className="text-zinc-400 text-sm font-light">welle — Make your creativity heard.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Follow us</p>
                    <a href="https://tiktok.com/@welle" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">TikTok</a>
                    <a href="https://instagram.com/welle" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Instagram</a>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Support</p>
                    <a href="mailto:wellesupport@gmail.com" className="text-zinc-400 hover:text-white transition-colors text-sm">wellesupport@gmail.com</a>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Libraries</p>
                    {libraries.map((lib) => (
                        <Link key={lib.id} href={`/library/${lib.slug}`} className="text-zinc-400 hover:text-white transition-colors text-sm">
                            {lib.name}
                        </Link>
                    ))}
                </div>

                <p className="text-zinc-600 text-xs">© {new Date().getFullYear()} Welle. All rights reserved.</p>
            </div>

            {/* Desktop */}
            <div className="hidden md:grid max-w-7xl mx-auto px-6 py-16 grid-cols-3 gap-8">
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Follow us</p>
                    <div className="flex flex-col gap-2">
                        <a href="https://tiktok.com/@welle" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">TikTok</a>
                        <a href="https://instagram.com/welle" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Instagram</a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <Image src="/logo-welle.png" alt="Welle" width={48} height={48} />
                    <p className="text-zinc-400 text-sm font-light">Welle — Make your creativity heard.</p>
                    <p className="text-zinc-600 text-xs mt-4">© {new Date().getFullYear()} Welle. All rights reserved.</p>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Libraries</p>
                        {libraries.map((lib) => (
                            <Link key={lib.id} href={`/library/${lib.slug}`} className="text-zinc-400 hover:text-white transition-colors text-sm">
                                {lib.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Support</p>
                        <a href="mailto:wellesupport@gmail.com" className="text-zinc-400 hover:text-white transition-colors text-sm">wellesupport@gmail.com</a>
                    </div>
                </div>
            </div>

        </footer>
    );
}
