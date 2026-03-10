import React from 'react'

const APIReference: React.FC = () => {
    return (
        <div className="py-16 max-w-3xl mx-auto px-6">
            <header className="mb-14">
                <span className="section-label">Reference</span>
                <h1 className="text-4xl font-black tracking-tight">API Reference</h1>
                <p className="text-sm text-white/30 mt-3">Programmatic interface for mkagent's core engine.</p>
            </header>

            <div className="space-y-12">
                {/* Config Schema */}
                <section id="config">
                    <h2 className="section-title">Config Schema</h2>
                    <p className="text-sm text-white/40 mb-5 leading-relaxed">
                        Configuration is stored in <code className="text-accent-cyan/60">~/.mkagent/config.json</code>. Here's the full schema:
                    </p>
                    <div className="code-block text-xs leading-relaxed">
                        <pre className="text-accent-purple/70">{`{
  "activeProfile": "default",
  "profiles": {
    "default": {
      "defaultModel": "gemini",
      "keys": {
        "openai": "sk-...",
        "anthropic": "sk-ant-...",
        "gemini": "AIza..."
      },
      "baseUrl": null,
      "modelName": null
    },
    "local": {
      "defaultModel": "local",
      "keys": { "local": "ollama" },
      "baseUrl": "http://localhost:11434/v1",
      "modelName": "llama3.2"
    }
  }
}`}</pre>
                    </div>
                </section>

                {/* Profile Fields */}
                <section id="fields">
                    <h2 className="section-title">Profile Fields</h2>
                    <div className="border border-white/[0.04] rounded-xl overflow-hidden">
                        {[
                            { field: 'defaultModel', type: 'string', desc: '"openai" | "anthropic" | "gemini" | "openai-compatible" | "local"' },
                            { field: 'keys', type: 'object', desc: 'API keys indexed by model type. For local models, use "ollama".' },
                            { field: 'baseUrl', type: 'string?', desc: 'Custom endpoint URL for OpenAI-compatible or Ollama servers.' },
                            { field: 'modelName', type: 'string?', desc: 'Model identifier (e.g., "llama3.2", "mistral", "gpt-4o").' },
                            { field: 'modelParams', type: 'object?', desc: 'Override temperature, maxTokens per model type.' },
                            { field: 'githubToken', type: 'string?', desc: 'Personal access token for Gist sync.' },
                        ].map((row, i) => (
                            <div key={row.field} className={`flex items-start gap-4 px-5 py-3.5 ${i !== 0 ? 'border-t border-white/[0.04]' : ''}`}>
                                <code className="text-accent-cyan/70 text-xs font-bold shrink-0 w-28 pt-0.5">{row.field}</code>
                                <span className="text-accent-purple/50 text-[10px] font-mono shrink-0 w-16 pt-0.5">{row.type}</span>
                                <span className="text-white/30 text-xs leading-relaxed">{row.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Generated Files */}
                <section id="files">
                    <h2 className="section-title">Generated Files</h2>
                    <p className="text-sm text-white/40 mb-5">Files that mkagent can generate for your project:</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: 'AGENTS.md', desc: 'Multi-agent coordination' },
                            { name: 'CLAUDE.md', desc: 'Anthropic Claude rules' },
                            { name: 'GEMINI.md', desc: 'Google Gemini rules' },
                            { name: 'MEMORY.md', desc: 'Persistent project context' },
                            { name: '.cursorrules', desc: 'Cursor IDE integration' },
                            { name: 'COPILOT.md', desc: 'GitHub Copilot rules' },
                        ].map((f) => (
                            <div key={f.name} className="glass p-4">
                                <code className="text-accent-cyan/70 text-xs font-bold">{f.name}</code>
                                <p className="text-white/20 text-[11px] mt-1">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default APIReference
