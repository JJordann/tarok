import React from 'react'

import Header from '../Header/Header'
import ContentBox from '../core/ContentBox'

import Button from '../core/Button'

import { COLORS } from '../../services/colors'

import error404PageStyles from './Error404Page.module.scss'
import { HOME_ROUTE } from '../../routes'
import { Link } from 'react-router-dom'

const Error404Page = () => {

  return (
    <div className={error404PageStyles.wrapper}>
      <Header />

      <div className={error404PageStyles.container}>
        <ContentBox color={COLORS.red}>Iskana stran ni bila najdena</ContentBox>
        
        <Link to={HOME_ROUTE}>
          <Button id={error404PageStyles.homeButton}>Domov</Button>
        </Link>
      </div>
    </div>
  )
}

export default Error404Page