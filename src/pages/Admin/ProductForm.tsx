// src/pages/Admin/ProductForm.tsx

import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/admi/apiClient";
import axios from "axios";
import {
  Loader2,
  AlertCircle,
  Save,
  UploadCloud,
  Plus,
  Trash2,
} from "lucide-react";

// --- Interfaces ---
interface Category {
  category_id: number;
  name: string;
}

interface PersonalizationMetadata {
  coords_x: number | "";
  coords_y: number | "";
  max_width: number | "";
}

// Variantes
interface VariantOption {
  id: string;
  value: string;
}

interface VariantGroup {
  id: string;
  name: string; // ej: "Talla"
  options: VariantOption[]; // ej: [{id: '1', value: 'S'}, ...]
}

interface ProductFormData {
  name: string;
  description: string;
  category_id: number | "";
  base_price: number | "";
  min_order_quantity: number | "";
  is_active: boolean;
  base_image_url: string | null;
  personalization_metadata: PersonalizationMetadata;
  variants: VariantGroup[];
}

interface ErrorResponse {
  message?: string;
}

// Tipo de producto que viene del backend / location.state
type ProductFromAPI = Partial<ProductFormData> & {
  personalization_metadata?: Partial<PersonalizationMetadata>;
  variants?: unknown; // luego lo parseamos
};

// State del location
type ProductLocationState = {
  product?: ProductFromAPI;
};

// --- Funciones de ayuda ---

// Transforma el JSON de la BD a nuestro estado de React
const parseVariantsFromDB = (dbVariants: unknown): VariantGroup[] => {
  if (!dbVariants || typeof dbVariants !== "object") return [];

  const variantsObj = dbVariants as Record<string, unknown>;

  return Object.keys(variantsObj).map((groupName, index) => {
    const rawOptions = variantsObj[groupName];

    const optionsArray = Array.isArray(rawOptions)
      ? (rawOptions as unknown[]).filter(
          (v): v is string => typeof v === "string"
        )
      : [];

    return {
      id: `group-${index}-${Date.now()}`,
      name: groupName,
      options: optionsArray.map((optValue, optIndex) => ({
        id: `opt-${index}-${optIndex}-${Date.now()}`,
        value: optValue,
      })),
    };
  });
};

// Transforma nuestro estado de React al JSON que la BD espera
const serializeVariantsForDB = (
  variants: VariantGroup[]
): Record<string, string[]> => {
  const dbJson: Record<string, string[]> = {};
  variants.forEach((group) => {
    const trimmedName = group.name.trim();
    if (!trimmedName) return;

    const options = group.options
      .map((opt) => opt.value.trim())
      .filter((val) => val.length > 0);

    if (options.length > 0) {
      dbJson[trimmedName] = options;
    }
  });
  return dbJson;
};

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const location = useLocation(); // sin genérico para evitar TS2558
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
    personalization_metadata: {
      coords_x: "",
      coords_y: "",
      max_width: "",
    },
    variants: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const isEditMode = Boolean(id);

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

      const fillForm = (product: ProductFromAPI) => {
        setFormData({
          name: product.name ?? "",
          description: product.description ?? "",
          category_id: product.category_id ?? "",
          base_price:
            product.base_price !== undefined ? Number(product.base_price) : "",
          min_order_quantity: product.min_order_quantity ?? 1,
          is_active: product.is_active ?? true,
          base_image_url: product.base_image_url ?? null,
          personalization_metadata: {
            coords_x: product.personalization_metadata?.coords_x ?? "",
            coords_y: product.personalization_metadata?.coords_y ?? "",
            max_width: product.personalization_metadata?.max_width ?? "",
          },
          variants: parseVariantsFromDB(product.variants),
        });
      };

      const state = location.state as ProductLocationState | null;

      if (isEditMode) {
        if (state?.product) {
          fillForm(state.product);
        } else {
          try {
            const response = await apiClient.get<ProductFromAPI>(
              `/products/${id}`
            );
            fillForm(response.data);
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
  // Manejadores de Variantes
  //-------------------------------------------------------
  const addVariantGroup = () => {
    const now = Date.now();
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `group-${now}`,
          name: "",
          options: [{ id: `opt-${now}`, value: "" }],
        },
      ],
    }));
  };

  const removeVariantGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((group) => group.id !== groupId),
    }));
  };

  const handleVariantGroupNameChange = (groupId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId ? { ...group, name: value } : group
      ),
    }));
  };

  const addVariantOption = (groupId: string) => {
    const now = Date.now();
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: [
                ...group.options,
                { id: `opt-${now}-${group.options.length}`, value: "" },
              ],
            }
          : group
      ),
    }));
  };

  const removeVariantOption = (groupId: string, optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.filter((opt) => opt.id !== optionId),
            }
          : group
      ),
    }));
  };

  const handleVariantOptionChange = (
    groupId: string,
    optionId: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.map((opt) =>
                opt.id === optionId ? { ...opt, value } : opt
              ),
            }
          : group
      ),
    }));
  };

  //-------------------------------------------------------
  // Manejadores generales
  //-------------------------------------------------------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    // Campos de metadatos de personalización
    if (name.startsWith("personalization_")) {
      const field = name.split("_")[1]; // x, y, width
      let key: keyof PersonalizationMetadata;

      if (field === "width") {
        key = "max_width";
      } else if (field === "x") {
        key = "coords_x";
      } else {
        key = "coords_y";
      }

      setFormData((prev) => ({
        ...prev,
        personalization_metadata: {
          ...prev.personalization_metadata,
          [key]: value === "" ? "" : Number(value),
        },
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked,
      }));
      return;
    }

    if (name === "category_id" || type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    } catch (err: unknown) {
      console.error("Error en handleImageUpload:", err);
      let msg = "Error al subir la imagen.";
      if (axios.isAxiosError(err) && err.response) {
        msg =
          (err.response.data as ErrorResponse)?.message ||
          `Error: ${err.response.status}`;
      }
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const dataToSend = {
      ...formData,
      personalization_metadata: {
        coords_x: Number(formData.personalization_metadata.coords_x) || 0,
        coords_y: Number(formData.personalization_metadata.coords_y) || 0,
        max_width: Number(formData.personalization_metadata.max_width) || 0,
      },
      variants: serializeVariantsForDB(formData.variants),
    };

    try {
      if (isEditMode) {
        await apiClient.put(`/products/${id}`, dataToSend);
      } else {
        await apiClient.post("/products", dataToSend);
      }
      navigate("/admin/productos");
    } catch (err: unknown) {
      console.error("Error en handleSubmit:", err);
      let msg = "Error al guardar el producto.";
      if (axios.isAxiosError(err) && err.response) {
        msg =
          (err.response.data as ErrorResponse)?.message ||
          `Error: ${err.response.status}`;
      }
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError("El nombre no puede estar vacío.");
      return;
    }
    setCategoryError(null);
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
    } catch (err: unknown) {
      console.error("Error en handleCreateCategory:", err);
      let msg = "Error al crear la categoría.";
      if (axios.isAxiosError(err) && err.response) {
        msg =
          (err.response.data as ErrorResponse)?.message ||
          `Error: ${err.response.status}`;
      }
      setCategoryError(msg);
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
          {isEditMode ? "Editar Producto" : "Crear Producto"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className='space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          {/* Sección 1: Datos Básicos */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Columna Izquierda */}
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'>
                  Nombre
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'>
                  Descripción
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label
                  htmlFor='category_id'
                  className='block text-sm font-medium text-gray-700'>
                  Categoría
                </label>
                <div className='mt-1 flex gap-2'>
                  <select
                    id='category_id'
                    name='category_id'
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'>
                    <option value=''>Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type='button'
                    onClick={() => setIsCategoryModalOpen(true)}
                    className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'>
                    <Plus className='h-4 w-4 mr-1' /> Nueva
                  </button>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='base_price'
                    className='block text-sm font-medium text-gray-700'>
                    Precio base (S/)
                  </label>
                  <input
                    type='number'
                    id='base_price'
                    name='base_price'
                    value={formData.base_price}
                    onChange={handleChange}
                    min={0}
                    step='0.01'
                    required
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='min_order_quantity'
                    className='block text-sm font-medium text-gray-700'>
                    Cantidad mínima
                  </label>
                  <input
                    type='number'
                    id='min_order_quantity'
                    name='min_order_quantity'
                    value={formData.min_order_quantity}
                    onChange={handleChange}
                    min={1}
                    required
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  id='is_active'
                  type='checkbox'
                  name='is_active'
                  checked={formData.is_active}
                  onChange={handleChange}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <label
                  htmlFor='is_active'
                  className='text-sm font-medium text-gray-700'>
                  Producto activo
                </label>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Imagen principal
                </label>
                {formData.base_image_url && (
                  <div className='mb-3'>
                    <img
                      src={formData.base_image_url}
                      alt='Producto'
                      className='h-32 w-32 rounded-md object-cover border'
                    />
                  </div>
                )}
                <label className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer'>
                  <UploadCloud className='h-4 w-4 mr-2' />
                  {isUploading ? "Subiendo..." : "Subir imagen"}
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                {uploadError && (
                  <p className='mt-2 text-sm text-red-600'>{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Metadatos de Personalización */}
          <div className='space-y-4 pt-6 border-t border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Metadatos de Personalización
            </h3>
            <p className='text-sm text-gray-500'>
              Define dónde se estampará el logo en el mockup (en píxeles).
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label
                  htmlFor='personalization_x'
                  className='block text-sm font-medium text-gray-700'>
                  Coordenada X (px)
                </label>
                <input
                  type='number'
                  id='personalization_x'
                  name='personalization_x'
                  value={formData.personalization_metadata.coords_x}
                  onChange={handleChange}
                  placeholder='0'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label
                  htmlFor='personalization_y'
                  className='block text-sm font-medium text-gray-700'>
                  Coordenada Y (px)
                </label>
                <input
                  type='number'
                  id='personalization_y'
                  name='personalization_y'
                  value={formData.personalization_metadata.coords_y}
                  onChange={handleChange}
                  placeholder='0'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label
                  htmlFor='personalization_width'
                  className='block text-sm font-medium text-gray-700'>
                  Ancho Máximo (px)
                </label>
                <input
                  type='number'
                  id='personalization_width'
                  name='personalization_width'
                  value={formData.personalization_metadata.max_width}
                  onChange={handleChange}
                  placeholder='100'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Variantes */}
          <div className='space-y-4 pt-6 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900'>
                  Variantes (Tallas, Colores)
                </h3>
                <p className='text-sm text-gray-500'>
                  Añade grupos de opciones como Talla, Color, etc.
                </p>
              </div>
              <button
                type='button'
                onClick={addVariantGroup}
                className='flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'>
                <Plus size={16} />
                <span>Añadir Grupo</span>
              </button>
            </div>

            <div className='space-y-4'>
              {formData.variants.map((group, groupIndex) => (
                <div
                  key={group.id}
                  className='rounded-md border bg-gray-50 p-4 space-y-3'>
                  <div className='flex items-center gap-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Nombre del Grupo
                    </label>
                    <input
                      type='text'
                      placeholder='Ej: Talla'
                      value={group.name}
                      onChange={(e) =>
                        handleVariantGroupNameChange(group.id, e.target.value)
                      }
                      className='block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    />
                    <button
                      type='button'
                      onClick={() => removeVariantGroup(group.id)}
                      className='ml-auto text-red-500 hover:text-red-700'>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className='space-y-2 pl-6'>
                    {group.options.map((option, optIndex) => (
                      <div key={option.id} className='flex items-center gap-2'>
                        <label className='text-sm text-gray-600'>
                          Opción {optIndex + 1}
                        </label>
                        <input
                          type='text'
                          placeholder={groupIndex === 0 ? "Ej: M" : "Ej: Rojo"}
                          value={option.value}
                          onChange={(e) =>
                            handleVariantOptionChange(
                              group.id,
                              option.id,
                              e.target.value
                            )
                          }
                          className='block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            removeVariantOption(group.id, option.id)
                          }
                          className='text-red-500 hover:text-red-700 disabled:opacity-50'
                          disabled={group.options.length <= 1}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => addVariantOption(group.id)}
                      className='text-sm text-blue-600 hover:text-blue-800'>
                      + Añadir opción
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className='flex justify-end gap-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => navigate("/admin/productos")}
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'>
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSaving || isUploading}
              className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60'>
              {isSaving ? (
                <Loader2 className='h-5 w-5 animate-spin mr-2' />
              ) : (
                <Save className='h-5 w-5 mr-2' />
              )}
              {isEditMode ? "Actualizar producto" : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal categoría */}
      {isCategoryModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-20 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Crear Nueva Categoría
            </h2>
            <form onSubmit={handleCreateCategory} className='mt-4 space-y-4'>
              <input
                type='text'
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Nombre de la categoría'
                autoFocus
              />
              {categoryError && (
                <p className='text-sm text-red-600'>{categoryError}</p>
              )}
              <div className='flex justify-end space-x-2'>
                <button
                  type='button'
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryError(null);
                  }}
                  className='px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300'>
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700'>
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
