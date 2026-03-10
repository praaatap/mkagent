import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Globe, Shield, Zap, Terminal, Server, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
    const models = [
        { name: 'OpenAI', color: 'text-emerald-400' },
        { name: 'Claude', color: 'text-orange-300' },
        { name: 'Gemini', color: 'text-blue-400' },
        { name: 'Ollama', color: 'text-violet-400' },
        { name: 'LM Studio', color: 'text-pink-400' },
    ]

    const features = [
        {
            icon: Cpu,
            title: "Deep Stack Intelligence",
            desc: "Auto-detects Next.js, React, Python, Node.js APIs, and Turbo monorepos. Maps your entire dependency graph.",
        },
        {
            icon: Globe,
            title: "Universal Model Support",
            desc: "Cloud APIs and local LLMs. Works fully offline with Ollama. Supports any OpenAI-compatible endpoint.",
        },
        {
            icon: Shield,
            title: "Zero-Trust Auditing",
            desc: "Scans for hardcoded secrets, stray logs, and TODOs. Auto-syncs findings to your MEMORY.md.",
        },
        {
            icon: Zap,
            title: "Precision Agent Files",
            desc: "Generates CLAUDE.md, GEMINI.md, .cursorrules, and more — tailored to your specific project architecture.",
        },
        {
            icon: Terminal,
            title: "Premium Terminal UX",
            desc: "Interactive prompts, progress spinners, and color-coded output. Designed for professional workflows.",
        },
        {
            icon: Server,
            title: "Fully Offline",
            desc: "Point at a local Ollama or LM Studio instance. No internet required. Complete data privacy.",
        }
    ]

    const fadeUp = (delay: number) => ({
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })

    return (
        <div className="pt-16 pb-24 px-6">
            <section className="max-w-5xl mx-auto flex flex-col items-center text-center">
                {/* Model badges */}
                <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-2 mb-10">
                    {models.map((m) => (
                        <span key={m.name} className={`px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-[10px] font-semibold tracking-wider ${m.color}`}>
                            {m.name}
                        </span>
                    ))}
                    <span className="px-3 py-1 bg-accent-cyan/5 border border-accent-cyan/15 rounded-full text-[10px] font-semibold tracking-wider text-accent-cyan">
                        + OpenAI-Compatible
                    </span>
                </motion.div>

                {/* Hero */}
                <motion.h1
                    {...fadeUp(0.2)}
                    className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] mb-6 bg-linear-to-b from-white via-white/80 to-white/30 bg-clip-text text-transparent leading-[0.9]"
                >
                    mk<span className="text-accent-cyan">agent</span>
                </motion.h1>

                <motion.p
                    {...fadeUp(0.3)}
                    className="max-w-lg text-base md:text-lg text-white/35 mb-10 leading-relaxed font-medium"
                >
                    The intelligence layer between your codebase and AI agents.
                    Cloud or local. Always precise.
                </motion.p>

                {/* Install block */}
                <motion.div
                    {...fadeUp(0.4)}
                    className="code-block flex items-center gap-4 mb-10 glow-cyan"
                >
                    <span className="text-accent-cyan/50 select-none text-xs">$</span>
                    <code className="text-white/70 text-sm">npm install -g mkagent</code>
                </motion.div>

                {/* CTAs */}
                <motion.div {...fadeUp(0.5)} className="flex flex-wrap justify-center gap-4 mb-24">
                    <Link to="/docs" className="no-underline">
                        <button className="flex items-center gap-2 px-7 py-3 bg-accent-cyan text-black text-[11px] font-bold rounded-full hover:scale-[1.03] transition-transform cursor-pointer uppercase tracking-widest">
                            Get Started
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                    <Link to="/terminal" className="no-underline">
                        <button className="px-7 py-3 bg-white/[0.03] border border-white/[0.08] rounded-full text-[11px] font-bold hover:bg-white/[0.06] transition-colors text-white/60 cursor-pointer uppercase tracking-widest">
                            Playground
                        </button>
                    </Link>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left w-full">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(0.6 + i * 0.08)}
                            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                        >
                            <f.icon className="w-4 h-4 text-accent-cyan/60 mb-4" />
                            <h3 className="text-sm font-bold mb-2 tracking-tight text-white/80">{f.title}</h3>
                            <p className="text-white/25 text-xs leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home
