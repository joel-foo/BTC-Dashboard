import { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context'
import Loading from '../pages/Loading'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'

const BlockExplorer = () => {
  const navigate = useNavigate()
  const { pagenum } = useParams()
  const { blockchainInfo } = useGlobalContext()
  const [blocksInfo, setBlocksInfo] = useState<any[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [error, setError] = useState(false)

  const fetchBlockInfo = async (bh: number, i: number) => {
    try {
      const res = await fetch(`/api/blockinfo/${bh}`)
      const data = await res.json()
      setBlocksInfo((blocksInfo) => {
        blocksInfo[i] = data
        return blocksInfo
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleClick = (height: number) => {
    navigate(`/blockexplorer/blockheight=${height}`)
  }

  useResetBodyClass()

  useEffect(() => {
    if (blockchainInfo.chainInfo) {
      if (
        !/^\d+$/.test(pagenum!) ||
        parseInt(pagenum!) > Math.ceil(blockchainInfo.chainInfo.blocks / 50)
      ) {
        setPage(null)
        setError(true)
      } else {
        setPage(parseInt(pagenum!))
        setError(false)
      }
    }
  }, [blockchainInfo])

  useEffect(() => {
    if (blockchainInfo.chainInfo && page) {
      let numBlocksToRetrieve = 50
      const maxPages = Math.ceil(blockchainInfo.chainInfo.blocks / 50)
      if (page === maxPages) {
        numBlocksToRetrieve =
          blockchainInfo.chainInfo.blocks - 50 * (maxPages - 1) + 1
      }
      const pageOffset = (page - 1) * 50
      for (let i = 0; i < numBlocksToRetrieve; i++) {
        fetchBlockInfo(blockchainInfo.chainInfo.blocks - pageOffset - i, i)
      }
    }
  }, [blockchainInfo, page])

  const getTimeDiff = (timestamp: number) => {
    return moment.unix(timestamp).fromNow()
  }

  if (error) {
    return <h2>No such page!</h2>
  }

  if (
    !(blockchainInfo && blockchainInfo.chainInfo) ||
    (page === Math.ceil(blockchainInfo.chainInfo.blocks / 50) &&
      blocksInfo.length !==
        blockchainInfo.chainInfo.blocks -
          50 * (Math.ceil(blockchainInfo.chainInfo.blocks / 50) - 1) +
          1) ||
    (page !== Math.ceil(blockchainInfo.chainInfo.blocks / 50) &&
      blocksInfo.length !== 50)
  ) {
    return <Loading />
  }

  return (
    <div className='block-exp-container'>
      {[...Array(50).keys()].map((i) => {
        if (!blocksInfo[i]) {
          return <div key={i}></div>
        } else {
          const { height, hash, time, difficulty, nTx } = blocksInfo[i].block
          const { avgfee, subsidy } = height !== 0 && blocksInfo[i].blockStats
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
                      {avgfee}, {subsidy / Math.pow(10, 8)} BTC
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
          return (
            <div
              className='nav-btn'
              onClick={() => {
                navigate(`/blockexplorer/page=${i + 1}`)
                navigate(0)
              }}
              key={i}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BlockExplorer
