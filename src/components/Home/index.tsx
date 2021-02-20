import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import { LOBBY_ROUTE } from '../../routes'

import homeStyle from './style.module.scss'

const Home = () => {

  return (
    <div className={homeStyle.container}>
      <header>
        <div>
          <h1>Berač.si</h1>
          <p><span>Brez omejitev.</span>Enostavno Tarok.</p>
        </div>
      </header>
      <main>
        <Link to={"/rooms"}>
          <div className={homeStyle.startButton}>
            <FontAwesomeIcon icon={faPlayCircle} />
            <span>Začni</span>
          </div>
        </Link>        
      </main>
    </div>
  )
}

export default Home