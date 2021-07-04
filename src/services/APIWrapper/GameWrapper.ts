import { socket } from '../Socket/socket'
import { CHOOSE_TALON, GAME_OVER, GAME_TYPE, GET_STATE, PLAY_CARD, TALON_SWAP } from './actions'

export const playCard = (card) => {
  socket.emit(PLAY_CARD, card)
}

export const swapCard = (card) => {
  socket.emit(TALON_SWAP, card)
}

export const chooseContract = (contract) => {
  socket.emit(GAME_TYPE, contract)
}

export const chooseTalon = (id) => {
  socket.emit(CHOOSE_TALON, id)
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