import React from 'react';
import Card from './Card';

const Hand = (props: any) => {
  const cards: JSX.Element[] = [];
  for(let i = 0; i < props.size; i++) {
    cards.push(<Card value={props.values[i]} id={i} key={i} />);
  }

  return (
    <div>
      {cards}
    </div>
  )
}

export default Hand;