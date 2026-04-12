import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Login } from './screens/Login';
import { ConfigInicial } from './screens/ConfigInicial';
import { Dashboard } from './screens/Dashboard';
import { Registros } from './screens/Registros';
import { GastosProgramados } from './screens/GastosProgramados';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/config-inicial" element={<ConfigInicial />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registros" element={<Registros />} />
        <Route path="/gastos-programados" element={<GastosProgramados />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
