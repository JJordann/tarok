import React from 'react'
import CardImage from '../CardImage'

import kingsStyle from './style.module.scss'

const Kings = () => {

  const kings = ['srce_kralj', 'pik_kralj', 'kara_kralj', 'kriz_kralj']

  const Kings = kings.map(king =>
    <CardImage card={king} />
  )

  return (
    <div className={kingsStyle.wrapper}>
      { Kings }
    </div>
  )
}

export default Kings