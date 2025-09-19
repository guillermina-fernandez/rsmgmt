import { Routes, Route } from 'react-router-dom'
import './App.css'
import Parameters from './pages/Parameters'
import RealStates from './pages/RealStates'
import { ObjProvider } from './context/ParametersContext'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/propietario" element={
          <ObjProvider obj="propietario">
            <Parameters />
          </ObjProvider>
        } />
        <Route path="/inquilino" element={
          <ObjProvider obj="inquilino">
            <Parameters />
          </ObjProvider>
        } />
        <Route path="/tipo_de_propiedad" element={
          <ObjProvider obj="tipo_de_propiedad">
            <Parameters />
          </ObjProvider>
        } />
        <Route path="/propiedad" element={
          <ObjProvider obj="propiedad">
            <RealStates />
          </ObjProvider>
        } />
      </Routes>
    </main>
  )
}

export default App
