import React from 'react'
import { useParams } from 'react-router-dom'

import Header from '../../Header/Header'
import Hand from '../../Hand/Hand'

import gameStyles from './GamePage.module.scss'

const GamePage = () => {
  
  const { id } = useParams<{ id: string }>()

  const dummyCards = ['pik_kralj', 'srce_kraljica', 'tarok_1', 'tarok_5', 'tarok_21', 'tarok_22']
  
  return (
    <div className={gameStyles.wrapper}>
      <Header />
      
      <div className={gameStyles.container}>
        <div className={gameStyles.gameContainer}>
          Hello, World!
        </div>

        <div className={gameStyles.handContainer}>
          <Hand cards={dummyCards} />
        </div>
      </div>
    </div>
  )
}

export default GamePage