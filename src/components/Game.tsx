import React, { useEffect, useState } from 'react'
import Hand from './Hand'
import Table from './Table'
import Chat from './Chat'
import getSocket from './global'
import Contracts from './Contracts'
import RoundEnd from './RoundEnd'

import gameStyle from '../style/game.module.scss'
import Scoreboard from './Scoreboard'
import PlayerBox from './PlayerBox'
import Talon from './Talon'

const Game = ({match}) => {
  const socket = getSocket()

  const [state, setState] = useState({
    stage: "gameType",
    myIndex: 0,   
    table: [],     // cards on table
    players: [],   // json: {name: string, contracts: string[]}
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false,    // is it my turn?
    playableGames: [],
    talon: [[]],
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
        playableGames: ['Dve', 'Ena', 'Solo tri', 'Solo dve', 'Solo ena', 'Solo brez', 'Pikolo', 'Berač', 'Odprti berač', 'Naprej']
      }
  
      //setState(testState);

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

  const getOtherPlayers = () => {
    const otherPlayers = [];
  
    for(let i = 1; i < state.players.length; i++) {
      let playerIndex = (state.myIndex + i) % state.players.length;
      
      otherPlayers.push(state.players[playerIndex]);
    }
  
    return otherPlayers;
  }

  const playerBoxes = getOtherPlayers().map(player =>
    <div className={gameStyle.playerWrapper}>
      <PlayerBox name={player.name} activity={player.contracts[0]} />
    </div>
  )


  let kings = ["srce_kralj", "kara_kralj", "pik_kralj", "kriz_kralj"]


  // DIY ROUTER
  var Activity = <></>
  switch(state.stage) {
    case "gameType":      Activity = <Contracts contracts={state.playableGames} />    ;break; 
    case "chooseKing":    Activity = <Table cards={kings} stage={state.stage}/>       ;break;
    case "chooseTalon":   Activity = <Talon cardGroups={state.talon} />               ;break;
    case "talonSwap":     Activity = <Talon cardGroups={state.talon} />               ;break;
    case "roundFinished": Activity = <RoundEnd players={state.players} />          ;break;
    default:              Activity = <Table cards={state.table} stage={state.stage}/>
  }

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
              { playerBoxes }
            </div>

            <div className={gameStyle.activityArea}>
              { Activity }
            </div>
            
            <div className={gameStyle.handWrapper}>
              <Hand cards={state.hand} playable={state.playable} stage={state.stage}/>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Game