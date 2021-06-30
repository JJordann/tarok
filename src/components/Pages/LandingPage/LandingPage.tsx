import React from 'react'
import { Link } from 'react-router-dom'
import Hand from '../../Hand/Hand'

import Header from '../../Header/Header'

import landingPageStyles from './LandingPage.module.scss'

const LandingPage = () => {

  const valatCards = ['kara_kralj', 'kriz_kralj', 'pik_kralj', 'srce_kralj',
    'tarok_1', 'tarok_16', 'tarok_17', 'tarok_18',
    'tarok_19', 'tarok_20', 'tarok_21', 'tarok_22']

  const beracCards = ['kara_4', 'kara_3', 'kara_2', 'kriz_7',
    'kriz_8', 'pik_7', 'pik_8', 'srce_4',
    'srce_3', 'srce_2', 'tarok_2', 'tarok_3']
  
  return (
    <div className={landingPageStyles.wrapper}>
      <Header />
      <div className={landingPageStyles.content}>
        <div className={landingPageStyles.valatContainer}>
          <Hand cards={valatCards} />
        </div>

        <div className={landingPageStyles.textBox}>
          <h2>Valati so stvar preteklosti</h2>
          <h2>To je <Link to={'/'}>Berač.si</Link></h2>
        </div>

        <div className={landingPageStyles.beracContainer}>
          <Hand cards={beracCards} />
        </div>
      </div>
    </div>
  )
}

export default LandingPage