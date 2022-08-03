export interface indivBlockInfo {
  info: { [key: string]: string | number; height: number; time: number }
  stats: { [key: string]: string | number; subsidy: number }
}

export const fetchIndividualBlock = async (
  bh: number,
  abridged: boolean
): Promise<indivBlockInfo> => {
  try {
    const [info, stats] = await Promise.all([
      fetchBlockInfo(bh, abridged),
      fetchBlockStats(bh, abridged),
    ])
    return { info, stats }
  } catch (err) {
    throw new Error()
  }
}

// export type returned = Awaited<Promise<ReturnType<typeof fetchIndividualBlock>>>

const fetchBlockInfo = async (bh: number, abridged: boolean) => {
  let url = `https://nakamotonode.com/api/block/${bh}`
  if (abridged) url += '?q1=height&q2=hash&q3=time&q4=nTx&q5=difficulty'
  const res = await fetch(url)
  const info = await res.json()
  return info
}

const fetchBlockStats = async (bh: number, abridged: boolean) => {
  if (bh === 0) return {}
  let url = `https://nakamotonode.com/api/blockstats/${bh}`
  if (abridged) url += '?q1=avgfee&q2=avgfeerate&q3=subsidy'
  const res = await fetch(url)
  const stats = await res.json()
  return stats
}
