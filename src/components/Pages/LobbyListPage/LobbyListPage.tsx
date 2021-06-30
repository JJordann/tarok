import React from 'react'
import Header from '../../Header/Header'

import lobbyListPageStyles from './LobbyListPage.module.scss'

const LobbyListPage = () => {

  return (
    <div className={lobbyListPageStyles.wrapper}>
      <Header routes={[]} />
      <div className={lobbyListPageStyles.container}>
        <h1>Tarok sobe</h1>
      </div>
    </div>
  )
}

export default LobbyListPage