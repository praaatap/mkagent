import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
    const { pathname } = useLocation()
    const isDocsPage = pathname.startsWith('/docs') || pathname === '/terminal'

    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-[#00f5ff]/30 antialiased font-sans flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <NavLink to="/" className="text-2xl font-bold text-white tracking-tighter no-underline">
                            mkagent
                        </NavLink>
                        <div className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest">
                            <NavLink to="/docs" className={({ isActive }) => isActive ? "text-[#00f5ff]" : "text-white/40 hover:text-white transition-colors no-underline"}>Documentation</NavLink>
                            <NavLink to="/terminal" className={({ isActive }) => isActive ? "text-[#00f5ff]" : "text-white/40 hover:text-white transition-colors no-underline"}>Playground</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                            <span className="text-xs font-bold uppercase tracking-widest">Github</span>
                        </a>
                        <button className="px-5 py-2 bg-[#00f5ff] text-black text-xs font-bold rounded-full hover:scale-105 transition-transform">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`flex flex-1 w-full max-w-[1600px] mx-auto`}>
                {isDocsPage && <Sidebar />}
                <main className={`flex-1 pt-20 ${isDocsPage ? 'px-8 lg:px-12' : ''}`}>
                    <Outlet />
                </main>
            </div>

            <footer className="w-full border-t border-white/5 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-xs text-white/20 font-medium">
                        © 2026 mkagent. Built for the agentic future.
                    </div>
                    <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-white/30">
                        <a href="#" className="hover:text-white transition-colors no-underline">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors no-underline">Terms</a>
                        <a href="#" className="hover:text-white transition-colors no-underline">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout
