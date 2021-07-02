import React, { useState } from 'react'

import inputBoxStyles from './InputBox.module.scss'

const InputBox = ({initialValue = '', placeholder = '', onChange = undefined,
                    onSubmit = undefined, minLength = 1, submitText = 'OK'}) => {

  const [value, setValue] = useState(initialValue)

  const handleChange = (e) => {
    const input = e.target.value

    setValue(input)

    if(onChange !== undefined) {
      onChange(input)
    }
  }

  const handleSubmit = () => {
    if(onSubmit !== undefined) {
      onSubmit(value)
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={inputBoxStyles.container}>
      <input type='text' placeholder={placeholder} value={value}
          onChange={handleChange} onKeyDown={handleKeyDown} />

        <div onClick={handleSubmit} className={(value && value.length >= minLength) ?
            inputBoxStyles.active : inputBoxStyles.inactive}
            data-content={submitText}>
        </div>
    </div>
  )
}

export default InputBox