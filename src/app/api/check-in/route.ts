import { createClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { customerId } = await req.json()

    if (!customerId) {
        return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }

    // 1. First, check current visit count
    const { count: currentCount, error: checkError } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', customerId)

    if (checkError) {
        console.error('Check error:', checkError)
        return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    const initialCount = currentCount || 0

    // 2. STOP if already reached 6 visits
    if (initialCount >= 6) {
        const { data: customerData } = await supabase
            .from('customers')
            .select('name')
            .eq('id', customerId)
            .single()

        return NextResponse.json({
            visitCount: initialCount,
            rewardUnlocked: false,
            message: "Sorry, your loyalty card is full! Please see our staff for a new one. ✨",
            customerName: customerData?.name || 'Gorgeous',
            isFull: true
        })
    }

    // 3. Insert new visit
    const { error: insertError } = await supabase
        .from('visits')
        .insert([{ customer_id: customerId }])

    if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // 4. Get updated count
    const newCount = initialCount + 1

    // 5. Fetch customer name
    const { data: customerData, error: nameError } = await supabase
        .from('customers')
        .select('name')
        .eq('id', customerId)
        .single()

    if (nameError) {
        console.error('Customer name fetch error:', nameError)
    }

    const customerName = customerData?.name || 'Gorgeous'

    // 6. Reward logic (STRICT)
    const rewardUnlocked = newCount === 3 || newCount === 6

    let message = `Keep going! You're on visit ${newCount}`

    if (newCount === 3) {
        message = "🎉 You've earned your first reward!"
    }

    if (newCount === 6) {
        message = "🔥 You've earned your second reward!"
    }

    return NextResponse.json({
        visitCount: newCount,
        rewardUnlocked,
        message,
        customerName,
        isFull: newCount === 6
    })
}