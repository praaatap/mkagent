import React from 'react'

interface TOCItem {
    id: string
    label: string
    level: number
}

interface TableOfContentsProps {
    items: TOCItem[]
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
    return (
        <aside className="w-64 sticky top-32 h-fit py-8 px-6 hidden xl:block">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mb-6 px-2">
                On this page
            </h4>
            <nav className="space-y-4">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`
              block text-xs font-medium transition-colors no-underline
              ${item.level === 2 ? 'pl-2 text-white/40 hover:text-white' : 'pl-6 text-white/30 hover:text-white'}
            `}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="mt-12 p-6 bg-linear-to-b from-accent-cyan/10 to-transparent border border-accent-cyan/20 rounded-2xl">
                <h5 className="text-xs font-bold mb-2">Need help?</h5>
                <p className="text-[10px] text-white/40 leading-relaxed mb-4">
                    Join our Discord community for real-time support and agent engineering tips.
                </p>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold transition-colors">
                    Join Discord
                </button>
            </div>
        </aside>
    )
}

export default TableOfContents
