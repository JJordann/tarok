import React from 'react'

import Box from './Box'

import contentBoxStyles from './ContentBox.module.scss'

const ContentBox = ({name = '', active = false, ...props}) => {

  return (
    <Box {...props}>
      <p className={contentBoxStyles.content}>{props.children}</p>
    </Box>
    
  )
}

export default ContentBox