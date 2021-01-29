import React from 'react';

import toggleStyles from '../../style/elements/toggle.module.scss';

const Toggle = (props: any) => {
  return (
    <div className={toggleStyles.toggle}>
      <input type="checkbox" name={props.name} id={props.name}
        className={toggleStyles.checkbox} />
      <label className={toggleStyles.label} htmlFor={props.name}>
        <span className={toggleStyles.inner} />
        <span className={toggleStyles.switch} />
      </label>
    </div>
  )
}

export default Toggle;