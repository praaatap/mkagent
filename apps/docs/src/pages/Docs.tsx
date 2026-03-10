import React from 'react'

const Docs: React.FC = () => {
    const commands = [
        { cmd: 'init', desc: 'Bootstrap high-fidelity agent files for the current project.' },
        { cmd: 'config', desc: 'Configure API keys, model selection, and local LLM endpoints.' },
        { cmd: 'doctor', desc: 'Live health-check of your AI configuration and project context.' },
        { cmd: 'audit', desc: 'Scan for secrets, TODOs, and debug logs. Auto-updates MEMORY.md.' },
        { cmd: 'stats', desc: 'Visual breakdown of agent file density and complexity.' },
        { cmd: 'regenerate', desc: 'Refresh all agent files with updated project context.' },
        { cmd: 'chat', desc: 'Start a precision-context terminal session with your AI model.' },
        { cmd: 'tokens', desc: 'Calculate token usage for all agent .md files.' },
        { cmd: 'compress', desc: 'Minify agent files to reduce token footprint.' },
        { cmd: 'sync', desc: 'Push/pull agent files to/from a GitHub Gist.' },
        { cmd: 'watch', desc: 'Watch for project changes and auto-update memory.' },
    ]

    return (
        <div className="py-16 max-w-3xl mx-auto px-6">
            <header className="mb-14">
                <span className="section-label">Documentation</span>
                <h1 className="text-4xl font-black tracking-tight">Getting Started</h1>
            </header>

            <div className="space-y-16">
                {/* Installation */}
                <section id="getting-started">
                    <h2 className="section-title">Installation</h2>
                    <p className="text-sm text-white/40 leading-relaxed mb-5">
                        Install <span className="text-white/70 font-semibold">mkagent</span> globally:
                    </p>
                    <div className="code-block">
                        <span className="text-accent-cyan/50">$</span>
                        <span className="text-white/70 ml-3">npm install -g mkagent</span>
                    </div>
                </section>

                {/* Configuration */}
                <section id="configuration">
                    <h2 className="section-title">Configuration</h2>
                    <p className="text-sm text-white/40 leading-relaxed mb-5">
                        Link your AI provider — <span className="text-white/60">OpenAI, Anthropic, Gemini, Ollama, LM Studio</span>, or any OpenAI-compatible endpoint.
                    </p>
                    <div className="code-block">
                        <span className="text-accent-cyan/50">$</span>
                        <span className="text-white/70 ml-3">mkagent config</span>
                    </div>
                    <p className="mt-4 text-xs text-white/25">
                        Keys stored locally in <code className="text-accent-cyan/60">~/.mkagent/config.json</code>. Local models need no API key.
                    </p>
                </section>

                {/* Local LLMs */}
                <section id="local-llm">
                    <h2 className="section-title">Local LLM Setup</h2>
                    <p className="text-sm text-white/40 leading-relaxed mb-6">
                        mkagent works fully offline. Two popular options:
                    </p>

                    <div className="space-y-4">
                        <div className="glass p-6">
                            <h3 className="text-sm font-bold mb-4 text-violet-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                                Ollama
                            </h3>
                            <div className="space-y-3">
                                <div className="code-block text-xs">
                                    <div className="text-white/20 mb-1"># Pull a model and configure</div>
                                    <div><span className="text-accent-cyan/50">$</span> <span className="text-white/60">ollama pull llama3.2</span></div>
                                    <div><span className="text-accent-cyan/50">$</span> <span className="text-white/60">mkagent config</span></div>
                                    <div className="text-white/20 mt-1"># Select "Local (Ollama)" → endpoint: http://localhost:11434/v1</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6">
                            <h3 className="text-sm font-bold mb-4 text-accent-cyan flex items-center gap-2">
                                <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
                                LM Studio / OpenAI-Compatible
                            </h3>
                            <div className="code-block text-xs">
                                <div className="text-white/20 mb-1"># Start LM Studio server, then configure</div>
                                <div><span className="text-accent-cyan/50">$</span> <span className="text-white/60">mkagent config</span></div>
                                <div className="text-white/20 mt-1"># Select "OpenAI-Compatible" → endpoint: http://localhost:1234/v1</div>
                            </div>
                            <p className="text-[11px] text-white/20 mt-3">
                                Also works with vLLM, text-generation-webui, LocalAI, or any OpenAI-compatible server.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Usage */}
                <section id="usage">
                    <h2 className="section-title">Core Usage</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-white/40 mb-3">Scaffold agent files for your project:</p>
                            <div className="code-block">
                                <span className="text-accent-cyan/50">$</span>
                                <span className="text-white/70 ml-3">mkagent init</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-white/40 mb-3">Refresh when your project evolves:</p>
                            <div className="code-block">
                                <span className="text-accent-cyan/50">$</span>
                                <span className="text-white/70 ml-3">mkagent regenerate</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Command Reference */}
                <section id="commands">
                    <h2 className="section-title">Command Reference</h2>
                    <div className="border border-white/[0.04] rounded-xl overflow-hidden">
                        {commands.map((c, i) => (
                            <div key={c.cmd} className={`flex items-start gap-4 px-5 py-3.5 ${i !== 0 ? 'border-t border-white/[0.04]' : ''} ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                                <code className="text-accent-cyan/70 text-xs font-bold shrink-0 w-28 pt-0.5">{c.cmd}</code>
                                <span className="text-white/30 text-xs leading-relaxed">{c.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Docs
