'use client'

import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'

export const ScrollContext = createContext<number>(0)

export function ScrollProvider({ children }: { children: ReactNode }) {
    const [section, setSection] = useState(0)

    useEffect(() => {
        const el = document.getElementById('snap-container')
        if (!el) return

        const onScroll = () => {
            setSection(Math.round(el.scrollTop / window.innerHeight))
        }

        el.addEventListener('scroll', onScroll)
        onScroll()

        return () => el.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <ScrollContext.Provider value={section}>
            {children}
        </ScrollContext.Provider>
    )
}
