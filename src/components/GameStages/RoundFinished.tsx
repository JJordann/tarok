import React from 'react'
import { send } from '../../services/APIWrapper/ChatWrapper'

import Card from '../Hand/Card'
import PlayerCard from '../PlayerCard/PlayerCard'

import roundFinishedStyles from './RoundFinished.module.scss'

const RoundFinished = ({recentScores, myIndex, players}) => {

  const handleClick = () => {
    send('!next')
  }

  const getRecentScore = () => {
    const Players = recentScores[0].players.map((playerIndex) =>
      <PlayerCard name={players[playerIndex].name} active={true} />
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
        <PlayerCard name={'Naslednja runda'} active={true}
          onClick={handleClick} /> : ''
      }
    </div>
  )
}

export default RoundFinished