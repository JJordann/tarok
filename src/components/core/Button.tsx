import React from 'react'

import ContentBox from './ContentBox'

import buttonStyles from './Button.module.scss'

const Button = ({...props}) => {

  return (
    <div className={buttonStyles.button}>
      <ContentBox {...props}>
        {props.children}
      </ContentBox>
    </div>
  )
}

export default Button