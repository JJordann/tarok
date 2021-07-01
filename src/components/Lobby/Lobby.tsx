import React, { useEffect, useState } from 'react'
import { getLobbies, getUsers, join, onAllReady, onGetUsers, stopAllReady, stopGetUsers } from '../../services/APIWrapper/APIWrapper'

import PlayerCard from '../PlayerCard/PlayerCard'

import lobbyStyles from './Lobby.module.scss'

const Lobby = ({lobbyId, players}) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers(lobbyId)

    onGetUsers((usersData) => {
      console.log(usersData)
      setUsers(usersData)

      console.log(users)
    })

    onAllReady(() => {
      console.log('ALL READY')
    })

    return () => {
      stopGetUsers()
      stopAllReady()
    }
  })

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