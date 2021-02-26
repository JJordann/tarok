import React, { useState } from 'react'
import { socket } from '../../../services/Socket'
import { JOIN, READY } from '../actions'
import connectionStyle from './style.module.scss'


const Connection = ({isConnected, isReady, lobbyId}) => {
  const [name, setName] = useState('')

  const connect = (e) => {
    e.preventDefault()

    socket.emit(JOIN, name, lobbyId)
  }

  const ready = () => {
    socket.emit(READY, String(!isReady))
  }

  const onInputChange = (e) => {
    setName(e.target.value)
  }

  const ConnectionForm =
    <form className={connectionStyle.form} onSubmit={connect}>
      <input type="text" placeholder="Vnesi ime" value={name} onChange={onInputChange} />
      <button type="submit">Connect</button>
    </form>

  const ReadyButton = 
    <button onClick={ready}>{isReady ? 'Not ready' : 'Ready'}</button>

  return (
    <div className={connectionStyle.input}>
      { isConnected ? ReadyButton : ConnectionForm }
    </div>
  )
}

export default Connection