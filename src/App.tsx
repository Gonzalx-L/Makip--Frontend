import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginAdm from "./pages/LoginAdm"
import InicioAdm from './pages/InicioAdm';

function App() {
 
  return (
    <BrowserRouter> 
    <Routes>
      <Route path="/" element={<LoginAdm/>} />
      <Route path="/inicio" element ={<InicioAdm/>} />
  
    </Routes>
    </BrowserRouter>
 
  )
}

export default App
