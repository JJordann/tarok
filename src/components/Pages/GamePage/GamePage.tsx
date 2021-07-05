import React, { useEffect, useState } from 'react'

import Header from '../../Header/Header'
import Hand from '../../Hand/Hand'
import PlayerCard from '../../PlayerCard/PlayerCard'
import Chat from '../../Chat/Chat'
import GameActivity from '../../GameActivity/GameActivity'

import gameStyles from './GamePage.module.scss'
import { getState, onGetState, stopGameOver, stopGetState } from '../../../services/APIWrapper/GameWrapper'
import { getUser } from '../../../services/User/User'

const emptyGameState = {
  stage: 'gameType',
  gameType: [],
  myIndex: 0,
  table: [],
  players: [],
  hand: [],
  playable: [],
  cardsWon: [],
  turn: 0,
  playableGames: [],
  talon: [[]],
  talonIndex: -1,
  recentScores: [{}]
}

const GamePage = () => {

  const [gameState, setGameState] = useState(emptyGameState)

  useEffect(() => {
    getState()

    onGetState((state) => {
      console.log(state)

      setGameState(state)
    })

    return () => {
      stopGetState()
      stopGameOver()
    }

  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(gameState.table.length >= gameState.players.length)
      setTimeout(clearTable, 750)
  }, [gameState.table.length, gameState.players.length])

  const clearTable = () => {
    setGameState(old => ({
      ...old,
      table: []
    }))
  }
  
  return (
    <div className={gameStyles.wrapper}>
      <Header routes={[{route: '', name: getUser()}]} />
      
      <div className={gameStyles.container}>
        <div className={gameStyles.gameContainer}>
          <div className={gameStyles.SidebarArea}>
            <Chat />
          </div>

          <div className={gameStyles.TopLeftPlayer}>
            <PlayerCard name='Top Left' active={false} />
          </div>
          <div className={gameStyles.TopPlayer}>
            <PlayerCard name='Top' active={false} />
          </div>
          <div className={gameStyles.TopRightPlayer}>
            <PlayerCard name='Top Right' active={false} />
          </div>
          <div className={gameStyles.LeftPlayer}>
            <PlayerCard name='Left' active={false} />
          </div>
          <div className={gameStyles.RightPlayer}>
            <PlayerCard name='Right' active={false} />
          </div>

          <div className={gameStyles.GameArea}>
            <GameActivity state={gameState} />
          </div>

          <div className={gameStyles.HandArea}>
            <Hand cards={gameState.hand} playable={gameState.playable}
              stage={gameState.stage} />
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default GamePage