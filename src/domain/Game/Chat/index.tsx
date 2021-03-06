import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../../../services/Socket'
import chatStyle from './style.module.scss'


const Chat = () => {

  let [history, setHistory] = useState([])

  const historyRef = useRef(null)

  useEffect(
    () => {
      // register
      socket.on('chat', msg => {
        setHistory(old => old.concat(JSON.parse(msg)))
      })

      socket.on('INFO', info => {
        setHistory(old => old.concat({sender: 'INFO', message: info}))
      })

      socket.on('ERROR', e => {
        setHistory(old => old.concat({sender: 'ERROR', message: e}))
      })

      return () => {
        // cleanup
        socket.off('chat')
        socket.off('INFO')
        socket.off('ERROR')
      }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [history])
    
  const handleSend = (e) => {
    e.preventDefault()
    socket.emit('chat', mymessage)
    setMymessage('')
  }

  const handleChange = e => {
    console.log(mymessage)
    setMymessage(e.target.value)
  }

  const [mymessage, setMymessage] = useState('')

  let History = history.map(
    (m, index) => 
      <div key={`${m['sender']}${index}`}>
        <span>
          {m['sender']}
        </span>
        <p>
          {m['message']}
        </p>
      </div>
  )

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    }
    
    return (
      <div style={{ ...style, ...thumbStyle}} {...props} />
    )
  }
    
  //const CustomScrollbars = (props) => <Scrollbars renderThumbVertical={renderThumb} {...props} />

  return (
    <div className={chatStyle.wrapper}>
        <div ref={historyRef} className={chatStyle.history}>
          { History }
      </div>
            
      <form className={chatStyle.inputRow} onSubmit={handleSend}>
        <label>
          <input 
            type="text" 
            onChange={handleChange} 
            value={mymessage} 
            placeholder="Bodi glasen" 
          />
        </label>
      </form>
    </div>
  )
}

export default Chat