import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    BookOpen,
    Terminal,
    Settings,
    Cpu,
    Command,
    ShieldCheck,
    Layout as LayoutIcon,
    Search,
    ChevronRight
} from 'lucide-react'

const Sidebar: React.FC = () => {
    const sections = [
        {
            title: 'Introduction',
            items: [
                { name: 'Overview', path: '/docs', icon: BookOpen },
                { name: 'Getting Started', path: '/docs/getting-started', icon: Terminal },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { name: 'AI Providers', path: '/docs/providers', icon: Cpu },
                { name: 'Environment', path: '/docs/config', icon: Settings },
            ]
        },
        {
            title: 'Core Concepts',
            items: [
                { name: 'CLI Commands', path: '/terminal', icon: Command },
                { name: 'API Reference', path: '/docs/api', icon: LayoutIcon },
                { name: 'Guardrails', path: '/docs/guardrails', icon: ShieldCheck },
            ]
        },
        {
            title: 'Resources',
            items: [
                { name: 'Best Practices', path: '/docs/best-practices', icon: BookOpen },
                { name: 'Changelog', path: '/docs/changelog', icon: Terminal },
            ]
        }
    ]

    return (
        <aside className="w-64 border-r border-white/5 h-[calc(100vh-5rem)] overflow-y-auto sticky top-20 py-8 px-6 hidden lg:block scrollbar-hide">
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search docs..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#00f5ff]/50 transition-colors"
                />
            </div>

            <nav className="space-y-8">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mb-4 px-2">
                            {section.title}
                        </h4>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center justify-between group px-2 py-2 rounded-lg transition-all no-underline
                                        ${isActive ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'text-white/50 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#00f5ff]' : 'group-hover:text-white'}`} />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                                        </>
                                    )}
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
