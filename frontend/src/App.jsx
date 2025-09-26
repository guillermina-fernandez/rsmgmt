import { Routes, Route } from 'react-router-dom'
import './App.css'
import Crud from './pages/Crud'
import { ObjProvider } from './context/CrudContext'
import { RsProvider } from './context/RsContext'
import RealState from './pages/RealState'
import NavBar from './components/NavBar'


function App() {
  return (
    <main>
      <NavBar/>
      <Routes>
        <Route path="/propietario" element={
          <ObjProvider obj="propietario" depth="0">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/inquilino" element={
          <ObjProvider obj="inquilino" depth="0">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/tipo_de_propiedad" element={
          <ObjProvider obj="tipo_de_propiedad" depth="0">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/propiedad" element={
          <ObjProvider obj="propiedad" depth="0">
            <Crud />
          </ObjProvider>
        } />
        <Route path="/propiedad/:rs_id" element={
          <RsProvider >
              <RealState />
          </RsProvider>
        } />
      </Routes>
    </main>
  )
}

export default App
