import React from 'react'

import cardStyles from './Card.module.scss'

const Card = ({value}) => {

  const imageSource = `${process.env.PUBLIC_URL}/cards/fmf/${value}.png`

  return (
    <div className={cardStyles.cardWrapper}>
      <img src={imageSource} alt={value} />
    </div>
  )
}

export default Card