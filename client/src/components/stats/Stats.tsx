import { BiCube } from 'react-icons/bi'
import { GiMiner } from 'react-icons/gi'
import Loading from '../pages/Loading'
import { useGlobalContext } from '../../context'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'

const Stats = () => {
  const { blockchainInfo } = useGlobalContext()
  const convertNum = (num: string) => {
    return parseFloat(num).toPrecision(3).split('e+')
  }

  useResetBodyClass()

  //instead of !blockchainInfo only
  if (!blockchainInfo.chainInfo || !blockchainInfo.miningInfo) {
    return <Loading />
  }

  const { blocks, headers, bestblockhash, difficulty } =
    blockchainInfo.chainInfo
  const { networkhashps, pooledtx } = blockchainInfo.miningInfo

  return (
    <main>
      <div className='card-container'>
        <div className='card'>
          <p className='card-title'>
            Current Block Height: {blocks}
            <br />
            Current Header Height: {headers}
            <br />
            {blocks === headers
              ? 'Your blockchain is fully updated'
              : 'Syncing your blockchain...'}
          </p>

          <BiCube className='card-icon' />
        </div>
        {/* <div className='card'>
          <p className='card-title'>Best Block Hash: {bestblockhash} </p>
          <IoTicketSharp className='card-icon' />
        </div> */}
        <div className='card'>
          <p className='card-title'>
            Current Difficulty: {convertNum(difficulty)[0]} x 10
            <sup>{convertNum(difficulty)[1]}</sup>
            <br />
            Hash Rate: {convertNum(networkhashps)[0]} x 10
            <sup>{convertNum(networkhashps)[1]}</sup> H/s
            <br />
            No. of transactions waiting in pool: {pooledtx}
          </p>
          <GiMiner className='card-icon' />
        </div>
        {/* <div className='card'>
          <p className='card-title'> All Softforks </p>
          <CgGitFork className='card-icon' />
        </div> */}
      </div>
    </main>
  )
}

export default Stats
