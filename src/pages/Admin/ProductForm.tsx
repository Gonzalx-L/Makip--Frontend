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
  allows_image: boolean;
}

interface VariantOption {
  id: string;
  value: string;
}

interface VariantGroup {
  id: string;
  name: string;
  options: VariantOption[];
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

type ProductFromAPI = Partial<ProductFormData> & {
  personalization_metadata?: Partial<PersonalizationMetadata>;
  variants?: unknown;
};

type ProductLocationState = {
  product?: ProductFromAPI;
};

// ==============================
// Helpers
// ==============================
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
    if (options.length > 0) dbJson[trimmedName] = options;
  });
  return dbJson;
};

// ==============================
// Componente principal
// ==============================
const ProductForm: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

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
      allows_image: false,
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

  // ==============================
  // Cargar categorías
  // ==============================
  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiClient.get<Category[]>("/categories");
      setCategories(res.data);
    } catch {
      setError("Error al cargar categorías.");
    }
  }, []);

  // ==============================
  // Cargar datos iniciales
  // ==============================
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCategories();

      const state = location.state as ProductLocationState | null;

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
            allows_image: product.personalization_metadata?.allows_image ?? false,
          },
          variants: parseVariantsFromDB(product.variants),
        });
      };

      if (isEditMode) {
        if (state?.product) {
          fillForm(state.product);
        } else {
          try {
            const res = await apiClient.get<ProductFromAPI>(`/products/${id}`);
            fillForm(res.data);
          } catch {
            setError("Error al cargar el producto.");
          }
        }
      }

      setIsLoading(false);
    };

    load();
  }, [id, isEditMode, location.state, fetchCategories]);

  // ==============================
  // Handlers
  // ==============================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Personalization
    if (name.startsWith("personalization_")) {
      const field = name.split("_")[1];
      
      if (field === "image") {
        // Handle checkbox for allows_image
        setFormData((prev) => ({
          ...prev,
          personalization_metadata: {
            ...prev.personalization_metadata,
            allows_image: (e.target as HTMLInputElement).checked,
          },
        }));
        return;
      }
      
      const map: Record<string, keyof PersonalizationMetadata> = {
        x: "coords_x",
        y: "coords_y",
        width: "max_width",
      };

      setFormData((prev) => ({
        ...prev,
        personalization_metadata: {
          ...prev.personalization_metadata,
          [map[field]]: value === "" ? "" : Number(value),
        },
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (type === "number" || name === "category_id") {
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
      const res = await apiClient.post<{ imageUrl: string }>(
        "/upload/product-image",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFormData((prev) => ({
        ...prev,
        base_image_url: res.data.imageUrl,
      }));
    } catch (err) {
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

  // ==============================
  // Variantes
  // ==============================
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

  const removeVariantGroup = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id),
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

  const removeVariantOption = (groupId: string, optId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.filter((o) => o.id !== optId),
            }
          : group
      ),
    }));
  };

  const handleVariantOptionChange = (
    groupId: string,
    optId: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.map((opt) =>
                opt.id === optId ? { ...opt, value } : opt
              ),
            }
          : group
      ),
    }));
  };

  // ==============================
  // Guardar
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      personalization_metadata: {
        coords_x: Number(formData.personalization_metadata.coords_x) || 0,
        coords_y: Number(formData.personalization_metadata.coords_y) || 0,
        max_width: Number(formData.personalization_metadata.max_width) || 0,
        allows_image: formData.personalization_metadata.allows_image,
      },
      variants: serializeVariantsForDB(formData.variants),
    };

    try {
      if (isEditMode) {
        await apiClient.put(`/products/${id}`, payload);
      } else {
        await apiClient.post(`/products`, payload);
      }
      navigate("/admin/productos");
    } catch (err) {
      let msg = "Error al guardar producto.";
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
      setCategoryError("Nombre vacío.");
      return;
    }
    try {
      const res = await apiClient.post("/categories", {
        name: newCategoryName,
      });
      await fetchCategories();
      setFormData((prev) => ({
        ...prev,
        category_id: res.data.category_id,
      }));
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setCategoryError("Error al crear categoría.");
    }
  };

  // ==============================
  // Loading
  // ==============================
  if (isLoading)
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );

  if (error)
    return (
      <div className='p-10 flex flex-col items-center'>
        <AlertCircle className='h-12 w-12 text-red-500' />
        <p className='text-red-600 mt-2'>{error}</p>
      </div>
    );

  // ==============================
  // UI
  // ==============================
  return (
    <>
      <div className='p-6 md:p-8 lg:p-10'>
        <h1 className='text-3xl font-bold mb-6'>
          {isEditMode ? "Editar Producto" : "Crear Producto"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className='space-y-8 border bg-white p-6 rounded-lg shadow-sm'>
          {/* ==================== */}
          {/* DATOS BÁSICOS */}
          {/* ==================== */}
          <div className='grid gap-8 md:grid-cols-2'>
            {/* IZQUIERDA */}
            <div className='space-y-6'>
              <div>
                <label className='font-medium text-sm'>Nombre</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='mt-1 w-full border rounded-md p-2 shadow-sm'
                />
              </div>

              <div>
                <label className='font-medium text-sm'>Descripción</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className='mt-1 w-full border rounded-md p-2 shadow-sm'
                />
              </div>

              <div>
                <label className='font-medium text-sm'>Categoría</label>
                <div className='flex gap-2 mt-1'>
                  <select
                    name='category_id'
                    value={formData.category_id}
                    onChange={handleChange}
                    className='flex-1 border rounded-md p-2 shadow-sm'>
                    <option value=''>Selecciona una categoría</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type='button'
                    className='border rounded-md px-3 py-2 hover:bg-gray-100'
                    onClick={() => setIsCategoryModalOpen(true)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* DERECHA */}
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='font-medium text-sm'>
                    Precio Base (S/)
                  </label>
                  <input
                    type='number'
                    name='base_price'
                    value={formData.base_price}
                    onChange={handleChange}
                    required
                    min={0}
                    className='w-full border rounded-md p-2 shadow-sm'
                  />
                </div>

                <div>
                  <label className='font-medium text-sm'>Cantidad mínima</label>
                  <input
                    type='number'
                    name='min_order_quantity'
                    value={formData.min_order_quantity}
                    onChange={handleChange}
                    required
                    min={1}
                    className='w-full border rounded-md p-2 shadow-sm'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name='is_active'
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className='text-sm'>Producto activo</span>
              </div>

              {/* Imagen */}
              <div>
                <label className='block font-medium text-sm mb-1'>
                  Imagen principal
                </label>

                {formData.base_image_url && (
                  <img
                    src={formData.base_image_url}
                    className='h-32 w-32 rounded-md border object-cover mb-3'
                  />
                )}

                <label className='cursor-pointer inline-flex items-center border px-3 py-2 rounded-md bg-white hover:bg-gray-50 shadow-sm'>
                  <UploadCloud size={16} className='mr-2' />
                  {isUploading ? "Subiendo..." : "Subir imagen"}
                  <input
                    type='file'
                    className='hidden'
                    onChange={handleImageUpload}
                    accept='image/*'
                  />
                </label>

                {uploadError && (
                  <p className='text-sm text-red-600 mt-2'>{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* ==================== */}
          {/* METADATOS */}
          {/* ==================== */}
          <div className='pt-6 border-t space-y-4'>
            <h3 className='font-semibold text-lg'>
              Metadatos de Personalización
            </h3>

            <div className='grid md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium'>Coordenada X</label>
                <input
                  type='number'
                  name='personalization_x'
                  value={formData.personalization_metadata.coords_x}
                  onChange={handleChange}
                  className='border rounded-md p-2 w-full'
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Coordenada Y</label>
                <input
                  type='number'
                  name='personalization_y'
                  value={formData.personalization_metadata.coords_y}
                  onChange={handleChange}
                  className='border rounded-md p-2 w-full'
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Ancho Máximo</label>
                <input
                  type='number'
                  name='personalization_width'
                  value={formData.personalization_metadata.max_width}
                  onChange={handleChange}
                  className='border rounded-md p-2 w-full'
                />
              </div>
            </div>

            <div className='flex items-center space-x-3 mt-4'>
              <input
                type='checkbox'
                id='allows_image'
                name='personalization_image'
                checked={formData.personalization_metadata.allows_image}
                onChange={handleChange}
                className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <label htmlFor='allows_image' className='text-sm font-medium text-gray-700'>
                Permitir subir imagen personalizada
              </label>
            </div>
          </div>

          {/* ==================== */}
          {/* VARIANTES */}
          {/* ==================== */}
          <div className='pt-6 border-t space-y-4'>
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-lg font-medium'>Variantes</h3>
                <p className='text-sm text-gray-500'>
                  Ejemplo: Tallas, Colores, Materiales.
                </p>
              </div>

              <button
                type='button'
                onClick={addVariantGroup}
                className='px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-medium'>
                <Plus size={16} className='inline mr-1' />
                Añadir Grupo
              </button>
            </div>

            {formData.variants.map((group) => (
              <div
                key={group.id}
                className='border rounded-md p-4 bg-gray-50 space-y-3'>
                <div className='flex items-center gap-4'>
                  <input
                    type='text'
                    value={group.name}
                    placeholder='Ej: Talla'
                    onChange={(e) =>
                      handleVariantGroupNameChange(group.id, e.target.value)
                    }
                    className='border w-full max-w-xs rounded-md p-2'
                  />
                  <button
                    type='button'
                    onClick={() => removeVariantGroup(group.id)}
                    className='text-red-600 hover:text-red-800'>
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Opciones */}
                {group.options.map((opt) => (
                  <div key={opt.id} className='flex items-center gap-2 pl-6'>
                    <input
                      type='text'
                      value={opt.value}
                      onChange={(e) =>
                        handleVariantOptionChange(
                          group.id,
                          opt.id,
                          e.target.value
                        )
                      }
                      placeholder='Ej: M'
                      className='border rounded-md p-2 w-full max-w-xs'
                    />

                    <button
                      type='button'
                      disabled={group.options.length <= 1}
                      className='text-red-600 hover:text-red-800 disabled:opacity-50'
                      onClick={() => removeVariantOption(group.id, opt.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type='button'
                  onClick={() => addVariantOption(group.id)}
                  className='text-blue-600 hover:text-blue-800 text-sm'>
                  + Añadir opción
                </button>
              </div>
            ))}
          </div>

          {/* BOTONES */}
          <div className='pt-6 border-t flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => navigate("/admin/productos")}
              className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200'>
              Cancelar
            </button>

            <button
              type='submit'
              disabled={isSaving || isUploading}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'>
              {isSaving ? (
                <Loader2 className='h-5 w-5 animate-spin mr-2' />
              ) : (
                <Save className='h-5 w-5 mr-2' />
              )}
              {isEditMode ? "Actualizar" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>

      {/* ==================== */}
      {/* MODAL DE CATEGORÍA */}
      {/* ==================== */}
      {isCategoryModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
          <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md border'>
            <h2 className='text-lg font-semibold mb-4'>
              Crear nueva categoría
            </h2>

            <form onSubmit={handleCreateCategory} className='space-y-4'>
              <input
                type='text'
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder='Ej: Tazas'
                className='w-full border rounded-md p-2'
              />

              {categoryError && (
                <p className='text-sm text-red-600'>{categoryError}</p>
              )}

              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryError(null);
                  }}>
                  Cancelar
                </button>

                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
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
