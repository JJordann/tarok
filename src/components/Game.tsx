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

const Game = () => {
  const socket = getSocket()

  const [gameSummary, setGameSummary] = useState(null)

  const [myName, setMyName] = useState('');

  const [state, setState] = useState({
    stage: "contracts",
    myIndex: 0,
    myName: "",    
    table: [],     // cards on table
    players: [],   // json: {name: string, contracts: string[]}
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false,    // is it my turn?
    playableContracts: [],
  })

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getState')

    socket.on('getState', s => {
      let _s = JSON.parse(s)
      console.log(_s)
      setState(_s)
      setMyName(_s.players[_s.myIndex].name)
    })

    socket.on("gameOver", info => {
      console.log(info)
      setGameSummary(info)
    })

    return () => {
      socket.off('getState')
      socket.off("gameOver")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  const getScores = players => 
    players.map(p => ({
      name: p.name, 
      points: p.scores, 
      sum: p.scores.reduce((a, b) => a + b, 0)
    }))

  const testScores = getScores(state.players)

  const _testScores = [
    {name: 'Lars', sum: 680, points: [500, 250, 140, 70, 10, 30, -70, -250]},
    {name: 'Dubioza', sum: 380, points: [0, 0, 30, 50, 70, 40, 50, 140]},
    {name: 'Valat.si', sum: 0, points: [0, 0, 0, 0, 0, 0, 0, 0]},
    {name: 'Berač.si', sum: 1337, points: [125, 125, 250, 250, 250, 87, 125, 125]}
  ]

  const otherPlayers = state.players.filter((player, index) => {
    if(state.myIndex !== index)
      return player
  })

  console.log(otherPlayers);

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
            <Chat myName={myName} />
          </div>
        </aside>

        <main className={gameStyle.game}>
          <div className={gameStyle.gameContainer}>
            <div className={gameStyle.playerWrappers}>
              {playerBoxes}
            </div>

            <div className={gameStyle.activityArea}>
              { state.stage === "contracts" ? <Contracts playable={state.playableContracts} /> : <Table cards={state.table} /> }
            </div>
            
            <div className={gameStyle.handWrapper}>
              <Hand cards={state.hand} playable={state.playable} />
            </div>
          </div>
        </main>
      </div>
    </div>
    /*
    <div className={gameStyle.game} >
      <Chat myName={myName} />
      { gameSummary == null ? Tableandhand : Summary }
    </div>*/
  )
}

export default Game