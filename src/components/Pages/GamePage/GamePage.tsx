import React from 'react'
import { useParams } from 'react-router-dom'

import Header from '../../Header/Header'
import Hand from '../../Hand/Hand'
import PlayerCard from '../../PlayerCard/PlayerCard'
import Chat from '../../Chat/Chat'

import gameStyles from './GamePage.module.scss'

const GamePage = () => {

  const dummyCards = ['pik_kralj', 'srce_kraljica', 'tarok_1', 'tarok_5',
    'tarok_12', 'tarok_14', 'tarok_15', 'tarok_16', 'tarok_18', 'tarok_20',
     'tarok_21', 'tarok_22']
  
  return (
    <div className={gameStyles.wrapper}>
      <Header />
      
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
            <div className={gameStyles.activity}>
              Hello
            </div>
          </div>
          <div className={gameStyles.HandArea}>
            <Hand cards={dummyCards} />
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default GamePage