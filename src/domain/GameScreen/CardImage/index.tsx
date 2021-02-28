import React from 'react'

import cardImageStyle from './style.module.scss'

const CardImage = ({card}) => {

  const imgSrc = `${process.env.PUBLIC_URL}/cards/fmf/${card}.png`

  return (
    <img className={cardImageStyle.image} src={imgSrc} />
  )

}

export default CardImage