import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon } from 'lucide-react'

interface HistoryItem {
    id: string;
    type: 'command' | 'output' | 'error' | 'success' | 'info' | 'header';
    content: string;
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bootSequence = async () => {
            const lines = [
                { type: 'header', content: 'MKAGENT CORE INTERFACE v1.4.2 STABLE' },
                { type: 'info', content: 'Access level: Architect-X. System initialized.' },
                { type: 'info', content: 'Type "help" to list available modules.' }
            ];

            for (const line of lines) {
                addHistory(line.type as any, line.content);
                await new Promise(r => setTimeout(r, 100));
            }
        };

        bootSequence();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addHistory = (type: HistoryItem['type'], content: string) => {
        setHistory(prev => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), type, content }
        ]);
    };

    const runCommand = async (cmd: string) => {
        const c = cmd.toLowerCase().trim();

        const commands: Record<string, () => Promise<void>> = {
            'help': async () => {
                addHistory('info', 'Available Modules:');
                addHistory('output', '  init     - Setup project');
                addHistory('output', '  audit    - Security scan');
                addHistory('output', '  stats    - Analytics');
                addHistory('output', '  clear    - Flush session');
            },
            'clear': async () => {
                setHistory([]);
            },
            'init': async () => {
                setIsProcessing(true);
                addHistory('info', '» Initializing...');
                await new Promise(r => setTimeout(r, 800));
                addHistory('success', '✓ project-alpha created.');
                setIsProcessing(false);
            },
            'audit': async () => {
                setIsProcessing(true);
                addHistory('info', '» Scanning...');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('success', '✓ No vulnerabilities found.');
                setIsProcessing(false);
            }
        };

        if (commands[c]) {
            await commands[c]();
        } else {
            addHistory('error', `error: command not found: ${c}`);
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
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-bg-void pt-32 pb-32 px-8 font-sans"
        >
            <div className="max-w-4xl mx-auto w-full">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-12"
                >
                    <TerminalIcon className="w-5 h-5 text-text-ghost" />
                    <h1 className="text-xl font-bold tracking-tight uppercase text-[12px] tracking-[0.2em] text-text-dim">Playground</h1>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="terminal-well min-h-[500px] flex flex-col relative overflow-hidden group border-white/5 bg-black"
                >
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4"
                    >
                        <AnimatePresence mode='popLayout'>
                            {history.map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[13px] leading-relaxed"
                                >
                                    {item.type === 'command' ? (
                                        <div className="flex gap-3">
                                            <span className="text-text-dim select-none">$</span>
                                            <span className="text-text-ghost font-medium">{item.content}</span>
                                        </div>
                                    ) : item.type === 'header' ? (
                                        <div className="text-text-ghost font-bold mb-4 py-1 tracking-widest text-[11px]">
                                            {item.content}
                                        </div>
                                    ) : item.type === 'error' ? (
                                        <div className="text-text-ghost bg-white/5 px-2 py-1 rounded inline-block border border-white/10">{item.content}</div>
                                    ) : item.type === 'success' ? (
                                        <div className="text-text-ghost font-bold italic">{item.content}</div>
                                    ) : item.type === 'info' ? (
                                        <div className="text-text-dim italic">{item.content}</div>
                                    ) : (
                                        <div className="whitespace-pre text-text-dim pl-6">{item.content}</div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {!isProcessing && (
                        <motion.form 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onSubmit={handleSubmit} 
                            className="flex gap-3 items-center mt-8 pt-8 border-t border-white/5"
                        >
                            <span className="text-text-dim select-none">$</span>
                            <input
                                autoFocus
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-text-ghost focus:outline-none py-1 placeholder:text-white/10 font-mono"
                                spellCheck="false"
                                autoComplete="off"
                                placeholder="Enter command..."
                            />
                        </motion.form>
                    )}
                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </motion.div>
    )
}

export default Terminal
