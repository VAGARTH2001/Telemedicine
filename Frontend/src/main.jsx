import React from 'react'
import ReactDOM from 'react-dom/client'
import TelecontextProvider from './Context/Telecontext.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelecontextProvider>

    <App />
    </TelecontextProvider>
    
  </React.StrictMode>,
)
