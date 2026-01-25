// example return type
export async function getImageDarkness(src: string): Promise<{
    isDark: boolean
    avgColor: string
}> {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    await new Promise((res) => (img.onload = res))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // 🔹 sample size (5% of image)
    const sampleWidth = Math.max(1, Math.floor(img.width * 0.05))
    const sampleHeight = Math.max(1, Math.floor(img.height * 0.05))

    // 🔹 choose corner
    const startX = 0 // left
    const startY = 0 // top
    // other options:
    // bottom-left → (0, img.height - sampleHeight)
    // top-right → (img.width - sampleWidth, 0)
    // bottom-right → (img.width - sampleWidth, img.height - sampleHeight)

    const { data } = ctx.getImageData(
        startX,
        startY,
        sampleWidth,
        sampleHeight
    )

    let r = 0,
        g = 0,
        b = 0

    const count = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
    }

    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    // perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    const isDark = brightness < 140

    return {
        isDark,
        avgColor: `rgb(${r}, ${g}, ${b})`,
    }
}
