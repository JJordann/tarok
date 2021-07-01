import React from 'react'

import chatStyles from './Chat.module.scss'

const Chat = () => {
  return (
    <ul className={chatStyles.chat}>
      <li>
        <div className={chatStyles.sender}>
          Tilen
        </div>
        <ul className={chatStyles.messages}>
          <li><p>Prav prijeten pozdrav vsem</p></li>
          <li><p>Tole je Berač.si</p></li>
        </ul>
      </li>

      <li>
        <div className={chatStyles.sender}>
          Gost
        </div>
        <ul className={chatStyles.messages}>
          <li><p>Tole smrdi</p></li>
        </ul>
      </li>
    </ul>
  )
}

export default Chat