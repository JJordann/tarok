import { socket } from '../Socket/socket'
import { CHAT, INFO, ERROR } from './actions'

export const send = (message) => {
  socket.emit(CHAT, message)
}

export const onChat = (callback) => {
  socket.on(CHAT, (incoming) => {
    callback(JSON.parse(incoming))
  })
}

export const onInfo = (callback) => {
  socket.on(INFO, callback)
}

export const onError = (callback) => {
  socket.on(ERROR, callback)
}

export const stopChat = () => {
  socket.off(CHAT)
}

export const stopInfo = () => {
  socket.off(INFO)
}

export const stopError = () => {
  socket.off(ERROR)
}