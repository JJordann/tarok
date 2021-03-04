import React from 'react';

import contractsStyle from './style.module.scss'

const Contracts = ({ contracts }) => {

  const Contracts = contracts.map((contract, index) =>
    <div className={contractsStyle.contract} key={index}>
      { contract }
    </div>
  )

  return (
    <div className={contractsStyle.wrapper}>
      <div className={contractsStyle.container}>
        { Contracts }
      </div>
    </div>
  )
}

export default Contracts