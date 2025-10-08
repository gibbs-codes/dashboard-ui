import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import './styles/projector.css'

function ProjectorApp() {
  return (
    <div className="projector-display projector-container projector-no-select flex items-center justify-center">
      <div className="text-center">
        <h1 className="projector-heading-primary projector-text-optimized text-projector-text-primary mb-8">Projector Display</h1>
        <p className="projector-body-text projector-text-optimized text-projector-text-secondary">Welcome to the Projector Display</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProjectorApp />
  </React.StrictMode>,
)
