import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HOME_ROUTE } from '../../routes'
import Hand from '../Hand/Hand'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
          <Route path={HOME_ROUTE} element={<Hand cards={['tarok_2']} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App