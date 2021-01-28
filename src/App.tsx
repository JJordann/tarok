import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from './components/LandingPage';
import Game from './components/Game';
import Flask from './components/Flask'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/game" exact component={Game} />
        <Route path="/test" exact component={Flask} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
