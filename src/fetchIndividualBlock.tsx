export const fetchIndividualBlock = async (bh: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/block/${bh}`)
    const info = await res.json()
    if (bh === 0) {
      return { info }
    }
    const res2 = await fetch(`http://localhost:3000/api/blockstats/${bh}`)
    const stats = await res2.json()
    return { info, stats, status: 200 }
  } catch (err) {
    return { status: 404 }
  }
}
