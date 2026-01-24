'use client'

export const getImageDarkness = async (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = src

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return resolve(true)

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

            let brightness = 0
            for (let i = 0; i < data.length; i += 4) {
                brightness += (data[i] + data[i + 1] + data[i + 2]) / 3
            }

            const avg = brightness / (data.length / 4)
            resolve(avg < 130) // threshold → tweak if needed
        }

        img.onerror = () => resolve(true)
    })
}
