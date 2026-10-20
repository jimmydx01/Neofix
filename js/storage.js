// Guardado en el navegador (localStorage) y cambio de tema día/noche.

// Guarda todo en el navegador
function save() {
  try {
    localStorage.setItem(
      'tf2',
      JSON.stringify({ U, O, I, P, N, C, H, nid, TF, IVA, G, me: me && me.id })
    );
  } catch (e) {}
}
// Carga lo guardado; si no hay nada, avisa del stock bajo inicial
try {
  const s = JSON.parse(localStorage.getItem('tf2'));
  if (s) {
    ({ U, O, I, P, N, C, H, nid } = s);
    if (s.TF) TF = s.TF;
    if (s.IVA != null) IVA = s.IVA;
    if (s.G) G = s.G;
    I = I.map(x =>
      Object.assign(
        {
          code: 'P-' + x.id,
          br: '',
          pv: 10,
          pc: 5,
          img: null,
          sup: [
            { n: 'Proveedor A', p: 5 },
            { n: 'Proveedor B', p: 5.5 },
            { n: 'Proveedor C', p: 6 }
          ]
        },
        x
      )
    );
    me = U.find(u => u.id == s.me) || null;
    if (me) view = 'app';
  } else lows().forEach(x => note(1, '⚠️ Stock bajo: ' + x.n + ' (' + x.q + ' uds.)'));
} catch (e) {}
// Recupera el tema elegido
try {
  document.documentElement.dataset.theme = localStorage.getItem('tf-th') || 'light';
} catch (e) {}
// Completa fechas en datos guardados antes de que existieran
O.forEach(o => {
  o.cr = o.cr || Date.now();
  if (o.paid) o.pd = o.pd || Date.now();
});
P.forEach(p => {
  p.ts = p.ts || Date.now();
});
// Cambia entre modo día y noche
function theme() {
  const d = document.documentElement,
    n = d.dataset.theme == 'light' ? 'dark' : 'light';
  d.dataset.theme = n;
  try {
    localStorage.setItem('tf-th', n);
  } catch (e) {}
  R();
}
