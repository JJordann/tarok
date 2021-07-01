import React, { useEffect, useState } from 'react'

import Lobby from '../../Lobby/Lobby'
import Header from '../../Header/Header'

import lobbyListPageStyles from './LobbyListPage.module.scss'
import PlayerCard from '../../PlayerCard/PlayerCard'
import { createLobby, getLobbies, onCreateLobby, onGetLobbies } from '../../../services/APIWrapper/APIWrapper'

const LobbyListPage = () => {

  const [lobbies, setLobbies] = useState([])

  useEffect(() => {
    onGetLobbies(handleLobbies)
    onCreateLobby(handleCreateLobby)
    getLobbies()
  }, [])

  const handleLobbies = (lobbies => {
    setLobbies(JSON.parse(lobbies))
    console.log(lobbies)
  })

  const handleCreateLobby = (msg) => {
    console.log('handleCreateLobby')
    console.log(msg)
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
    <Lobby lobbyId={lobby.id} players={lobby.players} key={index} />
  )

  return (
    <div className={lobbyListPageStyles.wrapper}>
      <Header />
      <div className={lobbyListPageStyles.container}>
        <h1><span>Tarok sobe</span></h1>

        {CreateLobby}

        {Lobbies}


      </div>
    </div>
  )
}

export default LobbyListPage