# 📁 Estructura del Proyecto - Makip E-commerce

## 🎯 Visión General

Este proyecto está estructurado siguiendo las mejores prácticas de React/TypeScript para un e-commerce con 3 estados principales:

- **Visitante**: Ve productos sin autenticación
- **Cliente**: Usuario autenticado que puede comprar
- **Admin**: Panel de administración con métricas

## 📂 Estructura de Carpetas

### `components/`

Componentes reutilizables organizados por funcionalidad

#### `features/`

Componentes específicos por dominio de negocio

- **auth/** - Login, registro, recuperación de contraseña
- **products/** - Catálogo, filtros, detalles de producto
- **cart/** - Carrito de compras y checkout
- **admin/** - Dashboard administrativo y métricas
- **customer/** - Perfil y gestión de usuario

#### `ui/`

Componentes de interfaz reutilizables

- **forms/** - Input, Button, Select, etc.
- **layout/** - Header, Sidebar, Container
- **navigation/** - NavBar, Footer, Breadcrumb
- **feedback/** - Modal, Alert, Loader, Toast

### `pages/`

Páginas principales de la aplicación

- **public/** - Páginas accesibles sin autenticación
- **auth/** - Páginas de login y registro
- **customer/** - Páginas para usuarios autenticados
- **admin/** - Páginas del panel administrativo

### `hooks/`

Custom hooks para lógica reutilizable

### `services/`

Servicios para llamadas a API y lógica de negocio

### `store/`

Redux store y slices para manejo de estado global

### `utils/`

Funciones utilitarias y helpers

### `types/`

Definiciones de TypeScript

### `constants/`

Constantes de la aplicación (rutas, endpoints, configuración)

## 🚀 Próximos Pasos

1. Configurar rutas y navegación
2. Implementar autenticación y protección de rutas
3. Crear componentes base y layout
4. Configurar Redux para estado global
5. Integrar Tailwind CSS
