import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MedicationProvider } from './context/MedicationContext'

import Home from './pages/users/Home'
import MedicationList from './pages/users/MedicationList';
import AddMedication from './pages/users/AddMedication'
import EditMedication from './pages/users/EditMedication'
import MedicationDetails from './pages/users/MedicationDetails'
import Compliance from './pages/users/Compliance'
import Alerts from './pages/users/Alerts'
import Settings from './pages/users/Settings'
import Navigation from './components/Navigation'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MedicationProvider>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Home /> }/>
          <Route path='/medications' element={ <MedicationList /> }/>
          <Route path="/medications/add" element={<AddMedication />} />
          <Route path="/medications/:id" element={<MedicationDetails />} />
          <Route path="/medications/:id/edit" element={<EditMedication />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Navigation />
    </MedicationProvider>
  </BrowserRouter>
)