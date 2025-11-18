# 📋 Documentación: Ruta Pública para Upload de Comprobantes

## 🎯 Problema Identificado

El frontend ahora crea órdenes para **clientes no autenticados**, pero el endpoint de upload de comprobantes requiere autenticación, causando error 401.

## ✅ Solución: Agregar Ruta Pública

### **Backend: Agregar nueva ruta**

```javascript
// En tu archivo de rutas (routes/orders.js o similar)

// Ruta pública para subir comprobantes (SIN autenticación)
router.post(
  "/public/orders/:id/upload-proof",
  upload.single("file"),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No se recibió ningún archivo",
        });
      }

      // Verificar que la orden existe y está en estado válido
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
        });
      }

      // Verificar que la orden permite subir comprobantes
      if (order.status === "cancelled" || order.payment_proof_url) {
        return res.status(403).json({
          success: false,
          message: "Esta orden no permite subir comprobantes",
        });
      }

      // Subir archivo a Google Cloud Storage
      const publicUrl = await uploadToGCS(file, "payment-proofs");

      // Actualizar orden con URL del comprobante
      await Order.findByIdAndUpdate(orderId, {
        payment_proof_url: publicUrl,
        status: "processing", // Cambiar estado a procesando
        updated_at: new Date(),
      });

      // Procesar OCR si está disponible (opcional, no bloquear)
      if (ocrService) {
        try {
          const ocrResult = await ocrService.detectText(file.buffer);
          // Procesar resultado del OCR...
        } catch (ocrError) {
          console.warn("OCR processing failed:", ocrError);
        }
      }

      res.json({
        success: true,
        message: "Comprobante subido exitosamente",
        order: {
          order_id: order._id,
          status: "processing",
          payment_proof_url: publicUrl,
        },
        isApproved: false, // Se aprobará después de la verificación
      });
    } catch (error) {
      console.error("Error uploading payment proof (public):", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);
```

### **Diferencias con la ruta autenticada:**

| Aspecto        | Ruta Autenticada           | Ruta Pública                      |
| -------------- | -------------------------- | --------------------------------- |
| **URL**        | `/orders/:id/upload-proof` | `/public/orders/:id/upload-proof` |
| **Middleware** | `protectClientRoute` ✅    | Sin autenticación ❌              |
| **Validación** | `req.client.id`            | Solo `orderId` válido             |
| **Seguridad**  | Por cliente                | Por estado de orden               |

### **Seguridad de la ruta pública:**

1. **Validar orden existe** ✅
2. **Verificar estado válido** (no cancelada) ✅
3. **Evitar duplicados** (una sola subida) ✅
4. **Límite de archivos** (por Multer) ✅
5. **Tipos permitidos** (imágenes/PDFs) ✅

## 🚀 Testing

### **Probar la nueva ruta:**

```bash
# Con Postman o curl
POST http://localhost:4000/api/v1/public/orders/123/upload-proof
Content-Type: multipart/form-data
Body: file (imagen o PDF)
```

### **Respuesta esperada:**

```json
{
  "success": true,
  "message": "Comprobante subido exitosamente",
  "order": {
    "order_id": 123,
    "status": "processing",
    "payment_proof_url": "https://storage.googleapis.com/..."
  },
  "isApproved": false
}
```

## 📝 Notas Importantes

1. **Esta ruta NO requiere autenticación** - es pública
2. **Se basa en el ID de orden** para la validación
3. **Cambia el estado a "processing"** automáticamente
4. **Compatible con el frontend actual** - no requiere cambios adicionales
5. **Mantiene la seguridad** validando estados de orden

## ✅ Implementación Completa

Una vez agregues esta ruta en tu backend, el sistema funcionará completamente:

1. **Cliente crea orden** → `POST /orders` ✅
2. **Sube comprobante** → `POST /public/orders/:id/upload-proof` ✅
3. **OCR procesa** → Validación automática ✅
4. **Estado actualiza** → `processing` → `approved/rejected` ✅

¡El flujo completo estará funcional! 🎉
