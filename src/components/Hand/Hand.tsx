import React from 'react'
import { playCard, swapCard } from '../../services/APIWrapper/GameWrapper';

import Card from './Card'

import handStyles from './Hand.module.scss'

const cardsOrdered = [
  'kara_4', 'kara_3', 'kara_2', 'kara_1',
  'kara_poba', 'kara_konj', 'kara_kraljica', 'kara_kralj',
  'kriz_7', 'kriz_8', 'kriz_9', 'kriz_10',
  'kriz_poba', 'kriz_konj', 'kriz_kraljica', 'kriz_kralj',
  'pik_7', 'pik_8', 'pik_9', 'pik_10',
  'pik_poba', 'pik_konj', 'pik_kraljica', 'pik_kralj',
  'srce_4', 'srce_3', 'srce_2', 'srce_1',
  'srce_poba', 'srce_konj', 'srce_kraljica', 'srce_kralj',
  'tarok_1', 'tarok_2', 'tarok_3', 'tarok_4',
  'tarok_5', 'tarok_6', 'tarok_7', 'tarok_8',
  'tarok_9', 'tarok_10', 'tarok_11', 'tarok_12',
  'tarok_13', 'tarok_14', 'tarok_15', 'tarok_16',
  'tarok_17', 'tarok_18', 'tarok_19', 'tarok_20',
  'tarok_21', 'tarok_22'
];

const Hand = ({cards, playable = [], stage = ''}) => {

  // To "bend" the cards as one would in their physical hands
  const cardRotation = (index, length) => (-15 + (30 / length) * index)
  const cardTranslation = (index, length) =>
    -(Math.pow(((index - length) / 2), 2)) * 24 / length - 60;

  const sortedCards = () => {
    cards.sort(compareCardOrder)

    return cards
  }

  const compareCardOrder = (a, b) => {
    if(cardsOrdered.indexOf(a) < cardsOrdered.indexOf(b)) return -1

    return 1
  }

  const isCardPlayable = (card) => {
    return (playable.indexOf(card) !== -1)
  }

  const handleCardClick = (card) => {
    if(stage === 'talonSwap') {
      swapCard(card)
    }
    else if(isCardPlayable(card)) {
      playCard(card)
    }
  }

  const Hand = sortedCards().map((card, index) =>
  //
    <div className={handStyles.cardContainer} style={{
      transform: `rotate(${cardRotation(index, cards.length)}deg)`,
      marginBottom: `${cardTranslation(index, cards.length)}px`,
      filter: (isCardPlayable(card)) ? 'brightness(100%)' : 'brightness(80%)'
    }}>
      <Card value={card} key={index} onClick={() => handleCardClick(card)} />
    </div>
      
  )

  return (
    <div className={handStyles.wrapper}>
      <div className={handStyles.container}>
        {Hand}
      </div>
    </div>
  )
}

export default Hand