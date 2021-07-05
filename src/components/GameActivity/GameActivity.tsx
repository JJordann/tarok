import React, { useState } from 'react'

import Contracts from '../GameStages/Contracts'
import Talon from '../GameStages/Talon'
import TalonSwap from '../GameStages/TalonSwap'
import Active from '../GameStages/Active'
import Kings from '../GameStages/Kings'
import RoundFinished from '../GameStages/RoundFinished'

import gameActivityStyles from './GameActivity.module.scss'

const GameActivity = ({state}) => {
  
  let CurrentActivity = <></>
  switch(state.stage) {
    case 'gameType': CurrentActivity =
        <Contracts playableContracts={state.playableGames}
          show={(state.turn === state.myIndex)} />
      break
    case 'chooseTalon': CurrentActivity =
      <Talon talon={state.talon} players={state.players}
        myIndex={state.myIndex} turn={state.turn} />
      break
    case 'talonSwap': CurrentActivity =
      <TalonSwap players={state.players} myIndex={state.myIndex}
        turn={state.turn} />
      break
    case 'chooseKing': CurrentActivity =
      <Kings players={state.players} myIndex={state.myIndex}
        turn={state.turn} />
      break
    case 'roundFinished': CurrentActivity =
      <RoundFinished recentScores={state.recentScores}
        myIndex={state.myIndex} players={state.players} />
      break

    default: CurrentActivity = 
      <Active players={state.players} table={state.table}
        myIndex={state.myIndex} stage={state.stage} />
  }

  return (
    <div className={gameActivityStyles.container}>
      {CurrentActivity}
    </div>
  )
}

export default GameActivity