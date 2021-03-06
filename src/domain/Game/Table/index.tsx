import React, { useEffect } from 'react'
import { socket } from '../../../services/Socket'
import Card from '../Card'
import tableStyle from './style.module.scss'

import Sound from '../../../services/soundEffects'

const Table = ({ state }) => {

  const { 
    players, 
    table, 
    myIndex, 
    stage 
  } = state


  useEffect(
    () => {
      
      if(stage === "active") 
        Sound.putCard()
      
    }, [state.table.length, stage])


  var handleOnClick = card => {}
  if(stage === "chooseKing") {
    handleOnClick = card => {
      socket.emit("chooseKing", card)
    }
  }

  const modulo = (n: number, mod: number): number => (((n % mod) + mod) % mod)
  const n = players.length

  const rot = (index, card) => {
    if (index >= players.length) 
      // talon card (klop)
      return players.length === 3 ? 90 : 60
    else 
      // player card
      return modulo((card.player - myIndex), n) * (360 / n) 
  }



  let Cards = table.map((card, index) => 
    <Card
      className={tableStyle.card}
      playable={stage === "chooseKing"}
      value={card.card} 
      rotation={ rot(index, card) } 
      id={index} 
      key={index}
      onClick={() => handleOnClick(card.card)}
    />)

  return (
    <div className={tableStyle.table}>
      {Cards}
    </div>
  )
}

export default Table