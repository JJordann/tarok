import React from 'react'

import Header from '../Header/Header'

import landingPageStyles from './LandingPage.module.scss'

const LandingPage = () => {

  return (
    <div className={landingPageStyles.wrapper}>
      <Header />
    </div>
  )
}

export default LandingPage