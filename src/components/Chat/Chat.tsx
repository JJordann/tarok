import React, { useEffect, useState } from 'react'
import { onChat, onError, onInfo, send, stopChat, stopError, stopInfo } from '../../services/APIWrapper/ChatWrapper'
import { getUser } from '../../services/User/User'

import InputBox from '../InputBox/InputBox'

import chatStyles from './Chat.module.scss'

const Chat = () => {

  const dummyMessages = [
    {sender: 'Tilen', message: 'Prav prijeten pozdrav vsem'},
    {sender: 'Tilen', message: 'Tole je Berač.si'},
    {sender: 'Gost', message: 'Tole smrdi'},
    {sender: 'Tilen', message: ':('}
  ]

  const dummy = [
    {sender: 'Tilen', messages: ['Prav prijeten pozdrav vsem', 'Tole je Berač.si']},
    {sender: 'Gost', messages: ['Tole smrdi']},
    {sender: 'Tilen', messages: [':(']}
  ]

  const [messages, setMessages] = useState(dummy)

  // This is used to force update
  const [numberOfMessages, setNumberOfMessages] = useState(0)

  useEffect(() => {

    onChat((incoming) => {
      setMessages(old => mergeMessage(old, incoming.sender, incoming.message))
    })

    onInfo((message) => {
      setMessages(old => mergeMessage(old, 'INFO', message))
    })

    onError((message) => {
      setMessages(old => mergeMessage(old, 'ERROR', message))
    })

    return () => {
      stopChat()
      stopInfo()
      stopError()
    }

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const mergeMessage = (messages, sender, message) => {
    console.log('I HAVE BEEN CALLED')
    if(messages.length === 0) {
      return [{sender: sender, messages: [message]}]
    }

    if(messages[messages.length - 1].sender !== sender) {
      return messages.concat({sender: sender, messages: [message]})
    }

    messages[messages.length - 1].messages.push(message)

    return messages
  }

  const sendMessage = (message) => {
    // send(message)

    setMessages(old => mergeMessage(old, 'Vid', message))

    setNumberOfMessages(oldNumberOfMessages => oldNumberOfMessages + 1)
  }

  const Messages = messages.map((message, index) => 
    <li key={index}>
      <div className={chatStyles.sender}>
        {message.sender}
      </div>
      <ul className={chatStyles.messages}>
        {message.messages.map((message, index) => 
          <li key={index}><p>{message}</p></li>
        )}
      </ul>
    </li>
  )

  return (
    <ul className={chatStyles.chat}>
      {Messages}

      <li>
        <InputBox placeholder='Napiši sporočilo' onSubmit={sendMessage}
          submitText='Pošlji' minLength={1} />
      </li>
    </ul>
  )
}

export default Chat