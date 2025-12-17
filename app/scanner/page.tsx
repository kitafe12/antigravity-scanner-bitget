import { supabase } from '@/lib/supabaseClient'
import { TraderCard } from '@/components/TraderCard'
import { Database } from '@/types/database.types'
import { Shield, BarChart3, Lock } from 'lucide-react'

type Trader = Database['public']['Tables']['master_traders']['Row']

export const revalidate = 60

export default async function ScannerPage() {
    const { data, error } = await supabase
        .from('master_traders')
        .select('*')
        .order('roi_90d', { ascending: false })

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono">
                <div className="text-center">
                    <p className="text-rose-500 mb-2">System Error</p>
                    <p className="text-slate-500 text-sm">{error.message}</p>
                </div>
            </div>
        )
    }

    const traders = data as Trader[] | null

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Shield className="text-emerald-500" size={18} />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Antigravity</span>
                        <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Beta</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center border-b border-white/5 bg-slate-950">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Bitget Market Scanner
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                        Copy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Winning</span> Strategies.
                        <br />
                        <span className="text-slate-600">Avoid the Noise.</span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        We track and analyze thousands of Bitget accounts in real-time, filtering for <span className="text-slate-200 font-medium">consistent profitability</span> and <span className="text-slate-200 font-medium">low risk</span> so you don't have to.
                    </p>

                    <div className="flex justify-center gap-4 mb-16">
                        <a href="#grid" className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-1">
                            Start Scanning Now
                        </a>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center gap-3 text-slate-300 font-medium">
                            <div className="p-2 rounded bg-slate-800/50 text-emerald-400"><Lock size={16} /></div>
                            <span>Spot Only</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center gap-3 text-slate-300 font-medium">
                            <div className="p-2 rounded bg-slate-800/50 text-emerald-400"><BarChart3 size={16} /></div>
                            <span>Max 15% Drawdown</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center gap-3 text-slate-300 font-medium">
                            <div className="p-2 rounded bg-slate-800/50 text-emerald-400"><Shield size={16} /></div>
                            <span>Verified Safe</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section id="grid" className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Top Performers
                        <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-700">
                            {traders?.length || 0} Found
                        </span>
                    </h2>
                    {/* Add Filter Buttons later */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {traders && traders.length > 0 ? (
                        traders.map((trader) => (
                            <TraderCard key={trader.id} trader={trader} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                            <Shield size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-400 text-lg font-medium">Database is empty.</p>
                            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                                The scanner hasn&apos;t run yet. Please execute the update script to populate the dashboard.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <footer className="py-12 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
                <p className="mb-2">© {new Date().getFullYear()} Antigravity Scanner. Built for safety.</p>
                <p className="opacity-50 text-xs">Trading involves risk. Past performance is not indicative of future results.</p>
            </footer>
        </main>
    )
}
