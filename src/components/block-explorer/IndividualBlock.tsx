import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Loading from '../pages/Loading'
import { fetchIndividualBlock } from '../../fetchIndividualBlock'
import ErrorPage from '../pages/ErrorPage'

const IndividualBlock = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const [blockInfo, setBlockInfo] = useState<any>(null)
  const { blockchainInfo, isSubmitted, setIsSubmitted, input, setInput } =
    useGlobalContext()
  const [isPrev, setIsPrev] = useState(false)
  const [isNext, setIsNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ show: boolean; msg?: string }>({
    show: false,
    msg: '',
  })

  const fetchBlockInfo = async (blockHeight: string) => {
    setLoading(true)
    try {
      const { info, stats } = await fetchIndividualBlock(
        parseInt(blockHeight),
        false
      )
      setBlockInfo({ info, stats })
    } catch (e) {
      setError({ show: true, msg: 'No such block!' })
    }
    setLoading(false)
  }

  useEffect(() => {
    setError({ show: false })
    fetchBlockInfo(id!)
  }, [id])

  useEffect(() => {
    if (isSubmitted) {
      fetchBlockInfo(input)
      setIsSubmitted(false)
    }
    if (isPrev) {
      const prevBlock = parseInt(id as string) - 1
      navigate(`/blockexplorer/blockheight=${prevBlock}`)
      // fetchBlockInfo(prevBlock)
      setIsPrev(false)
    }
    if (isNext) {
      const nextBlock = parseInt(id as string) + 1
      navigate(`/blockexplorer/blockheight=${nextBlock}`)
      // fetchBlockInfo(nextBlock)
      setIsNext(false)
    }
  }, [isSubmitted, isNext, isPrev])

  if (loading) {
    return <Loading />
  }

  if (error.show) {
    return <ErrorPage msg={error.msg} />
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
  } = blockInfo.info

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
    height !== 0 && 'Hash of Previous Block',
    height !== blockchainInfo.blocks && 'Hash of Next Block',
    height !== 0 && 'Average fee in block',
    height !== 0 && 'Average fee rate (sats/byte)',
    'All Transaction Ids',
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
    tx,
  ]

  const keysBack = [
    'Average transaction size',
    'Feerates at the 10th',
    'Number of inputs (excluding coinbase)',
    'Max fee in block',
    'Max fee rate (sats/byte)',
    'Max transaction size',
    'Truncated median fee in block',
    'Truncated median transaction size',
    'Min fee in block',
    'Min fee rate (sats/byte)',
    'Min transaction size',
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
    'Change in UTXO number',
    'Change in size for UTXO index',
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

  return (
    <section className='px-3'>
      <div className='container mx-auto border-2 border-gray-200 rounded-b-md shadow-xl py-10 px-5 md:max-w-3xl md:px-10'>
        <div className='grid grid-cols-2 gap-y-6'>
          {keysFront.map((k, i) => {
            const value = valuesFront[i]
            return (
              <React.Fragment key={i}>
                <span
                  key={`k-${i}`}
                  className='w-36 break-normal pr-1 font-semibold md:w-auto'
                >
                  {k}
                </span>
                {i === keysFront.length - 1 ? (
                  <textarea
                    value={value}
                    className='border-2 border-gray-200 p-3 rounded-md resize-none focus:outline-none'
                    spellCheck='false'
                    key={`v-${i}`}
                    readOnly
                  ></textarea>
                ) : (
                  <span key={`v-${i}`} className='break-all'>
                    {value}
                  </span>
                )}
              </React.Fragment>
            )
          })}
          {height !== 0 &&
            keysBack.map((k, i) => {
              return (
                <React.Fragment key={i}>
                  <span
                    key={`k2-${i}`}
                    className='w-24 break-normal font-semibold md:w-auto'
                  >
                    {k}
                  </span>
                  <span key={`v2-${i}`} className='break-all'>
                    {valuesBack[i]}
                  </span>
                </React.Fragment>
              )
            })}
        </div>
      </div>
    </section>
  )
}
export default IndividualBlock
