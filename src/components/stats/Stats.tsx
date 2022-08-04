import { GiMiner } from 'react-icons/gi'
import Loading from '../pages/Loading'
import { useGlobalContext } from '../../context'
import { convertNum } from '../../helpers'
import moment from 'moment'

const Stats = () => {
  const { blockchainInfo } = useGlobalContext()

  if (blockchainInfo.blocks === -1) {
    return <Loading />
  }

  const { blocks, headers, difficulty, networkhashps, pooledtx, mediantime } =
    blockchainInfo

  const metrics = [
    'blocks',
    'headers',
    '',
    'difficulty',
    'network hashes/sec',
    'transactions waiting in mempool',
    'blocks to next halving',
    'est. date of next halving',
  ]

  const values = [
    blocks,
    headers,
    blocks === headers
      ? 'Blockchain is fully synced ✅'
      : 'Blockchain is still syncing...😎',
    convertNum(difficulty as string),
    convertNum(networkhashps as string),
    pooledtx,
    (Math.floor(blocks / 210000) + 1) * 210000 - blocks,
    moment()
      .add(10 * ((Math.floor(blocks / 210000) + 1) * 210000 - blocks), 'm')
      .format('MMM D YYYY'),
  ]

  const getHtml = (i: number) => {
    return `<span class='text-4xl font-bold'>${values[i]}</span><br> ${metrics[i]}`
  }

  return (
    <section className='px-3'>
      <div className='container mx-auto flex justify-center py-5'>
        <div className='flex flex-col space-y-10 bg-blue-500 text-white rounded-md shadow-md px-8 py-10'>
          {metrics.map((m, i) => {
            return (
              <div
                dangerouslySetInnerHTML={{ __html: getHtml(i) }}
                key={i}
              ></div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stats
