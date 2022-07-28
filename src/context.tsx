import React, { useState, useEffect, useContext, ReactNode } from 'react'

interface ContextInterface {
  blockchainInfo: { [key: string]: string | number; blocks: number }
  wallets: string[] | null
  input: string | ''
  error: {
    show: boolean
    message: string | ''
  }
  isSubmitted: boolean
  setInput: (input: string) => void
  setError: (error: { show: boolean; message: string }) => void
  setIsSubmitted: (isSubmitted: boolean) => void
}

const AppContext = React.createContext<ContextInterface | ''>('')

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [blockchainInfo, setBlockchainInfo] = useState({
    blocks: 0,
  })
  const [wallets, setWallets] = useState(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState({ show: false, message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function fetchData() {
    const res = await fetch('http://localhost:3000/api/blockchaininfo')
    const data = await res.json()
    setBlockchainInfo(data)
  }

  useEffect(() => {
    fetchData()
    setInterval(fetchData, 5000)
  }, [])

  return (
    <AppContext.Provider
      value={{
        blockchainInfo,
        wallets,
        input,
        error,
        isSubmitted,
        setInput,
        setError,
        setIsSubmitted,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(AppContext) as ContextInterface
}

export { AppContext, AppProvider }
