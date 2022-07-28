import { IoWalletSharp } from 'react-icons/io5'
import { useGlobalContext } from '../../context'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'
import Loading from '../pages/Loading'

const Wallets = () => {
  const { wallets } = useGlobalContext()

  useResetBodyClass()

  if (!wallets) {
    return <Loading />
  }
  return (
    <main>
      <div className='card-container home-card-container'>
        <div className='home-card'>
          <label htmlFor='wallets'>Choose your wallet: </label>
          <select name='wallets' id='wallets'>
            {wallets.map((w, i) => {
              return (
                <option value={`${w}`} key={i}>
                  {w}
                </option>
              )
            })}
          </select>
          <IoWalletSharp className='card-icon' />
        </div>
      </div>
    </main>
  )
}

export default Wallets
