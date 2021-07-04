import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Header from '../../Header/Header'
import InputBox from '../../InputBox/InputBox'

import { getUser, setUser } from '../../../services/User/User'
import { LOBBY_LIST_ROUTE } from '../../../routes'

import loginPageStyles from './LoginPage.module.scss'

const LoginPage = () => {
  const history = useHistory()

  if(getUser()) {
    history.push(LOBBY_LIST_ROUTE)
  }

  const saveName = (name) => {
    setUser(name)

    history.push(LOBBY_LIST_ROUTE)
  }

  return (
    <div className={loginPageStyles.wrapper}>
      <Header />
      <div className={loginPageStyles.container}>
        <h1><span>Prijava</span></h1>

        <InputBox placeholder='Vnesi ime' onSubmit={saveName} minLength={3}
          submitText='Prijava' />
      </div>
    </div>
  )
}

export default LoginPage