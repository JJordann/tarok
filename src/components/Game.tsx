import React from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"

const Game = () => {
  const values = ['srce_kraljica', 'srce_kralj', 'kara_kralj', 'pik_kralj',
                    'kriz_kralj', 'tarok_1', 'tarok_16', 'tarok_19', 'tarok_18',
                      'tarok_20', 'tarok_21', 'tarok_22'];

  return (
    <div>
      <Hand size={values.length} values={values} />
    </div>
  )
}

export default Game;