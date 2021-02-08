import React from 'react';

import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Scrollbars } from 'react-custom-scrollbars';

import scoreboardStyle from './style.module.scss'

const Scoreboard = ({scores}) => {

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    }

    return (
      <div style={{ ...style, ...thumbStyle}} {...props} />
    )
  }

  const CustomScrollbars = (props) => <Scrollbars renderThumbVertical={renderThumb} {...props} />

  const getScores = (scores) => {
    const Radelci = scores.map(score => 
      <div className={scoreboardStyle.radelci}>
        {[...Array((score.radelci ? score.radelci : 0))].map((element, index) => 
          <FontAwesomeIcon icon={faStar} key={index} />
        )}
      </div>
    )

    const Names = scores.map(score => <div className={scoreboardStyle.name}>{score.name}</div>)

    const Points = scores.map(score =>
      <div className={scoreboardStyle.points}>
        {score.points.map(point => <div className={scoreboardStyle.point}>{point}</div>)}
      </div>
    )

    const Sums = scores.map(score => <div className={scoreboardStyle.sum}>{score.sum}</div>)

    return (
      <div className={scoreboardStyle.container}>
        <div className={scoreboardStyle.radelciWrapper}>
          {Radelci}
        </div>

        <div className={scoreboardStyle.namesWrapper}>
          {Names}
        </div>

        <CustomScrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
          <div className={scoreboardStyle.pointsWrapper}>
            {Points}
          </div>
        </CustomScrollbars>

        <div className={scoreboardStyle.sumsWrapper}>
          {Sums}
        </div>
      </div>
    )
  }

  return (
    <div className={scoreboardStyle.scoreboard}>
      {getScores(scores)}
    </div>
  )
}

export default Scoreboard;