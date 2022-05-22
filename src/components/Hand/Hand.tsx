import React from 'react'

import { Card } from './Card'

import './Hand.scss'

const Hand = ({ cards, ...props }) => {



  const handleCardClick = (card) => {
    console.log(card)
  }

  
  const rotation = (cardIndex) => (-15 + (30 / cards.length) * cardIndex)
  const margin   = (cardIndex) => Math.pow(cardIndex - (cards.length / 2), 2)
  const rotationStyle = (cardIndex) => {
    return {
      transform: `rotate(${rotation(cardIndex)}deg`,
      marginBottom: `-${margin(cardIndex)}px`
    }
  }

  const Cards = cards.map((card, index) => {
    return (
      <div className='hand-card-container' style={rotationStyle(index)} tabIndex={1} key={index}
        onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}>
        <Card value={card} disabled={index < 5} onClick={() => handleCardClick(card)}  />
      </div>
    )
  })

  return (
    <div className='hand-wrapper' {...props}>
      <div className='hand-container'>
        {Cards}
      </div>
    </div>
  )
}

export { Hand }
