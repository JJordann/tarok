import React from 'react';

import cardStyle from './style.module.scss'

const Card = (props: any) => {
  
  let imgsrc = `${process.env.PUBLIC_URL}/cards/fmf/${props.value}.png`

  let wrapperclass = props.playable ? cardStyle.cardWrapper : `${cardStyle.cardWrapper} ${cardStyle.disabled}`

  return (
    <div className={wrapperclass}
         style={{transform: `rotate(${props.rotation}deg)`, marginBottom: `-${props.translate}px`}}
         onClick={props.onClick}>
      <img 
        src={imgsrc} 
        className={cardStyle.card} 
        alt={props.value} 
      />
    </div>
  )
}


export default Card;