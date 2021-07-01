import React from 'react'
import { getLobbies, join } from '../../services/APIWrapper/APIWrapper'

import PlayerCard from '../PlayerCard/PlayerCard'

import lobbyStyles from './Lobby.module.scss'

const Lobby = ({lobbyId, players}) => {

  const Players = players.map((player, index) =>
    <PlayerCard name={player} active={false} key={index} />
  )

  const joinLobby = () => {
    join('Tilen', lobbyId)

    getLobbies()
  }

  return (
    <div className={lobbyStyles.lobbyContainer}>
      {Players}
      {(players.length < 4) ?
          <PlayerCard className={lobbyStyles.joinCard} 
            onClick={joinLobby}
            name='Pridruži se' active={true} key={5}/>
        : ''}
    </div>
  )
}

export default Lobby