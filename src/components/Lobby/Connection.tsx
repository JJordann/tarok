import React from 'react'

import ContentBox from '../core/ContentBox/ContentBox'

import { join } from '../../services/APIWrapper/APIWrapper'

import connectionStyles from './Connection.module.scss'
import { getUser } from '../../services/User/User'

const Connection = ({isConnected, lobbyId}) => {
  const connect = () => {
    join(getUser(), lobbyId)
  }

  const joinButton = <ContentBox name='Pridruži se' active={true}
    onClick={connect} />

  return (
    <div className={connectionStyles.container}>
      { joinButton }
    </div>
  )
}

export default Connection