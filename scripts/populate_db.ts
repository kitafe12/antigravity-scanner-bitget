
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { fetchTopTraders } from '../lib/bitget'

// Load environment variables manually
dotenv.config({ path: resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing environment variables!')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
    console.log('Starting manual update with REAL DATA...')

    // Fetch from Bitget (via lib/bitget)
    const tradersToUpsert = await fetchTopTraders()

    console.log(`Fetched ${tradersToUpsert.length} market items.`)

    if (tradersToUpsert.length === 0) {
        console.warn('No traders returned. Check API Keys.')
        return
    }

    // Upsert
    const { data, error } = await supabase
        .from('master_traders')
        .upsert(tradersToUpsert, { onConflict: 'exchange_name,exchange_uid' })
        .select()

    if (error) {
        console.error('Error upserting to DB:', error)
    } else {
        console.log('Success! Upserted:', data.length, 'traders.')
        console.log('Example:', data[0]?.nickname)
    }
}

run()
