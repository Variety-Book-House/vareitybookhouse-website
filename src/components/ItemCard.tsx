'use client'
import { cn } from "@/lib/utils"
import { ProductHeartIcon } from "./icons/ProductHeartIcon"
import { ProductCartIcon } from "./icons/ProductCartIcon"

export interface Book {
    id?: string
    volumeInfo?: {
        title?: string
        authors?: string[]
        imageLinks?: { thumbnail?: string }
    }
    saleInfo?: {
        listPrice?: { amount?: number }
    }
}

interface ItemCardProps {
    book: Book
    onClick?: () => void
    className?: string
    show?: boolean
}

const ItemCard = ({ book, onClick, className, show = false }: ItemCardProps) => {
    const title = book.volumeInfo?.title ?? 'Untitled'
    const author = book.volumeInfo?.authors?.[0] ?? 'Unknown'
    const price = book.saleInfo?.listPrice?.amount ?? 299

    return (
        <div
            onClick={onClick}
            className={cn(
                `
        flex flex-col bg-white cursor-pointer overflow-hidden
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-[2px]

        /* CARD SIZE */
        
        ${show ? 'w-[200px] h-[320px]' : 'w-[150px] h-[230px] sm:w-[160px] sm:h-[280px] lg:w-[200px] lg:h-[320px]'}
        `,
                className
            )}
        >
            {/* IMAGE */}
            <div
                className={`bg-[#e3e3e3] flex items-center justify-center
          
          ${show ? 'h-[220px]' : 'h-[150px] sm:h-[180px] lg:h-[220px]'}
        `}
            >
                <img
                    src="/image 14.png"
                    alt={title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* TEXT */}
            <div
                className={`
          flex justify-between px-3 py-2

          
           ${show ? 'h-[100px]' : 'h-[80px] sm:h-[100px] lg:h-[100px]'}
        `}
            >
                <div>
                    <h3
                        className={`
              

              
                ${show ? 'text-[14px]' : 'text-[12px] sm:text-[12px] lg:text-[14px]'}
            `}
                    >
                        {title.toUpperCase()}
                    </h3>

                    <p
                        className={`
              uppercase tracking-widest  text-neutral-500
font-light line-clamp-1
              
               ${show ? 'text-[12px]' : 'text-[10px] sm:text-[10px] lg:text-[12px]'}
            `}
                    >
                        {author}
                    </p>

                    <p
                        className={`
              
line-clamp-1
              
              ${show ? 'text-[12px]' : 'text-[12px] sm:text-[12px] lg:text-[14px]'}
            `}
                    >
                        ₹{price}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <ProductCartIcon />
                    <ProductHeartIcon />
                </div>
            </div>
        </div>
    )
}

export default ItemCard
