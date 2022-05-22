import React from 'react'
import { Hand } from '../../components/Hand'

import './Game.scss'

const testCards = ['tarok_1', 'tarok_2', 'tarok_3', 'tarok_4', 'tarok_5',
'tarok_6', 'tarok_7', 'tarok_8', 'tarok_9', 'tarok_10', 'tarok_11',
'tarok_12', 'tarok_13', 'tarok_14', 'tarok_15', 'tarok_16']

const Game = () => {

  return (
    <div className='game-wrapper'>
      <div className='game-container'>
        <main className='game-main'>
          
        </main>

        <section className='game-hand-container'>
          <Hand cards={testCards} />
        </section>
      </div>
    </div>
  )
}

export { Game }
