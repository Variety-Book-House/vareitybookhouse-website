export type User = {
    id: string,
    email: string,
    password: string,
    name: string,
    created_at: Date
}
export interface Product {
    id: string
    title: string
    description: string | null
    MRP: number
    images: string[] | null
    stock: number
    is_active: boolean
    created_at: Date
    updated_at: Date
    genre: string | null
    language: string | null
    publisher: string | null
    author: string
    barcode: string | null
}

// Helper to convert Product to Book format for existing components
export function productToBook(product: Product) {
    return {
        id: product.id,
        volumeInfo: {
            title: product.title,
            authors: product.author ? [product.author] : ['Unknown'],
            imageLinks: {
                thumbnail: product.images?.[0] || '/image 14.png'
            }
        },
        saleInfo: {
            listPrice: {
                amount: product.MRP
            }
        }
    }
}