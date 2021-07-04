import React, { useEffect, useState } from 'react'
import { onChat, onError, onInfo, send, stopChat, stopError, stopInfo } from '../../services/APIWrapper/ChatWrapper'

import InputBox from '../InputBox/InputBox'

import chatStyles from './Chat.module.scss'

const Chat = () => {

  const [messages, setMessages] = useState([])

  // This is used to force update
  const [numberOfMessages, setNumberOfMessages] = useState(0)

  useEffect(() => {

    onChat((incoming) => {
      setMessages(old => mergeMessage(old, incoming.sender, incoming.message))

      setNumberOfMessages(oldNumberOfMessages => oldNumberOfMessages + 1)
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
    send(message)
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
    <div className={chatStyles.container}>
      <ul className={chatStyles.chat}>
        {Messages}
      </ul>
      <div className={chatStyles.inputContainer}>
        <InputBox placeholder='Napiši sporočilo' onSubmit={sendMessage}
          submitText='Pošlji' minLength={1} />
      </div>
    </div>
    
  )
}

export default Chat