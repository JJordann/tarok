import React, { useState } from 'react'
import { join, setReady } from '../../services/APIWrapper/APIWrapper'

import connectionStyles from './Connection.module.scss'

const Connection = ({isConnected, isReady, lobbyId}) => {
  const [name, setName] = useState('')

  const connect = (e) => {
    e.preventDefault()

    join(name, lobbyId)
  }

  const ready = () => {
    setReady(!isReady)
  }

  const onInputChange = (e) => {
    setName(e.target.value)
  }

  const ConnectionForm =
    <form className={connectionStyles.form} onSubmit={connect}>
      <input type='text' placeholder='Vnesi ime' value={name} onChange={onInputChange} />
      <button type='submit'>Connect</button>
    </form>

  const ReadyButton =
    <button onClick={ready}>{isReady ? 'Not ready' : 'Ready'}</button>

    return (
      <div className={connectionStyles.container}>
        { isConnected ? ReadyButton : ConnectionForm }
      </div>
    )
}

export default Connection