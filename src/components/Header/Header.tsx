import React from 'react'

import { Link } from 'react-router-dom'

import headerStyles from './Header.module.scss'
import Navigation from './Navigation'

import { HOME_ROUTE } from '../../routes'

const Header = () => {

  return (
    <header className={headerStyles.wrapper}>
      <div className={headerStyles.container}>
        <Link to={HOME_ROUTE}><h1 className={headerStyles.logo}>Berač.si</h1></Link>

        <Navigation className={headerStyles.navigation} routes={[{route: '/', name: 'Domov'}]} />
      </div>
    </header>
  )
}

export default Header