
import { supabase } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { TraderAvatar } from '@/components/TraderAvatar'
import { ProfitCalculator } from '@/components/ProfitCalculator'
import { ShieldCheck, Activity, ArrowUpRight, Bell } from 'lucide-react'
import { notFound } from 'next/navigation'

import { Metadata } from 'next'

// ... imports remain the same

type Trader = Database['public']['Tables']['master_traders']['Row']

export const revalidate = 60 // ISR: Revalidate every 60s

interface Props {
    params: Promise<{ uid: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { uid } = await params

    const { data } = await supabase
        .from('master_traders')
        .select('*')
        .eq('exchange_uid', uid)
        .single()

    if (!data) {
        return {
            title: 'Trader Not Found | Antigravity',
        }
    }

    const trader = data as Trader
    const roi = (trader.roi_90d || 0) * 100
    const drawdown = (trader.max_drawdown || 0) * 100

    return {
        title: `${trader.nickname} - Is this Trader Safe? | Spot Copy Trading Review`,
        description: `Analyze ${trader.nickname}'s performance: ${roi.toFixed(0)}% ROI and ${drawdown.toFixed(1)}% Drawdown. Use our profit calculator to see potential gains. Verified Spot Trading stats.`,
        openGraph: {
            title: `${trader.nickname} - Copy Trading Review`,
            description: `Is ${trader.nickname} safe to copy? View 90-day performance and risk analysis.`,
            images: [
                {
                    url: trader.avatar_url || '',
                    width: 400,
                    height: 400,
                    alt: trader.nickname || 'Trader',
                }
            ],
        },
        twitter: {
            card: 'summary',
            title: `${trader.nickname} - Review`,
            description: `See ${trader.nickname}'s PnL and Win Rate on Antigravity.`,
            images: [trader.avatar_url || ''],
        }
    }
}

export default async function TraderPage({ params }: Props) {
    const { uid } = await params

    // 1. Fetch Trader Data
    const { data, error } = await supabase
        .from('master_traders')
        .select('*')
        .eq('exchange_uid', uid)
        .single()

    if (error || !data) {
        return notFound()
    }

    const trader = data as Trader
    const roi = (trader.roi_90d || 0) * 100
    const drawdown = (trader.max_drawdown || 0) * 100
    const winRate = (trader.win_rate || 0) * 100

    const affiliateId = 'YOUR_ID_HERE'
    const copyLink = `https://www.bitget.com/`

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 relative pb-32">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Header */}
            <header className="relative pt-20 pb-10 px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    {/* Avatar */}
                    <div className="relative w-32 h-32 rounded-full border-4 border-slate-900 shadow-2xl overflow-hidden shrink-0">
                        <TraderAvatar
                            src={trader.avatar_url}
                            nickname={trader.nickname || 'Trader'}
                            className="w-full h-full"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <ShieldCheck size={12} /> Verified Spot Trader
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">{trader.nickname}</h1>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto md:mx-0">
                            Professional Bitget trader tracked by Antigravity. Consistent performance with a focus on risk management.
                        </p>
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">

                {/* 1. The "Why This Trader" Logic Box (Procedural Generation) */}
                <section className="mb-12 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-emerald-500" size={20} />
                        Why this trader?
                    </h2>
                    <ul className="space-y-3">
                        {/* Dynamic Insight 1: Safety */}
                        {drawdown < 5 ? (
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="text-xl">🛡️</span>
                                <span><strong className="text-slate-100">Ultra-Conservative Strategy.</strong> Rarely loses capital (Max Drawdown {drawdown.toFixed(1)}%).</span>
                            </li>
                        ) : (
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="text-xl">⚖️</span>
                                <span><strong className="text-slate-100">Balanced Risk.</strong> Accepts moderate volatility for growth.</span>
                            </li>
                        )}

                        {/* Dynamic Insight 2: Growth */}
                        {roi > 50 ? (
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="text-xl">🚀</span>
                                <span><strong className="text-slate-100">High Growth Potential.</strong> Best for aggressive compounding (+{roi.toFixed(0)}% ROI).</span>
                            </li>
                        ) : (
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="text-xl">📈</span>
                                <span><strong className="text-slate-100">Steady Accumulation.</strong> Focuses on consistent, sustainable gains.</span>
                            </li>
                        )}

                        {/* Dynamic Insight 3: Type */}
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="text-xl">✅</span>
                            <span><strong className="text-slate-100">Verified Spot Trading.</strong> No liquidation risk. You own the assets.</span>
                        </li>
                    </ul>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 2. Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 h-fit">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Total ROI</p>
                            <p className="text-2xl font-bold text-emerald-400">+{roi.toFixed(0)}%</p>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Win Rate</p>
                            <p className="text-2xl font-bold text-white">{winRate.toFixed(0)}%</p>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Drawdown</p>
                            <p className="text-2xl font-bold text-slate-200">{drawdown.toFixed(1)}%</p>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Asset Type</p>
                            <p className="text-xl font-bold text-blue-400">SPOT</p>
                        </div>
                    </div>

                    {/* 3. Profit Calculator Component */}
                    <ProfitCalculator roi={roi} />
                </div>

            </div>

            {/* Sticky Bottom Bar for Conversion */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 md:p-6 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-white">Ready to copy?</p>
                        <p className="text-xs text-slate-500">Sync with this trader on Bitget instantly.</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 w-full md:w-auto">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                <Bell size={16} /> <span className="hidden sm:inline">Get Alerts</span>
                            </button>
                            <a
                                href={copyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                            >
                                Copy {trader.nickname} <ArrowUpRight size={18} />
                            </a>
                        </div>
                        <p className="text-[10px] text-emerald-500/80 font-medium hidden md:block">
                            Official Bitget Partner Link
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
