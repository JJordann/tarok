import React from 'react';
import Game from './components/Game';
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Flask from './components/Flask'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Game} />
        <Route path="/test" exact component={Flask} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
