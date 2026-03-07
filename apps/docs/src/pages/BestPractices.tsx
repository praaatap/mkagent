import React from 'react'
import TableOfContents from '../components/TableOfContents'

const BestPractices: React.FC = () => {
    const tocItems = [
        { id: 'prompting', label: 'Prompt Engineering', level: 2 },
        { id: 'structure', label: 'Scalable Structure', level: 2 },
        { id: 'case-studies', label: 'Case Studies', level: 2 },
    ]

    return (
        <div className="flex gap-12">
            <div className="flex-1 py-12">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Best Practices</h1>
                <p className="text-white/50 text-lg mb-12">
                    Guidelines for building high-performance agentic workflows with mkagent.
                </p>

                <section id="prompting" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Prompt Engineering</h2>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                        <p className="text-white/60 leading-relaxed">
                            When using mkagent, the quality of generated instructions depends on the clarity of your project structure. Avoid vague naming conventions.
                        </p>
                        <div className="p-6 bg-[#00f5ff]/5 border border-[#00f5ff]/20 rounded-2xl">
                            <h5 className="text-[#00f5ff] font-bold text-sm mb-2">Pro Tip</h5>
                            <p className="text-xs text-white/50">
                                Always include a detailed <code className="text-[#00f5ff]">package.json</code> description. mkagent uses this to prime the AI models with high-level intent.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="structure" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Scalable Structure</h2>
                    <p className="text-white/60 leading-relaxed mb-6">
                        Organize your codebase into logical domains. mkagent performs best when it can map instructions to specific directory segments.
                    </p>
                    <pre className="p-6 bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-x-auto">
                        <code className="text-xs text-[#00f5ff]">
                            {`src/
├── core/       # Shared business logic
├── services/   # Infrastructure and APIs
├── components/ # UI layer
└── agents/     # Agent-specific instructions`}
                        </code>
                    </pre>
                </section>

                <section id="case-studies">
                    <h2 className="text-2xl font-bold mb-6">Case Studies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-[#00f5ff]/30 transition-colors">
                            <h3 className="font-bold mb-2">Next.js Enterprise</h3>
                            <p className="text-xs text-white/40">How a Fintech leader uses mkagent to maintain 100% agent context in a 50k LOC monorepo.</p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-[#9d00ff]/30 transition-colors">
                            <h3 className="font-bold mb-2">Edge Computing</h3>
                            <p className="text-xs text-white/40">Optimizing mkagent for low-latency agent reasoning on the edge.</p>
                        </div>
                    </div>
                </section>
            </div>
            <TableOfContents items={tocItems} />
        </div>
    )
}

export default BestPractices
