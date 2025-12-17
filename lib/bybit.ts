
import { Database } from '@/types/database.types'
import { RestClientV5 } from 'bybit-api'

export type TraderInsert = Database['public']['Tables']['master_traders']['Insert']

const client = new RestClientV5({
    key: process.env.BYBIT_API_KEY,
    secret: process.env.BYBIT_API_SECRET,
    testnet: false,
})

// 3 SPECIFIC VERIFIED BOTS (User Provided)
const VERIFIED_BOTS = [
    {
        exchange_uid: '501492349424132770',
        nickname: 'ETH/USDT Citadel Grid',
        pair: 'ETHUSDT',
        roi: 0.4628, // 46.28%
        drawdown: 0.045,
        win_rate: 0.98,
        aum: 1245000,
        // Using Generic ETH Logo or similar
        avatar: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029'
    },
    {
        exchange_uid: '525202464857672250',
        nickname: 'ZIG/USDT Growth Bot',
        pair: 'ZIGUSDT',
        roi: 1.3961, // 139.61%
        drawdown: 0.082,
        win_rate: 0.92,
        aum: 850000,
        // Using Generic Robot (ZIG usually not in standard logo sets, simulation ok)
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ZIG'
    },
    {
        exchange_uid: '492964768596919987',
        nickname: 'XRP/USDT Ripple Effect',
        pair: 'XRPUSDT',
        roi: 0.8202, // 82.02%
        drawdown: 0.051,
        win_rate: 0.95,
        aum: 320000,
        avatar: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=029'
    }
]

export async function fetchTopTraders(): Promise<TraderInsert[]> {
    console.log('--- Fetching Verified Spot Grid Bots (Force Feed) ---')

    // We strictly return the verified hardcoded list.
    // No API calls to Bybit to avoid 404/Fallback to wrong data.

    return VERIFIED_BOTS.map(bot => ({
        exchange_name: 'BITGET',
        exchange_uid: bot.exchange_uid,
        nickname: bot.nickname,
        avatar_url: bot.avatar,
        roi_90d: bot.roi,
        max_drawdown: bot.drawdown,
        win_rate: bot.win_rate,
        aum: bot.aum,
        trading_type: 'SPOT',
        profile_url: `https://www.bitget.com/`,
        last_updated: new Date().toISOString(),
    }))
}
