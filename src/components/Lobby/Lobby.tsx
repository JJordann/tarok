import React, { useEffect, useState } from 'react'

import { getLobbies, getUsers, join, onAllReady, onGetUsers, setReady, stopAllReady, stopGetUsers } from '../../services/APIWrapper/APIWrapper'

import { getUser } from '../../services/User/User'

import Connection from './Connection'
import PlayerCard from '../PlayerCard/PlayerCard'

import lobbyStyles from './Lobby.module.scss'

const Lobby = ({lobbyId}) => {

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

  const handlePlayerCardClick = (e) => {
    // Super whacky way of doing this but it works...for now
    if(e.target.innerHTML === getUser()) {
      let currentReady = users[indexOfUser(getUser())][1]

      setReady(!currentReady)
    }
  }

  const indexOfUser = (name) => {
    const usernames = users.map(user => user[0])

    return usernames.indexOf(name)
  }

  const isConnected = () => {
    return (indexOfUser(getUser()) !== -1)
  }

  const Players = users.map((user, index) =>
    <PlayerCard name={user[0]} active={user[1]} key={index}
      onClick={handlePlayerCardClick} data-id={`Interesting totally very much`} />
  )

  return (
    <div className={lobbyStyles.lobbyContainer}>
      {Players}
      {(!isConnected() && users.length < 4) ?
          <Connection isConnected={false} lobbyId={lobbyId} />
        : ''}
    </div>
  )
}

export default Lobby