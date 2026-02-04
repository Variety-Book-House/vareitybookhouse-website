'use client'

import { useEffect, useState } from 'react'
import Main from '../../components/Main'
import EmblaCarouselAutoplayProgress from '@/components/carousel/Embla Carousel Auto Progress React/EmblaCarousel'
import { useSnapScroll } from '../../hooks/useSnapScroll'
import ItemCarousel from '@/components/carousel/BestSellerCarousel/ItemCarousel'
import LanguageCarousel from '@/components/carousel/LanguageCarousel/ItemCarousel'
import Footer from '@/components/Footer'
import { Product } from '@/lib/definitions'

export default function Home() {
  /* -------------------- STATE -------------------- */
  const [bestSellers, setBestSellers] = useState<Product[]>([])

  const [genres, setGenres] = useState<string[]>([])
  const [activeGenre, setActiveGenre] = useState<string>('')
  const [loadingTypeBooks, setLoadingTypeBooks] = useState(false)

  const [feed, setFeed] = useState<
    { genre: string; books: Product[] }[]
  >([])


  const [types, setTypes] = useState<string[]>([])
  const [typeBooks, setTypeBooks] = useState<Record<string, Product[]>>({})
  const [activeType, setActiveType] = useState('')

  const [loadingGenres, setLoadingGenres] = useState(true)
  const [loadingTypes, setLoadingTypes] = useState(true)

  /* -------------------- META FETCH (FAST) -------------------- */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [genreRes, typeRes, bestRes] = await Promise.all([
          fetch('/api/genres'),
          fetch('/api/products/by-type'),
          fetch('/api/bestsellers?limit=15'),
        ])

        const { genres } = await genreRes.json()
        const { types } = await typeRes.json()
        const bestData = await bestRes.json()

        setGenres(genres.slice(0, 5))
        setActiveGenre(genres[0])

        setTypes(types)
        setActiveType(types[0])

        if (bestData.success) {
          setBestSellers(bestData.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingGenres(false)
        setLoadingTypes(false)
      }
    }

    fetchMeta()
  }, [])

  /* -------------------- GENRE BOOKS (ON DEMAND) -------------------- */
  useEffect(() => {
    if (!genres.length) return

    let cancelled = false

    const loadGenresIncrementally = async () => {
      for (const genre of genres) {
        try {
          const res = await fetch(
            `/api/products/by-genre?genre=${genre}&limit=10`
          )
          const data = await res.json()

          if (cancelled) return

          setFeed(prev => [
            ...prev,
            {
              genre,
              books: data.books || [],
            },
          ])
        } catch (err) {
          console.error(`Failed loading genre ${genre}`, err)
        }
      }
    }

    // reset feed when genres change
    setFeed([])
    loadGenresIncrementally()

    return () => {
      cancelled = true
    }
  }, [genres])



  /* -------------------- TYPE BOOKS (ON DEMAND) -------------------- */
  useEffect(() => {
    if (!activeType) return

    const fetchTypeBooks = async () => {
      setLoadingTypeBooks(true)

      try {
        // Optional: clear previous books immediately
        // setTypeBooks(prev => ({ ...prev, [activeType]: [] }))

        const res = await fetch(
          `/api/products/by-type?type=${encodeURIComponent(activeType)}&limit=10`
        )
        const data = await res.json()

        setTypeBooks(prev => ({
          ...prev,
          [activeType]: data.books || [],
        }))
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingTypeBooks(false)
      }
    }

    fetchTypeBooks()
  }, [activeType])


  useSnapScroll()

  /* -------------------- RENDER -------------------- */
  return (
    <div
      id="snap-container"
      className="h-screen overflow-hidden overflow-y-scroll snap-y snap-mandatory"
    >
      <section className="h-screen snap-start">
        <Main />
      </section>

      {/* BEST SELLERS */}
      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)] h-full flex items-center justify-center">
          {bestSellers.length === 0 ? (
            <Loader label="Loading best sellers..." />
          ) : (
            <ItemCarousel title="BEST SELLERS" books={bestSellers} />
          )}
        </div>
      </section>

      {/* GENRE CAROUSEL */}
      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)] h-full flex items-center justify-center">
          <EmblaCarouselAutoplayProgress
            feed={feed}
            loading={loadingGenres}
            options={{ loop: true }}
          />
        </div>
      </section>


      {/* TYPE CAROUSEL */}
      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)] h-full">
          {loadingTypes ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-10 w-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <LanguageCarousel
              languages={types}
              books={typeBooks[activeType] || []}
              loading={loadingTypeBooks}
              onActiveChange={setActiveType}
            />
          )}
        </div>
      </section>

      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)] h-full">
          <Footer />
        </div>
      </section>
    </div>
  )
}

/* -------------------- LOADER -------------------- */
const Loader = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="h-10 w-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
    <span className="text-sm font-light tracking-wide">{label}</span>
  </div>
)
