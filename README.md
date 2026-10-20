# NexaLab – Demo de servicio técnico

Demo web para un negocio de reparación de computadoras y equipos tecnológicos, hecho con HTML, CSS, JavaScript y Tailwind. No necesita servidor ni instalación.

## Cómo abrirlo

1. Descomprime la carpeta.
2. Abre `index.html` en el navegador.
3. Se necesita internet porque Tailwind, jsPDF y qrcodejs se cargan desde CDN.

Los datos se guardan en el navegador (localStorage), así que no se pierden al recargar. Para empezar de cero, borra los datos del sitio desde el navegador.

## Usuarios de prueba (clave 1234)

| Rol           | Correo             |
| ------------- | ------------------ |
| Administrador | admin@demo.com     |
| Técnico       | tecnico@demo.com   |
| Cliente       | cliente@demo.com   |

## Estructura

```
index.html          Página principal; carga los estilos y los scripts
css/
  styles.css        Estilos propios (colores, modo día/noche, degradados)
js/
  data.js           Datos de ejemplo y estado global
  utils.js          Funciones de apoyo
  storage.js        Guardado en el navegador y tema día/noche
  users.js          Registro, ingreso y personal
  photos.js         Fotos de los equipos
  orders.js         Órdenes de servicio y estados
  inventory.js      Inventario, proveedores y piezas faltantes
  quotes.js         Presupuestos (tarifas + repuestos + IVA)
  payments.js       Pagos, autorización de entrega y comprobante
  chat.js           Chat
  finance.js        Gastos, reportes, CSV, PDF y gráfico
  followup.js       Historial, plan de entrega, calificación, WhatsApp y ficha con QR
  notifications.js  Notificaciones por usuario
  components.js     Piezas de interfaz reutilizables
  view-public.js    Inicio, barra superior y formularios de acceso
  view-modals.js    Ventanas emergentes
  view-client.js    Panel del cliente
  view-tech.js      Panel del técnico
  view-admin.js     Panel del administrador
  main.js           Punto de entrada
```

El orden de los scripts en `index.html` importa: los datos y las funciones de apoyo van primero y `main.js` va al final.

## Flujo de una orden

Solicitud del cliente, asignación del técnico, diagnóstico, presupuesto, aceptación del cliente, reparación, equipo listo, pago, autorización del administrador y entrega. Cada paso envía una notificación solo a quien corresponde.

## Notas

- El IVA (15 %) se cambia en la pestaña Tarifas del administrador.
- Los PDF y el CSV se descargan con el navegador.
- El código QR de la ficha apunta a la dirección donde esté publicado el demo (`?seg=código`).
- Es un demo sin servidor: las claves y los datos viven en el navegador. Para uso real hace falta un backend con base de datos (por ejemplo Django y PostgreSQL).
