import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HOME_ROUTE } from '../../routes'
import { Home } from '../../pages/Home'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
          <Route path={HOME_ROUTE} element={<Home  />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App