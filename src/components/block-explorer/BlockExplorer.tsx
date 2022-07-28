import { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context'
import Loading from '../pages/Loading'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'
import { fetchIndividualBlock } from '../../fetchIndividualBlock'

type indivBlockInfo = {
  info: { [key: string]: string | number; height: number; time: number }
  stats: { [key: string]: string | number; subsidy: number }
}

const BlockExplorer = () => {
  const navigate = useNavigate()
  const { pagenum } = useParams()
  const { blockchainInfo } = useGlobalContext()
  const [blocksInfo, setBlocksInfo] = useState<indivBlockInfo[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [error, setError] = useState(false)

  const fetchBlockInfo = async (bh: number, i: number) => {
    try {
      const { info, stats } = await fetchIndividualBlock(bh)
      setBlocksInfo((blocksInfo) => {
        blocksInfo[i] = {info, stats}
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
    if (blockchainInfo.blocks !== 0) {
      if (
        !/^\d+$/.test(pagenum!) ||
        parseInt(pagenum!) > Math.floor(blockchainInfo.blocks / 50) + 1
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
    if (blockchainInfo.blocks !==0 && page) {
      let numBlocksToRetrieve = 50
      const maxPage = Math.floor(blockchainInfo.blocks / 50) + 1
      if (page === maxPage) {
        numBlocksToRetrieve = blockchainInfo.blocks - 50 * (maxPage - 1) + 1
      }
      const pageOffset = (page - 1) * 50
      for (let i = 0; i < numBlocksToRetrieve; i++) {
        fetchBlockInfo(blockchainInfo.blocks - pageOffset - i, i)
      }
    }
  }, [blockchainInfo.blocks, page])

  const getTimeDiff = (timestamp: number) => {
    return moment.unix(timestamp).fromNow()
  }

  if (error) {
    return <h2>No such page!</h2>
  }

  if (
    (page === Math.floor(blockchainInfo.blocks / 50) + 1 &&
      blocksInfo.length !==
        blockchainInfo.blocks -
          50 * Math.floor(blockchainInfo.blocks / 50) +
          1) ||
    (page !== Math.floor(blockchainInfo.blocks / 50) + 1 && blocksInfo.length !== 50)
  ) {
    return <Loading />
  }

  return (
    <div className='block-exp-container'>
      {[...Array(50).keys()].map((i) => {
        if (!blocksInfo[i]) {
          return <div key={i}></div>
        } else {
          let avgfee, subsidy;
          const { height, hash, time, difficulty, nTx } = blocksInfo[i].info
          if(height !== 0){
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
                      {avgfee}, {subsidy as number / Math.pow(10, 8)} BTC
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
