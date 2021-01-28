import React from 'react';
import Card from './Card';

import handStyles from "../style/hand.module.scss"

const Hand = (props: any) => {
  const cards: JSX.Element[] = [];
  for(let i = 0; i < props.size; i++) {
    cards.push(<Card value={props.values[i]} id={i} key={i} />);
  }

  return (
    <div className={handStyles.hand}>
      {cards}
    </div>
  )
}

export default Hand;