import React from 'react'
import Card from './Card'

import tableStyle from '../style/table.module.scss'

const Table = ({cards}) => {

  console.log(cards);

  let Cards =cards.map((card, index) => 
  <Card
    playable={0}
    value={card} 
    rotation={ 0 } 
    id={index} 
    key={index}
  />)

  return (
    <div className={tableStyle.table}>
      {Cards}
    </div>
  )
}

export default Table