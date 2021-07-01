import { socket } from '../Socket/socket'
import { ALL_READY, CREATE_LOBBY, GET_LOBBIES, GET_USERS, JOIN, READY } from './actions'

export const createLobby = () => {
  socket.emit(CREATE_LOBBY)
}

export const join = (name, lobbyId) => {
  socket.emit(JOIN, name, lobbyId)
}

export const setReady = (flag) => {
  socket.emit(READY, String(flag))
}

export const getUsers = (id) => {
  socket.emit(GET_USERS, id)
}

export const getLobbies = () => {
  socket.emit(GET_LOBBIES)
}

export const onGetUsers = (callback) => {
  socket.on(GET_USERS, callback)
}

export const onAllReady = (callback) => {
  socket.on(ALL_READY, callback)
}

export const onGetLobbies = (callback) => {
  socket.on(GET_LOBBIES, callback)
}

export const onCreateLobby = (callback) => {
  socket.on(CREATE_LOBBY, callback)
}

export const stopGetUsers = () => {
  socket.off(GET_USERS)
}

export const stopAllReady = () => {
  socket.off(ALL_READY)
}

export const stopGetLobbies = () => {
  socket.off(GET_LOBBIES)
}

export const stopCreateLobby = () => {
  socket.off(CREATE_LOBBY)
}