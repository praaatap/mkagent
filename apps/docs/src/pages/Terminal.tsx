import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Terminal as TerminalIcon,
    X,
    Minus,
    Square,
    Search,
    Plus,
    ChevronRight,
    Command,
    Shield,
    Activity,
    Settings,
    Lock,
    Cpu
} from 'lucide-react'

interface HistoryItem {
    id: string;
    type: 'command' | 'output' | 'error' | 'success' | 'info' | 'header';
    content: string;
    timestamp: string;
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([
        { id: '1', type: 'header', content: 'MKAGENT CORE ENGINE v1.2.0-beta', timestamp: new Date().toLocaleTimeString() },
        { id: '2', type: 'info', content: 'Connection: encrypted(AES-256)', timestamp: new Date().toLocaleTimeString() },
        { id: '3', type: 'info', content: 'Type "help" to list available intelligence modules.', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const tabs = ['bash', 'mkagent-core', 'audit-log'];

    const filteredInput = useMemo(() => {
        // Simple highlighting for common subcommands
        const parts = input.split(' ');
        return parts.map((part, i) => {
            const isCmd = ['init', 'audit', 'stats', 'config', 'clear', 'help'].includes(part.toLowerCase());
            return (
                <span key={i} className={isCmd ? 'text-accent-cyan font-bold' : 'text-white'}>
                    {part}{i < parts.length - 1 ? ' ' : ''}
                </span>
            );
        });
    }, [input]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addHistory = (type: HistoryItem['type'], content: string) => {
        setHistory(prev => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), type, content, timestamp: new Date().toLocaleTimeString() }
        ]);
    };

    const runCommand = async (cmd: string) => {
        const c = cmd.toLowerCase().trim();

        const commands: Record<string, () => Promise<void>> = {
            'help': async () => {
                addHistory('info', 'Available Intelligence Modules:');
                addHistory('output', '  init     - Bootstrap agentic project structure');
                addHistory('output', '  audit    - Scan codebase for security hotspots');
                addHistory('output', '  stats    - Aggregated agent complexity analytics');
                addHistory('output', '  config   - Manage AI profiles and model weighting');
                addHistory('output', '  clear    - Flush terminal session history');
            },
            'clear': async () => {
                setHistory([]);
            },
            'init': async () => {
                setIsProcessing(true);
                addHistory('info', '» MKAGENT INIT: Initializing secure pipeline...');
                await new Promise(r => setTimeout(r, 600));
                addHistory('info', '» ANALYZING: Detected modern tech stack (Next.js 14)');
                await new Promise(r => setTimeout(r, 800));
                addHistory('info', '» GENERATING: Priming agentic context via Claude 3.5...');
                await new Promise(r => setTimeout(r, 1200));
                addHistory('success', '✔ ALLOCATION SUCCESS: Folder structure & .md rules deployed.');
                setIsProcessing(false);
            },
            'audit': async () => {
                setIsProcessing(true);
                addHistory('info', '» MKAGENT AUDIT: Broadening scan scope...');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('info', '» SCANNING: Analyzing patterns in /src/core...');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('success', '✔ HEALTH CHECK: 0 critical vulnerabilities. 2 TODOs flagged.');
                addHistory('header', 'MEMORY UPDATE: Memory.md automatically synchronized.');
                setIsProcessing(false);
            },
            'stats': async () => {
                addHistory('info', '» ANALYTICS: Project Snapshot');
                addHistory('output', '  AGENTS.md   | [▇▇▇▇▇▇▇▇▇▇▇▇▇▇░░░░░░] 74% optimized');
                addHistory('output', '  CLAUDE.md   | [▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇░░] 88% optimized');
                addHistory('output', '  MEMORY.md   | [▇▇▇▇░░░░░░░░░░░░░░░░] 22% filled');
                addHistory('success', 'Global Complexity Index: Low (Safe for LLM parsing)');
            },
            'config': async () => {
                addHistory('header', 'ACTIVE AI PROFILE');
                addHistory('output', '  Default Model: claude-3-5-sonnet');
                addHistory('output', '  Safety Level:  Rigorous');
                addHistory('output', '  Key Mask:      sk-••••••••42xy');
            }
        };

        if (commands[c]) {
            await commands[c]();
        } else {
            addHistory('error', `Unknown directive: "${c}"`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const cmd = input.trim();
        addHistory('command', cmd);
        setInput('');
        await runCommand(cmd);
    };

    return (
        <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen bg-linear-to-b from-transparent to-black/20">
            <header className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 rounded-full border border-accent-cyan/20 text-accent-cyan text-xs font-black uppercase tracking-widest mb-8"
                >
                    <Activity className="w-3 h-3" />
                    Interactive Lab v1.2
                </motion.div>
                <h2 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter bg-linear-to-b from-white to-white/30 bg-clip-text text-transparent">
                    Developer <span className="text-accent-cyan italic">Sandbox</span>
                </h2>
                <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
                    A fully immersive, glass-morphic development environment. Interact with <span className="text-white font-bold">mkagent</span> logic in real-time.
                </p>
            </header>

            <div className="max-w-5xl mx-auto relative group">
                {/* Dynamic Glow Background */}
                <div className="absolute -inset-10 bg-accent-cyan/5 rounded-[40px] blur-[120px] opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                {/* Multi-layered Glass Terminal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-3xl overflow-hidden"
                >
                    {/* Glass Overlay for depth */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none"></div>

                    {/* Window Controls & Tabs */}
                    <div className="bg-white/5 border-b border-white/5 px-6 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                            </div>
                            <div className="flex items-center gap-4 text-white/20">
                                <Search className="w-4 h-4 cursor-not-allowed" />
                                <Lock className="w-4 h-4 cursor-not-allowed" />
                                <button onClick={() => setHistory([])} className="hover:text-accent-cyan transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs Bar */}
                        <div className="flex items-center gap-1">
                            {tabs.map((tab, idx) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(idx)}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-t-xl text-[10px] font-black uppercase tracking-widest transition-all
                                        ${activeTab === idx
                                            ? 'bg-black/60 text-accent-cyan border-t border-x border-white/10'
                                            : 'text-white/40 hover:bg-white/5'}
                                    `}
                                >
                                    {tab === 'bash' ? <TerminalIcon className="w-3 h-3" /> : tab === 'mkagent-core' ? <Cpu className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                    {tab}
                                </button>
                            ))}
                            <button className="p-3 text-white/20 hover:text-white transition-colors">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Terminal Interior */}
                    <div
                        ref={scrollRef}
                        className="p-10 text-left font-mono text-sm leading-relaxed min-h-[500px] max-h-[650px] overflow-y-auto bg-black/60 custom-scrollbar scroll-smooth"
                    >
                        <AnimatePresence initial={false}>
                            {history.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mb-3 group/line flex items-start gap-4`}
                                >
                                    <span className="text-white/10 text-[10px] select-none pt-1">{item.timestamp}</span>

                                    <div className="flex-1">
                                        {item.type === 'command' ? (
                                            <div className="flex items-center gap-3">
                                                <ChevronRight className="w-4 h-4 text-accent-purple" />
                                                <span className="text-white/40">mkagent</span>
                                                <span className="text-white font-bold">{item.content}</span>
                                            </div>
                                        ) : item.type === 'header' ? (
                                            <div className="bg-accent-cyan/10 border border-accent-cyan/20 px-4 py-3 rounded-xl text-accent-cyan font-black text-xs inline-block my-2">
                                                {item.content}
                                            </div>
                                        ) : (
                                            <div className={`
                                                ${item.type === 'error' ? 'text-red-400 border-l-2 border-red-500/50 pl-4' : ''}
                                                ${item.type === 'success' ? 'text-accent-cyan' : ''}
                                                ${item.type === 'info' ? 'text-white/40 font-bold' : 'text-white/70'}
                                                ${item.type === 'output' ? 'whitespace-pre opacity-90' : ''}
                                            `}>
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Input Area */}
                        {!isProcessing && (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleSubmit}
                                className="mt-8 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-accent-cyan/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
                                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Local</span>
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white/20 select-none">mkagent</span>
                                    <div className="relative flex-1">
                                        <div className="absolute inset-0 flex items-center pointer-events-none opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                            {filteredInput}
                                        </div>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="w-full bg-transparent border-none outline-none text-white font-bold caret-accent-cyan"
                                            placeholder="Type a command (e.g. init, stats)..."
                                        />
                                    </div>
                                </div>
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] text-white/30 font-bold">
                                    <Command className="w-2.5 h-2.5" />
                                    <span>ENTER</span>
                                </kbd>
                            </motion.form>
                        )}

                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 flex items-center gap-4 bg-accent-cyan/5 p-4 rounded-2xl border border-accent-cyan/10"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan animate-spin"></div>
                                </div>
                                <span className="text-accent-cyan/60 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Quantum Engine Processing...
                                </span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                    {[
                        { icon: Shield, title: "Zero Trust", color: "text-accent-cyan" },
                        { icon: Activity, title: "Deep Context", color: "text-accent-purple" },
                        { icon: Settings, title: "Auto Optimization", color: "text-white" }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[24px] flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className={`p-3 rounded-2xl bg-black/40 ${card.color}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] text-white/60">{card.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 245, 255, 0.2);
                }
            `}</style>
        </div>
    )
}

export default Terminal
