import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Zap, Shield, Cpu, Code } from 'lucide-react'

const BestPractices: React.FC = () => {
    const practices = [
        {
            icon: <Zap className="w-5 h-5 text-text-ghost" />,
            title: "Atomic Reasoning",
            desc: "Break down complex agent tasks into non-overlapping sub-processes for maximum reliability.",
            category: "Core"
        },
        {
            icon: <Shield className="w-5 h-5 text-text-ghost" />,
            title: "Memory Isolation",
            desc: "Always use ephemeral context windows for sensitive data handling between orchestrators.",
            category: "Security"
        },
        {
            icon: <Cpu className="w-5 h-5 text-text-ghost" />,
            title: "Local-First Inference",
            desc: "Prefer local LLM execution for architectural mapping to avoid data leakage.",
            category: "Architecture"
        },
        {
            icon: <Code className="w-5 h-5 text-text-ghost" />,
            title: "Strict Typing",
            desc: "Define rigid JSON schemas for all agent tool-calling to prevent stochastic failures.",
            category: "Engineering"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-24"
            >
                <span className="section-label">Redefined Standards</span>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Best <span className="text-text-dim">Practices.</span></h1>
                <p className="text-lg text-text-dim leading-relaxed max-w-2xl">
                    Engineering agentic systems requires a shift from deterministic logic to probabilistic orchestration. 
                    These principles form the foundation of the mkagent architecture.
                </p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle border border-border-subtle rounded-xl overflow-hidden mb-32"
            >
                {practices.map((item, i) => (
                    <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="bg-bg-void p-10 hover:bg-white/[0.02] group transition-colors cursor-default"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.1, x: 5 }}
                            className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity"
                        >
                            {item.icon}
                        </motion.div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-2 block">{item.category}</span>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                        <p className="text-sm text-text-dim leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card p-12 rounded-2xl border-white/10 group"
            >
                <div className="flex items-start gap-6">
                    <motion.div 
                        whileHover={{ rotate: -10 }}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors"
                    >
                        <AlertCircle className="w-6 h-6 text-text-ghost" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-4">Architecture First.</h2>
                        <p className="text-text-dim leading-relaxed mb-8">
                            Before deploying any agent, ensure your codebase is indexed and mapped correctly. 
                            Stochastic intelligence performs best when constrained by high-fidelity context.
                        </p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary text-[11px] font-bold uppercase tracking-widest"
                        >
                            Read Design Docs
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default BestPractices
