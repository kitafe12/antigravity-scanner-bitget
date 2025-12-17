import { NextResponse } from 'next/server'
import { fetchTopTraders } from '@/lib/bitget'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Prevent caching for Cron jobs
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // 1. FORCE CLEANUP (User Request)
        await supabaseAdmin.from('master_traders').delete().neq('exchange_uid', '0')

        // 2. Fetch Verified Bots (Static List)
        const allTraders = await fetchTopTraders()

        if (!allTraders || allTraders.length === 0) {
            return NextResponse.json({ error: 'No data returned.' }, { status: 500 })
        }

        // 3. Upsert to Supabase
        const { data, error } = await supabaseAdmin
            .from('master_traders')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .upsert(allTraders as any, { onConflict: 'exchange_name,exchange_uid' })
            .select()

        if (error) {
            console.error('Upsert Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Updated ${allTraders.length} Verified Bots.`,
            traders: allTraders.map(t => t.nickname)
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
