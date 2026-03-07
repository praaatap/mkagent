import React from 'react'

const Terminal: React.FC = () => {
    return (
        <div className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 tracking-tighter">Interactive Terminal</h2>

            <div className="max-w-4xl mx-auto py-12 px-6 bg-linear-to-b from-accent-cyan/5 to-transparent rounded-3xl border border-white/5">
                <div className="bg-[#0a0a0f] rounded-[22px] overflow-hidden border border-white/5 shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        <button className="px-5 py-2 bg-accent-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                            Clear Terminal
                        </button>
                    </div>
                    <div className="p-8 text-left font-mono text-sm leading-relaxed min-h-[400px]">
                        <div className="flex items-center gap-2">
                            <span className="text-accent-purple">mk</span>
                            <span className="text-accent-cyan">agent</span>
                            <span className="text-white/40 ml-2">v1.2.0</span>
                        </div>
                        <div className="mt-4 text-white/40">[Processing] Initializing project "my-agent-app"...</div>
                        <div className="text-white/40">[Info] Detecting tech stack: Next.js (App Router)</div>
                        <div className="text-white/40">[AI] Reasoning about project structure...</div>
                        <div className="mt-2 text-white/40">Generating AGENTS.md with Claude 3.5...</div>
                        <div className="text-white/40">Generating CLAUDE.md with Gemini 2.0...</div>
                        <div className="mt-6 text-accent-cyan">Done: Project successfully scaffolded.</div>

                        <div className="mt-8 flex gap-3 animate-pulse">
                            <span className="text-accent-purple">➜</span>
                            <span className="text-accent-cyan">~</span>
                            <span className="w-2 h-5 bg-accent-cyan"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-accent-cyan">Smart Autodetection</h3>
                    <p className="text-white/50 leading-relaxed">
                        mkagent automatically scans your directory to identify frameworks, languages, and dependencies.
                        It uses this information to prime the AI model for more accurate instruction generation.
                    </p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-accent-purple">Multi-Model Support</h3>
                    <p className="text-white/50 leading-relaxed">
                        Choose the model that works best for you. Whether it's the reasoning of Claude 3.5, the speed of Gemini 2.0, or the versatility of GPT-4o.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Terminal
