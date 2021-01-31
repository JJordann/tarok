import React, { useEffect, useState } from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"
import getSocket from './global';

const Game = () => {
  const socket = getSocket();

  const [state, setState] = useState({
    table: [],     // cards on table
    players: [],   // players in room
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false    // is it my turn?
  })

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getState');

    socket.on('getState', s => {
      console.log(JSON.parse(s))
      setState(JSON.parse(s))
    });


    return () => {
      socket.off('getState')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div>
      <Hand cards={state.hand} playable={state.playable} />
    </div>
  )
}

export default Game;