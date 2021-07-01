import React from 'react'

import NameForm from '../../NameForm/NameForm'
import Header from '../../Header/Header'

import loginPageStyles from './LoginPage.module.scss'

const LoginPage = () => {

  return (
    <div className={loginPageStyles.wrapper}>
      <Header />
      <div className={loginPageStyles.container}>
        <h1><span>Prijava</span></h1>

        <NameForm />
      </div>
    </div>
  )
}

export default LoginPage