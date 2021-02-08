import React from 'react';

import toggleStyle from './style.module.scss';

const Toggle = ({name, disabled, checked, ...props}) => {
  return (
    <div className={toggleStyle.toggle}>
      <input type="checkbox" name={name} id={name}
        className={toggleStyle.checkbox} disabled={disabled} checked={checked} />

      <label className={toggleStyle.label} htmlFor={name}>
        <span className={toggleStyle.inner} />
        <span className={toggleStyle.switch} />
      </label>
    </div>
  )
}

export default Toggle;