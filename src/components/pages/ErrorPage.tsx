import React from 'react'

type Props = {
  msg?: string
}

const ErrorPage: React.FC<Props> = ({ msg }) => {
  return (
    <section>
      <div className='container mx-auto py-20'>
        <h1 className='text-4xl text-red-500 font-bold text-center'>{msg}</h1>
      </div>
    </section>
  )
}

export default ErrorPage
