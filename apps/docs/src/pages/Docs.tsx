import React from 'react'

const Docs: React.FC = () => {
    return (
        <div className="py-20 px-6 max-w-7xl mx-auto flex gap-12">
            <aside className="w-64 hidden lg:block sticky top-32 h-fit">
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Introduction</h4>
                <nav className="flex flex-col gap-4 text-sm font-medium">
                    <a href="#getting-started" className="text-[#00f5ff] no-underline">Getting Started</a>
                    <a href="#configuration" className="text-white/50 hover:text-white transition-colors no-underline">Configuration</a>
                    <a href="#usage" className="text-white/50 hover:text-white transition-colors no-underline">Core Usage</a>
                </nav>

                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mt-12 mb-6">Features</h4>
                <nav className="flex flex-col gap-4 text-sm font-medium">
                    <a href="#" className="text-white/50 hover:text-white transition-colors no-underline">AI Reasoning</a>
                    <a href="#" className="text-white/50 hover:text-white transition-colors no-underline">Next.js Scaffolding</a>
                    <a href="#" className="text-white/50 hover:text-white transition-colors no-underline">Custom Templates</a>
                </nav>
            </aside>

            <div className="flex-1 max-w-3xl">
                <section id="getting-started" className="mb-20">
                    <h2 className="text-4xl font-black mb-8 tracking-tighter">Getting Started</h2>
                    <p className="text-lg text-white/60 mb-8 leading-relaxed">
                        Boost your productivity by providing your AI agents with the perfect context. mkagent handles the heavy lifting of writing project-specific rules.
                    </p>
                    <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-[#00f5ff] mb-4">
                        npm install -g mkagent
                    </div>
                    <p className="text-sm text-white/30 italic">Global installation is recommended for CLI usage.</p>
                </section>

                <section id="configuration" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">Configuration</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        Before initializing your first project, you'll need to configure your AI providers. We support OpenAI, Anthropic, and Google.
                    </p>
                    <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-white/80">
                        <span className="text-[#00f5ff]">$</span> mkagent config
                    </div>
                    <p className="mt-6 text-white/60">
                        This will prompt you for your API keys and your default model choice. Keys are stored safely in <code>~/.mkagent/config.json</code>.
                    </p>
                </section>

                <section id="usage" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">Core Usage</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        To scaffold a new project with AI-generated docs:
                    </p>
                    <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-white/80">
                        <span className="text-[#00f5ff]">$</span> mkagent init
                    </div>
                    <p className="mt-6 text-white/60">
                        If you're in an existing project and want to refresh the agent files:
                    </p>
                    <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-white/80">
                        <span className="text-[#00f5ff]">$</span> mkagent regenerate
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Docs
