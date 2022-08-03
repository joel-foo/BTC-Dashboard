import { Link } from 'react-router-dom'
import { BiCube } from 'react-icons/bi'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { IoStatsChartSharp } from 'react-icons/io5'
import { useGlobalContext } from '../../context'
import Loading from './Loading'
import moment from 'moment'

const Home = () => {
  const { blockchainInfo } = useGlobalContext()
  if (blockchainInfo.blocks === -1) {
    return <Loading />
  }
  return (
    <section className='p-5 '>
      <div className='container mx-auto flex flex-col gap-y-12 text-4xl items-center py-10'>
        <h1>Welcome back, {process.env.REACT_APP_RPC_USER}!</h1>
        <div>
          <span className='text-6xl font-bold'> {blockchainInfo.blocks} </span>{' '}
          blocks
        </div>
        <div className='flex flex-col gap-y-3 md:flex-row md:gap-y-0 md:space-x-3 md:min-h-[600px] justify-center'>
          <Link to='/stats'>
            <div className='flex flex-col items-center justify-center p-20 gap-y-10 border-2 border-gray-100 shadow-xl md:h-[100%] hover:scale-[102%]'>
              <p className='text-center'>Statistics Overview</p>
              <IoStatsChartSharp />
            </div>
          </Link>
          <Link to='/blockexplorer/page=1' className='link-page'>
            <div className='flex flex-col items-center justify-center  p-20 gap-y-10 border-2 border-gray-100 shadow-xl md:h-[100%] hover:scale-[102%]'>
              <p className='text-center'>Block Explorer</p>
              <div className='flex relative'>
                <BiCube />
                <GiMagnifyingGlass className='absolute text-xl bottom-0 ' />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home
