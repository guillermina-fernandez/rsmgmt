import { Routes, Route } from 'react-router-dom'
import './App.css'
import Parameter from './pages/Parameter'
import { ObjProvider } from './context/ParametersContext'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/propietario" element={
          <ObjProvider obj="propietario">
            <Parameter />
          </ObjProvider>
        } />
        <Route path="/inquilino" element={
          <ObjProvider obj="inquilino">
            <Parameter />
          </ObjProvider>
        } />
        <Route path="/tipo_de_propiedad" element={
          <ObjProvider obj="tipo_de_propiedad">
            <Parameter />
          </ObjProvider>
        } />
      </Routes>
    </main>
  )
}

export default App
