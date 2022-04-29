import { useEffect } from 'react'

export function useResetBodyClass() {
  useEffect(() => {
    document.body.className = ''
  }, [])
  return
}
