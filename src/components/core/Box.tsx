import React, { CSSProperties } from 'react'

import { COLORS } from '../../services/colors'

import boxStyles from './Box.module.scss'

export interface VariableCSSProperties extends CSSProperties {
  '--primary-color': string
  '--secondary-color': string
}

const Box = ({color = COLORS.blue, secondaryColor = '', ...props}) => {

  if(color && secondaryColor === '') {
    secondaryColor = color
  }

  return (
    <div className={boxStyles.box} {...props}>
      <div>
        {props.children}
      </div>
      <div style={
        {
          '--primary-color': color,
          '--secondary-color': secondaryColor
        } as VariableCSSProperties
      }></div>
    </div>
  )
}

export default Box