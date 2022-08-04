import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context'

const FormLayout = () => {
  const navigate = useNavigate()
  const { input, setInput, error, setError, blockchainInfo, setIsSubmitted } =
    useGlobalContext()

  const handleSubmit = () => {
    if (!/^\d+$/.test(input)) {
      setError({ show: true, message: 'Only digits allowed' })
      return
    }
    if (parseInt(input) > blockchainInfo.blocks) {
      setError({ show: true, message: 'Max block count exceeded' })
      return
    }
    setIsSubmitted(true)
    navigate(`./blockheight=${input}`)
  }

  const genericSubmitFn = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ): void => {
    e.preventDefault()
    handleSubmit()
  }

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError({ show: false, message: '' })
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [error])

  return (
    <section>
      <div className='container mx-auto text-center text-xl pt-10 flex flex-col items-center gap-y-3'>
        <form className='space-x-3'>
          <label htmlFor='blockHeight'>Search for Block:</label>
          <input
            className={`
              ${
                error.show && 'border-red-400'
              } px-3 py-1 border-2 w-36 border-gray-300 rounded-sm focus:outline-none focus:border-gray-400`}
            type='text'
            onChange={(e) => {
              setInput(e.target.value)
            }}
            value={input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                genericSubmitFn(e)
              }
            }}
          />
        </form>
        <button
          type='button'
          className='text-white rounded-md w-20 bg-blue-500 px-2 py-1 text-base'
          onClick={(e) => {
            genericSubmitFn(e)
          }}
        >
          Find it!
        </button>
        <p className='text-red-500 text-base'>{error.show && error.message}</p>
      </div>
      <Outlet />
    </section>
  )
}

export default FormLayout
