const Loading = () => {
  return (
    <div className='container mx-auto flex flex-col items-center gap-y-6 py-10 md:py-20'>
      <h1 className='text-2xl'>Processing blocks...</h1>
      <div className='loader'></div>
    </div>
  )
}

export default Loading
