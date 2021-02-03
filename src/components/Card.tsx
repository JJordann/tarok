import React from 'react';

import cardStyles from "../style/card.module.scss"

const Card = (props: any) => {
  
  let imgsrc = `${process.env.PUBLIC_URL}/cards/fmf/${props.value}.png`

  let wrapperclass = props.playable ? cardStyles.cardWrapper : `${cardStyles.cardWrapper} ${cardStyles.disabled}`

  return (
    <div className={wrapperclass}
         style={{transform: `rotate(${props.rotation}deg)`, marginBottom: `-${props.translate}px`}}
         onClick={props.onClick}>
      <img 
        src={imgsrc} 
        className={cardStyles.card} 
        alt={props.value} 
      />
    </div>
  )
}


export default Card;