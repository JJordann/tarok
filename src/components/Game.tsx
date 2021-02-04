import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hand from './Hand'
import Table from './Table'
import Chat from './Chat'
import getSocket from './global'
import Contracts from './Contracts'

import gameStyle from '../style/game.module.scss'
import Scoreboard from './Scoreboard'
import PlayerBox from './PlayerBox'

const Game = ({match}) => {
  const socket = getSocket()

  const [state, setState] = useState({
    stage: "contracts",
    myIndex: 0,   
    table: [],     // cards on table
    players: [],   // json: {name: string, contracts: string[]}
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false,    // is it my turn?
    playableTypes: [],
  })

  useEffect(() => {
    if(match.params.debug) {
      console.log('Running in debug mode');

      let testState = {
        stage: match.params.stage,
        myIndex: 0,
        table: [],
        players: [
          {name: 'Player 1', contracts: [], scores: [0, 0, 20, 25], radelci: 1},
          {name: 'Player 2', contracts: [], scores: [80, 0, 0, -20], radelci: 2},
          {name: 'Player 3', contracts: [], scores: [0, 0, -42, -20], radelci: 2},
          {name: 'Player 4', contracts: [], scores: [0, -70, 20, 0], radelci: 2}
        ],
        hand: [
          'kriz_9', 'tarok_7', 'tarok_18', 'pik_10', 'tarok_11', 'pik_9',
          'tarok_12', 'kriz_kraljica', 'kriz_poba', 'pik_konj', 'srce_2', 'kriz_10'
        ],
        playable: [],
        cardsWon: [],
        turn: true,
        playableTypes: ['Dve', 'Ena', 'Solo tri', 'Solo dve', 'Solo ena', 'Solo brez', 'Pikolo', 'Berač', 'Odprti berač', 'Naprej']
      }
  
      setState(testState);

      return () => {
      }
    } else {
      // fetch connected users immediately after first render
      socket.emit('getState')

      socket.on('getState', s => {
        let _s = JSON.parse(s)
        console.log(_s)
        setState(_s)
      })

      socket.on("gameOver", info => {
        console.log(info)
      })

      return () => {
        socket.off('getState')
        socket.off('gameOver')
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const myName = (state.players.length > 0) ? state.players[state.myIndex].name : '';

  const getScores = players => 
    players.map(p => ({
      name: p.name, 
      points: p.scores, 
      sum: p.scores.reduce((a, b) => a + b, 0),
      radelci: p.radelci
    }))

  const testScores = getScores(state.players)

  const otherPlayers = state.players.filter((player, index) => {
    if(state.myIndex !== index)
      return player
  })

  const playerBoxes = otherPlayers.map(player =>
    <div className={gameStyle.playerWrapper}>
      <PlayerBox name={player.name} activity={player.contracts[0]} />
    </div>
  )

  return (
    <div className={gameStyle.layout}>
      <header className={gameStyle.header}>
        <h1>Berač.si</h1>
        <p className="name">{myName}</p>
      </header>
      <div className={gameStyle.container}>
        <aside className={gameStyle.sidebar}>
          <div className={gameStyle.scoreboardWrapper}>
            <Scoreboard scores={testScores} />
          </div>
          <div className={gameStyle.chatWrapper}>
            <Chat />
          </div>
        </aside>

        <main className={gameStyle.game}>
          <div className={gameStyle.gameContainer}>
            <div className={gameStyle.playerWrappers}>
              {playerBoxes}
            </div>

            <div className={gameStyle.activityArea}>
              { state.stage === "contracts" ? <Contracts contracts={state.playableTypes} /> : <Table cards={state.table} /> }
            </div>
            
            <div className={gameStyle.handWrapper}>
              <Hand cards={state.hand} playable={state.playable || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Game