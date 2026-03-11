import React, { useState, useEffect, useRef, useMemo } from 'react'

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
                { type: 'header', content: 'Welcome to mkagent interactive terminal v1.4.2' },
                { type: 'info', content: 'Type "help" to see available commands.' }
            ];

            for (const line of lines) {
                addHistory(line.type as any, line.content);
                await new Promise(r => setTimeout(r, 100));
            }
        };

        bootSequence();
    }, []);

    const filteredInput = useMemo(() => {
        const parts = input.split(' ');
        return parts.map((part, i) => {
            const isCmd = ['init', 'audit', 'stats', 'config', 'clear', 'help', 'whoami', 'matrix', 'scan'].includes(part.toLowerCase());
            return (
                <span key={i} className={isCmd ? 'text-green-400 font-bold' : 'text-gray-100'}>
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
            { id: Math.random().toString(36).substr(2, 9), type, content }
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
                addHistory('output', '  whoami   - Display current system identity');
                addHistory('output', '  matrix   - Enter the digital void');
                addHistory('output', '  scan     - Deep network penetration test');
                addHistory('output', '  clear    - Flush terminal session history');
            },
            'whoami': async () => {
                addHistory('info', 'ENTITY IDENTIFIED:');
                addHistory('output', '  NAME:    Architect-X');
                addHistory('output', '  ROLE:    Agentic Intelligence Supervisor');
                addHistory('output', '  CLEARANCE: LEVEL 5 (GOD-MODE)');
            },
            'matrix': async () => {
                setIsProcessing(true);
                addHistory('info', '» INITIATING MATRIX OVERRIDE...');
                await new Promise(r => setTimeout(r, 500));
                for (let i = 0; i < 5; i++) {
                    addHistory('output', Array(20).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join(' '));
                    await new Promise(r => setTimeout(r, 200));
                }
                addHistory('success', '» SYSTEM REALITY RESTORED.');
                setIsProcessing(false);
            },
            'scan': async () => {
                setIsProcessing(true);
                addHistory('info', '» COMMENCING NETWORK AUDIT...');
                await new Promise(r => setTimeout(r, 800));
                addHistory('info', '» TARGET: 127.0.0.1:8080');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('error', '!! VULNERABILITY DETECTED: UNSECURED LLM ENDPOINT !!');
                addHistory('success', '» MITIGATION STRATEGY DEPLOYED.');
                setIsProcessing(false);
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
                addHistory('info', '» GENERATING: Priming agentic context...');
                await new Promise(r => setTimeout(r, 1200));
                addHistory('success', '✔ ALLOCATION SUCCESS: Folder structure deployed.');
                setIsProcessing(false);
            },
            'audit': async () => {
                setIsProcessing(true);
                addHistory('info', '» MKAGENT AUDIT: Broadening scan scope...');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('info', '» SCANNING: Analyzing patterns in /src/core...');
                await new Promise(r => setTimeout(r, 1000));
                addHistory('success', '✔ HEALTH CHECK: No critical vulnerabilities found.');
                setIsProcessing(false);
            },
            'stats': async () => {
                addHistory('info', '» ANALYTICS: Project Snapshot');
                addHistory('output', '  AGENTS.md   | [▇▇▇▇▇▇▇▇▇▇▇▇▇▇░░░░░░] 74%');
                addHistory('output', '  CLAUDE.md   | [▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇░░] 88%');
                addHistory('output', '  MEMORY.md   | [▇▇▇▇░░░░░░░░░░░░░░░░] 22%');
                addHistory('success', 'Global Complexity Index: Optimized');
            },
            'config': async () => {
                addHistory('header', 'ACTIVE AI PROFILE');
                addHistory('output', '  Default Model: claude-3-5-sonnet');
                addHistory('output', '  Safety Level:  Rigorous');
            }
        };

        if (commands[c]) {
            await commands[c]();
        } else {
            addHistory('error', `bash: ${c}: command not found`);
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
        <div className="min-h-screen bg-[#0d0d0d] text-gray-300 font-mono text-[14px] leading-relaxed p-6 sm:p-12 md:p-24 selection:bg-green-500/30">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header text similar to reference */}
                <div className="mb-8 text-gray-500 select-none">
                    ~_ mkagent-demo-terminal ~ bash
                </div>

                <div
                    ref={scrollRef}
                    className="overflow-y-auto mb-4 custom-scrollbar"
                >
                    {history.map((item) => (
                        <div key={item.id} className="mb-2">
                            {item.type === 'command' ? (
                                <div className="flex gap-2">
                                    <span className="text-green-500 font-bold">$</span>
                                    <span className="text-gray-100">{item.content}</span>
                                </div>
                            ) : item.type === 'header' ? (
                                <div className="text-gray-100 mt-4 mb-2">
                                    {item.content}
                                </div>
                            ) : item.type === 'error' ? (
                                <div className="text-red-400">{item.content}</div>
                            ) : item.type === 'success' ? (
                                <div className="text-green-400">{item.content}</div>
                            ) : item.type === 'info' ? (
                                <div className="text-gray-100">{item.content}</div>
                            ) : (
                                <div className="whitespace-pre text-gray-400">{item.content}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                {!isProcessing && (
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center group/input mt-4">
                        <span className="text-green-500 font-bold select-none">$</span>
                        <div className="relative flex-1 bg-transparent">
                            <div className="absolute inset-0 flex items-center pointer-events-none opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                {filteredInput}
                                <span className="w-2.5 h-4 bg-gray-400 animate-pulse ml-0.5 mt-0.5 inline-block" />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-transparent caret-transparent placeholder:text-gray-600 focus:outline-none"
                                spellCheck="false"
                                autoComplete="off"
                            />
                        </div>
                    </form>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
            `}</style>
        </div>
    )
}

export default Terminal
