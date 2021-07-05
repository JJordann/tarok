import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import Lobby from '../../Lobby/Lobby'
import Header from '../../Header/Header'
import ContentBox from '../../core/ContentBox'
import Button from '../../core/Button'

import lobbyListPageStyles from './LobbyListPage.module.scss'

import { createLobby, getLobbies, getUsers, join, onCreateLobby, onGetLobbies, stopCreateLobby, stopGetLobbies } from '../../../services/APIWrapper/APIWrapper'
import { LOGIN_ROUTE } from '../../../routes'
import { getUser } from '../../../services/User/User'
import { COLORS } from '../../../services/colors'

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
    const parsedLobbies = JSON.parse(lobbies)

    parsedLobbies.forEach((lobby, index) => {
      getUsers(lobby.id)
    })
  })

  const handleCreateLobby = (lobbyId) => {
    join(getUser(), lobbyId)
  }

  const handleClick = () => {
    createLobby()
  }
  

  const Notice = (lobbies.length === 0) ?
    <ContentBox color={COLORS.red}>Trenutno ni aktivnih sob</ContentBox> : ''

  const CreateLobby = 
    <div className={lobbyListPageStyles.flex}>
      {Notice}
      <Button color={COLORS.blue} onClick={handleClick}>Ustvari sobo</Button>
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

        <ContentBox>
          Pozdravljen, {name}!
        </ContentBox>

        {Content}
      </div>
    </div>
  )
}

export default LobbyListPage