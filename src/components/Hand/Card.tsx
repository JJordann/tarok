import React from 'react'

import cardStyles from './Card.module.scss'

const Card = ({value, onClick = () => {}}) => {

  const imageSource = `${process.env.PUBLIC_URL}/cards/fmf/${value}.png`

  return (
    <div className={cardStyles.cardWrapper} onClick={onClick}>
      <img src={imageSource} alt={value} />
    </div>
  )
}

export { Card }
