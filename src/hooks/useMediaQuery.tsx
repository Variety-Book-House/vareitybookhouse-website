'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to track a CSS media query.
 *
 * @param query - string media query (e.g. '(max-width: 640px)')
 * @returns boolean - whether the query matches
 */
export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia(query)

        const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)

        // Initial check
        setMatches(mediaQuery.matches)

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [query])

    return matches
}
