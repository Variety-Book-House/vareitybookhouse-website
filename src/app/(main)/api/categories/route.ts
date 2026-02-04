// app/api/books/all-categories/route.ts
import { NextResponse } from 'next/server'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

const CATEGORIES = [
    'Manga',
    'Novels',
    'Encyclopedia',
    'Short Stories',
    'Practice Books',
    'Coloring Books',
]

const CATEGORY_MAPPINGS: Record<string, string> = {
    'Manga': 'subject:comics+manga',
    'Novels': 'subject:fiction+novels',
    'Encyclopedia': 'subject:reference+encyclopedia',
    'Short Stories': 'subject:fiction+short+stories',
    'Practice Books': 'subject:study+guides+workbooks',
    'Coloring Books': 'subject:coloring+books',
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const booksPerCategory = parseInt(searchParams.get('booksPerCategory') || '10')

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY || ''

        // Fetch books for all categories in parallel
        const categoriesData = await Promise.all(
            CATEGORIES.map(async (category) => {
                try {
                    const searchTerm = CATEGORY_MAPPINGS[category]
                    const url = new URL(GOOGLE_BOOKS_API)
                    url.searchParams.append('q', searchTerm)
                    url.searchParams.append('maxResults', booksPerCategory.toString())
                    url.searchParams.append('orderBy', 'relevance')
                    if (apiKey) {
                        url.searchParams.append('key', apiKey)
                    }

                    const response = await fetch(url.toString())

                    if (!response.ok) {
                        console.error(`Failed to fetch ${category}:`, response.statusText)
                        return { category, books: [], error: response.statusText }
                    }

                    const data = await response.json()

                    const books = data.items?.map((item: any) => ({
                        id: item.id,
                        volumeInfo: {
                            title: item.volumeInfo?.title,
                            authors: item.volumeInfo?.authors || [],
                            categories: item.volumeInfo?.categories || [],
                            imageLinks: {
                                thumbnail: item.volumeInfo?.imageLinks?.thumbnail ||
                                    item.volumeInfo?.imageLinks?.smallThumbnail
                            }
                        },
                        saleInfo: {
                            listPrice: {
                                amount: item.saleInfo?.listPrice?.amount ||
                                    item.saleInfo?.retailPrice?.amount
                            }
                        }
                    })) || []

                    return { category, books, total: data.totalItems || 0 }
                } catch (error) {
                    console.error(`Error fetching ${category}:`, error)
                    return {
                        category,
                        books: [],
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }
            })
        )

        return NextResponse.json({
            success: true,
            categories: categoriesData
        })

    } catch (error) {
        console.error('Error fetching all categories:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch categories',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}