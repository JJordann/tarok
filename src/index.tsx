import React from 'react'
import ReactDOM from 'react-dom'

import { CookiesProvider } from 'react-cookie'

import App from './components/App/App'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)