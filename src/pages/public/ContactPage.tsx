import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const ContactPage: React.FC = () => {

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-100 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestros productos personalizados? 
            Contáctanos a través de WhatsApp o visítanos en nuestra ubicación.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contenido centrado en una sola columna */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Información de Contacto */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Información de Contacto</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">
                      Thomas Alva Edison 146<br />
                      San Martín de Porres 15103
                    </p>
                  </div>
                </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <FaPhone className="text-green-600" />
                </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+51 923 119 167</p>
                  </div>
                </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <FaEnvelope className="text-purple-600" />
                </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@makip.com</p>
                  </div>
                </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <FaClock className="text-orange-600" />
                </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Horarios de Atención</h3>
                    <div className="text-gray-600 text-sm">
                      <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                      <p>Sábado: 9:00 AM - 12:00 PM</p>
                      <p>Domingo: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Redes Sociales */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Síguenos en nuestras redes</h2>
            
            <div className="flex justify-center gap-6">
              <a 
                href="https://www.facebook.com/share/16NPBjRzD9/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors hover:scale-110 transform"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/makiptecrea?igsh=MTY2MnQ2Ymg0eXluaQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-pink-600 text-white p-4 rounded-full hover:bg-pink-700 transition-colors hover:scale-110 transform"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://www.tiktok.com/@makip.tecrea?_r=1&_t=ZS-91D5WnWsOCS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-colors hover:scale-110 transform"
              >
                <FaTiktok size={24} />
              </a>
              </div>
              
            </div>

          {/* Google Maps */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ubicación</h2>
              
              {/* Google Maps iframe */}
              <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.4697163157416!2d-77.06627932404545!3d-12.024360688127747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cedc1ea2dc2b%3A0x4e79066d9195b3eb!2sThomas%20Alva%20Edison%20146%2C%20San%20Mart%C3%ADn%20de%20Porres%2015103!5e0!3m2!1ses!2spe!4v1699360000000!5m2!1ses!2spe"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Makip - Thomas Alva Edison 146"
              ></iframe>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">📍 Nuestra Ubicación</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Thomas Alva Edison 146, San Martín de Porres 15103<br/>
                    Zona accesible con transporte público y estacionamiento disponible.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;