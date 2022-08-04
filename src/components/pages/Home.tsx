import { Link } from 'react-router-dom'
import { BiCube } from 'react-icons/bi'
import { IoStatsChartSharp } from 'react-icons/io5'
import { useGlobalContext } from '../../context'
import Loading from './Loading'

const Home = () => {
  const { blockchainInfo } = useGlobalContext()
  if (blockchainInfo.blocks === -1) {
    return <Loading />
  }
  return (
    <section className='px-3 '>
      <div className='container mx-auto flex flex-col gap-y-12 text-3xl items-center py-10 md:text-4xl md:pt-20'>
        <div className='flex flex-col gap-y-3 text-center'>
          <h1 className='text-6xl font-bold'> {blockchainInfo.blocks} </h1>
          <span>blocks and counting...</span>
        </div>
        <div className='flex flex-col gap-y-3 md:flex-row md:gap-y-0 md:space-x-3 md:min-h-[400px] justify-center'>
          <Link to='/stats'>
            <div className='flex flex-col items-center justify-center p-20 gap-y-10 shadow-md md:h-[100%] hover:scale-[102%] bg-blue-500  rounded-md text-white opacity-95 hover:opacity-100'>
              <p className='text-center'>Statistics Overview</p>
              <IoStatsChartSharp className='text-4xl' />
            </div>
          </Link>
          <Link to='/blockexplorer/page=1' className='link-page'>
            <div className='flex flex-col items-center justify-center  p-20 gap-y-10 shadow-md md:h-[100%] hover:scale-[102%] bg-blue-500  rounded-md text-white opacity-95 hover:opacity-100'>
              <p className='text-center'>Block Explorer</p>
              <BiCube className='text-4xl' />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home
