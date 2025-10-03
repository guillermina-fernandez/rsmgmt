import { Routes, Route } from 'react-router-dom'
import './App.css'
import Crud from './pages/Crud'
import { DataProvider } from './context/DataContext'
import { RsProvider } from './context/RsContext'
import RealState from './pages/RealState'
import NavBar from './components/NavBar'


function App() {
  
  const crudRoutes = [
    { path: '/propietario', modelName: 'propietario', modelDepth: 0, modelId: null, relatedModel: null, relatedModelDepth: null, relatedFieldName: null },
    { path: '/inquilino', modelName: 'inquilino', modelDepth: 0, modelId: null, relatedModel: null, relatedModelDepth: null, relatedFieldName: null },
    { path: '/tipo_de_propiedad', modelName: 'tipo_de_propiedad', modelDepth: 0, modelId: null, relatedModel: null, relatedModelDepth: null, relatedFieldName: null },
    { path: '/propiedad', modelName: 'propiedad', modelDepth: 0, modelId: null, relatedModel: null, relatedModelDepth: null, relatedFieldName: null },
    { path: '/tipo_de_impuesto', modelName: 'tipo_de_impuesto', modelDepth: 0, modelId: null, relatedModel: null, relatedModelDepth: null, relatedFieldName: null },
  ]

  return (
    <main>
      <NavBar />
      <Routes>
        {crudRoutes.map(({ path, modelName, modelDepth, modelId, relatedModel, relatedModelDepth, relatedFieldName }) => (
          <Route key={modelName} path={path} element={
              <DataProvider modelName={modelName} modelDepth={modelDepth} modelId={modelId} relatedModel={relatedModel} relatedModelDepth={relatedModelDepth} relatedFieldName={relatedFieldName}>
                <Crud/>
              </DataProvider>
            }
          />
        ))}
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
