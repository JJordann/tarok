import React from 'react'

import Card from './Card'

import handStyles from './Hand.module.scss'

const Hand = ({cards}) => {

  // To "bend" the cards as one would in their physical hands
  const cardRotation = (index, length) => (-15 + (30 / length) * index)
  const cardTranslation = (index, length) =>
    -(Math.pow(((index - length) / 2), 2)) * 24 / length - 60;

  const Hand = cards.map((card, index) =>
  //
    <div className={handStyles.cardContainer}
      style={{transform: `rotate(${cardRotation(index, cards.length)}deg)`,
                marginBottom: `${cardTranslation(index, cards.length)}px`}}>
      <Card value={card} key={index} />
    </div>
      
  )

  return (
    <div className={handStyles.wrapper}>
      <div className={handStyles.container}>
        {Hand}
      </div>
    </div>
  )
}

export default Hand