import React from 'react'

import { socket } from '../../../services/Socket'

import Card from '../Card'

import tableStyle from './style.module.scss'

const Table = ({ state }) => {

  const { players, turn, table, myIndex, stage } = state

  var handleOnClick = card => {}
  if(stage === "chooseKing") {
    handleOnClick = card => {
      socket.emit("chooseKing", card)
    }
  }

  const modulo = (n: number, mod: number): number => (((n % mod) + mod) % mod)


  let n = players.length
  let startingPlayer = modulo((turn - table.length), n)
  let indexOffset = modulo((startingPlayer - myIndex), n)


  let Cards = table.map((card, index) => 
    <Card
      className={tableStyle.card}
      playable={stage === "chooseKing"}
      value={card.card} 
      rotation={ (indexOffset + index) * (360 / n) } 
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