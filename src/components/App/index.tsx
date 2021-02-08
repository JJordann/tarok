import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '../Home'
import Lobby from '../Lobby'
import Game from '../Game'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/game" exact component={Game} />
          <Route path="/lobby" exact component={Lobby} />
      </Switch>
    </BrowserRouter>
  )
}

export default App