import { useEffect, useState } from 'react'
import { CARD_CONFIG } from '@/lib/cardConfig'

type CardSize = 'sm' | 'md' | 'lg'

const GAP = 24

const getCardSize = (width: number): CardSize => {
    if (width < 640) return 'sm'
    if (width < 1024) return 'md'
    return 'lg'
}

export function useCardGrid() {
    const [cardSize, setCardSize] = useState<CardSize>('md')

    useEffect(() => {
        const update = () => {
            setCardSize(getCardSize(window.innerWidth))
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    return {
        cardSize,
        cardWidth: CARD_CONFIG[cardSize].width,
        gap: GAP,
    }
}
