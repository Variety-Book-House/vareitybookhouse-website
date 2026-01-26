import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FilterSectionProps {
    title: string
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
}

export const FilterSection = ({
    title,
    isOpen,
    onToggle,
    children,
}: FilterSectionProps) => {
    return (
        <div className="mb-3">
            <button
                onClick={onToggle}
                className="
          w-full
          flex
          items-center
          justify-between
          text-left
          text-sm
          uppercase
          tracking-wide
          opacity-60
          hover:opacity-100
          transition
        "
            >
                <span>{title}</span>

                {/* ARROW */}
                <motion.span
                    animate={{
                        rotate: isOpen ? 180 : 0,
                        opacity: isOpen ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="ml-2"
                >
                    <ChevronDown size={14} strokeWidth={1.5} />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 uppercase flex flex-col gap-3 text-xs">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
