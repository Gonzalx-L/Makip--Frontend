import React from 'react';
import { Link } from 'react-router-dom';
import bannerNosotros from '../../assets/Banner-Nosotros.jpg';
import historiaImage from '../../assets/Historia.webp';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section - Nosotros */}
      <section 
        className="relative text-white py-32 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url(${bannerNosotros})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay para mejor legibilidad del texto */}
        <div className="absolute inset-0  bg-opacity-40"></div>
        
        {/* Contenido */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
            Sobre Nosotros
          </h1>
          <p className="text-xl lg:text-3xl text-gray-100 max-w-4xl mx-auto leading-relaxed font-light">
            Conoce la historia, misión y valores que nos impulsan a ser tu mejor opción
          </p>
                   
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Makip nació con la visión de revolucionar la experiencia de compra online, 
                ofreciendo productos de calidad excepcional a precios justos y accesibles 
                para todos nuestros clientes.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Desde nuestros inicios, nos hemos comprometido a brindar un servicio 
                personalizado, rápido y confiable, construyendo relaciones duraderas 
                con cada persona que confía en nosotros.
              </p>
            </div>
            <div className="relative">
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                <img 
                  src={historiaImage} 
                  alt="Historia de Makip - Nuestra evolución y crecimiento" 
                  className="w-full h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Elemento decorativo en esquina */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que nos define</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestros principios y objetivos que guían cada decisión y acción
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-bullseye text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Misión</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Proporcionar productos de alta calidad y un servicio excepcional, 
                superando las expectativas de nuestros clientes en cada interacción.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-eye text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Visión</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Ser la plataforma de e-commerce líder y con objetivo de la globalización, reconocida por nuestra 
                innovación, confiabilidad y compromiso.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-heart text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Valores</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Integridad, transparencia, calidad, innovación y compromiso 
                son los pilares que sustentan todas nuestras decisiones.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para formar parte de nuestra historia?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos y descubre por qué somos diferentes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/productos" 
              className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors duration-300 transform hover:scale-105"
            >
              Ver Productos
            </Link>
            <Link 
              to="/contacto" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;