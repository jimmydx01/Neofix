/*
  NexaLab – Demo de servicio técnico
  Datos de ejemplo y estado global de la aplicación.

  Nombres cortos que se usan en todo el código:
    U usuarios · O órdenes de servicio · I inventario · P pedidos a proveedores
    N notificaciones · C mensajes del chat · G gastos y pérdidas · TF tarifas base
    H historial mensual de ejemplo (solo para el gráfico)

  Campos de una orden:
    c cliente · s servicio · m modelo · d descripción · st estado · t técnico
    q presupuesto · wait espera de repuesto · paid / pd / pm pago, fecha y método
    pr prioridad · eta fecha estimada · h historial · rt calificación
    cr fecha de creación · dl fecha de entrega
*/

// Catálogo de servicios: [icono, nombre, precio base]
const SV = [
  ["💻", "Reparación de computadoras", 40, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85"],
  ["📱", "Celulares y tablets", 30, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85"],
  ["🖨️", "Impresoras", 35, "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=85"],
  ["🌐", "Redes y WiFi", 45, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85"],
  ["🎮", "Consolas y gaming", 50, "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85"],
  ["🧼", "Mantenimiento preventivo", 25, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85"],
];
// Estados de una orden, color de cada estado y métodos de pago
const ST = ['Recibido', 'En diagnóstico', 'En reparación', 'Listo', 'Entregado'],
  SC = ['bg-slate-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-fuchsia-600'],
  PM = [
    ['💵', 'Efectivo'],
    ['🏦', 'Transferencia'],
    ['🅿️', 'PayPal'],
    ['💳', 'Tarjeta']
  ];
// Usuarios de demostración (rol: admin, tec o cli)
let U = [
  { id: 1, n: 'Administrador', e: 'admin@demo.com', p: '1234', r: 'admin' },
  { id: 2, n: 'Carlos Técnico', e: 'tecnico@demo.com', p: '1234', r: 'tec' },
  { id: 3, n: 'Lucía Técnico', e: 'lucia@demo.com', p: '1234', r: 'tec' },
  { id: 4, n: 'Ana Cliente', e: 'cliente@demo.com', p: '1234', r: 'cli', t: '0991234567' }
];
// Órdenes de servicio de ejemplo
let O = [
  { id: 101, c: 4, s: 0, m: 'HP Pavilion 15', d: 'No enciende', st: 1, t: 2, ph: null },
  { id: 102, c: 4, s: 1, m: 'Samsung A32', d: 'Pantalla rota', st: 0, t: null, ph: null }
];
// Inventario de repuestos, cada uno con 3 proveedores
let I = [
  {
    id: 1,
    n: 'Pasta térmica',
    code: 'PT-001',
    br: 'Arctic',
    pv: 6,
    pc: 3,
    q: 3,
    min: 5,
    img: null,
    sup: [
      { n: 'TecnoMayorista', p: 3 },
      { n: 'ElectroSur', p: 3.4 },
      { n: 'CompuPlus', p: 3.8 }
    ]
  },
  {
    id: 2,
    n: 'SSD 480GB',
    code: 'SSD-480',
    br: 'Kingston',
    pv: 45,
    pc: 32,
    q: 12,
    min: 4,
    img: null,
    sup: [
      { n: 'TecnoMayorista', p: 32 },
      { n: 'ElectroSur', p: 34 },
      { n: 'CompuPlus', p: 35.5 }
    ]
  },
  {
    id: 3,
    n: 'Pantalla laptop 15"',
    code: 'PL-156',
    br: 'Genérica',
    pv: 80,
    pc: 55,
    q: 2,
    min: 3,
    img: null,
    sup: [
      { n: 'TecnoMayorista', p: 55 },
      { n: 'ElectroSur', p: 58 },
      { n: 'CompuPlus', p: 61 }
    ]
  },
  {
    id: 4,
    n: 'Batería celular',
    code: 'BC-210',
    br: 'Samsung',
    pv: 18,
    pc: 11,
    q: 8,
    min: 4,
    img: null,
    sup: [
      { n: 'TecnoMayorista', p: 11 },
      { n: 'ElectroSur', p: 12 },
      { n: 'CompuPlus', p: 13.5 }
    ]
  }
];
// Porcentaje de IVA que se suma a los presupuestos (se edita en Tarifas)
let IVA = 15;
// Gastos y pérdidas registrados a mano
let G = [];
// Tarifas base de mano de obra y servicios
let TF = [
  { id: 1, n: 'Mano de obra', p: 20 },
  { id: 2, n: 'Limpieza de equipo', p: 10 },
  { id: 3, n: 'Diagnóstico', p: 5 },
  { id: 4, n: 'Instalación de sistema', p: 15 },
  { id: 5, n: 'Respaldo de datos', p: 12 },
  { id: 6, n: 'Cambio de pantalla (mano de obra)', p: 25 }
];
// Pedidos a proveedores, notificaciones, chat e historial mensual de ejemplo
let P = [],
  N = [],
  C = [],
  H = [
    { m: 'May', i: 820, g: 540, l: 60 },
    { m: 'Jun', i: 960, g: 610, l: 40 },
    { m: 'Jul', i: 1120, g: 700, l: 90 },
    { m: 'Ago', i: 1050, g: 650, l: 30 },
    { m: 'Sep', i: 1380, g: 820, l: 70 }
  ];
// Filtro de fechas de los reportes
let fd = '',
  fh = '';
// Estado de la interfaz: sesión, pantalla, pestaña, ventana abierta, etc.
let me = null,
  view = 'home',
  tab = 'dash',
  q = '',
  phs = [],
  modal = null,
  notes = false,
  nid = 200,
  pmx = 'Tarjeta';
