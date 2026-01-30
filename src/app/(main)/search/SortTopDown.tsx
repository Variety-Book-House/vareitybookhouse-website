import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'title'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low → High', value: 'price-low' },
    { label: 'Price: High → Low', value: 'price-high' },
    { label: 'Title (A–Z)', value: 'title' },
    { label: 'Best Seller', value: 'title' },
]

interface SortDropdownProps {
    value: SortOption
    onChange: (value: SortOption) => void
}

export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
    const [open, setOpen] = useState(false)

    const activeLabel =
        SORT_OPTIONS.find(opt => opt.value === value)?.label

    return (
        <div className="relative">
            {/* BUTTON */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="
          w-full
          flex
          items-center
          justify-between
          text-sm
          uppercase
          tracking-widest
          opacity-60
          hover:opacity-100
          transition
        "
            >
                <span>{activeLabel}</span>

                <motion.span
                    animate={{ rotate: open ? 180 : 0, opacity: open ? 1 : 0.5 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                    <ChevronDown size={14} strokeWidth={1.5} />
                </motion.span>
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-3 text-xs uppercase tracking-wide mt-3">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value)
                                        setOpen(false)
                                    }}
                                    className={`
              text-left
              transition-opacity uppercase
              ${value === opt.value
                                            ? 'opacity-100 underline underline-offset-4'
                                            : 'opacity-40 hover:opacity-80'
                                        }
            `}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
