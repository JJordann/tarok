import React from 'react';
import Game from './components/Game';
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Flask from './components/Flask'
import Join from './components/Join'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Game} />
        <Route path="/join" exact component={Join} />
        <Route path="/test" exact component={Flask} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
