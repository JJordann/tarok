import React from 'react'
import Talon from '../Talon'
import Hand from '../Hand'

import layoutStyle from './style.module.scss'

const Layout = () => {

  return (
    <div className={layoutStyle.container}>

      <div className={layoutStyle.activityArea}>
        <Talon cards={[['tarok_16', 'tarok_17'], ['srce_poba', 'kriz_kraljica'], ['kriz_konj', 'kara_kraljica']]} />
      </div>

      <div className={layoutStyle.handContainer}>
        <Hand cards={['srce_kralj', 'pik_kralj', 'kara_kralj', 'kriz_kralj', 'tarok_1', 'tarok_2', 'tarok_3', 'tarok_18', 'tarok_19', 'tarok_20', 'tarok_21', 'tarok_22']} />
      </div>
    </div>
  )
}

export default Layout;