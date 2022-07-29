export const fetchIndividualBlock = async (bh: number) => {
  try {
    const [info, stats] = await Promise.all([
      fetchBlockInfo(bh),
      fetchBlockStats(bh),
    ])
    if (bh === 0) return { info }
    return { info, stats, status: 200 }
  } catch (err) {
    return { status: 404 }
  }
}

const fetchBlockInfo = async (bh: number) => {
  const res = await fetch(`http://localhost:3000/api/block/${bh}`)
  const info = await res.json()
  return info
}

const fetchBlockStats = async (bh: number) => {
  if (bh === 0) return null
  const res = await fetch(`http://localhost:3000/api/blockstats/${bh}`)
  const stats = await res.json()
  return stats
}
