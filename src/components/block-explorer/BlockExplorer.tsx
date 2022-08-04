import { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context'
import Loading from '../pages/Loading'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchIndividualBlock } from '../../fetchIndividualBlock'
import { convertNum } from '../../helpers'
import ErrorPage from '../pages/ErrorPage'
import { indivBlockInfo } from '../../fetchIndividualBlock'

const BlockExplorer = () => {
  const navigate = useNavigate()
  //pagenum will never be undefined because the react router will serve the error route if pagenum parameter is not provided
  const { pagenum } = useParams() as { pagenum: string }
  const {
    blockchainInfo,
    currentChainHeight,
    setCurrentChainHeight,
    setStartUpdate,
  } = useGlobalContext()
  const [blocksInfo, setBlocksInfo] = useState<indivBlockInfo[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [maxPage, setMaxPage] = useState<number | null>(null)
  //this is for when the 20 blocks for the page has been retrieved, and we are looking whether to update the current blocksInfo state.
  const [isUpdating, setIsUpdating] = useState(false)
  //loading is when we are retrieving the 20 blocks itself
  const [isLoading, setIsLoading] = useState(true)
  const [diff, setDiff] = useState({ num: 0, active: false })

  const handleClick = (height: number) => {
    navigate(`/blockexplorer/blockheight=${height}`)
  }

  //validate pagenum
  useEffect(() => {
    //number of blocks still unknown, we can only validate pagenum if we know it
    if (blockchainInfo.blocks === -1) return
    if (
      parseInt(pagenum) === 0 ||
      !/^\d+$/.test(pagenum) ||
      parseInt(pagenum) > Math.floor(blockchainInfo.blocks! / 20) + 1
    ) {
      setPage(null)
      setError(true)
    } else {
      setPage(parseInt(pagenum))
      setError(false)
    }
  }, [blockchainInfo.blocks !== -1, pagenum])

  useEffect(() => {
    if (!page) return
    let numBlocksToRetrieve = 20
    const maxPageNum = Math.floor(blockchainInfo.blocks / 20) + 1
    if (page === maxPageNum) {
      numBlocksToRetrieve = blockchainInfo.blocks - 20 * (maxPageNum - 1) + 1
    }
    const pageOffset = (page - 1) * 20
    const promiseChain = []
    for (let i = 0; i < numBlocksToRetrieve; i++) {
      const p = fetchIndividualBlock(
        blockchainInfo.blocks - pageOffset - i,
        true
      )
      promiseChain.push(p)
    }
    Promise.all(promiseChain).then((results) => {
      setBlocksInfo(results)
      setIsLoading(false)
    })
    //these don't need to wait for the promises to resolve
    setMaxPage(maxPageNum)
    setStartUpdate(false)
  }, [page])

  //fetch new blocks when no. of blocks in the chain change
  useEffect(() => {
    //this hook only comes into play if we are not updating (whose state is itself controlled by this hook) and not loading (in other words, once we have finished retrieving the 20 blocks)
    if (isUpdating || !(maxPage && page) || isLoading) return
    const diff = blockchainInfo.blocks - currentChainHeight
    const promiseChain = []
    //starts by returning the latest block first
    for (let i = diff, j = 20; i > 0 && j > 0; i--, j--) {
      const p = fetchIndividualBlock(blocksInfo[0].info.height + i, true)
      promiseChain.push(p)
    }
    setStartUpdate(true)
    setIsUpdating(true)
    Promise.all(promiseChain).then((results) => {
      setBlocksInfo((blocksInfo) => {
        blocksInfo = results.concat(blocksInfo)
        blocksInfo.splice(20, diff)
        return blocksInfo
      })
      //only set these states once we are sure the promises are resolved
      setIsUpdating(false)
      setCurrentChainHeight(currentChainHeight + diff)
      setDiff({ num: diff, active: true })
    })
  }, [blockchainInfo.blocks])

  useEffect(() => {
    //or use window.setTimeout to return a number:
    let timeout: ReturnType<typeof setTimeout>
    //clear timeout once animation completes
    if (diff.active)
      timeout = setTimeout(() => setDiff({ num: 0, active: false }), 1000)
    return () => clearTimeout(timeout)
  }, [diff.active])

  const getTimeDiff = (timestamp: number) => {
    return moment.unix(timestamp).fromNow()
  }

  if (error) {
    return <ErrorPage msg='404 Page Not Found' />
  }

  if (!(maxPage && page) || isLoading) {
    return <Loading />
  }

  return (
    <section className='px-3'>
      <div className='container mx-auto flex flex-col items-center gap-y-6'>
        {[...Array(20).keys()].map((i) => {
          let avgfee, subsidy, avgfeerate
          const { height, hash, time, nTx, difficulty } = blocksInfo[i].info
          if (height !== 0) {
            avgfee = blocksInfo[i].stats['avgfee']
            avgfeerate = blocksInfo[i].stats['avgfeerate']
            subsidy = blocksInfo[i].stats['subsidy']
          }
          return (
            <div
              className={`relative flex flex-col border-2 border-gray-200 border-t-[1px] shadow-xl p-10 rounded-md w-full gap-y-2 md:max-w-2xl break-all ${
                diff.active &&
                i <= diff.num - 1 &&
                (i % 2 === 0 ? 'new-left' : 'new-right')
              }`}
              key={i}
            >
              <h1 className='text-xl font-bold relative md:text-2xl'>
                Block {height}
              </h1>
              <div>
                <h2>Hash: {hash}</h2>
                <h2
                  dangerouslySetInnerHTML={{
                    __html: `Difficulty: ${convertNum(difficulty as string)}`,
                  }}
                ></h2>
                {height !== 0 && (
                  <>
                    <h2>Average fee: {avgfee} sats</h2>
                    <h2>Average fee rate: {avgfeerate} sats/byte</h2>
                    <h2>
                      Block subsidy: {(subsidy as number) / Math.pow(10, 8)} BTC
                    </h2>
                  </>
                )}
                <h2> No. of Transactions: {nTx} </h2>
              </div>
              <h1 className='absolute right-10 top-11 '>{getTimeDiff(time)}</h1>
              <button
                className='rounded-md px-3 py-1 text-white bg-blue-500 w-24 self-end'
                onClick={() => handleClick(height)}
              >
                See More
              </button>
              {i !== 19 && (
                <img
                  className='absolute -bottom-7 left-1/2 w-8 transform rotate-90 -translate-x-1/2'
                  src='/images/Chain_link_icon.svg'
                  alt=''
                />
              )}
            </div>
          )
        })}
        <div className='flex gap-4 flex-wrap justify-center items-center mt-3 mb-8'>
          {[...Array(10).keys()].map((i) => {
            const pagenum = Math.min(Math.max(page - 4, 1), maxPage - 9)
            return (
              <div
                className='bg-blue-400 text-white px-3 py-1 rounded-md hover:cursor-pointer'
                onClick={() => {
                  navigate(`/blockexplorer/page=${pagenum + i}`)
                  navigate(0)
                  setIsLoading(true)
                }}
                key={i}
              >
                {pagenum + i}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BlockExplorer
