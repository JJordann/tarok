import React, { useState, useEffect } from 'react';
import getSocket from './global';
import lobbyStyles from '../style/lobby.module.scss';
import Toggle from './elements/Toggle';

import { Link } from 'react-router-dom';

const Lobby = (props: any) => {
  
  const socket = getSocket();

  const [playerList, setPlayerList] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [checked, setChecked] = useState('false');

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getUsers')

    // register event listeners here
    socket.on('getUsers', players => {
      setPlayerList(players);
    })

    return () => {
      // unregister event listeners here
      console.log('unregistered');
      socket.off('getUsers');
    }

  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const onPlayerNameInputChange = (event) => {
    setPlayerName(event.target.value);
  }

  const connect = () => {
    socket.emit('join', playerName);
  }

  const ready = () => {
    socket.emit('ready', 'ready');
  }

  const onToggleChange = (value) => {
    setChecked(value);
    ready();
  }


  let playerBoxes = 
      playerList.map((player, i) =>
        <span className={lobbyStyles.player} key={i}>
          <div className={lobbyStyles.content}>
            <div className={lobbyStyles.top}>
              <p>{player[0]}</p>
            </div>

            <div className={lobbyStyles.bottom}>
              <Toggle name={`${player}-switch-${i}`} checked={player[1]}
                onChange={onToggleChange} className={lobbyStyles.checkbox} />
            </div>
          </div> 
        </span>
      )

  return (
    <div className={lobbyStyles.lobbyContainer}>
      <div className={lobbyStyles.lobby}>
         { playerBoxes }
      </div>

      <div className={lobbyStyles.input}>
        <input type="text" placeholder="Vnesi ime" value={playerName}
          onChange={onPlayerNameInputChange} />
        <button onClick={connect}>Connect</button>
      </div>
      <Link to="/">go hom</Link>
    </div>
    
  );
}

export default Lobby;