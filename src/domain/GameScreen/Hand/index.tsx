import React from 'react'
import CardImage from '../CardImage'

import handStyle from './style.module.scss'

const Hand = ({cards}) => {

  const rotation = (cardIndex) => {
    return -15 + (30 / cards.length) * cardIndex
  }

  /* Translate is used to "bend" the middle of the hand upwards
      Uses a parabola, translated according to cards.length
        (* 24 / cards.length) in order to "flatten" a bit, depending on cards.length
          24 is foreseen as the max number cards in hand (2 players) */
  const translateBy = (cardIndex) => {
    return -Math.pow((cardIndex - cards.length / 2), 2) * 24 / cards.length
  }

  const Cards = cards.map((card, index) =>
    <div className={handStyle.cardWrapper}
      style={{transform: `rotate(${ rotation(index) }deg)`,
      marginBottom: `${ translateBy(index) }px`}}
      key={index}
    >
      <CardImage card={card} />
    </div>
  )

  return (
    <div className={handStyle.wrapper}>
      { Cards }
    </div>
  )
}

export default Hand