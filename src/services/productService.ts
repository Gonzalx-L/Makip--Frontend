import { apiClient } from './api';
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types';

export const productService = {
  // Obtener todos los productos (ruta pública)
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/public/products');
    return response.data;
  },

  // Obtener producto por ID (ruta pública)
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/public/products/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  create: async (productData: CreateProductDTO): Promise<Product> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // Actualizar producto
  update: async (id: number, productData: UpdateProductDTO): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar producto (soft delete)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Buscar productos
  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Obtener productos por categoría
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  }
};