import React from 'react';
import { Link } from 'react-router-dom';

import landingPageStyles from '../style/landingpage.module.scss';

const LandingPage = () => {

  return (
    <div className={landingPageStyles.container}>
      <div className={landingPageStyles.header}>
        <nav className={landingPageStyles.navbarContainer}>
          <ul className={landingPageStyles.navbar}>
            <li><Link to="/game">Prijava</Link></li>
            <li><Link to="#">Pravila</Link></li>
            <li><a href="https://valat.si/tarok" target="blank">Valat.si</a></li>
          </ul>
        </nav>
        <h1>Berač.si</h1>
      </div>
    </div>
  )
}

export default LandingPage;