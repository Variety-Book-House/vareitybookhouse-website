'use client'
import { useEffect, useRef } from 'react'

export function useSnapScroll() {
    const current = useRef(0)
    const isScrolling = useRef(false)

    useEffect(() => {
        const el = document.getElementById('snap-container')
        if (!el) return

        const sections = el.children.length

        const scrollToSection = (index: number) => {
            isScrolling.current = true
            el.scrollTo({
                top: index * window.innerHeight,
                behavior: 'smooth',
            })
            setTimeout(() => (isScrolling.current = false), 700)
        }

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (isScrolling.current) return

            if (e.deltaY > 0 && current.current < sections - 1) {
                current.current += 1
            } else if (e.deltaY < 0 && current.current > 0) {
                current.current -= 1
            }

            scrollToSection(current.current)
        }

        el.addEventListener('wheel', onWheel, { passive: false })

        return () => el.removeEventListener('wheel', onWheel)
    }, [])
}
