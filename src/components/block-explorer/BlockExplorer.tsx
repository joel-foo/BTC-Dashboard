import { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context'
import Loading from '../pages/Loading'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
// import { useResetBodyClass } from '../custom hooks/useResetBodyClass'
import { fetchIndividualBlock } from '../../fetchIndividualBlock'

type indivBlockInfo = {
  info: { [key: string]: string | number; height: number; time: number }
  stats: { [key: string]: string | number; subsidy: number }
  status?: 200
}

const BlockExplorer = () => {
  const navigate = useNavigate()
  const { pagenum } = useParams()
  const { blockchainInfo } = useGlobalContext()
  const [blocksInfo, setBlocksInfo] = useState<indivBlockInfo[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [maxPage, setMaxPage] = useState<number | null>()

  const fetchBlockInfo = async (bh: number, i: number) => {
    try {
      const { info, stats } = await fetchIndividualBlock(bh)
      setBlocksInfo((blocksInfo) => {
        blocksInfo[i] = { info, stats }
        return blocksInfo
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleClick = (height: number) => {
    navigate(`/blockexplorer/blockheight=${height}`)
  }

  //validate pagenum
  useEffect(() => {
    if (blockchainInfo.blocks !== -1) {
      if (
        !/^\d+$/.test(pagenum!) ||
        parseInt(pagenum!) > Math.floor(blockchainInfo.blocks! / 20) + 1
      ) {
        setPage(null)
        setError(true)
      } else {
        setPage(parseInt(pagenum!))
        setError(false)
      }
    }
  }, [blockchainInfo.blocks !== -1, pagenum])

  useEffect(() => {
    if (blockchainInfo.blocks !== -1 && page) {
      let numBlocksToRetrieve = 20
      const maxPageNum = Math.floor(blockchainInfo.blocks / 20) + 1
      if (page === maxPageNum) {
        numBlocksToRetrieve = blockchainInfo.blocks - 20 * (maxPageNum - 1) + 1
      }
      const pageOffset = (page - 1) * 20
      for (let i = 0; i < numBlocksToRetrieve; i++) {
        fetchBlockInfo(blockchainInfo.blocks - pageOffset - i, i)
      }
      setMaxPage(maxPageNum)
    }
  }, [blockchainInfo.blocks !== -1, page])

  //fetch new blocks when no. of blocks in the chain change
  useEffect(() => {
    if (
      blockchainInfo.blocks === -1 ||
      (maxPage &&
        ((page === maxPage &&
          blocksInfo.length !==
            blockchainInfo.blocks - 20 * (maxPage - 1) + 1) ||
          (page !== maxPage && blocksInfo.length !== 20)))
    )
      return
    const currentHeight = blocksInfo[0].info.height
    const diff = blockchainInfo.blocks - currentHeight
    const promiseChain = []
    //starts returning the latest block first
    for (let i = diff; i > 0; --i) {
      const p = fetchIndividualBlock(currentHeight + i)
      promiseChain.push(p)
    }
    Promise.all(promiseChain).then((results) => {
      const newResults: indivBlockInfo[] = []
      for (const r of results) {
        const { info, stats } = r
        newResults.push({ info, stats })
      }
      setBlocksInfo((blocksInfo) => {
        blocksInfo = newResults.concat(blocksInfo)
        blocksInfo.splice(20, diff)
        return blocksInfo
      })
    })
  }, [blockchainInfo.blocks])

  const getTimeDiff = (timestamp: number) => {
    return moment.unix(timestamp).fromNow()
  }

  if (error) {
    return <h2>No such page!</h2>
  }

  if (
    maxPage &&
    ((page === maxPage &&
      blocksInfo.length !== blockchainInfo.blocks - 20 * (maxPage - 1) + 1) ||
      (page !== maxPage && blocksInfo.length !== 20))
  ) {
    return <Loading />
  }

  return (
    <div className='block-exp-container'>
      {[...Array(20).keys()].map((i) => {
        if (!blocksInfo[i]) {
          return <div key={i}></div>
        } else {
          let avgfee, subsidy
          const { height, hash, time, difficulty, nTx } = blocksInfo[i].info
          if (height !== 0) {
            avgfee = blocksInfo[i].stats['avgfee']
            subsidy = blocksInfo[i].stats['subsidy']
          }
          return (
            <div className='block-exp-main-container' key={i}>
              <div className='block-exp-individual-block-container'>
                <div className='block-title'>
                  Block {height}
                  <span id='block-time'>{getTimeDiff(time)}</span>
                </div>
                <div className='block-info'>
                  <p>Hash: {hash} </p>
                  <p>Difficulty: {difficulty}</p>
                  <p>nTx: {nTx}</p>
                  {height !== 0 && (
                    <p>
                      {avgfee}, {(subsidy as number) / Math.pow(10, 8)} BTC
                    </p>
                  )}
                </div>
                <button
                  className='submit-btn'
                  onClick={() => handleClick(height)}
                >
                  See More
                </button>
              </div>
              <img
                className='chain-icon'
                src='/images/Chain_link_icon.svg'
                alt=''
              />
            </div>
          )
        }
      })}
      <div className='nav-page-container'>
        {[...Array(10).keys()].map((i) => {
          const pagenum = page! + i
          if (pagenum > maxPage!) {
            return <div key={i}></div>
          }
          return (
            <div
              className='nav-btn'
              onClick={() => {
                navigate(`/blockexplorer/page=${pagenum}`)
                navigate(0)
              }}
              key={i}
            >
              {pagenum}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BlockExplorer
