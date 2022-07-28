import React from 'react'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'

const ErrorPage = () => {
  useResetBodyClass()
  return <div>Error</div>
}

export default ErrorPage
