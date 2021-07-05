import React from 'react'

import ContentBox from '../core/ContentBox'
import Button from '../core/Button'

import { join } from '../../services/APIWrapper/APIWrapper'

import connectionStyles from './Connection.module.scss'
import { getUser } from '../../services/User/User'
import { COLORS } from '../../services/colors'

const Connection = ({isConnected, lobbyId}) => {
  const connect = () => {
    join(getUser(), lobbyId)
  }

  const joinButton = <Button color={COLORS.red} onClick={connect}>Pridruži se</Button>

  return (
    <div className={connectionStyles.container}>
      { joinButton }
    </div>
  )
}

export default Connection