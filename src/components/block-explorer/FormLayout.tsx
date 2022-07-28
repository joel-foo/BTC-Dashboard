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
    <>
      <div className='form-container'>
        <form>
          <label htmlFor='blockHeight'>Search for Block: </label>
          <input
            className={error.show ? 'block-input error' : `block-input`}
            type='text'
            name='blockHeight'
            id='blockHeight'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                genericSubmitFn(e)
              }
            }}
          />

          <button
            type='button'
            className='submit-btn'
            onClick={(e) => {
              genericSubmitFn(e)
            }}
          >
            Submit
          </button>
          <div className='err-msg-container'>
            <p className='err-msg'>{error.show && error.message}</p>
          </div>
        </form>
      </div>
      <Outlet />
    </>
  )
}

export default FormLayout
