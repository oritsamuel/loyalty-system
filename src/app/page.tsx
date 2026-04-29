import Link from 'next/link'
import { Heart, Sparkles, Star } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--primary)] opacity-5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl relative animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-full shadow-xl shadow-rose-100">
            <Heart className="w-8 h-8 text-[var(--primary)] fill-[var(--primary)] opacity-80" />
          </div>
        </div>

        <h1 className="text-6xl font-serif tracking-[0.2em] text-[var(--foreground)] mb-4 uppercase">Amra</h1>
        <p className="text-lg uppercase tracking-[0.3em] text-[var(--primary)] font-medium mb-8">Nail Salon</p>

        <div className="h-px w-24 bg-[var(--border)] mx-auto mb-8" />

        <p className="text-[var(--muted-foreground)] leading-relaxed mb-12 max-w-md mx-auto">
          Welcome to Amra's exclusive loyalty program.
          Enjoy premium nail care and get rewarded for your loyalty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-[var(--primary)] text-white rounded-full font-medium tracking-wide shadow-lg shadow-rose-200 hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Join Loyalty Program
          </Link>

        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2">
            <Star className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">Premium Care</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">Client First</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">Real Rewards</span>
          </div>
        </div>
      </div>
    </main>
  )
}
