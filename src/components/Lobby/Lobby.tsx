import React, { useEffect, useState } from 'react'

import { getLobbies, getUsers, join, onAllReady, onGetUsers, stopAllReady, stopGetUsers } from '../../services/APIWrapper/APIWrapper'

import Connection from './Connection'
import PlayerCard from '../PlayerCard/PlayerCard'

import lobbyStyles from './Lobby.module.scss'

const Lobby = ({lobbyId, players}) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers(lobbyId)

    onGetUsers((usersData) => {
      console.log(usersData)
      setUsers([...usersData])

      console.log(users)
    })

    onAllReady(() => {
      console.log('ALL READY')
    })

    return () => {
      stopGetUsers()
      stopAllReady()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const Players = users.map((user, index) =>
    <PlayerCard name={user[0]} active={user[1]} key={index} />
  )

  return (
    <div className={lobbyStyles.lobbyContainer}>
      {Players}
      {(users.length < 4) ?
          <Connection isConnected={false} lobbyId={lobbyId} />
        : ''}
    </div>
  )
}

export default Lobby