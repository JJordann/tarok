import React, { useState, useEffect } from 'react';
import getSocket from './global';
import lobbyStyles from '../style/lobby.module.scss';
import Toggle from './elements/Toggle';

import { Link, useHistory } from 'react-router-dom';

const Lobby = (props: any) => {
  
  const socket = getSocket();

  const history = useHistory();

  const [playerList, setPlayerList] = useState([]);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getUsers');

    // register event listeners here
    socket.on('getUsers', players => {
      setPlayerList(players);
    });

    socket.on('allReady', () => {
      history.push('/game');
    });

    return () => {
      // unregister event listeners here
      console.log('unregistered');
      socket.off('getUsers');
      //socket.off('dealCards')
      socket.off('allReady')
    }

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const onPlayerNameInputChange = (event) => {
    setPlayerName(event.target.value);
  }


  // TODO: zagotovi, da lahko uporabnik joina samo enkrat (v state shrani če je že joinu)

  const connect = () => {
    socket.emit('join', playerName);
  }

  const ready = (value) => {
    socket.emit('ready', String(value));
  }

  const onToggleChange = (value) => {
    ready(value);
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


  const clientIsJoined = () => playerList.some(p => p[2])

  const clientIsReady = () => clientIsJoined() ? 
        playerList.find(p => p[2])[1] : false

  const onFormSubmit = (e) => {
    e.preventDefault();
    connect();
  }


  let Ready = 
    <div className={lobbyStyles.input}>
      <button onClick={() => ready(true)}> READY </button>
    </div> 

  let Connect = 
    <form className={lobbyStyles.input} onSubmit={onFormSubmit}>
      <input type="text" placeholder="Vnesi ime" value={playerName}
        onChange={onPlayerNameInputChange} />
      <button type="submit">Connect</button>
    </form>

  return (
    <div className={lobbyStyles.lobbyContainer}>
      <div className={lobbyStyles.lobby}>
         { playerBoxes }
      </div>
        { clientIsJoined() ? Ready : Connect}
        <br />
        { clientIsJoined() ? "JOINED": "NOT JOINED"}
        <br />
        { clientIsReady() ? "READY": "NOT READY"}
    </div>
    
  );
}

export default Lobby;