import React from 'react'
import { send } from '../../services/APIWrapper/ChatWrapper'

import Card from '../Hand/Card'
import ContentBox from '../core/ContentBox'
import Button from '../core/Button'

import roundFinishedStyles from './RoundFinished.module.scss'

const RoundFinished = ({recentScores, myIndex, players}) => {

  const handleClick = () => {
    send('!next')
  }

  const getRecentScore = () => {
    const Players = recentScores[0].players.map((playerIndex) =>
      <ContentBox>{players[playerIndex].name}</ContentBox>
    )

    const CardsWon = recentScores[0].cardsWon.map((card) =>
      <Card value={card} key={card} />
    )

    return (
      <div className={roundFinishedStyles.recentScore}>
        <div className={roundFinishedStyles.players}>
          {Players}
        </div>
        <div className={roundFinishedStyles.cardsWon}>
          {CardsWon}
        </div>
        <p>{recentScores[0].sum} Točk</p>
        <p>Final Score: {recentScores[0].finalScore}</p>
      </div>
    )
  }

  return (
    <div className={roundFinishedStyles.container}>
      {getRecentScore()}

      {(myIndex === 0) ?
        <Button onClick={handleClick}>Naslednja runda</Button> : ''
      }
    </div>
  )
}

export default RoundFinished