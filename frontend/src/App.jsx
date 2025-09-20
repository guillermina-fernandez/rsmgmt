import { Routes, Route } from 'react-router-dom'
import './App.css'
import Crud from './pages/Crud'
import { ObjProvider } from './context/CrudContext'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/propietario" element={
          <ObjProvider obj="propietario">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/inquilino" element={
          <ObjProvider obj="inquilino">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/tipo_de_propiedad" element={
          <ObjProvider obj="tipo_de_propiedad">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/propiedad" element={
          <ObjProvider obj="propiedad">
            <Crud />
          </ObjProvider>
        } />
      </Routes>
    </main>
  )
}

export default App
