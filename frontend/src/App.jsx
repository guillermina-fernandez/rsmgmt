import { Routes, Route } from 'react-router-dom'
import './App.css'
import Parameter from './pages/Parameter'
import FormOwner from './components/ModalsParameters'
import { ObjProvider } from './context/ParametersContext'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/propietario" element={
          <ObjProvider obj="propietario"> {/* to pass context to it's children */}
            <Parameter />
          </ObjProvider>
        } />
      </Routes>
    </main>
  )
}

export default App
