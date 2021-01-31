import React, { useEffect, useState } from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"
import getSocket from './global';

const Game = () => {
  const socket = getSocket();

  const [state, setState] = useState({})

  const values = ['srce_kraljica', 'srce_kralj', 'kara_kralj', 'pik_kralj',
                    'kriz_kralj', 'tarok_1', 'tarok_16', 'tarok_18', 'tarok_19',
                      'tarok_20', 'tarok_21', 'tarok_22'];

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getState');

    socket.on('getState', s => {
      console.log(s);
      console.log(JSON.parse(s))
      setState(JSON.parse(s))
    });


    return () => {
      socket.off('getState')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div>
      <Hand cards={values} />
    </div>
  )
}

export default Game;