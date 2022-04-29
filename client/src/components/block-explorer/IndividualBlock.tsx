import { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { VscArrowSwap } from 'react-icons/vsc'
import Loading from '../pages/Loading'

const IndividualBlock = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blockInfo, setBlockInfo] = useState<any>(null)
  const { blockchainInfo, isSubmitted, setIsSubmitted, input, setInput } =
    useGlobalContext()
  const [isPrev, setIsPrev] = useState(false)
  const [isNext, setIsNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const centerContainerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState({ show: false, msg: '' })
  const [isRotate, setIsRotate] = useState(false)
  const [isHide, setIsHide] = useState(false)

  const fetchBlockInfo = async (blockHeight: any) => {
    setLoading(true)
    const res = await fetch(`/blockinfo/${blockHeight}`)
    const data = await res.json()
    if (res.status === 404) {
      setError({ show: true, msg: data.msg })
      setLoading(false)
    } else {
      setBlockInfo({ block: data.block, stats: data.blockStats })
      setLoading(false)
    }
  }

  useEffect(() => {
    document.body.className = 'hide-overflow-y'
  }, [id])

  useEffect(() => {
    fetchBlockInfo(id)
  }, [])

  useEffect(() => {
    if (isSubmitted) {
      fetchBlockInfo(input)
      setIsSubmitted(false)
      setInput('')
    }
    if (isPrev) {
      const prevBlock = parseInt(id as string) - 1
      setIsHide(true)
      navigate(`/blockexplorer/blockheight=${prevBlock}`)
      fetchBlockInfo(prevBlock)
      setIsPrev(false)
      setIsRotate(false)
      setTimeout(() => {
        centerContainerRef.current!.className = 'center-container left'
      }, 690)
      setTimeout(() => {
        setIsHide(false)
      }, 1500)
    }
    if (isNext) {
      const nextBlock = parseInt(id as string) + 1
      setIsHide(true)
      navigate(`/blockexplorer/blockheight=${nextBlock}`)
      fetchBlockInfo(nextBlock)
      setIsNext(false)
      setIsRotate(false)
      setTimeout(() => {
        centerContainerRef.current!.className = 'center-container right'
      }, 690)
      setTimeout(() => {
        setIsHide(false)
      }, 1500)
    }
  }, [isSubmitted, isNext, isPrev])

  if (loading) {
    return <></>
  }

  if (error.show) {
    return <h2>Error!: {error.msg}</h2>
  }

  const {
    hash,
    confirmations,
    height,
    version,
    versionHex,
    merkleroot,
    time,
    nonce,
    bits,
    difficulty,
    chainwork,
    nTx,
    previousblockhash,
    nextblockhash,
    size,
    weight,
    tx,
  } = blockInfo.block

  const {
    avgfee,
    avgfeerate,
    avgtxsize,
    feerate_percentiles,
    ins,
    maxfee,
    maxfeerate,
    maxtxsize,
    medianfee,
    mediantxsize,
    minfee,
    minfeerate,
    mintxsize,
    outs,
    subsidy,
    swtotal_size,
    swtotal_weight,
    swtxs,
    total_out,
    total_size,
    total_weight,
    totalfee,
    txs,
    utxo_increase,
    utxo_size_inc,
  } = height !== 0 && blockInfo.stats

  const keysFront = [
    'Block Height',
    'Block Hash',
    'No. of Confirmations',
    'Block Size',
    'Block Weight',
    'Block Version',
    'Block Version (in hexadecimal)',
    'Merkle Root',
    'Block Time',
    'Nonce',
    'Bits',
    'Difficulty',
    'Chainwork',
    'No. of Transactions',
    'Hash of Previous Block',
    'Hash of Next Block',
    'Average fee in block',
    'Average fee rate (sats/byte)',
    'All Transaction Ids',
  ]

  const keysBack = [
    'Average transaction size',
    'Feerates at the 10th',
    'Number of inputs (excluding coinbase)',
    'Max fee in block',
    'Max fee rate (sats/virtual byte)',
    'Max transaction size',
    'Truncated median fee in block',
    'Truncated median transaction size',
    'Min fee in block',
    'Min fee rate (sats/virtual byte)',
    'Min transaciton size',
    'Number of outputs',
    'Block subsidy',
    'Total size of all segwit transactions',
    'Total weight of all segwit transactions',
    'Number of segwit transactions',
    'Total amount in all outputs (excluding coinbase)',
    'Total size of all non-coinbase transactions',
    'Total weight of all  non-coinbase transactions',
    'Fee total',
    'Number of transactions (including coinbase)',
    'Change in utxo number',
    'Change in size for utxo index',
  ]

  const valuesBack = [
    avgtxsize,
    feerate_percentiles,
    ins,
    maxfee,
    maxfeerate,
    maxtxsize,
    medianfee,
    mediantxsize,
    minfee,
    minfeerate,
    mintxsize,
    outs,
    subsidy,
    swtotal_size,
    swtotal_weight,
    swtxs,
    total_out,
    total_size,
    total_weight,
    totalfee,
    txs,
    utxo_increase,
    utxo_size_inc,
  ]

  const valuesFront = [
    height,
    hash,
    confirmations,
    size,
    weight,
    version,
    versionHex,
    merkleroot,
    moment.unix(time).format('MMMM Do YYYY, h:mm:ss a'),
    nonce,
    bits,
    difficulty,
    chainwork,
    nTx,
    previousblockhash,
    nextblockhash,
    avgfee,
    avgfeerate,
  ]

  return (
    <div className='center-container' ref={centerContainerRef}>
      <div className='temp-block-container left2'></div>
      <div
        className='temp-block-container left'
        onClick={() => height !== 0 && setIsPrev(true)}
      ></div>
      <div className='block-line'></div>
      <div className={isRotate ? ' flip-block rotate' : 'flip-block'}>
        {height !== 0 && (
          <VscArrowSwap
            className={isHide ? 'flip-icon hide' : 'flip-icon'}
            onClick={() => setIsRotate(!isRotate)}
          />
        )}
        <div className='flip-block-inner'>
          <div className='flip-block-front'>
            <div className={isHide ? 'keys-container hide' : 'keys-container'}>
              {keysFront.map((k, i) => {
                return (
                  <span className='block-values' key={i}>
                    {k}
                  </span>
                )
              })}
            </div>
            <div
              className={isHide ? 'values-container hide' : 'values-container'}
            >
              {valuesFront.map((v, i) => {
                return (
                  <span className='block-values' key={i}>
                    {v}
                  </span>
                )
              })}
              <textarea
                id='transactions'
                cols={30}
                rows={6}
                value={tx}
                readOnly
              ></textarea>
            </div>
          </div>
          {height !== 0 && (
            <div className='flip-block-back'>
              <div className='keys-container back'>
                {keysBack.map((k, i) => {
                  return (
                    <span className='block-values' key={i}>
                      {k}
                    </span>
                  )
                })}
              </div>
              <div className='values-container back'>
                {valuesBack.map((v, i) => {
                  return (
                    <span className='block-values' key={i}>
                      {v}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className='temp-block-container right'
        onClick={() =>
          height !== blockchainInfo.chainInfo.blocks && setIsNext(true)
        }
      ></div>
      <div className='temp-block-container right2'></div>
    </div>
  )
}
export default IndividualBlock
