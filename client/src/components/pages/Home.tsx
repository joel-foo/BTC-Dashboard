import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BiCube } from 'react-icons/bi'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { IoWalletSharp, IoStatsChartSharp } from 'react-icons/io5'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'

const Home = () => {
  useResetBodyClass()

  return (
    <main>
      <div className='card-container home-card-container'>
        <Link to='/stats' className='link-page'>
          <div className='home-card'>
            <p className='card-title'>Statistics Overview</p>
            <IoStatsChartSharp className='card-icon' />
          </div>
        </Link>
        <Link to='/blockexplorer/page=1' className='link-page'>
          <div className='home-card'>
            <p className='card-title'>Block Explorer</p>
            <div className='icon-container'>
              <BiCube className='card-icon' />
              <GiMagnifyingGlass className='card-icon' />
            </div>
          </div>
        </Link>
        <Link to='/wallets' className='link-page'>
          <div className='home-card'>
            <p className='card-title'>Create/Load Wallet</p>
            <IoWalletSharp className='card-icon' />
          </div>
        </Link>
        <Link to='/fun' className='link-page'>
          <div className='home-card'>
            <p className='card-title'>Fun Activities</p>
            <IoWalletSharp className='card-icon' />
          </div>
        </Link>
      </div>
    </main>
  )
}

export default Home
