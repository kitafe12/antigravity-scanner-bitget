import { Database } from '@/types/database.types'
import { ExternalLink, ShieldCheck, TrendingUp, AlertTriangle, Medal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TraderAvatar } from './TraderAvatar'

type Trader = Database['public']['Tables']['master_traders']['Row']

interface TraderCardProps {
    trader: Trader
}

export function TraderCard({ trader }: TraderCardProps) {
    const drawdownPercent = (trader.max_drawdown || 0) * 100
    const roiPercent = (trader.roi_90d || 0) * 100
    const winRate = (trader.win_rate || 0) * 100
    const safetyScore = Math.max(0, 10 - (drawdownPercent / 2))

    const affiliateId = 'YOUR_ID_HERE'
    const copyLink = `https://www.bitget.com/`

    const isHighSafety = safetyScore >= 9
    const isHighGrowth = roiPercent > 50

    // Progress Ring Calculation
    const radius = 18
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (safetyScore / 10) * circumference
    const scoreColor = isHighSafety ? '#34d399' : '#fbbf24' // Emerald 400 vs Amber 400

    return (
        <div className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 active:scale-[0.99]">

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none" />

            {/* Header: Avatar & Name */}
            <div className="flex items-start justify-between relative z-10 mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                            <TraderAvatar
                                src={trader.avatar_url}
                                nickname={trader.nickname || 'Trader'}
                                className="w-full h-full"
                            />
                        </div>
                        {isHighSafety && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full border border-slate-900">
                                <Medal size={10} fill="currentColor" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                            {trader.nickname}
                            <ShieldCheck size={14} className="text-emerald-500" />
                        </h3>
                        <div className="flex gap-2 text-[10px] font-medium mt-0.5">
                            <span className="text-slate-400 bg-slate-800 text-[10px] px-1.5 py-0.5 rounded">SPOT</span>
                            {trader.roi_90d && trader.roi_90d > 0.5 && (
                                <span className="text-blue-400 bg-blue-500/10 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/20">GROWTH</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Safety Score Ring */}
                <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-12 h-12">
                            <circle
                                className="text-slate-800"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="24"
                                cy="24"
                            />
                            <circle
                                style={{ stroke: scoreColor, transition: 'stroke-dashoffset 1s ease-in-out' }}
                                strokeWidth="3"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx="24"
                                cy="24"
                            />
                        </svg>
                        <span className={cn("absolute text-xs font-bold", isHighSafety ? "text-emerald-400" : "text-amber-400")}>
                            {safetyScore.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold mt-1">Safety</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">90d ROI</p>
                    <p className="text-2xl font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                        <span className="text-sm self-end mb-1 opacity-50">+</span>{roiPercent.toFixed(0)}<span className="text-sm self-end mb-1 opacity-50">%</span>
                    </p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Drawdown</p>
                    <p className={cn("text-2xl font-extrabold", drawdownPercent > 10 ? "text-rose-400" : "text-slate-200")}>
                        {drawdownPercent.toFixed(1)}<span className="text-sm opacity-50">%</span>
                    </p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Win Rate</p>
                    <p className="text-2xl font-extrabold text-white">
                        {winRate.toFixed(0)}<span className="text-sm opacity-50">%</span>
                    </p>
                </div>
            </div>

            {/* Action */}
            <Link
                href={`/trader/${trader.exchange_uid}`}
                className="relative z-10 block w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl text-center transition-all duration-300 border border-slate-700 hover:border-emerald-500/50 group-hover:text-emerald-400"
            >
                View Analytics
            </Link>
        </div>
    )
}
