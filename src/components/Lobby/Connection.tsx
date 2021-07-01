import React, { useState } from 'react'

import PlayerCard from '../PlayerCard/PlayerCard'

import { join, setReady } from '../../services/APIWrapper/APIWrapper'

import connectionStyles from './Connection.module.scss'

const Connection = ({isConnected, lobbyId}) => {



  const connect = () => {
    join('Tilen', lobbyId)
  }

  const joinButton = <PlayerCard name='Pridruži se' active={true}
    onClick={connect} />

  return (
    <div className={connectionStyles.container}>
      { joinButton }
    </div>
  )
}

export default Connection