import React from 'react';

import Toggle from '../../../components/Toggle'

import lobbyCardStyle from './style.module.scss';

const LobbyCard = ({name, ready}) => {
  return (
    <div className={lobbyCardStyle.wrapper}>
      <div className={lobbyCardStyle.content}>
        <div className={lobbyCardStyle.top}>
          <p>{name}</p>
        </div>

        <div className={lobbyCardStyle.bottom}>
          <Toggle name={`${name}-switch`} checked={ready} disabled={true} className={lobbyCardStyle.checkbox} />
        </div>
      </div>
    </div>
  )
}

export default LobbyCard;