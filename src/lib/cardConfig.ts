type CardSize = 'sm' | 'md' | 'lg'

export const CARD_CONFIG = {
    sm: {
        width: 150,
        height: 230,
        imageHeight: 140,
        title: 'text-[8px]',
        author: 'text-[6px]',
        price: 'text-[8px]',
    },
    md: {
        width: 160,
        height: 280,
        imageHeight: 180,
        title: 'text-[10px]',
        author: 'text-[8px]',
        price: 'text-[10px]',
    },
    lg: {
        width: 200,
        height: 320,
        imageHeight: 210,
        title: 'text-[14px]',
        author: 'text-[10px]',
        price: 'text-[14px]',
    },
} as const
