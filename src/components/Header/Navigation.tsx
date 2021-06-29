import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({ routes, ...props }) => {

  let Links = routes.map((route, index) =>
    <li>
      <Link to={route.route} key={index}>{route.name}</Link>
    </li>
  )

  return (
    <ul className={props.className}>
      {Links}
    </ul>
  )
}

export default Navigation