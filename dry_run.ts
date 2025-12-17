
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Mock Data from lib/bitget.ts
const MOCK_TRADERS = [
    {
        exchange_name: 'BITGET',
        exchange_uid: 'USER_101',
        nickname: 'AlphaSeeker',
        roi_90d: 0.85,
        max_drawdown: 0.08,
        trading_type: 'SPOT',
        last_updated: new Date().toISOString(),
    }
]

// Load env
const envPath = path.resolve(process.cwd(), '.env.local')
const envConfig = dotenv.parse(fs.readFileSync(envPath))
const supabaseUrl = envConfig['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = envConfig['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing credentials')

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function dryRun() {
    console.log('--- START DRY RUN ---')

    // Simulate core logic
    const validTraders = MOCK_TRADERS // Skip filter simulation, just test the upsert
    console.log('Upserting traders:', validTraders.length)

    const { data, error } = await supabaseAdmin
        .from('master_traders')
        .upsert(validTraders, {
            onConflict: 'exchange_name,exchange_uid'
        })
        .select()

    if (error) {
        console.error('CRASHED:', error)
    } else {
        console.log('SUCCESS:', data)
    }
}

dryRun().catch(e => console.error('HArd CRASH:', e))
