import React from 'react';
import Card from './Card';

import handStyles from "../style/hand.module.scss"

const Hand = ({ cards }) => {
  //const cards: JSX.Element[] = [];
  const cardPack = 'fmf';

  let Cards = cards.map((card, index) => 
  <Card 
    value={card} 
    rotation={ -15 + (30 / cards.length) * index } 
    cardPack={cardPack} 
    id={index} 
    key={index}
  />)

  //for(let i = 0; i < props.values.length; i++) {
    //// Rotate cards from -15deg to +15deg
    //let rotation = -15 + (30 / props.size) * i;
    //cards.push(<Card value={props.values[i]} rotation={rotation}
                            //cardPack={cardPack} id={i} key={i} />);
  //}

  return (
    <div className={handStyles.hand}>
      <div className={handStyles.container}>
        {Cards}
      </div>
    </div>
  )
}

export default Hand;