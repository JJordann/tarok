import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Header from '../../Header/Header'
import Hand from '../../Hand/Hand'
import PlayerCard from '../../PlayerCard/PlayerCard'
import Chat from '../../Chat/Chat'
import StateDebugger from '../../StateDebugger/StateDebugger'
import GameActivity from '../../GameActivity/GameActivity'

import gameStyles from './GamePage.module.scss'
import { getState, onGetState, stopGameOver, stopGetState } from '../../../services/APIWrapper/GameWrapper'
import { getUser } from '../../../services/User/User'

const GamePage = () => {

  const debug = true

  const [gameState, setGameState] = useState({
    stage: 'gameType',
    gameType: [],
    myIndex: 0,
    cards: [],
    players: [],
    hand: [],
    playable: [],
    cardsWon: [],
    turn: 0,
    playableGames: [],
    talon: [[]],
    talonIndex: -1,
    recentScores: [{}]
  })

  const dummyCards = ['pik_kralj', 'srce_kraljica', 'tarok_1', 'tarok_5',
    'tarok_12', 'tarok_14', 'tarok_15', 'tarok_16', 'tarok_18', 'tarok_20',
     'tarok_21', 'tarok_22']

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
  
  return (
    <div className={gameStyles.wrapper}>
      <Header routes={[{route: '', name: getUser()}]} />
      
      <div className={gameStyles.container}>
        <div className={gameStyles.gameContainer}>
          <div className={gameStyles.SidebarArea}>
            <Chat />
            {(debug && gameState !== undefined) ? <StateDebugger state={gameState} /> : <></>}
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