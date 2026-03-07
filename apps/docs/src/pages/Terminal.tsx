import React from 'react'

const Terminal: React.FC = () => {
    return (
        <div className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 tracking-tighter">Interactive Terminal</h2>

            <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-[#0a0a0f] rounded-[22px] overflow-hidden border border-white/5 shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        <span className="ml-4 text-xs font-mono text-white/30 uppercase tracking-widest">zsh — 80x24</span>
                    </div>
                    <div className="p-8 text-left font-mono text-sm leading-relaxed min-h-[400px]">
                        <div className="flex gap-3">
                            <span className="text-[#9d00ff]">➜</span>
                            <span className="text-[#00f5ff]">~</span>
                            <span className="text-white">npx mkagent init</span>
                        </div>
                        <div className="mt-4 text-white/40">[Processing] Initializing project "my-agent-app"...</div>
                        <div className="text-white/40">[Info] Detecting tech stack: Next.js (App Router)</div>
                        <div className="text-white/40">[AI] Reasoning about project structure...</div>
                        <div className="mt-2 text-white/40">Generating AGENTS.md with Claude 3.5...</div>
                        <div className="text-white/40">Generating CLAUDE.md with Gemini 2.0...</div>
                        <div className="mt-6 text-[#00f5ff]">Done: Project successfully scaffolded.</div>

                        <div className="mt-8 flex gap-3 animate-pulse">
                            <span className="text-[#9d00ff]">➜</span>
                            <span className="text-[#00f5ff]">~</span>
                            <span className="w-2 h-5 bg-[#00f5ff]"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#00f5ff]">Smart Autodetection</h3>
                    <p className="text-white/50 leading-relaxed">
                        mkagent automatically scans your directory to identify frameworks, languages, and dependencies.
                        It uses this information to prime the AI model for more accurate instruction generation.
                    </p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#9d00ff]">Multi-Model Support</h3>
                    <p className="text-white/50 leading-relaxed">
                        Choose the model that works best for you. Whether it's the reasoning of Claude 3.5, the speed of Gemini 2.0, or the versatility of GPT-4o.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Terminal
