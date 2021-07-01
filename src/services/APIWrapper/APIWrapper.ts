import { socket } from '../Socket/socket'
import { ALL_READY, CREATE_LOBBY, GET_LOBBIES, GET_USERS, JOIN } from './actions'

export const createLobby = () => {
  socket.emit(CREATE_LOBBY)

  console.log('CREATE LOBBY')
}

export const join = (name, lobbyId) => {
  socket.emit(JOIN, name, lobbyId)

  console.log('Joining ', name, lobbyId)
}

export const getUsers = (id) => {
  socket.emit(GET_USERS, id)
}

export const getLobbies = () => {
  socket.emit(GET_LOBBIES)

  console.log('Getting lobbies')
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