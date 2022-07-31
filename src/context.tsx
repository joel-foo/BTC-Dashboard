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
  startUpdate: boolean
  currentChainHeight: number
  setInput: (input: string) => void
  setError: (error: { show: boolean; message: string }) => void
  setIsSubmitted: (isSubmitted: boolean) => void
  setStartUpdate: (isUpdating: boolean) => void
  setCurrentChainHeight: (currentChainHeight: number) => void
}

const AppContext = React.createContext<ContextInterface | ''>('')

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [blockchainInfo, setBlockchainInfo] = useState({
    blocks: -1,
  })
  const [wallets, setWallets] = useState(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState({ show: false, message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  //current chain height is always one tick before blockchainInfo.blocks
  const [currentChainHeight, setCurrentChainHeight] = useState<number>(
    blockchainInfo.blocks
  )
  const [startUpdate, setStartUpdate] = useState(false)

  async function fetchData() {
    const res = await fetch('http://localhost:3000/api/blockchaininfo')
    const data = await res.json()
    if (!startUpdate) setCurrentChainHeight(blockchainInfo.blocks)
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
        currentChainHeight,
        setCurrentChainHeight,
        startUpdate,
        setStartUpdate,
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
