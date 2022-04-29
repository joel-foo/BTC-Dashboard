import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Stats from './components/stats/Stats'
import Home from './components/pages/Home'
import Wallets from './components/wallets/Wallets'
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
          <Route path='wallets' element={<Wallets />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
