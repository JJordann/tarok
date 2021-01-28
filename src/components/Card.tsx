import React, { useState } from 'react';

import cardStyles from "../style/card.module.scss"

const Card = (props: any) => {

  let imgsrc = `${process.env.PUBLIC_URL}/cards/fmf/${props.value}.png`

  return (
    <div className={cardStyles.cardWrapper}>
      <img src={imgsrc} className={cardStyles.card} alt={props.value} />
    </div>
  )
}


export default Card;