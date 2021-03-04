import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'

import { LOBBY_ROUTE } from '../../routes'

import homeStyle from './style.module.scss'
import Hand from '../../domain/GameScreen/Hand';
import Rooms from '../../domain/Lobby/Rooms'

const Home = () => {

  return (
    <div className={homeStyle.container}>
      <header>
        <div className={homeStyle.textContainer}>
          <div className={homeStyle.logo}>
            <h1>Berač.si</h1>
          </div>

          <ul className={homeStyle.navbar}>
            <li><Link to='/rooms'>Igraj</Link></li>
          </ul>
        </div>
      </header>

      <div className={homeStyle.handContainer}>
        <Hand cards={['srce_kralj', 'pik_kralj', 'kara_kralj', 'kriz_kralj', 'tarok_1', 'tarok_16', 'tarok_17', 'tarok_18', 'tarok_19', 'tarok_20', 'tarok_21', 'tarok_22']} />
      </div>

      <section className={homeStyle.section}>
        <div className={homeStyle.textContainer}>
          <h2 className={homeStyle.valati}>Valati so stvar preteklosti</h2>
          <div className={homeStyle.berac}>
            <h2>To je <Link to='/rooms'><span>Berač.si</span></Link></h2>
          </div>
        </div>
      </section>
      

      <div className={homeStyle.handContainer}>
        <Hand cards={['srce_4', 'srce_3', 'srce_2', 'pik_7', 'pik_8', 'pik_9', 'kara_4', 'kara_3', 'kara_2', 'kriz_7', 'kriz_8', 'tarok_2']} />
      </div>
    </div>
  )
}

export default Home