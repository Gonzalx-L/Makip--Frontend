import React from 'react';
import { Link } from 'react-router-dom';
import producto1Image from '../../assets/09.png';
import producto2Image from '../../assets/08.png';
import producto3Image from '../../assets/07.png';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-100 text-white py-20 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Texto a la izquierda */}
            <div className="flex-1 text-left">
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="font-black">Bienvenido a Makip te crea!</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-purple-100 leading-relaxed max-w-2xl">
                Descubre los mejores productos con la mejor calidad y precios increíbles.
                Tu tienda online de confianza.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/productos" 
                  className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  Ver Productos
                </Link>
                <Link 
                  to="/nosotros" 
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-teal-700 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Conoce más
                </Link>
              </div>
            </div>
            
            {/* Espacio para imagen/banner a la derecha */}
            <div className="flex-1 max-w-lg">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="w-full h-80 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  <img 
                       src="/src/assets/home.jpg" 
                       alt="Banner Makip" 
                       className="w-full h-auto rounded-2xl shadow-2xl"
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Los productos más populares de nuestra tienda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Producto ejemplo 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={producto1Image} 
                  className="w-full h-48 object-fit group-hover:scale-105 transition-transform duration-300" 
                  alt="Producto 1" 
                />
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">CINTAS PERSONALIZADAS</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Cinta personalizada con el diseño que desees.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-500">S/15.00</span>
                  <button className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Ver más
                  </button>
                </div>
              </div>
            </div>

            {/* Producto ejemplo 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={producto2Image} 
                  className="w-full h-48 object-fit group-hover:scale-105 transition-transform duration-300" 
                  alt="Producto 2" 
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">APLIQUE PERSONALIZADA</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Aplique personalizada con el diseño que desees.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-500">S/15.00</span>
                  <button className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Ver más
                  </button>
                </div>
              </div>
            </div>

            {/* Producto ejemplo 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={producto3Image} 
                  className="w-full h-48 object-fit group-hover:scale-105 transition-transform duration-300" 
                  alt="Producto 3" 
                />
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">VINIL TEXTIL</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Vinil textil para personalizar tus prendas favoritas.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-500">S/10.00</span>
                  <button className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            <Link to="/productos" className="btn btn-primary btn-lg">
              Ver todos los productos
            </Link>
             </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/src/assets/nosostros1.jpg"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Elemento decorativo */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-100 rounded-full opacity-20 blur-xl"></div>
            </div>
            
            {/* Contenido */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  ¿Por qué elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Makip</span>?
                </h2>
              </div>
              
              {/* Grid de características */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Envío Rápido */}
                <div className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-cyan-100 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-shipping-fast text-white text-lg"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">Envío Rápido</h3>
                      <p className="text-gray-600 text-sm">Entrega en 24-48 horas</p>
                    </div>
                  </div>
                </div>

                {/* Compra Segura */}
                <div className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-cyan-100 hover:to-emerald-50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-shield-alt text-white text-lg"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">Compra Segura</h3>
                      <p className="text-gray-600 text-sm">Pago 100% protegido</p>
                    </div>
                  </div>
                </div>

                {/* Mejor Calidad */}
                <div className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-cyan-100 hover:to-teal-50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-medal text-white text-lg"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">Mejor Calidad</h3>
                      <p className="text-gray-600 text-sm">Productos garantizados</p>
                    </div>
                  </div>
                </div>

                {/* Soporte 24/7 */}
                <div className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-cyan-100 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-headset text-white text-lg"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">Soporte 24/7</h3>
                      <p className="text-gray-600 text-sm">Atención al cliente</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón CTA */}
              <div className="pt-4">
                <Link 
                  to="/nosotros" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Conoce más sobre nosotros
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-br from-teal-300 via-teal-600 to-teal-200 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Contenido principal */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Título principal */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                ¿Listo para 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-100 via-teal-400 to-cyan-400">
                  empezar?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Únete a miles de clientes satisfechos y descubre una nueva forma de comprar
              </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">1000+</div>
                <div className="text-purple-200">Clientes felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">24h</div>
                <div className="text-purple-200">Envío rápido</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">100%</div>
                <div className="text-purple-200">Garantizado</div>
              </div>
            </div>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/login" 
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-teal-900 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[200px]"
              >
                Iniciar sesión
                <i className="fas fa-sign-in-alt ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;