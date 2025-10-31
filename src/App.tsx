import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/layout/Layout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import LoginAdm from "./pages/LoginAdm"
import InicioAdm from './pages/InicioAdm';
import TrackingPage from './pages/public/TrackingPage';

function App() {
 
  return (
    <BrowserRouter> 
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/nosotros" element={<AboutPage/>} />
          <Route path="/login" element={<LoginAdm/>} />
          <Route path="/admin" element ={<InicioAdm/>} />
          <Route path="/tracking/:orderId" element={<TrackingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
 
  )
}

export default App
