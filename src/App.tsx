import React, { useState, useMemo } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { UserContext } from "./components/UserContext"

import LandingPage from './components/LandingPage';
import Game from './components/Game';
import Flask from './components/Flask'

import io from "socket.io-client"


function App() {


  //const socket = io()


  //const endpoint = "http://127.0.0.1:5000"
  //socket.connect(`${endpoint}/joined`)
  //const socket = io(`${endpoint}/joined`)



  return (
    <BrowserRouter>
      <Switch>
        <UserContext.Provider value={"aaa"}>       
          <Route path="/" exact component={LandingPage} />
          <Route path="/game" exact component={Game} />
          <Route path="/test" exact component={Flask} />
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
