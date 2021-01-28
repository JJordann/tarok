import React from 'react';
import Hand from './Hand';

import { Link } from "react-router-dom"

const Game = () => {
  const values = ['srce_kraljica', 'srce_kralj', 'pik_8', 'pik_9', 'pik_10', 
                  'pik_poba', 'pik_kralj', 'kriz_kaval', '1', '4', '12', '21'];

  return (
    <div>
      <Hand size={values.length} values={values} />
      <br />
      <Link to="/test">TEST --&gt;</Link>
    </div>
  )
}

export default Game;