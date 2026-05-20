import Link from 'next/link';
import { libraries } from '@/data/products';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Follow us</p>
                    <div className="flex flex-col gap-2">
                        <a
                            href="https://tiktok.com/@welle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            TikTok
                        </a>
                        <a
                            href="https://instagram.com/welle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            Instagram
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-2xl font-bold tracking-tight text-white">Welle</span>
                    <p className="text-zinc-500 text-sm font-light">Make your creativity heard.</p>
                    <p className="text-zinc-600 text-xs mt-4">© {new Date().getFullYear()} Welle. All rights reserved.</p>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Libraries</p>
                    <div className="flex flex-col items-end gap-2">
                        {libraries.map((lib) => (
                            <Link
                                key={lib.id}
                                href={`/library/${lib.slug}`}
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                {lib.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
