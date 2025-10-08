import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import './styles/tv.css'

function TVApp() {
  return (
    <div className="tv-display tv-container tv-no-select flex items-center justify-center">
      <div className="text-center">
        <h1 className="tv-heading-primary text-tv-text-primary mb-6">TV Display</h1>
        <p className="tv-body-text text-tv-text-secondary">Welcome to the TV Display</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TVApp />
  </React.StrictMode>,
)
