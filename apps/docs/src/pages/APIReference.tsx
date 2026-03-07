import React from 'react'
import TableOfContents from '../components/TableOfContents'

const APIReference: React.FC = () => {
    const tocItems = [
        { id: 'endpoints', label: 'Endpoints', level: 2 },
        { id: 'config', label: 'Config Schema', level: 2 },
        { id: 'playground', label: 'Playground', level: 2 },
    ]

    return (
        <div className="flex gap-12">
            <div className="flex-1 py-12">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">API Reference</h1>
                <p className="text-white/50 text-lg mb-12">
                    Programmatic interface for mkagent's core engine.
                </p>

                <section id="endpoints" className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-[10px] font-bold rounded-lg uppercase tracking-widest">POST</span>
                        <h2 className="text-2xl font-bold tracking-tight">/v1/agent/run</h2>
                    </div>
                    <div className="p-8 bg-[#0a0a0f] border border-white/5 rounded-3xl">
                        <p className="text-sm text-white/40 mb-6">Trigger a generation run for a specific project context.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-white/20 border-b border-white/5 pb-2">
                                <span>Parameter</span>
                                <span>Type</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-mono text-accent-cyan">projectId</span>
                                <span className="text-white/40">string</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-mono text-accent-cyan">prompt</span>
                                <span className="text-white/40">string</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="config" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Config Schema</h2>
                    <pre className="p-8 bg-[#0a0a0f] border border-white/5 rounded-3xl overflow-x-auto text-[13px] leading-relaxed">
                        <code className="text-accent-purple">
                            {`{
  "defaultModel": "claude-3-5-sonnet",
  "providers": {
    "anthropic": "sk-ant-...",
    "openai": "sk-...",
    "google": "AIza..."
  },
  "scaffold": {
    "engine": "nextjs-app-router",
    "styling": "tailwind-v4"
  }
}`}
                        </code>
                    </pre>
                </section>

                <section id="playground">
                    <h2 className="text-2xl font-bold mb-6">Interactive Playground</h2>
                    <div className="p-12 border border-white/5 rounded-[40px] bg-linear-to-br from-white/5 to-transparent text-center">
                        <div className="w-16 h-16 bg-accent-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h4 className="font-bold mb-2">Playground Loading...</h4>
                        <p className="text-xs text-white/30">Connect your local instance to start testing prompts.</p>
                    </div>
                </section>
            </div>
            <TableOfContents items={tocItems} />
        </div>
    )
}

export default APIReference
