import React from 'react'

const Home: React.FC = () => {
    return (
        <div className="pt-12 pb-20 px-6">
            <section className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="mb-6 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-widest text-[#00f5ff] uppercase">
                    Supported Models: Gemini 2.0 and Claude 3.5
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    Your Agents Deserve <br /> <span className="text-[#00f5ff]">Better Context.</span>
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-white/50 mb-12 leading-relaxed">
                    The CLI utility for generating structured, instruction-dense <code>AGENTS.md</code>, <code>CLAUDE.md</code>, and <code>GEMINI.md</code> files.
                    Optimized for LLM reasoning and professional developer workflows.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center">
                    <button className="px-8 py-4 bg-[#00f5ff] text-black font-bold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,245,255,0.3)]">
                        Get Started
                    </button>
                    <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors text-white">
                        Project Documentation
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-20">
                    {[
                        {
                            title: "Context Retention",
                            desc: "mkagent analyzes project structures and package definitions to generate rules that ensure agents maintain deep context."
                        },
                        {
                            title: "Model Versatility",
                            desc: "Seamlessly switch between leading LLMs including GPT-4o, Claude 3.5 Sonnet, and Gemini 2.0 Flash."
                        },
                        {
                            title: "Framework Scaffolding",
                            desc: "Automate the creation of Next.js and React project structures with standardized patterns and best practices."
                        }
                    ].map((f, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl group hover:border-[#00f5ff]/50 transition-colors p-8 relative overflow-hidden">
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                            <p className="text-white/50 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home
