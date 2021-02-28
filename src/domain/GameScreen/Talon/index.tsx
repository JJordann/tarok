import React from 'react'

import CardImage from '../CardImage'

import talonStyle from './style.module.scss'

const Talon = ({cards}) => {
  
  const Cards = cards.map(part =>
    <div className={talonStyle.part}>
      { part.map(card => <CardImage card={card} />) }
    </div>
  )

  return (
    <div className={talonStyle.wrapper}>
      { Cards }
    </div>
  )
}

export default Talon