import React from 'react';

import scoreboardStyle from '../style/scoreboard.module.scss';

const Scoreboard = ({scores}) => {

  // TODO: Rewrite as table so tbody is scrollable, not each one seperately
  const Scores = scores.map(score => 
    <div>
      <h3>{score.name}</h3>
      <div>
        {score.points.map(point => 
          <span>{point}</span>
        )}
      </div>
      <h4>{score.sum}</h4>
    </div>
  )

  return (
    <div className={scoreboardStyle.scoreboard}>
      {Scores}
    </div>
  )
}

export default Scoreboard;