import React from 'react';
import Card from './Card';

import handStyles from "../style/hand.module.scss"

const Hand = ({ cards, playable }) => {
  const cardsOrdered = [
    'srce_4', 'srce_3', 'srce_2', 'srce_1',
    'srce_poba', 'srce_konj', 'srce_kraljica', 'srce_kralj',
    'kara_4', 'kara_3', 'kara_2', 'kara_1',
    'kara_poba', 'kara_konj', 'kara_kraljica', 'kara_kralj',
    'pik_7', 'pik_8', 'pik_9', 'pik_10',
    'pik_poba', 'pik_konj', 'pik_kraljica', 'pik_kralj',
    'kriz_7', 'kriz_8', 'kriz_9', 'kriz_10',
    'kriz_poba', 'kriz_konj', 'kriz_kraljica', 'kriz_kralj',
    'tarok_1', 'tarok_2', 'tarok_3', 'tarok_4',
    'tarok_5', 'tarok_6', 'tarok_7', 'tarok_8',
    'tarok_9', 'tarok_10', 'tarok_11', 'tarok_12',
    'tarok_13', 'tarok_14', 'tarok_15', 'tarok_16',
    'tarok_17', 'tarok_18', 'tarok_19', 'tarok_20',
    'tarok_21', 'tarok_22'
  ];

  const compareCardOrder = (a: string, b: string) => {
    if(cardsOrdered.indexOf(a) < cardsOrdered.indexOf(b)) return -1;
    
    return 1;
  }

  const sortedCards = cards.sort(compareCardOrder);

  const isCardPlayable = (card => {
    console.log(cards.indexOf(card) + 1);
    return cards.indexOf(card) + 1; // starting index is 0, not found is -1
  })

  const cardPack = 'fmf';

  let Cards = sortedCards.map((card, index) => 
  <Card
    playable={isCardPlayable(card)}
    value={card} 
    rotation={ -15 + (30 / cards.length) * index } 
    cardPack={cardPack} 
    id={index} 
    key={index}
  />)

  return (
    <div className={handStyles.hand}>
      <div className={handStyles.container}>
        {Cards}
      </div>
    </div>
  )
}

export default Hand;