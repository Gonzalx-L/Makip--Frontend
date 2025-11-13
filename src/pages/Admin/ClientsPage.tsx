// src/pages/Admin/ClientsPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../services/admi/apiClient";
import { Loader2, AlertCircle, User, Search, CalendarDays } from "lucide-react";

// --- Interface para los datos del Cliente ---
interface Client {
  client_id: number;
  name: string;
  email: string;
  google_uid: string;
  created_at: string;
}

const ClientsPage: React.FC = () => {
  const [allClients, setAllClients] = useState<Client[]>([]); // Lista maestra
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inputs de filtro (lo que el usuario escribe/selecciona)
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filtros ACTIVOS (lo que realmente se aplica a la tabla)
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activeStartDate, setActiveStartDate] = useState("");
  const [activeEndDate, setActiveEndDate] = useState("");

  // --- Cargar Clientes ---
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Client[]>("/admin/clients");
        setAllClients(response.data);
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError("Error al cargar los clientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // --- Lógica de Filtrado (usa solo los filtros ACTIVOS) ---
  const filteredClients = useMemo(() => {
    return allClients.filter((client) => {
      const term = activeSearchTerm.toLowerCase().trim();
      const clientDate = new Date(client.created_at);

      // Filtro por nombre / email
      if (
        term &&
        !(
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term)
        )
      ) {
        return false;
      }

      // Filtro "Registrado Desde"
      if (activeStartDate) {
        const fromDate = new Date(activeStartDate);
        fromDate.setHours(0, 0, 0, 0);
        if (clientDate < fromDate) return false;
      }

      // Filtro "Registrado Hasta"
      if (activeEndDate) {
        const toDate = new Date(activeEndDate);
        toDate.setHours(23, 59, 59, 999);
        if (clientDate > toDate) return false;
      }

      return true;
    });
  }, [allClients, activeSearchTerm, activeStartDate, activeEndDate]);

  // --- Aplicar filtros al enviar el formulario ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchInput);
    setActiveStartDate(startDate);
    setActiveEndDate(endDate);
  };

  // --- Limpiar filtros e inputs ---
  const handleClearFilters = () => {
    setSearchInput("");
    setStartDate("");
    setEndDate("");
    setActiveSearchTerm("");
    setActiveStartDate("");
    setActiveEndDate("");
  };

  // --- Loading / Error ---
  if (isLoading) {
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-10 flex flex-col items-center'>
        <AlertCircle className='h-12 w-12 text-red-500' />
        <p className='mt-4 text-lg text-red-600'>{error}</p>
      </div>
    );
  }

  // --- UI principal ---
  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Header */}
      <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-2'>
          <User className='h-7 w-7 text-blue-600' />
          <h1 className='text-3xl font-bold text-gray-900'>
            Gestión de Clientes
          </h1>
        </div>
      </div>

      {/* Formulario de Filtros */}
      <form
        onSubmit={handleSearchSubmit}
        className='mb-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
        {/* Filtro por Nombre/Email */}
        <div className='md:col-span-2'>
          <label
            htmlFor='search-client'
            className='block text-sm font-medium text-gray-700'>
            Buscar por Nombre o Email
          </label>
          <div className='relative mt-1'>
            <input
              type='text'
              id='search-client'
              placeholder='Buscar...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* Filtro Desde */}
        <div>
          <label
            htmlFor='start-date'
            className='block text-sm font-medium text-gray-700'>
            Registrado Desde
          </label>
          <div className='relative mt-1'>
            <input
              type='date'
              id='start-date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* Filtro Hasta */}
        <div>
          <label
            htmlFor='end-date'
            className='block text-sm font-medium text-gray-700'>
            Registrado Hasta
          </label>
          <div className='relative mt-1'>
            <input
              type='date'
              id='end-date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* Botones */}
        <div className='flex items-end gap-2'>
          <button
            type='submit'
            className='flex w-full justify-center items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700'>
            <Search size={16} />
            <span>Buscar</span>
          </button>
          <button
            type='button'
            onClick={handleClearFilters}
            className='flex w-full justify-center items-center space-x-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-300'>
            <span>Limpiar</span>
          </button>
        </div>
      </form>

      {/* Tabla */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Nombre
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Google ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Fecha de Registro
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.client_id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {client.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {client.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {client.google_uid}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {new Date(client.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    No se encontraron clientes con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
