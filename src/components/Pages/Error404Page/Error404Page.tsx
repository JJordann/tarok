import React from 'react'

import Header from '../../Header/Header'
import ContentBox from '../../core/ContentBox'

import Button from '../../core/Button'

import { COLORS } from '../../../services/colors'

import error404PageStyles from './Error404Page.module.scss'

const Error404Page = () => {

  return (
    <div className={error404PageStyles.wrapper}>
      <Header />

      <div className={error404PageStyles.container}>
        <ContentBox color={COLORS.red}>Iskana stran ni bila najdena</ContentBox>
      </div>
    </div>
  )
}

export default Error404Page