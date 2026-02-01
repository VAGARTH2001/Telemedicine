import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './Context/AuthContext'
import TelecontextProvider from './Context/Telecontext.jsx'
import App from './App.jsx'
import 'font-awesome/css/font-awesome.min.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TelecontextProvider>
        <App />
      </TelecontextProvider>
    </AuthProvider>
  </React.StrictMode>,
)
