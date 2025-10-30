import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/layout/Layout';
import HomePage from './pages/public/HomePage';
import LoginAdm from "./pages/LoginAdm"
import InicioAdm from './pages/InicioAdm';

function App() {
 
  return (
    <BrowserRouter> 
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginAdm/>} />
          <Route path="/admin" element ={<InicioAdm/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
 
  )
}

export default App
