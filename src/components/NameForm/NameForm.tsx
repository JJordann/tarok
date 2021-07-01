import React, { useState } from 'react'

import { useCookies } from 'react-cookie'

import nameFormStyles from './NameForm.module.scss'

const NameForm = () => {
  const [cookies, setCookie] = useCookies(['user'])

  const [name, setName] = useState(cookies.name)
  const [submitted, setSubmitted] = useState(false)

  const saveName = (e) => {
    e.preventDefault()

    setCookie('name', name, { path: '/' })

    setSubmitted(true)
  }

  const onInputChange = (e) => {
    setName(e.target.value)
  }

  const Form = 
    <form className={nameFormStyles.form} onSubmit={saveName}>
      <input type='text' placeholder='Vnesi ime' value={name}
        onChange={onInputChange} />
      <button type='submit'>Vstopi</button>
    </form>

  const LoggedInAs = <p>Pozdravljen, {name}</p>

  return (
    <div className={nameFormStyles.wrapper}>
      {(cookies.name !== undefined || submitted) ? LoggedInAs : Form}
    </div>
  )
}

export default NameForm