import React from 'react'
import CardImage from '../../CardImage'

import kingsStyle from './style.module.scss'

const Kings = () => {

  const kings = ['srce_kralj', 'pik_kralj', 'kara_kralj', 'kriz_kralj']

  const Kings = kings.map((king, index) =>
    <CardImage card={king} key={index} />
  )

  return (
    <div className={kingsStyle.wrapper}>
      { Kings }
    </div>
  )
}

export default Kings