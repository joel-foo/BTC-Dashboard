import { Outlet, Link } from 'react-router-dom'
import { FaBitcoin } from 'react-icons/fa'

const Layout = () => {
  return (
    <>
      <nav className='navbar'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/stats'>Stats</Link>
          </li>
          <li>
            <Link to='/blockexplorer/page=1'>Block Explorer</Link>
          </li>
        </ul>
      </nav>
      <div className='title-container'>
        Your <FaBitcoin className='bitcoin-logo' /> Dashboard
      </div>
      <Outlet />
    </>
  )
}

export default Layout
