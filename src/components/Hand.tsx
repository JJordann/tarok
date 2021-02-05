import React from 'react';
import Card from './Card';
import getSocket from './global'
import handStyles from "../style/hand.module.scss"


const Hand = ({ cards, playable, stage }) => {

  const socket = getSocket()

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
    return playable.indexOf(card) + 1; // starting index is 0, not found is -1
  })


  var handleCardClick = card => {
    socket.emit("playCard", card)
  }

  if(stage === "talonSwap") {
    handleCardClick = card => {
      socket.emit("talonSwap", card)
    }
  }


  // Translate is used to "bend" the middle of the hand upwards
  //  Uses a parabola, translated according to cards.length
  //    (* 24 / cards.length) in order to "flatten" a bit, depending on cards.length
  //    24 is foreseen as the max number cards in hand (2 players)
  let Cards = sortedCards.map((card, index) => 
    <Card
      playable={isCardPlayable(card)}
      value={card} 
      rotation={ -15 + (30 / cards.length) * index }
      translate={ Math.pow((index - cards.length / 2), 2) * 24 / cards.length }
      id={index} 
      key={index}
      onClick={() => handleCardClick(card)}
    />)

  return (
    <div className={handStyles.hand}>
      <div className={handStyles.wrapper}>
        {Cards}
      </div>
    </div>
  )
}

export default Hand;