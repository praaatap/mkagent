import React from 'react'
import { NavLink } from 'react-router-dom'
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
        <aside className="w-56 border-r border-white/[0.04] h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 py-6 px-4 hidden lg:block">
            <nav className="space-y-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/15 mb-3 px-3">
                            {section.title}
                        </h4>
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.path === '/docs'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 px-3 py-2 text-[12px] rounded-lg no-underline transition-all ${isActive
                                            ? "bg-accent-cyan/8 text-accent-cyan font-semibold"
                                            : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
                                        }`
                                    }
                                >
                                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
