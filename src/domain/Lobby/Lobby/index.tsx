import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { socket } from '../../../services/Socket'

import { GET_USERS, ALL_READY } from '../actions'

import { GAME_ROUTE } from '../../../routes'

import Connection from '../Connection'
import LobbyCard from '../LobbyCard'

import lobbyStyle from './style.module.scss'

const Lobby = () => {
  const [users, setUsers] = useState([])

  const history = useHistory()

  useEffect(() => {
    socket.emit(GET_USERS)

    socket.on(GET_USERS, (usersData) => {
      setUsers(usersData)
    })

    socket.on(ALL_READY, () => {
      history.push(GAME_ROUTE)
    })

    return () => {
      socket.off(GET_USERS)
      socket.off(ALL_READY)
    }
    
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const clientIsJoined = () => users.some(p => p[2])

  const clientIsReady = () => clientIsJoined() ? users.find(p => p[2])[1] : false

  const LobbyCards = users.map((user, index) =>
    <LobbyCard name={user[0]} ready={user[1]} key={index} />
  )

  return (
    <div className={lobbyStyle.container}>
      <Connection isConnected={clientIsJoined()} isReady={clientIsReady()} />
      <div className={lobbyStyle.cards}>
        { (users.length) ? LobbyCards : '' }
      </div>
    </div>
  )
}

export default Lobby