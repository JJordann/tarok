import React, { useEffect, useState } from 'react'

import { socket } from '../../../services/Socket'

import { GameTypes } from '../GameTypes'

import Hand from '../Hand'
import Table from '../Table'
import Chat from '../Chat'
import Contracts from '../Contracts'
import RoundEnd from '../RoundEnd'
import Scoreboard from '../Scoreboard'
import PlayerBox from '../PlayerBox'
import Talon from '../Talon'

import gameStyle from './style.module.scss'

const Game = ({match}) => {

  const [state, setState] = useState({
    stage: "gameType",
    gameType: null,
    myIndex: 0,   
    table: [],     // cards on table
    players: [],   // json: {name: string, contracts: string[]}
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: 0,    // index of player whose turn it is
    playableGames: [],
    talon: [[]],
  })

  useEffect(() => {
     // TODO: Premakni to ven iz useEffect !
    if(match.params.debug) {
      console.log('Running in debug mode');

      let testState = {
        stage: match.params.stage,
        gameType: [],
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



  useEffect(() => {
    let clearTable = () => {
      if(state.table.length === state.players.length)
        setState(oldState => ({
          ...oldState,
          table: []
        }))
    }

    if(state.table.length === state.players.length) {
      setTimeout(clearTable, 750)
    }

  }, [state.table.length, state.players.length])


  const myName = (state.players.length > 0) ? state.players[state.myIndex].name : '';

  const getScores = players => 
    players.map(p => ({
      name: p.name, 
      points: p.scores, 
      sum: p.scores.reduce((a, b) => a + b, 0),
      radelci: p.radelci
    }))

  const testScores = getScores(state.players)

  const getPlayerActivity = (playerIndex) => {
    let gameType = undefined;

    if(state.stage === 'gameType') {
      gameType = state.gameType.filter(obj => obj.player === playerIndex)[0]
    } else {
      // state.gameType has multiple personality disorder and is now an Object...
      if(state.gameType.player === playerIndex)
        gameType = state.gameType
    }
    

    if(gameType && gameType.name !== 'choosing')
      return GameTypes[gameType.name]
  }

  const getOtherPlayers = () => {
    const otherPlayers = [];
  
    for(let i = 1; i < state.players.length; i++) {
      const playerIndex = (state.myIndex + i) % state.players.length;
      
      const player = state.players[playerIndex];

      otherPlayers.push({
        name: player.name,
        activity: getPlayerActivity(playerIndex),
        hasTurn: (state.turn === playerIndex) ? true : false
      });
    }
  
    return otherPlayers;
  }

  const playerBoxes = getOtherPlayers().map(player =>
    <div className={gameStyle.playerWrapper}>
      <PlayerBox name={player.name} activity={player.activity} hasTurn={player.hasTurn} />
    </div>
  )


  let kings = ["srce_kralj", "kara_kralj", "pik_kralj", "kriz_kralj"]


  // DIY ROUTER
  var Activity = <></>
  switch(state.stage) {
    case "gameType":      Activity = <Contracts contracts={state.playableGames}
                            show={(state.turn === state.myIndex) ? true : false} />   ;break; 
    case "chooseKing":    Activity = <Table state={state}/>       ;break;
    case "chooseTalon":   Activity = <Talon cardGroups={state.talon} />               ;break;
    case "talonSwap":     Activity = <Talon cardGroups={state.talon} />               ;break;
    case "roundFinished": Activity = <RoundEnd players={state.players} />             ;break;
    default:              Activity = <Table state={state} />
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