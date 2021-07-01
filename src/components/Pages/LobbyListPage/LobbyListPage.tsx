import React, { useEffect, useState } from 'react'

import NameForm from '../../NameForm/NameForm'
import Lobby from '../../Lobby/Lobby'
import Header from '../../Header/Header'
import PlayerCard from '../../PlayerCard/PlayerCard'

import lobbyListPageStyles from './LobbyListPage.module.scss'

import { createLobby, getLobbies, onCreateLobby, onGetLobbies, stopCreateLobby, stopGetLobbies } from '../../../services/APIWrapper/APIWrapper'

const LobbyListPage = () => {

  const [lobbies, setLobbies] = useState([])

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

        <NameForm />

        {Content}


      </div>
    </div>
  )
}

export default LobbyListPage