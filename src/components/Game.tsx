import React, { useEffect, useState } from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"
import getSocket from './global';

const Game = () => {
  const socket = getSocket();

  const [playerList, setPlayerList] = useState([]);

  const values = ['srce_kraljica', 'srce_kralj', 'kara_kralj', 'pik_kralj',
                    'kriz_kralj', 'tarok_1', 'tarok_16', 'tarok_18', 'tarok_19',
                      'tarok_20', 'tarok_21', 'tarok_22'];

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getUsers');

    socket.emit('getCards');

    socket.on('getUsers', players => {
      console.log(players);
    });

    socket.on('getCards', cards => {
      console.log(cards);
    });
  });
  
  return (
    <div>
      <Hand size={values.length} values={values} />
    </div>
  )
}

export default Game;