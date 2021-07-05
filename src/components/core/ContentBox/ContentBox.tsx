import React from 'react'

import contentBoxStyles from './ContentBox.module.scss'

const ContentBox = ({name, active, ...props}) => {

  return (
    <div className={`${contentBoxStyles.contentBox} ${props.className}`}
      onClick={props.onClick}>
      <p>{name}</p>
      <div className={(active ?
          contentBoxStyles.active : contentBoxStyles.inactive)}>
      </div>
    </div>
  )
}

export default ContentBox