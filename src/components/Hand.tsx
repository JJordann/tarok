import React from 'react';
import Card from './Card';

import handStyles from "../style/hand.module.scss"

const Hand = (props: any) => {
  const cards: JSX.Element[] = [];
  const cardPack = 'fmf';

  for(let i = 0; i < props.size; i++) {
    // Rotate cards from -15deg to +15deg
    let rotation = -15 + (30 / props.size) * i;
    cards.push(<Card value={props.values[i]} rotation={rotation}
                            cardPack={cardPack} id={i} key={i} />);
  }

  return (
    <div className={handStyles.hand}>
      {cards}
    </div>
  )
}

export default Hand;