import React from 'react'
import { Link } from 'react-router-dom'
import Hand from '../Hand/Hand'

import Header from '../Header/Header'

import landingPageStyles from './LandingPage.module.scss'

import { LOBBY_LIST_ROUTE } from '../../routes'
import Base from './Base'

const LandingPage = () => {

  const valatCards = ['kara_kralj', 'kriz_kralj', 'pik_kralj', 'srce_kralj',
    'tarok_1', 'tarok_16', 'tarok_17', 'tarok_18',
    'tarok_19', 'tarok_20', 'tarok_21', 'tarok_22']

  const beracCards = ['kara_4', 'kara_3', 'kara_2', 'kriz_7',
    'kriz_8', 'pik_7', 'pik_8', 'srce_4',
    'srce_3', 'srce_2', 'tarok_2', 'tarok_3']
  
  return (
    <Base routes={[{route: LOBBY_LIST_ROUTE, name: 'Igraj'}]}>
      <div className={landingPageStyles.container}>
        <div className={landingPageStyles.valatContainer}>
          <Hand cards={valatCards} playable={valatCards} />
        </div>

        <div className={landingPageStyles.textBox}>
          <h2>Valati so stvar preteklosti</h2>
          <h1>To je <Link to={'/'}>Berač.si</Link></h1>
        </div>

        <div className={landingPageStyles.pushToBottom}></div>

        <div className={landingPageStyles.beracContainer}>
          <Hand cards={beracCards} playable={beracCards} />
        </div>
      </div>
    </Base>
  )
}

export default LandingPage