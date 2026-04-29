'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Gift, Heart, Star } from 'lucide-react'
import confetti from 'canvas-confetti'

function CheckInContent() {
    const params = useSearchParams()
    const customerId = params.get('customerId')

    const [message, setMessage] = useState('Initializing your visit...')
    const [customerName, setCustomerName] = useState<string | null>(null)
    const [visits, setVisits] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [rewardUnlocked, setRewardUnlocked] = useState(false)
    const [isFull, setIsFull] = useState(false)

    useEffect(() => {
        if (!customerId) {
            setMessage('Invalid customer link')
            setLoading(false)
            return
        }

        const checkIn = async () => {
            try {
                const res = await fetch('/api/check-in', {
                    method: 'POST',
                    body: JSON.stringify({ customerId }),
                })

                const data = await res.json()

                if (res.ok) {
                    setVisits(data.visitCount)
                    setMessage(data.message)
                    setRewardUnlocked(data.rewardUnlocked)
                    setCustomerName(data.customerName)
                    setIsFull(data.isFull)

                    if (data.rewardUnlocked) {
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#ff85a2', '#fbb6ce', '#fbd38d']
                        })
                    }
                } else {
                    setMessage(data.error || 'Something went wrong')
                }
            } catch (err) {
                setMessage('Connection error')
            } finally {
                setLoading(false)
            }
        }

        checkIn()
    }, [customerId])

    const totalSlots = 6
    const visitSlots = Array.from({ length: totalSlots }, (_, i) => i + 1)

    return (
        <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] opacity-10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Brand Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <h1 className="text-4xl font-serif tracking-widest text-[var(--foreground)] mb-2 uppercase">Amra</h1>
                    <div className="h-px w-12 bg-[var(--primary)] mx-auto mb-2" />
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Nail Salon</p>
                </div>

                {/* Loyalty Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl shadow-rose-100/50 relative overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center py-12">
                            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-[var(--muted-foreground)] animate-pulse">Recording your visit...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-serif text-[var(--foreground)] mb-1">
                                        Hello, {customerName || 'Gorgeous'}!
                                    </h2>
                                    <p className="text-xs text-[var(--muted-foreground)]">Your Loyalty Progress</p>
                                </div>
                                <Heart className="text-[var(--primary)] fill-[var(--primary)] w-5 h-5 opacity-20" />
                            </div>

                            {/* Stamp Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {visitSlots.map((slot) => {
                                    const isFilled = visits !== null && visits >= slot
                                    const isReward = slot === 3 || slot === 6

                                    return (
                                        <div
                                            key={slot}
                                            className={`
                                                aspect-square rounded-2xl flex items-center justify-center relative
                                                transition-all duration-700
                                                ${isFilled
                                                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-rose-200'
                                                    : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)]'
                                                }
                                            `}
                                        >
                                            {isFilled ? (
                                                <div className="animate-in zoom-in duration-500 flex flex-col items-center">
                                                    <Star className="w-6 h-6 fill-white" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center opacity-40">
                                                    {isReward ? <Gift className="w-5 h-5" /> : <span className="text-lg font-serif">{slot}</span>}
                                                </div>
                                            )}

                                            {isReward && !isFilled && (
                                                <div className="absolute -top-1 -right-1">
                                                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-ping" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Status Message */}
                            <div className={`
                                p-6 rounded-2xl text-center transition-all duration-500 mb-6
                                ${isFull
                                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                    : rewardUnlocked
                                        ? 'bg-[var(--accent)]/10 border border-[var(--accent)] text-[var(--foreground)]'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                                }
                            `}>
                                {rewardUnlocked && <Sparkles className="w-5 h-5 text-[var(--accent)] mx-auto mb-2 animate-bounce" />}
                                {isFull && <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2 animate-pulse" />}
                                <p className={`font-medium ${rewardUnlocked || isFull ? 'text-lg' : ''}`}>
                                    {message}
                                </p>
                            </div>

                            <p className="text-center text-[var(--muted-foreground)] text-sm italic">
                                Thank you for choosing Amra.<br />
                                We look forward to seeing you again!
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-[var(--muted-foreground)] text-xs opacity-60">
                    <p>© {new Date().getFullYear()} Amra Nail Salon. All rights reserved.</p>
                </div>
            </div>
        </main>
    )
}

export default function CheckInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CheckInContent />
        </Suspense>
    )
}
