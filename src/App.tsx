import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from './components/LandingPage';
import Game from './components/Game';
import Flask from './components/Flask'
import Lobby from './components/Lobby';


function App() {

  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/game/:debug?/:stage?" exact component={Game} />
          <Route path="/test" exact component={Flask} />
          <Route path="/lobby" exact component={Lobby} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
