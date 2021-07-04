import React from 'react'

import Card from '../Hand/Card'

import stateDebuggerStyles from './StateDebugger.module.scss'

const StateDebugger = ({state}) => {

  const cardArrayOuput = (array) =>
    <div className={stateDebuggerStyles.hand}>
      {array.map((card, index) => <Card value={card} />)}
    </div>

  const Value = (key, value) => {
    let output = <></>

    switch(key) {
      case 'players': output =
        <div className={stateDebuggerStyles.table}>
          {value.map((player, index) => <div>
            {Object.entries(player).map(([playerKey, playerValue]) =>
              <div>
                <div>{playerKey}</div>
                <div>{playerValue}</div>
              </div>
          )}
        </div>)}
        </div>
        break

      case 'gameType':
        if(value.length !== undefined) {
          output = 
          <div className={stateDebuggerStyles.table}>
            {value.map((gameType, index) => <div>
              {Object.entries(gameType).map(([gameTypeKey, gameTypeValue]) =>
                <div>
                  <div>{gameTypeKey}</div>
                  <div>{gameTypeValue}</div>
                </div>
              )}
            </div>)}
          </div>
        } else {
          output = 
          <div className={stateDebuggerStyles.table}>
            {Object.entries(value).map(([gameTypeKey, gameTypeValue], index) => <div>
              <div>
                <div>{gameTypeKey}</div>
                <div>{gameTypeValue}</div>
              </div>
            </div>)}
          </div>
        }
        
        break

      case 'table': output = cardArrayOuput(value); break;

      case 'hand': output = cardArrayOuput(value); break;

      case 'playable': output = cardArrayOuput(value); break;

      case 'cardsWon': output = cardArrayOuput(value); break;

      case 'playableGames': output =
        <div className={stateDebuggerStyles.games}>
          {value.map((game, index) => <div>{game}</div>)}
        </div>
        break

      default: output =
        <div>
          {JSON.stringify(value)}
        </div>
        break
    }

    return output
  }

  const State = Object.entries(state).map(([key, value], index) => 
    <div>
      <div>{key}</div>
      {Value(key, value)}
    </div>
  )

  return (
    <div className={stateDebuggerStyles.container}>
      <h1>State Debugger</h1>

      {State}
    </div>
  )
}

export default StateDebugger