import React from 'react'

import CardImage from '../../CardImage'

import talonStyle from './style.module.scss'

const Talon = ({cards}) => {
  
  const Cards = cards.map((part, index) =>
    <div className={talonStyle.part} key={index}>
      { part.map((card, index) => <CardImage card={card} key={index} />) }
    </div>
  )

  return (
    <div className={talonStyle.wrapper}>
      { Cards }
    </div>
  )
}

export default Talon