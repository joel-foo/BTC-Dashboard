import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Stats from './components/stats/Stats'
import Home from './components/pages/Home'
import BlockExplorer from './components/block-explorer/BlockExplorer'
import IndividualBlock from './components/block-explorer/IndividualBlock'
import ErrorPage from './components/pages/ErrorPage'
import FormLayout from './components/block-explorer/FormLayout'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='stats' element={<Stats />} />
          <Route path='blockexplorer' element={<FormLayout />}>
            <Route path='page=:pagenum' element={<BlockExplorer />} />
            <Route path='blockheight=:id' element={<IndividualBlock />} />
          </Route>
          <Route path='*' element={<ErrorPage msg='404 Page Not Found' />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
