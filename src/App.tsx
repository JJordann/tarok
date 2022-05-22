import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { GAME_ROUTE, HOME_ROUTE } from './routes'
import { Home } from './pages/Home'
import { Game } from './pages/Game'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
          <Route path={HOME_ROUTE} element={<Home  />} />
          <Route path={GAME_ROUTE} element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App