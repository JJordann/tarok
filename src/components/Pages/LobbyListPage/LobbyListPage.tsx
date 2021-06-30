import React from 'react'

import Lobby from '../../Lobby/Lobby'
import CreateLobby from '../../Lobby/CreateLobby'
import Header from '../../Header/Header'

import lobbyListPageStyles from './LobbyListPage.module.scss'
import PlayerCard from '../../PlayerCard/PlayerCard'

const LobbyListPage = () => {

  const lobbies = [
    [
      {player: 'Tilen', ready: false},
      {player: 'Vid', ready: true},
      {player: 'Jordan', ready: false},
      {player: 'Matija', ready: false}
    ],
    [
      {player: 'Vražji poba', ready: true},
      {player: 'Štefka', ready: true},
      {player: 'Mato211', ready: false},
      {player: 'Serbo', ready: true}
    ],
    [
      {player: 'Janez Novak', ready: false},
      {player: 'Player69', ready: false},
      {player: 'Dolorem ipsum', ready: false}
    ]
  ]

  const Notice = (lobbies.length === 0) ?
    <PlayerCard name='Trenutno ni aktivnih sob' active={false} /> : ''

  const CreateLobby = 
    <div className={lobbyListPageStyles.flex}>
      {Notice}
      <PlayerCard name='Ustvari sobo' active={true} />
    </div>

  const Lobbies = lobbies.map((lobby, index) =>
      <Lobby players={lobby} key={index} />
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