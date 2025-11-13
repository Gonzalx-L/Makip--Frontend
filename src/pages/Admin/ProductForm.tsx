// src/pages/Admin/ProductForm.tsx

import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react"; // 👈 Import de tipo
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/admi/apiClient";
import { Loader2, AlertCircle, Save, UploadCloud, Plus } from "lucide-react";

// Interfaces
interface Category {
  category_id: number;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category_id: number | "";
  base_price: number | "";
  min_order_quantity: number | "";
  is_active: boolean;
  base_image_url: string | null;
}

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  //-------------------------------------------------------
  // ESTADOS
  //-------------------------------------------------------
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category_id: "",
    base_price: "",
    min_order_quantity: 1,
    is_active: true,
    base_image_url: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true); // carga inicial
  const [isSaving, setIsSaving] = useState(false); // guardando
  const [isUploading, setIsUploading] = useState(false); // subiendo imagen

  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Modal Categoría
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const isEditMode = Boolean(id);

  //-------------------------------------------------------
  // Cargar categorías
  //-------------------------------------------------------
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get<Category[]>("/categories");
      setCategories(response.data);
    } catch {
      setError("Error al cargar categorías.");
    }
  }, []);

  //-------------------------------------------------------
  // Cargar datos iniciales
  //-------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCategories();

      if (isEditMode) {
        if (location.state?.product) {
          const product = location.state.product;

          setFormData({
            name: product.name,
            description: product.description || "",
            category_id: product.category_id,
            base_price: Number(product.base_price),
            min_order_quantity: product.min_order_quantity,
            is_active: product.is_active,
            base_image_url: product.base_image_url || null,
          });
        } else {
          try {
            const response = await apiClient.get(`/products/${id}`);
            const product = response.data;

            setFormData({
              name: product.name,
              description: product.description || "",
              category_id: product.category_id,
              base_price: Number(product.base_price),
              min_order_quantity: product.min_order_quantity,
              is_active: product.is_active,
              base_image_url: product.base_image_url || null,
            });
          } catch {
            setError("Error al cargar el producto.");
          }
        }
      }

      setIsLoading(false);
    };

    load();
  }, [id, isEditMode, location.state, fetchCategories]);

  //-------------------------------------------------------
  // Manejadores
  //-------------------------------------------------------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value, type } = target;

    // Checkbox
    if (type === "checkbox") {
      const input = target as HTMLInputElement; // 👈 forzamos que es input
      setFormData((prev) => ({ ...prev, [name]: input.checked }));
      return;
    }

    // Números
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    // Texto / select
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //-------------------------------------------------------
  // Subida de imagen
  //-------------------------------------------------------
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const response = await apiClient.post<{ imageUrl: string }>(
        "/upload/product-image",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFormData((prev) => ({
        ...prev,
        base_image_url: response.data.imageUrl,
      }));
    } catch {
      setUploadError("Error al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  //-------------------------------------------------------
  // Guardar producto
  //-------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await apiClient.put(`/products/${id}`, formData);
      } else {
        await apiClient.post("/products", formData);
      }

      navigate("/admin/productos");
    } catch {
      setError("Error al guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  };

  //-------------------------------------------------------
  // Crear categoría
  //-------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      setCategoryError("El nombre no puede estar vacío.");
      return;
    }

    try {
      const response = await apiClient.post<Category>("/categories", {
        name: newCategoryName,
      });

      await fetchCategories();
      setIsCategoryModalOpen(false);
      setNewCategoryName("");

      setFormData((prev) => ({
        ...prev,
        category_id: response.data.category_id,
      }));
    } catch {
      setCategoryError("Error al crear la categoría.");
    }
  };

  //-------------------------------------------------------
  // Loading o Error
  //-------------------------------------------------------
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
        <p className='text-red-600 mt-2'>{error}</p>
      </div>
    );
  }

  //-------------------------------------------------------
  // FORMULARIO
  //-------------------------------------------------------
  return (
    <>
      <div className='p-6 md:p-8 lg:p-10'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>
          {isEditMode ? "Editar Producto" : "Crear Nuevo Producto"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className='rounded-lg border bg-white p-6 shadow-sm space-y-6'>
          {/* Nombre */}
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Nombre del Producto
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm'
            />
          </div>

          {/* Categoría */}
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Categoría
            </label>

            <div className='flex space-x-3'>
              <select
                name='category_id'
                value={formData.category_id}
                onChange={handleChange}
                required
                className='mt-1 w-full rounded-md border-gray-300 shadow-sm'>
                <option value=''>-- Selecciona una categoría --</option>

                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                type='button'
                onClick={() => setIsCategoryModalOpen(true)}
                className='mt-1 flex items-center rounded-md bg-gray-200 px-3 text-sm'>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Descripción
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm'
            />
          </div>

          {/* Imagen */}
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Imagen del Producto
            </label>

            <div className='mt-2 flex items-center space-x-4'>
              <div className='h-24 w-24 border flex items-center justify-center rounded-md bg-gray-50'>
                {formData.base_image_url ? (
                  <img
                    src={formData.base_image_url}
                    className='h-full w-full object-cover rounded-md'
                  />
                ) : (
                  <UploadCloud className='text-gray-400 h-8 w-8' />
                )}
              </div>

              <div>
                <input
                  type='file'
                  id='file-upload'
                  className='hidden'
                  accept='image/png, image/jpeg'
                  onChange={handleImageUpload}
                />

                <button
                  type='button'
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  disabled={isUploading}
                  className='border rounded-md px-3 py-2 text-sm bg-white shadow-sm disabled:opacity-50'>
                  {isUploading ? "Subiendo..." : "Cambiar Imagen"}
                </button>

                {uploadError && (
                  <p className='text-red-600 text-sm mt-1'>{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Precio y Cantidad */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Precio Base (S/)
              </label>
              <input
                type='number'
                name='base_price'
                min='0'
                step='0.01'
                value={formData.base_price}
                onChange={handleChange}
                required
                className='mt-1 w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>
                Cantidad Mínima
              </label>
              <input
                type='number'
                name='min_order_quantity'
                min='1'
                value={formData.min_order_quantity}
                onChange={handleChange}
                required
                className='mt-1 w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>
          </div>

          {/* Activo */}
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='is_active'
              checked={formData.is_active}
              onChange={handleChange}
              className='h-4 w-4'
            />
            <label className='text-sm text-gray-700'>Producto activo</label>
          </div>

          {/* Botones */}
          <div className='flex justify-end gap-4 border-t pt-4'>
            <button
              type='button'
              onClick={() => navigate("/admin/productos")}
              className='border px-4 py-2 rounded-md bg-white'>
              Cancelar
            </button>

            <button
              type='submit'
              disabled={isSaving || isUploading}
              className='px-4 py-2 bg-blue-600 text-white rounded-md flex items-center'>
              {isSaving ? (
                <Loader2 className='h-5 w-5 animate-spin mr-2' />
              ) : (
                <Save className='h-5 w-5 mr-2' />
              )}
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Modal categoría */}
      {isCategoryModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Crear Nueva Categoría
            </h2>

            <form onSubmit={handleCreateCategory} className='mt-4 space-y-4'>
              <input
                type='text'
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder='Nombre de la categoría'
                className='w-full rounded-md border-gray-300 shadow-sm'
              />

              {categoryError && (
                <p className='text-red-600 text-sm'>{categoryError}</p>
              )}

              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => setIsCategoryModalOpen(false)}
                  className='px-4 py-2 border rounded-md bg-gray-100'>
                  Cancelar
                </button>

                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md'>
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductForm;
