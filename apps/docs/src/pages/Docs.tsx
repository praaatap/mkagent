import React from 'react'

const Docs: React.FC = () => {
    return (
        <div className="py-20 max-w-4xl mx-auto px-6">
            <header className="mb-16">
                <span className="text-accent-cyan font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Core Documentation</span>
                <h1 className="text-5xl font-black tracking-tighter">Getting Started</h1>
            </header>

            <div className="space-y-24">
                <section id="getting-started">
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">Installation</h2>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                        <p className="text-lg text-white/50 leading-relaxed">
                            To begin your journey with <span className="text-accent-cyan font-bold italic">mkagent</span>, simple install the package globally or use it via npx:
                        </p>
                        <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm group relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <code className="text-accent-cyan">$ npm install -g mkagent</code>
                                <div className="text-[10px] text-white/20 uppercase font-black tracking-widest bg-white/5 px-2 py-1 rounded">Bash</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="configuration">
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">Configuration</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        Before initializing your first project, you'll need to configure your AI providers. We support OpenAI, Anthropic, and Google.
                    </p>
                    <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm text-white/80">
                        <span className="text-accent-cyan">$</span> mkagent config
                    </div>
                    <p className="mt-6 text-white/60">
                        This will prompt you for your API keys and your default model choice. Keys are stored safely in <code>~/.mkagent/config.json</code>.
                    </p>
                </section>

                <section id="usage">
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">Core Usage</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        To scaffold a new project with AI-generated docs:
                    </p>
                    <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm text-white/80">
                        <span className="text-accent-cyan">$</span> mkagent init
                    </div>
                    <p className="mt-6 text-white/60">
                        If you're in an existing project and want to refresh the agent files:
                    </p>
                    <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm text-white/80">
                        <span className="text-accent-cyan">$</span> mkagent regenerate
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Docs
