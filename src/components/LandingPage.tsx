import React from 'react';
import { Link } from 'react-router-dom';

import landingPageStyles from '../style/landingpage.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {

  return (
    <div className={landingPageStyles.container}>
      <div className={landingPageStyles.header}>
        <div>
          <h1>Berač.si</h1>
          <p><span>Brez omejitev.</span> Enostavno Tarok.</p>
        </div>
      </div>
      <div className={landingPageStyles.content}>
        <Link to="/game">
          <div className={landingPageStyles.startButton}>
            <FontAwesomeIcon icon={faPlayCircle} />
            <span>Začni</span>
          </div>
        </Link>        
      </div>
    </div>
  )
}

export default LandingPage;