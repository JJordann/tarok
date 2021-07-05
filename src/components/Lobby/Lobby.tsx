import React, { useEffect, useState } from 'react'

import { getUsers, onAllReady, onGetUsers, setReady, stopAllReady, stopGetUsers } from '../../services/APIWrapper/APIWrapper'

import { getUser } from '../../services/User/User'

import Connection from './Connection'

import Button from '../core/Button'

import lobbyStyles from './Lobby.module.scss'
import { useHistory } from 'react-router-dom'
import { GAME_ROUTE } from '../../routes'
import { COLORS } from '../../services/colors'

const Lobby = ({lobbyId}) => {

  const [users, setUsers] = useState([])

  const history = useHistory()

  useEffect(() => {
    getUsers(lobbyId)

    onGetUsers((usersData) => {
      console.log(usersData)
      setUsers([...usersData])
    })

    onAllReady(() => {
      history.push(GAME_ROUTE)
    })

    return () => {
      stopGetUsers()
      stopAllReady()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleContentBoxClick = (e) => {
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

  const getColor = (ready) => {
    return (ready) ? COLORS.blue : COLORS.red
  }

  const Players = users.map((user) =>
    <Button color={getColor(user[1])} onClick={handleContentBoxClick} key={user}>
      {user[0]}
    </Button>
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