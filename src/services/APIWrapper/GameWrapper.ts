import { socket } from '../Socket/socket'
import { GAME_OVER, GAME_TYPE, GET_STATE } from './actions'

export const chooseContract = (contract) => {
  socket.emit(GAME_TYPE, contract)
}

export const getState = () => {
  socket.emit(GET_STATE)
}

export const onGetState = (callback) => {
  socket.on(GET_STATE, (state) => {
    callback(JSON.parse(state))
  })
}

export const onGameOver = (callback) => {
  socket.on(GAME_OVER, callback)
}

export const stopGetState = () => {
  socket.off(GET_STATE)
}

export const stopGameOver = () => {
  socket.off(GAME_OVER)
}