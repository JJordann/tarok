import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from './components/LandingPage';
import Game from './components/Game';
import Flask from './components/Flask'
import Join from './components/Join'

function App() {
  return (
    <BrowserRouter>
      <Switch>
<<<<<<< HEAD
        <Route path="/" exact component={Game} />
        <Route path="/join" exact component={Join} />
=======
        <Route path="/" exact component={LandingPage} />
        <Route path="/game" exact component={Game} />
>>>>>>> 794273e19fa3dfa3d07c1dc889f666b51b309534
        <Route path="/test" exact component={Flask} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
