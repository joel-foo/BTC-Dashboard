export const fetchIndividualBlock = async (bh: number) => {
  try {
    const p1 = new Promise((res, rej) => {
      fetch(`http://localhost:3000/api/block/${bh}`)
    }).then((res) => (res as Response).json())
    const p2 = new Promise((res, rej) => {
      fetch(`http://localhost:3000/api/blockstats/${bh}`)
    }).then((res) => (res as Response).json())
    let [info, stats] = await Promise.all([p1, p2])
    return { info, stats, status: 200 }
  } catch (err) {
    return { status: 404 }
  }
}
