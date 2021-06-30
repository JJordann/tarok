import React from 'react'

import { Link } from 'react-router-dom'

import headerStyles from './Header.module.scss'
import Navigation from './Navigation'

import { HOME_ROUTE } from '../../routes'

const Header = ({routes}) => {

  return (
    <header className={headerStyles.wrapper}>
      <div className={headerStyles.container}>
        <Link to={HOME_ROUTE}>
          <h2 className={headerStyles.logo}>
            Berač.si
            <div className={headerStyles.slogan}>
              <p>Brez Omejitev</p>
              <p>Enostavno Tarok</p>
            </div>
          </h2>
          </Link>

        <Navigation className={headerStyles.navigation} routes={routes} />
      </div>
    </header>
  )
}

export default Header