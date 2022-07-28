import React from 'react'
import { useResetBodyClass } from '../custom hooks/useResetBodyClass'

const Loading = () => {
  useResetBodyClass()
  return (
    <div className='loading'>
      <div className='loader'></div>
    </div>
  )
}

export default Loading
