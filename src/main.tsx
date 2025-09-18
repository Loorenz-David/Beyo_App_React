
import{BrowserRouter as Router} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import {ServerMessageProvider} from './contexts/ServerMessageContext.tsx'
import './css/index.css'
import './css/grid_styles.css'
import './css/input-styles.css'
import './css/text-styles.css'
import './css/buttons-styles.css'
import './css/server-error.css'
import './css/svg-styles.css'
import './css/loaders.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>  
    <ServerMessageProvider>
      <App />
    </ServerMessageProvider>
  </Router>
)
