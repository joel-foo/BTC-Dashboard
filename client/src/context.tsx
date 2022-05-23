import React, { useState, useEffect, useContext, ReactNode } from 'react'

interface ContextInterface {
  blockchainInfo: {
    chainInfo: any
    miningInfo: any
  }
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

const defaultState = {
  blockchainInfo: {
    chainInfo: null,
    miningInfo: null,
  },
  wallets: null,
  input: '',
  error: { show: false, message: '' },
  isSubmitted: false,
  setInput: () => {},
  setError: () => {},
  setIsSubmitted: () => {},
}

const AppContext = React.createContext<ContextInterface>(defaultState)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [blockchainInfo, setBlockchainInfo] = useState(
    defaultState.blockchainInfo
  )
  const [wallets, setWallets] = useState(defaultState.wallets)
  const [input, setInput] = useState(defaultState.input)
  const [error, setError] = useState(defaultState.error)
  const [isSubmitted, setIsSubmitted] = useState(defaultState.isSubmitted)

  async function fetchData() {
    const res = await fetch('http://localhost:3001/api/getblockchaininfo')
    const data = await res.json()
    const res2 = await fetch('http://localhost:3001/api/getmininginfo')
    const data2 = await res2.json()
    setBlockchainInfo({
      chainInfo: data.chainInfo,
      miningInfo: data2.miningInfo,
    })
  }

  useEffect(() => {
    fetchData()
    setInterval(fetchData, 5000)
  }, [])

  useEffect(() => {
    fetch('/wallet')
      .then((res) => res.json())
      .then((data) => setWallets(data.wallets))
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
  return useContext(AppContext)
}

export { AppContext, AppProvider }
