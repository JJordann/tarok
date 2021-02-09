import React from 'react'

import { socket } from '../../../services/Socket'

import Card from '../Card'

import kingsStyle from './style.module.scss'

const Kings = () => {

  const handleOnClick = (king) => {
    socket.emit('chooseKing', king)
  }

  const kings = ['srce_kralj', 'pik_kralj', 'kara_kralj', 'kriz_kralj']

  const Kings = kings.map((king, index) =>
    <Card
      playable={true}
      value={king} 
      rotation={ 0 }
      translate={ 0 }
      id={index} 
      key={index}
      onClick={() => handleOnClick(king)}
    />
  )

  return (
    <div className={kingsStyle.wrapper}>
      {Kings}
    </div>
  )
}

export default Kings