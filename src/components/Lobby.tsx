import React, { useState } from 'react';

import getSocket from "./global"

import lobbyStyles from '../style/lobby.module.scss';

import Toggle from './elements/Toggle';

const Lobby = (props: any) => {
  
  const socket = getSocket();

  const [playerList, setPlayerList] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [checked, setChecked] = useState('false');
  
  const onPlayerNameInputChange = (event) => {
    setPlayerName(event.target.value);
  }

  socket.on('join', players => {
    setPlayerList(players);
  });

  const connect = () => {
    socket.emit('join', playerName);
  }

  const ready = () => {
    socket.emit('ready', 'ready');
  }

  const onToggleChange = (value) => {
    setChecked(value);
    ready();
    console.log(value);
  }

  return (
    <div className={lobbyStyles.lobbyContainer}>
      <div className={lobbyStyles.lobby}>
        {playerList.map((player, i) =>
          <span className={lobbyStyles.player} key={i}>
            <div className={lobbyStyles.content}>
              <div className={lobbyStyles.top}>
                <p>{player}</p>
              </div>

              <div className={lobbyStyles.bottom}>
                <Toggle name={`${player}-switch-${i}`} checked={checked}
                  onChange={onToggleChange} className={lobbyStyles.checkbox} />
              </div>
            </div> 
          </span>
        )}
      </div>

      <div className={lobbyStyles.input}>
        <input type="text" placeholder="Vnesi ime" value={playerName}
          onChange={onPlayerNameInputChange} />
        <button onClick={connect}>Connect</button>
      </div>
    </div>
    
  );
}

export default Lobby;