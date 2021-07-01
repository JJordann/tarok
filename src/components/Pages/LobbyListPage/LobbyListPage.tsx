import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import Lobby from '../../Lobby/Lobby'
import Header from '../../Header/Header'
import PlayerCard from '../../PlayerCard/PlayerCard'

import lobbyListPageStyles from './LobbyListPage.module.scss'

import { createLobby, getLobbies, join, onCreateLobby, onGetLobbies, stopCreateLobby, stopGetLobbies } from '../../../services/APIWrapper/APIWrapper'
import { LOGIN_ROUTE } from '../../../routes'
import { getUser } from '../../../services/User/User'

const LobbyListPage = () => {
  const [lobbies, setLobbies] = useState([])

  const history = useHistory()

  const name = getUser()

  if(name === '') {
    history.push(LOGIN_ROUTE)
  }

  useEffect(() => {
    onGetLobbies(handleLobbies)
    onCreateLobby(handleCreateLobby)
    getLobbies()

    return () => {
      stopGetLobbies()
      stopCreateLobby()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLobbies = (lobbies => {
    setLobbies(JSON.parse(lobbies))
    console.log(lobbies)
  })

  const handleCreateLobby = (lobbyId) => {
    join(getUser(), lobbyId)
  }

  const handleClick = () => {
    createLobby()
  }
  

  const Notice = (lobbies.length === 0) ?
    <PlayerCard name='Trenutno ni aktivnih sob' active={false} /> : ''

  const CreateLobby = 
    <div className={lobbyListPageStyles.flex}>
      {Notice}
      <PlayerCard name='Ustvari sobo' active={true} onClick={handleClick} />
    </div>

  const Lobbies = lobbies.map((lobby, index) =>
    <Lobby lobbyId={lobby.id} key={index} />
  )

  const Content =
    <>
      {CreateLobby}

      {Lobbies}
    </>

  return (
    <div className={lobbyListPageStyles.wrapper}>
      <Header />
      <div className={lobbyListPageStyles.container}>
        <h1><span>Tarok sobe</span></h1>

        <PlayerCard className={lobbyListPageStyles.welcome}
          name={`Pozdravljen, ${name}!`} active={true} />

        {Content}


      </div>
    </div>
  )
}

export default LobbyListPage