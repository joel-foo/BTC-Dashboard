import { Outlet, Link } from 'react-router-dom'
import { FaBitcoin } from 'react-icons/fa'

const Layout = () => {
  return (
    <>
      <section className='bg-blue-100 relative'>
        <div className='container mx-auto flex justify-center items-center py-8 text-xl relative md:text-3x '>
          <nav>
            <ul className='flex space-x-4 md:space-x-10'>
              <li className='hover:underline'>
                <Link to='/'>home</Link>
              </li>
              <li className='hover:underline'>
                <Link to='/stats'>stats</Link>
              </li>
              <li className='hover:underline'>
                <Link to='/blockexplorer/page=1'>block explorer</Link>
              </li>
            </ul>
          </nav>
          <FaBitcoin className='absolute right-5 top-1/2 transform -translate-y-1/2' />
        </div>
      </section>
      <Outlet />
    </>
  )
}

export default Layout
