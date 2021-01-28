import React, { useState } from 'react';

const Card = (props: any) => {
  const [state, setState] = useState(props);

  const marginLeft = state.id * 100;

  return (
    <img src={process.env.PUBLIC_URL + '/cards/fmf/' + props.value + '.png'} style={{position: 'absolute', marginLeft: marginLeft}} alt={props.value} />
  )
}


export default Card;