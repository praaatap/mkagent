import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
    const location = useLocation()
    const isDocsPage = location.pathname.startsWith('/docs') || location.pathname === '/terminal'

    return (
        <div className="min-h-screen bg-bg-void text-text-ghost selection:bg-white selection:text-black antialiased font-sans flex flex-col">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-void/80 backdrop-blur-md border-b border-border-subtle">
                <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <NavLink to="/" className="flex items-center gap-3 no-underline group">
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="text-xl font-black tracking-tighter text-text-ghost lowercase"
                            >
                                mkagent.
                            </motion.span>
                        </NavLink>
                        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-text-dim">
                            <NavLink to="/docs" className={({ isActive }) => isActive ? "text-text-ghost no-underline" : "hover:text-text-ghost transition-colors no-underline"}>Docs</NavLink>
                            <NavLink to="/terminal" className={({ isActive }) => isActive ? "text-text-ghost no-underline" : "hover:text-text-ghost transition-colors no-underline"}>Playground</NavLink>
                            <a href="https://github.com/praaatap/mkagent" className="hover:text-text-ghost transition-colors no-underline text-text-dim">GitHub</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NavLink to="/docs" className="no-underline">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-1.5 border border-white text-text-ghost text-[10px] font-bold rounded hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                            >
                                get access
                            </motion.button>
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className={`flex flex-1 w-full max-w-[1600px] mx-auto overflow-hidden`}>
                {isDocsPage && <Sidebar />}
                
                <main className={`flex-1 pt-16 h-screen overflow-y-auto ${isDocsPage ? 'px-8 lg:px-20 pb-32' : ''}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <footer className="w-full border-t border-border-subtle py-16 bg-bg-void mt-auto">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 text-text-dim">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em]">
                        © 2026 MKAGENT LABS. REDEFINED.
                    </div>
                    <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest">
                        <a href="https://github.com/praaatap/mkagent" className="hover:text-text-ghost transition-colors no-underline text-text-dim">Source</a>
                        <a href="#" className="hover:text-text-ghost transition-colors no-underline text-text-dim">Legal</a>
                        <a href="#" className="hover:text-text-ghost transition-colors no-underline text-text-dim">Artifacts</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout
