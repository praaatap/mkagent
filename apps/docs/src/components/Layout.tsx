import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-[#00f5ff]/30 antialiased font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <NavLink to="/" className="text-2xl font-bold text-white tracking-tighter no-underline">
                        mkagent
                    </NavLink>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <NavLink to="/docs" className={({ isActive }) => isActive ? "text-[#00f5ff]" : "text-white/60 hover:text-[#00f5ff] transition-colors no-underline"}>Documentation</NavLink>
                        <NavLink to="/terminal" className={({ isActive }) => isActive ? "text-[#00f5ff]" : "text-white/60 hover:text-[#00f5ff] transition-colors no-underline"}>Terminal</NavLink>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white no-underline">GitHub</a>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                <Outlet />
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center text-white/30 text-sm">
                © 2026 mkagent. Built by antigravity for the agentic future.
            </footer>
        </div>
    )
}

export default Layout
