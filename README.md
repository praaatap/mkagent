# 🤖 mkagent — The Intelligence Layer for Modern Dev Stacks

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Turbo](https://img.shields.io/badge/Built%20with-Turbo-ef4444.svg)](https://turbo.build/)

**mkagent** is a technically sophisticated CLI that bridges the gap between your local codebase and AI agents. It doesn't just scaffold files; it **understands** your technology stack, project architecture, and developer patterns to create a seamless "Intelligence Layer" for AI pairs like Claude, Gemini, and Cursor.

---

## ⚡ Core Philosophy: "Intelligence-First"

Traditional scaffolding tools focus on folders and files. **mkagent** focuses on **Knowledge Transfer**. It distills your messy project structure into a high-fidelity mental model that AI agents can consume to act with senior-level precision from second one.

---

## 🚀 Experience the Edge

### 🔍 Deep Stack Detection
Automatically identifies Next.js (App Router), React, Node.js, Python, and Monorepos (Turbo). It maps your dependencies, config files, and architectural patterns.

### 🧠 Agent Rule Generation
Generates precision-tuned `.md` and `.rules` files for:
- **CLAUDE.md**: Directives for Anthropic Claude.
- **GEMINI.md**: Optimization for Google Gemini.
- **AGENTS.md**: Central coordination for multi-agent workflows.
- **.cursorrules**: Deep integration for the Cursor IDE.

### 🛡 Zero-Trust Auditing
`mkagent audit` scans your codebase for security hotspots, hardcoded secrets, and "Context Gaps" (TODOs and stray logs), and synchronizes them directly into your project's `MEMORY.md`.

---

## 🛠 Installation & Setup

### Install via NPM
```bash
npm install -g mkagent
```

### Initial Configuration
Link your preferred AI intelligence (OpenAI, Anthropic, or Google Gemini):
```bash
mkagent config
```

### Bootstrap Your Project
```bash
mkagent init
```

---

## 📖 Command Reference

| Command | Description |
| :--- | :--- |
| `init` | Scaffold high-fidelity agent files for the current project. |
| `doctor` | Live health-check of your AI configuration and project context. |
| `audit` | Scan for secrets/TODOs and update your project memory. |
| `stats` | Visual breakdown of your local project intelligence density. |
| `regenerate` | Refresh agent files with updated project context. |
| `chat` | Start a precision-context terminal session with your AI. |

---

## 🏗 Modular Architecture

- **`packages/mkagent`**: The core CLI engine built with TypeScript & ESM.
- **`apps/docs`**: A premium documentation portal and interactive sandbox.
- **Intelligence Layer**: Centralized logic in `detect.ts` for deep structural analysis.

---

## 🔐 Safety & Privacy

- **Masked Keys**: All API keys are masked in terminal outputs.
- **Local Priority**: Scanning happens locally; only technical context is sent to the LLM.
- **Professional Standard**: Strictly no emojis and human-like technical English for maximum LLM parsing reliability.

---

<div align="center">
  <br />
  <p>Built for the next generation of AI-Native Engineering.</p>
  <sub>Copyright © 2026 mkagent contributors.</sub>
</div>