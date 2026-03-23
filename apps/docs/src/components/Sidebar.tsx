import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    BookOpen,
    Terminal,
    Cpu,
    Command,
    ShieldCheck,
    Layout as LayoutIcon,
    Server,
} from 'lucide-react'

const Sidebar: React.FC = () => {
    const sections = [
        {
            title: 'Getting Started',
            items: [
                { name: 'Overview', path: '/docs', icon: BookOpen },
                { name: 'Playground', path: '/terminal', icon: Terminal },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { name: 'API Reference', path: '/docs/api', icon: LayoutIcon },
                { name: 'AI Providers', path: '/docs/best-practices', icon: Cpu },
            ]
        },
        {
            title: 'Advanced',
            items: [
                { name: 'CLI Commands', path: '/terminal', icon: Command },
                { name: 'Local LLMs', path: '/docs', icon: Server },
                { name: 'Security', path: '/docs/best-practices', icon: ShieldCheck },
            ]
        },
    ]

    return (
        <aside className="w-64 border-r border-border-subtle h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 py-8 px-6 hidden lg:block bg-bg-void">
            <nav className="space-y-8">
                {sections.map((section, sectionIdx) => (
                    <motion.div 
                        key={section.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sectionIdx * 0.1 }}
                    >
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-dim mb-4 px-2">
                            {section.title}
                        </h4>
                        <div className="space-y-1">
                            {section.items.map((item, itemIdx) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.path === '/docs'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 text-[12px] rounded-md no-underline transition-all duration-200 font-medium ${isActive
                                            ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            : "text-text-dim hover:text-text-ghost hover:bg-white/5"
                                        }`
                                    }
                                >
                                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
