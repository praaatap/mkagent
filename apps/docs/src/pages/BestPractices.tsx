import React from 'react'

const BestPractices: React.FC = () => {
    const practices = [
        {
            title: "Write Clear Descriptions",
            tip: "Always include a detailed description in your package.json. mkagent uses this to prime AI models with high-level project intent.",
            example: '"description": "E-commerce API with Stripe integration and Redis caching"'
        },
        {
            title: "Organize by Domain",
            tip: "Structure your codebase into logical domains. mkagent performs best when it can map rules to specific directories.",
            example: "src/\n├── core/       # Business logic\n├── services/   # Infrastructure\n├── components/ # UI layer\n└── agents/     # Agent context"
        },
        {
            title: "Keep Agent Files Updated",
            tip: "Run 'mkagent regenerate' after significant architecture changes. Stale context leads to poor AI suggestions.",
            example: "$ mkagent regenerate --dry-run  # Preview first"
        },
        {
            title: "Use Local Models for Privacy",
            tip: "For sensitive codebases, use Ollama or LM Studio. No data leaves your machine. Run 'mkagent config' and select 'Local (Ollama)'.",
            example: null
        },
        {
            title: "Audit Regularly",
            tip: "Run 'mkagent audit' before major releases. It catches hardcoded secrets, stray console.logs, and forgotten TODOs.",
            example: "$ mkagent audit  # Results saved to MEMORY.md"
        },
        {
            title: "Use Profiles for Teams",
            tip: "Create separate profiles for different workflows — one for cloud AI, one for local testing, one for CI/CD.",
            example: "$ mkagent config  # Select 'Create New Profile'"
        }
    ]

    return (
        <div className="py-16 max-w-3xl mx-auto px-6">
            <header className="mb-14">
                <span className="section-label">Guide</span>
                <h1 className="text-4xl font-black tracking-tight">Best Practices</h1>
                <p className="text-sm text-white/30 mt-3">Guidelines for high-performance agentic workflows.</p>
            </header>

            <div className="space-y-6">
                {practices.map((p, i) => (
                    <div key={i} className="glass p-6">
                        <div className="flex items-start gap-4">
                            <span className="text-accent-cyan/30 text-xs font-bold mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold mb-2 text-white/80">{p.title}</h3>
                                <p className="text-xs text-white/30 leading-relaxed mb-3">{p.tip}</p>
                                {p.example && (
                                    <div className="code-block text-[11px]">
                                        <pre className="text-accent-cyan/50">{p.example}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BestPractices
