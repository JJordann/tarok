import React from 'react'

import Header from '../../Header/Header'
import PlayerCard from '../../PlayerCard/PlayerCard'

import error404PageStyles from './Error404Page.module.scss'

const Error404Page = () => {

  return (
    <div className={error404PageStyles.wrapper}>
      <Header />

      <div className={error404PageStyles.container}>
        <PlayerCard name='Iskana stran ni bila najdena' active={false} />
      </div>
    </div>
  )
}

export default Error404Page