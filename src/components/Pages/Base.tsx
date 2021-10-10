import React from 'react'

import Header from '../Header/Header'

import baseStyles from './Base.module.scss'

const Base = ({ children, routes }) => {

  return (
    <div className={baseStyles.wrapper}>
      <Header routes={routes}></Header>
      <main className={baseStyles.main}>
        {children}
      </main>
    </div>
  )
}

export default Base