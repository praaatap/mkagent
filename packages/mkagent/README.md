# 🤖 mkagent

**The Intelligence Layer for AI-Native Engineering**

`mkagent` is a high-fidelity CLI tool designed to bridge the "Context Gap" between your local codebase and AI assistants (Claude, Gemini, GPT-4). It deep-scans your project architecture to generate precision-tuned directive files that transform generic LLMs into elite, project-aware engineering agents.

---

## 💎 Why mkagent?

Standard LLMs often lack context about your specific stack, directory structure, and coding standards. `mkagent` solves this by:
- **Structural Intelligence**: Automatically detecting your tech stack (Next.js, Python, Monorepos).
- **Zero-Latency Rules**: Deploying local `.md` rules that AI agents read instantly.
- **Project Memory**: Maintaining a persistent `MEMORY.md` to track evolution and prevents context loss.
- **Local-First AI**: First-class support for **Ollama** and **LM Studio** for fully offline, private development.

---

## 🚀 Quick Start

### 1. Installation
Install globally via NPM to use the `mkagent` command anywhere:
```bash
npm install -g mkagent
```

### 2. Configuration
Connect your preferred AI model. Supports cloud APIs and local endpoints:
```bash
mkagent config
```
*Follow the interactive prompts to link OpenAI, Anthropic, Google Gemini, or a Local Ollama instance.*

### 3. Initialize
Bootstrap your project's intelligence layer:
```bash
mkagent init
```
*This generates high-fidelity rules like `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` tailored to your code.*

---

## 🛠 Command Reference

| Command | Description |
| :--- | :--- |
| `init` | **Bootstrap**: Deep-scans project and generates localized agent files. |
| `config` | **Setup**: Manage API keys, active profiles, and local LLM endpoints. |
| `doctor` | **Health Check**: Live verification of AI connectivity and project context. |
| `audit` | **Scan**: Finds hardcoded secrets, TODOs, and stray logs. Updates `MEMORY.md`. |
| `regenerate` | **Sync**: Refreshes all agent files when your project structure evolves. |
| `stats` | **Insight**: Visual breakdown of agent file density and complexity. |
| `chat` | **Instant AI**: Start a precision-context terminal session with your model. |
| `sync` | **Cloud Link**: Push or pull agent files via GitHub Gists. |

---

## 🔌 AI Provider Support

`mkagent` reaches beyond basic APIs to support professional engineering workflows:

### ☁️ Cloud Providers
- **Anthropic**: Optimized for `CLAUDE.md` and high-reasoning tasks.
- **Google Gemini**: Deep integration with `GEMINI.md` and large context windows.
- **OpenAI**: Fast, reliable rules for GPT-4o and O1 models.

### 🏠 Local & Private (Self-Hosted)
- **Ollama**: Works fully offline. We recommend `llama3.2` or `mistral`.
- **LM Studio**: Point `mkagent` at any local server running on `localhost`.
- **OpenAI-Compatible**: Support for vLLM, LocalAI, and any OpenAI-spec endpoint.

---

## 📂 Intelligence Artifacts

`mkagent` generates several specialized files to guide your AI:

- **`AGENTS.md`**: The "Master Blueprint" for multi-agent coordination.
- **`CLAUDE.md`**: Hardened rules for Anthropic's Claude (optimized for reasoning).
- **`GEMINI.md`**: Technical directives for Google's Gemini models.
- **`.cursorrules`**: Deep integration for the Cursor IDE.
- **`MEMORY.md`**: A persistent ledger of project decisions, evolution, and audit findings.

---

## 🛡 Security & Privacy

- **Masked Keys**: All sensitive API keys are masked in terminal output and stored in `~/.mkagent/config.json`.
- **Offline Mode**: Use the "Local (Ollama)" profile to ensure no code ever leaves your machine.
- **Zero-Trust**: Automated code audits catch leaked secrets before they are committed.

---

<p align="center">
  <sub>Built for the next generation of AI-Native Engineers.</sub><br/>
  <b><a href="https://github.com/praaatap/mkagent">GitHub</a> • <a href="https://mkagent.dev">Documentation</a></b>
</p>
