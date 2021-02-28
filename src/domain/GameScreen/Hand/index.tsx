import React from 'react'
import CardImage from '../CardImage'

import handStyle from './style.module.scss'

const Hand = ({cards}) => {

  const Cards = cards.map(card =>
    <CardImage card={card} />
  )

  return (
    <div className={handStyle.wrapper}>
      { Cards }
    </div>
  )
}

export default Hand