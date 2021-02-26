import React, { useEffect } from 'react'
import { socket } from '../../../services/Socket'
import { GameTypes } from '../GameTypes'
import contractStyle from './style.module.scss'
import Sound from '../../../services/soundEffects'


const Contracts = ({ contracts, show = true }) => {

  const handleContract = (contract: string) => {
    socket.emit('gameType', contract)
    console.log(contract)
  }

  useEffect(
    () => {
      Sound.shuffleDeck()
    }, [])
    
  let Items = contracts.map((contract, index) =>
    <div key={contract}>
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