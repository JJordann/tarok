import React, { useState } from 'react'

import { Redirect, useHistory } from 'react-router-dom'

import { LOBBY_LIST_ROUTE } from '../../routes'

import { getUser, setUser } from '../../services/User/User'

import nameFormStyles from './NameForm.module.scss'

const NameForm = () => {

  const [name, setName] = useState(getUser())

  const history = useHistory()

  const saveName = (e) => {
    e.preventDefault()

    setUser(name)

    history.push(LOBBY_LIST_ROUTE)
  }

  const onInputChange = (e) => {
    setName(e.target.value)
  }

  return (
    <div className={nameFormStyles.container}>
      {(getUser()) ? <Redirect to={LOBBY_LIST_ROUTE} /> : ''}

      <form className={nameFormStyles.form} onSubmit={saveName}>
        <input type='text' placeholder='Vnesi ime' value={name}
          onChange={onInputChange} />

        <div className={(name !== undefined && name.length > 2) ? nameFormStyles.active :
          nameFormStyles.inactive}
          onClick={saveName}></div>
      </form>
    </div>
  )
}

export default NameForm