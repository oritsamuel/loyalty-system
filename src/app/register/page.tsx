'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { UserPlus, QrCode, Download, Check, Sparkles, Heart, Phone } from 'lucide-react'
import { createClient } from '@/lib/client'

export default function RegisterPage() {
    const [customerId, setCustomerId] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('+251')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const supabase = createClient()

    const generateId = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        let result = ''
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        // Validate phone length (expecting 9 digits after +251)
        if (phone.length !== 13) {
            setError('Phone number must have 9 digits after +251')
            setLoading(false)
            return
        }

        const newId = generateId()
        setCustomerId(newId)

        try {
            const { error: insertError } = await supabase
                .from('customers')
                .insert([{ id: newId, name: name, phone: phone }])

            if (insertError) throw insertError

            setSuccess(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to register customer'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const downloadQR = () => {
        const svg = document.querySelector('.qr-container svg') as SVGElement
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = `QR_AMRA_${name.replace(/\s+/g, '_')}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    const checkInUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/check-in?customerId=${customerId}`
        : ''

    return (
        <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] opacity-10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-2xl grid md:grid-cols-2 gap-8 items-start relative">
                {/* Registration Form */}
                <div className="bg-white/80 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl shadow-rose-100/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-[var(--primary)]/10 rounded-xl">
                            <UserPlus className="text-[var(--primary)] w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-serif text-[var(--foreground)]">New Member</h1>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                                Customer Name
                            </label>
                            <input 
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                                Phone Number (Ethiopia)
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                                <input 
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        // Prevent deleting the prefix
                                        if (val.startsWith('+251')) {
                                            // Only allow digits after prefix
                                            const digits = val.slice(4).replace(/\D/g, '')
                                            if (digits.length <= 9) {
                                                setPhone('+251' + digits)
                                            }
                                        }
                                    }}
                                    placeholder="+251 911..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-lg font-mono"
                                />
                            </div>
                            <p className="mt-2 text-[10px] text-[var(--muted-foreground)]">Format: +251 followed by 9 digits</p>
                        </div>

                        {success && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-3 animate-in slide-in-from-left duration-500">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold">Registered!</p>
                                    <p className="text-xs">ID: {customerId}</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-medium shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Register Customer
                                </>
                            )}
                        </button>

                        {success && (
                            <button 
                                onClick={() => { setSuccess(false); setName(''); setPhone('+251'); setCustomerId(''); }}
                                className="w-full py-3 text-[var(--primary)] font-medium text-sm hover:underline"
                            >
                                Register another customer
                            </button>
                        )}
                    </form>
                </div>

                {/* QR Generation Area */}
                <div className={`
                    bg-white/80 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl shadow-rose-100/50 flex flex-col items-center text-center transition-all duration-700
                    ${success ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none grayscale'}
                `}>
                    <div className="flex items-center gap-3 mb-8 w-full">
                        <div className="p-2 bg-[var(--accent)]/10 rounded-xl">
                            <QrCode className="text-[var(--accent)] w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif text-[var(--foreground)]">Loyalty QR</h2>
                    </div>

                    <div className="qr-container bg-white p-6 rounded-3xl shadow-inner border border-[var(--border)] mb-8">
                        {mounted && (
                            <QRCodeSVG 
                                value={checkInUrl}
                                size={180}
                                includeMargin={true}
                                fgColor="#7c3aed"
                                level="H"
                            />
                        )}
                    </div>

                    <div className="space-y-4 w-full">
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {success ? `QR Code for ${name}` : 'Register a customer to see QR'}
                        </p>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={downloadQR}
                                className="flex-1 py-4 bg-[var(--accent)] text-[var(--foreground)] rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.05] transition-all shadow-lg shadow-amber-100"
                            >
                                <Download className="w-5 h-5" />
                                Download QR
                            </button>
                            <div className="p-4 bg-[var(--primary)] text-white rounded-xl shadow-lg shadow-rose-100">
                                <Heart className="w-5 h-5 fill-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
