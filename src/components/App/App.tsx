import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { GAME_ROUTE, HOME_ROUTE, LOBBY_LIST_ROUTE, LOGIN_ROUTE } from '../../routes'

import GamePage from '../Pages/GamePage'
import LandingPage from '../Pages/LandingPage'
import LobbyListPage from '../Pages/LobbyListPage'
import Error404Page from '../Pages/Error404Page'
import LoginPage from '../Pages/LoginPage'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path={HOME_ROUTE} exact component={LandingPage} />
          <Route path={LOBBY_LIST_ROUTE} exact component={LobbyListPage} />
          <Route path={GAME_ROUTE} exact component={GamePage} />
          <Route path={LOGIN_ROUTE} exact component={LoginPage} />
          <Route component={Error404Page} />
      </Switch>
    </BrowserRouter>
  )
}

export default App