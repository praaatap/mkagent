import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Globe, Shield, Zap, Terminal, Server, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
    const features = [
        {
            icon: <Cpu className="w-5 h-5 text-text-ghost" />,
            title: "Architectural Intelligence",
            description: "Deep codebase mapping with automated context injection.",
        },
        {
            icon: <Zap className="w-5 h-5 text-text-ghost" />,
            title: "Sub-second Latency",
            description: "Optimized inference pipelines for real-time agentic feedback.",
        },
        {
            icon: <Shield className="w-5 h-5 text-text-ghost" />,
            title: "Zero-Trust Security",
            description: "Strict isolation or local-only LLM orchestration.",
        },
        {
            icon: <Globe className="w-5 h-5 text-text-ghost" />,
            title: "Universal Protocols",
            description: "Seamless integration with any MCP-compliant resource.",
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            className="relative pt-32 pb-48 px-8 overflow-hidden"
        >
            <section className="relative z-10 max-w-5xl mx-auto text-center mb-40">
                <motion.div 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-white/5 mb-8"
                >
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">v1.4.2 stable released</span>
                </motion.div>

                <motion.h1 
                    variants={itemVariants}
                    className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                >
                    mkagent <br />
                    <span className="text-text-dim">Intelligence Layer.</span>
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Orchestrate high-performance AI agents with surgical precision. 
                    The missing bridge between raw code and agentic reasoning.
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/docs" className="no-underline">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                        >
                            Get Early Access
                        </motion.button>
                    </Link>
                    <Link to="/terminal" className="no-underline">
                        <motion.button 
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-secondary"
                        >
                            Explore Playground <ArrowRight className="w-4 h-4 ml-1" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <motion.section 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-6xl mx-auto px-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle border border-border-subtle overflow-hidden rounded-xl">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-bg-void p-10 hover:bg-white/[0.02] transition-colors group cursor-default"
                        >
                            <motion.div 
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity"
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-sm text-text-dim leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <section className="mt-48 max-w-5xl mx-auto px-4 text-center">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-border-subtle pt-24"
                >
                    <h2 className="text-4xl font-bold tracking-tighter mb-12">Built for the next <span className="text-text-dim italic">standard.</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 filter grayscale contrast-125">
                        <motion.div whileHover={{ opacity: 1, scale: 1.1 }} className="flex items-center justify-center gap-2 cursor-default"><Server className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-tighter text-[10px]">LLM.OS</span></motion.div>
                        <motion.div whileHover={{ opacity: 1, scale: 1.1 }} className="flex items-center justify-center gap-2 cursor-default"><Terminal className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-tighter text-[10px]">AGENT.CLI</span></motion.div>
                        <motion.div whileHover={{ opacity: 1, scale: 1.1 }} className="flex items-center justify-center gap-2 cursor-default"><Cpu className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-tighter text-[10px]">NEURAL.IO</span></motion.div>
                        <motion.div whileHover={{ opacity: 1, scale: 1.1 }} className="flex items-center justify-center gap-2 cursor-default"><Shield className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-tighter text-[10px]">ZERO.LATENCY</span></motion.div>
                    </div>
                </motion.div>
            </section>
        </motion.div>
    )
}

export default Home
