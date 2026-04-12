import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Login } from './screens/Login';
import { ConfigInicial } from './screens/ConfigInicial';
import { Dashboard } from './screens/Dashboard';
import { Registros } from './screens/Registros';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/config-inicial" element={<ConfigInicial />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registros" element={<Registros />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
