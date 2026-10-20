// Funciones de apoyo que se usan en toda la aplicación.

// Atajos: $ busca por id, v lee el valor de un campo y m$ da formato de dinero
const $ = i => document.getElementById(i),
  v = i => ($(i) || {}).value || '',
  m$ = n => '$' + (Math.round(n * 100) / 100).toLocaleString();
// Mensaje breve en pantalla
const toast = t => {
  const e = $('toast');
  e.textContent = t;
  e.classList.remove('hidden');
  setTimeout(() => e.classList.add('hidden'), 2600);
};
// Crea una notificación para un usuario
const note = (to, text) =>
  N.unshift({
    to,
    text,
    r: 0,
    t: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  });
// Nombre de un usuario, precio de una orden, productos con stock bajo y búsqueda de orden
const un = id => (U.find(u => u.id == id) || { n: '—' }).n,
  pri = o => (o.q && o.q.s == 'ok' ? o.q.amt : SV[o.s][2]),
  lows = () => I.filter(x => x.q <= x.min),
  gO = id => O.find(o => o.id == id);
// Guarda un archivo: usa el permiso de descargas del demo publicado o la descarga normal del navegador
async function saveFile(name, data) {
  try {
    const dl = window.claude ? await window.claude.use('downloads') : null;
    if (dl) {
      await dl.save({ filename: name, data });
      toast('Archivo guardado ✔');
      return;
    }
    const blob = data instanceof Blob ? data : new Blob([data]),
      a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Archivo descargado ✔');
  } catch (e) {
    if (!e || e.code != 'declined') toast('No se pudo guardar el archivo');
  }
}
// Convierte milisegundos a horas o días
const dur = ms => (ms < 36e5 * 48 ? (ms / 36e5).toFixed(1) + ' h' : (ms / 864e5).toFixed(1) + ' d');
