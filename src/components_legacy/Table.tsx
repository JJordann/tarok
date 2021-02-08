import React from 'react'
import Card from './Card'

import tableStyle from '../style/table.module.scss'
import getSocket from './global'

const Table = ({cards, stage}) => {

  console.log(cards);

  const socket = getSocket()
  var handleOnClick = card => {}

  if(stage === "chooseKing") {
    handleOnClick = card => {
      socket.emit("chooseKing", card)
    }
  }

  let Cards = cards.map((card, index) => 
  <Card
    playable={stage === "chooseKing"}
    value={card} 
    rotation={ 0 } 
    id={index} 
    key={index}
    onClick={() => handleOnClick(card)}
  />)

  return (
    <div className={tableStyle.table}>
      {Cards}
    </div>
  )
}

export default Table