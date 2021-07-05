import React, { useEffect, useState } from 'react'

import Header from '../../Header/Header'
import Hand from '../../Hand/Hand'
import ContentBox from '../../core/ContentBox/ContentBox'
import Chat from '../../Chat/Chat'
import GameActivity from '../../GameActivity/GameActivity'

import gamePageStyles from './GamePage.module.scss'
import { getState, onGetState, stopGameOver, stopGetState } from '../../../services/APIWrapper/GameWrapper'
import { getUser } from '../../../services/User/User'
import { GameTypes } from '../../GameStages/GameTypes'

const emptyGameState = {
  stage: 'gameType',
  gameType: null,
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

  const getPlayerActivity = (playerIndex) => {
    const kingSuits = {
      srce_kralj: '♥',
      kara_kralj: '♦',
      kriz_kralj: '♣',
      pik_kralj: '♠'
    }

    if(gameState.stage === 'gameType')
      return GameTypes[gameState.gameType
        .filter(obj => obj.player === playerIndex)[0].name]

    if(gameState.gameType.player === playerIndex 
        && gameState.gameType.king === undefined)
      return GameTypes[gameState.gameType.name]
      
    if(gameState.gameType.player === playerIndex)
      return GameTypes[gameState.gameType.name] + ' '
        + kingSuits[gameState.gameType.king]

    if(gameState.gameType.with !== undefined
        && gameState.gameType.with === playerIndex)
      return GameTypes[gameState.gameType.name]

    return ''
  }

  const getOtherPlayers = () => {
    const otherPlayers = []

    for(let i = 1; i < gameState.players.length; i++) {
      const playerIndex = (gameState.myIndex + i) % gameState.players.length

      const player = gameState.players[playerIndex]

      otherPlayers.push({
        name: player.name,
        activity: getPlayerActivity(playerIndex),
        hasTurn: (gameState.turn === playerIndex) ? true : false
      })
    }

    return otherPlayers
  }

  // Section used here so that :nth-of-type selector works correctly
  // <section> tag should not be used anywhere else on this page!
  // It's an easy fix to just set specific class names based on position but
  // this seems more elegant for now
  const PlayerBoxes =
    getOtherPlayers().map((player) =>
      <section className={(gameState.players.length === 4) ?
          gamePageStyles.player : gamePageStyles.playerOfThree}>
        <ContentBox name={player.name} active={player.hasTurn} />
      </section>
    )
  
  return (
    <div className={gamePageStyles.wrapper}>
      <Header routes={[{route: '', name: getUser()}]} />
      
      <div className={gamePageStyles.container}>
        <div className={gamePageStyles.gameContainer}>
          <div className={gamePageStyles.SidebarArea}>
            <Chat />
          </div>

          {PlayerBoxes}

          <div className={gamePageStyles.GameArea}>
            <GameActivity state={gameState} />
          </div>

          <div className={gamePageStyles.HandArea}>
            <Hand cards={gameState.hand} playable={gameState.playable}
              stage={gameState.stage} />
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default GamePage