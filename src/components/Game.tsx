import React from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"

const Game = () => {
  const values = ['srce_kraljica', 'srce_kralj', 'kara_kralj', 'pik_kralj',
                    'kriz_kralj', '1', '16', '19','18', '20', '21', '22'];

  return (
    <div>
      <Hand size={values.length} values={values} />
    </div>
  )
}

export default Game;