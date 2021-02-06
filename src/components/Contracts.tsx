import React from 'react'
import getSocket from './global'

import contractStyle from '../style/contracts.module.scss'

import GameTypes from '../util/GameTypes'

const Contracts = ({ contracts, show = true }) => {

  const socket = getSocket()

  const handleContract = contract => {
    socket.emit('gameType', contract)
    console.log(contract)
  }
    
  let Items = contracts.map((contract, index) =>
    <div>
      <button onClick={() => handleContract(contract)} key={index}>{GameTypes[contract]}</button>
    </div>
  )

  return (
    <div className={contractStyle.container}>
      {(show === true) ? Items : ''}
    </div>
  )
}


export default Contracts