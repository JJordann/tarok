import React, { CSSProperties } from 'react'

import { COLORS } from '../../services/colors'

import boxStyles from './Box.module.scss'

export interface VariableCSSProperties extends CSSProperties {
  '--primary-color': string
  '--secondary-color': string
}

const Box = ({color = COLORS.blue, secondaryColor = '', left = false, ...props}) => {

  if(color && secondaryColor === '') {
    secondaryColor = color
  }

  return (
    <div className={boxStyles.box} {...props}>
      <div className={(left) ? boxStyles.show : boxStyles.hide} style={
        {
          '--primary-color': color,
          '--secondary-color': secondaryColor
        } as VariableCSSProperties
      }></div>

      <div className={boxStyles.children}>
        {props.children}
      </div>

      <div className={(left) ? boxStyles.hide : boxStyles.show} style={
        {
          '--primary-color': color,
          '--secondary-color': secondaryColor
        } as VariableCSSProperties
      }></div>
    </div>
  )
}

export default Box