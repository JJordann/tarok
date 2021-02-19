import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { HOME_ROUTE, GAME_ROUTE, LOBBY_ROUTE } from '../../routes'

import Home from '../Home'
import Lobby from '../../domain/Lobby/Lobby'
import Game from '../../domain/Game/Game'
import Rooms from '../../domain/Lobby/Rooms'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path={HOME_ROUTE} exact component={Home} />
          <Route path={GAME_ROUTE} exact component={Game} />
          <Route path={"/lobby/:id"}  exact   component={Lobby} />
          <Route path={"/rooms"}   exact component={Rooms} />
      </Switch>
    </BrowserRouter>
  )
}

export default App