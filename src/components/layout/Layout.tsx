import { Outlet, Link, useNavigate } from 'react-router-dom'
import { FaBitcoin } from 'react-icons/fa'

const Layout = () => {
  const navigate = useNavigate()

  return (
    <main>
      <section className='bg-blue-100 relative'>
        <div className='container mx-auto flex justify-center items-center py-8 text-xl relative md:text-3x '>
          <nav>
            <ul className='flex space-x-4 md:space-x-10'>
              <li className='hover:underline underline-offset-4'>
                <Link to='/'>home</Link>
              </li>
              <li className='hover:underline underline-offset-4'>
                <Link to='/stats'>stats</Link>
              </li>
              <li className=''>
                <button
                  onClick={() => {
                    navigate('/blockexplorer/page=1')
                    navigate(0)
                  }}
                  className='hover:underline underline-offset-4'
                >
                  block explorer
                </button>
              </li>
            </ul>
          </nav>
          <FaBitcoin className='absolute right-5 top-1/2 transform -translate-y-1/2' />
        </div>
      </section>
      <Outlet />
      {/* <footer className='container mx-auto text-center mb-10'>
        logged in as {process.env.REACT_APP_RPC_USER}
      </footer> */}
    </main>
  )
}

export default Layout
