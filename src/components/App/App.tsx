import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { GAME_ROUTE, HOME_ROUTE, LOBBY_LIST_ROUTE } from '../../routes'
import GamePage from '../Pages/Game/GamePage'

import LandingPage from '../Pages/LandingPage/LandingPage'
import LobbyListPage from '../Pages/LobbyListPage/LobbyListPage'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path={HOME_ROUTE} exact component={LandingPage} />
          <Route path={LOBBY_LIST_ROUTE} exact component={LobbyListPage} />
          <Route path={GAME_ROUTE} exact component={GamePage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App