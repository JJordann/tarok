import React from 'react'

import './Card.scss'

const Card = ({value, disabled = false, onClick = () => {}, ...props}) => {

  const imageSource = `${process.env.PUBLIC_URL}/cards/fmf/${value}.png`

  const altValue = value.split('_').join(' ')

  const wrapperClass = disabled ? 'card-wrapper disabled' : 'card-wrapper'

  const handle = () => console.log('HI')

  return (
    <div className={wrapperClass} onClick={onClick} {...props}>
      <div className='card-container'>
        <img src={imageSource} alt={altValue} />
      </div>
    </div>
  )
}

export { Card }
