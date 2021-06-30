import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { GAME_ROUTE, HOME_ROUTE, LOBBY_LIST_ROUTE } from '../../routes'

import GamePage from '../Pages/GamePage/GamePage'
import LandingPage from '../Pages/LandingPage/LandingPage'
import LobbyListPage from '../Pages/LobbyListPage/LobbyListPage'
import Error404Page from '../Pages/Error404Page/Error404Page'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path={HOME_ROUTE} exact component={LandingPage} />
          <Route path={LOBBY_LIST_ROUTE} exact component={LobbyListPage} />
          <Route path={GAME_ROUTE} exact component={GamePage} />
          <Route component={Error404Page} />
      </Switch>
    </BrowserRouter>
  )
}

export default App