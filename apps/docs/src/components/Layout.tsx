import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
    const { pathname } = useLocation()
    const isDocsPage = pathname.startsWith('/docs') || pathname === '/terminal'

    return (
        <div className="min-h-screen bg-bg-dark text-white selection:bg-accent-cyan/30 antialiased font-sans flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-2xl border-b border-white/[0.04]">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <NavLink to="/" className="flex items-center gap-3 no-underline">
                            <div className="w-7 h-7 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg flex items-center justify-center">
                                <span className="text-accent-cyan text-xs font-black">M</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">mkagent</span>
                            <span className="text-[9px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded-full tracking-widest uppercase">v1.0</span>
                        </NavLink>
                        <div className="hidden md:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-widest">
                            <NavLink to="/docs" className={({ isActive }) => isActive ? "text-accent-cyan no-underline" : "text-white/30 hover:text-white/60 transition-colors no-underline"}>Docs</NavLink>
                            <NavLink to="/terminal" className={({ isActive }) => isActive ? "text-accent-cyan no-underline" : "text-white/30 hover:text-white/60 transition-colors no-underline"}>Playground</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/praaatap/mkagent" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors no-underline text-[11px] font-semibold uppercase tracking-widest hidden sm:block">
                            GitHub
                        </a>
                        <NavLink to="/docs" className="no-underline">
                            <button className="px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold rounded-full hover:bg-accent-cyan/20 transition-colors cursor-pointer uppercase tracking-widest">
                                Get Started
                            </button>
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className={`flex flex-1 w-full max-w-[1600px] mx-auto`}>
                {isDocsPage && <Sidebar />}
                <main className={`flex-1 pt-16 ${isDocsPage ? 'px-8 lg:px-12' : ''}`}>
                    <Outlet />
                </main>
            </div>

            <footer className="w-full border-t border-white/[0.04] py-10 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3 text-xs text-white/15 font-medium">
                        <div className="w-5 h-5 bg-accent-cyan/10 rounded-md flex items-center justify-center">
                            <span className="text-accent-cyan text-[8px] font-black">M</span>
                        </div>
                        © 2026 mkagent. Built for AI-native engineering.
                    </div>
                    <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest text-white/15">
                        <a href="https://github.com/praaatap/mkagent" className="hover:text-white/40 transition-colors no-underline">GitHub</a>
                        <a href="#" className="hover:text-white/40 transition-colors no-underline">NPM</a>
                        <a href="#" className="hover:text-white/40 transition-colors no-underline">Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout
