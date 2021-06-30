import React from 'react'

import PlayerCard from '../PlayerCard/PlayerCard'

import lobbyStyles from './Lobby.module.scss'

const Lobby = ({players}) => {

  const Players = players.map((player, index) =>
    <PlayerCard name={player.player} active={player.ready} key={index} />
  )

  return (
    <div className={lobbyStyles.lobbyContainer}>
      {Players}
      {(players.length < 4) ?
          <PlayerCard name='Pridruži se' active={true} key={5}/> : ''}
    </div>
  )
}

export default Lobby