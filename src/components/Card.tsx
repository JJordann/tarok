import React from 'react';

import cardStyles from "../style/card.module.scss"

const Card = (props: any) => {
  let imgsrc = `${process.env.PUBLIC_URL}/cards/${props.cardPack}/${props.value}.png`

  return (
    <div className={cardStyles.cardWrapper}
      style={{transform: `rotate(${props.rotation}deg)`}}
        onClick={props.onClick}>
      <img src={imgsrc} className={cardStyles.card} alt={props.value} />
    </div>
  )
}


export default Card;