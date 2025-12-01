# Guía de Estados de Seguimiento - Makip

## Estados del Backend

El sistema de tracking ahora soporta todos los estados que maneja el backend:

### 🔴 NO_PAGADO
- **Descripción**: El pedido fue creado pero aún no se ha subido el comprobante de pago
- **Banner**: "Esperando Pago"
- **Indicador**: Paso 1 (Pago) en pendiente
- **Color**: Amarillo

### 🔍 PAGO_EN_VERIFICACION
- **Descripción**: Se subió el comprobante pero está siendo verificado manualmente
- **Banner**: "Verificando Pago"
- **Indicador**: Paso 1 (Pago) activo/pulsando
- **Color**: Azul

### ✅ PENDIENTE
- **Descripción**: Pago aprobado, pedido en cola para producción
- **Banner**: "Pedido Confirmado"
- **Indicador**: Paso 1 completo, Paso 2 activo
- **Color**: Azul

### ⚙️ EN_EJECUCION
- **Descripción**: El pedido está siendo producido
- **Banner**: "En Producción: Estimado X días"
- **Indicador**: Paso 2 (Producción) activo con ícono giratorio
- **Color**: Azul

### 📦 TERMINADO
- **Descripción**: Producción finalizada, listo para empaque/envío
- **Banner**: "Producción Finalizada"
- **Indicador**: Paso 3 (Finalizado) activo
- **Color**: Verde

### 🎉 COMPLETADO
- **Descripción**: Pedido entregado o listo para recojo
- **Banner**: Depende del tipo de entrega:
  - DELIVERY: "Entregado"
  - PICKUP: "Listo para Recojo - Código: XXX"
- **Indicador**: Todos los pasos completos
- **Color**: Verde

### ❌ CANCELADO
- **Descripción**: Pedido cancelado por cualquier motivo
- **Banner**: "Pedido Cancelado"
- **Indicador**: Estados en rojo con ícono de error
- **Color**: Rojo

## Componentes Actualizados

### 1. TrackingStepIndicator
- Ahora maneja 4 pasos en lugar de 3:
  1. **Pago** (FaCreditCard)
  2. **Producción** (FaCog)
  3. **Finalizado** (FaBoxOpen)
  4. **Entregado/Listo** (FaTruck/FaCommentDots según tipo de entrega)

### 2. OrderTrackingTimeline
- Banner dinámico con colores según el estado
- Iconos específicos para cada tipo de actualización
- Soporte para códigos de recojo
- Timeline más detallado con colores personalizados

### 3. TrackingPage
- Botón de seguimiento automático (polling)
- Información de debug en modo desarrollo
- Notificaciones de actualización mejoradas

## Iconos y Colores por Tipo de Actualización

### Iconos
- `payment`: FaCreditCard (Pago)
- `production`: FaCog (Producción)
- `quality`: FaEye (Control de calidad)
- `packaging`: FaBoxOpen (Empaquetado)
- `delivery`: FaTruck (Entrega)
- `pickup`: FaMapMarkerAlt (Recojo)
- `completed`: FaCircleCheck (Completado)
- `cancelled`: FaTimesCircle (Cancelado)

### Colores
- `green`: Verde (Exitoso)
- `blue`: Azul (En proceso)
- `orange`: Naranja (Pendiente)
- `red`: Rojo (Error/Cancelado)

## Transiciones de Estado

El frontend ahora respeta las transiciones válidas del backend:

```
NO_PAGADO → PAGO_EN_VERIFICACION → PENDIENTE → EN_EJECUCION → TERMINADO → COMPLETADO
     ↓              ↓                  ↓            ↓            ↓
 CANCELADO      CANCELADO          CANCELADO    CANCELADO        ✓
```

## Notificaciones

El sistema incluye:
- Notificaciones en tiempo real cuando hay cambios
- Actualización automática cada 30 segundos (opcional)
- Notificaciones del navegador si están habilitadas
- Mensajes informativos en la UI

## Uso para Desarrollo

Para probar los diferentes estados, puedes:

1. Cambiar el `currentStatus` en el mock data
2. Usar las herramientas de desarrollo del admin
3. Simular diferentes escenarios de pedido

El componente incluye información de debug en modo desarrollo que muestra el estado actual del backend.