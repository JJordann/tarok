import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { HOME_ROUTE, GAME_ROUTE, LOBBY_ROUTE, GAME_SCREEN_ROUTE } from '../../routes'

import LandingPage from '../LandingPage/LandingPage'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path={HOME_ROUTE} exact component={LandingPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App