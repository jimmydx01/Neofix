// Seguimiento: historial de cada equipo, plan de entrega, calificación, WhatsApp y ficha con QR.

// Una orden está atrasada si pasó su fecha estimada
const late = o => o.eta && o.st < 4 && new Date(o.eta + 'T23:59:59') < new Date();
// Aviso de equipos atrasados para el administrador
const lateBanner = () => {
  const l = O.filter(late);
  return l.length
    ? `
      <div class="bg-rose-500/20 border border-rose-500/60 rounded-2xl p-4 mb-4">⏰ ${l.length} equipo(s) atrasado(s): ${l.map(o => o.m + ' (#' + o.id + ', ' + o.eta + ')').join(', ')}</div>
    `
    : '';
};
// Botón de WhatsApp con un mensaje según el estado del equipo
const waBtn = o => {
  const c = U.find(u => u.id == o.c);
  let ph = ((c && c.t) || '').replace(/\D/g, '');
  if (!ph) return '';
  if (ph.startsWith('0')) ph = '593' + ph.slice(1);
  const n = c.n.split(' ')[0],
    m =
      o.st == 3
        ? `Hola ${n}, tu equipo ${o.m} ya está listo.${o.paid ? '' : ' Puedes realizar el pago en la plataforma.'}`
        : o.q && o.q.s == 'pend'
          ? `Hola ${n}, te enviamos el presupuesto de tu equipo ${o.m} por ${m$(o.q.amt)}. Revísalo en la plataforma.`
          : o.wait
            ? `Hola ${n}, seguimos buscando la pieza para tu equipo ${o.m}.`
            : `Hola ${n}, novedades de tu equipo ${o.m}: estado ${ST[o.st]}.`;
  return `
    <a href="https://wa.me/${ph}?text=${encodeURIComponent(m)}" target="_blank" rel="noopener" class="btn g3 t text-xs inline-block">WhatsApp</a>
  `;
};
// Agrega un evento al historial de una orden
const lg = (o, x) => {
  (o.h = o.h || []).push({ ts: Date.now(), x, b: me ? me.n : 'Sistema' });
};
// Botón para ver el historial de una orden
const btnTL = o =>
  `
    <button onclick="modal={k:'tl',o:${o.id}};R()" class="btn glass text-sm">🕒 Historial</button>
  `;
// Guarda la calificación del cliente
function rateSave() {
  const o = gO(modal.o);
  if (!modal.s) return toast('Elige de 1 a 5 estrellas');
  o.rt = { s: modal.s, c: v('rc'), ts: Date.now() };
  lg(o, 'Calificación del cliente: ' + modal.s + ' estrellas');
  const t =
    '⭐ ' +
    un(o.c) +
    ' calificó ' +
    o.m +
    ': ' +
    modal.s +
    '/5' +
    (o.rt.c ? ' · ' + o.rt.c.slice(0, 60) : '');
  if (o.t) note(o.t, t);
  note(1, t);
  modal = null;
  toast('¡Gracias por tu calificación!');
  R();
}
// Consulta pública del estado por código de seguimiento
function track() {
  const o = O.find(x => x.id == +v('tc').replace(/\D/g, ''));
  if (!o) return toast('No encontramos ese código');
  modal = { k: 'track', o: o.id };
  R();
}
// Ficha del equipo en PDF con código QR
async function ficha(id) {
  const o = gO(id);
  try {
    const d = new window.jspdf.jsPDF({ format: [100, 150] }),
      c = t => String(t).replace(/[^\x20-\xFF]/g, ''),
      link = location.href.split('#')[0].split('?')[0] + '?seg=' + o.id;
    let y = 16;
    const L = (t, b) => {
      d.setFontSize(b ? 14 : 10);
      d.text(c(t), 8, y);
      y += b ? 9 : 6.5;
    };
    L('NexaLab - Ficha de equipo', 1);
    L('Codigo: NL-' + o.id, 1);
    L('Cliente: ' + un(o.c));
    L('Servicio: ' + SV[o.s][1]);
    L('Equipo: ' + o.m);
    L('Ingreso: ' + new Date(o.cr || Date.now()).toLocaleDateString('es'));
    L('Problema: ' + (o.d || '-').slice(0, 60));
    if (window.QRCode) {
      const t = document.createElement('div');
      new QRCode(t, { text: link, width: 160, height: 160 });
      await new Promise(r => setTimeout(r, 80));
      const cv = t.querySelector('canvas');
      if (cv) {
        d.addImage(cv.toDataURL('image/png'), 'PNG', 28, y + 2, 44, 44);
        d.setFontSize(9);
        d.text('Escanea para ver el estado', 50, y + 52, { align: 'center' });
      }
    }
    saveFile('ficha-NL-' + o.id + '.pdf', d.output('blob'));
  } catch (e) {
    toast('No se pudo generar la ficha');
  }
}
// Guarda la prioridad y la fecha estimada de entrega
function planSave() {
  const o = gO(modal.o);
  o.pr = v('pr');
  o.eta = v('pe');
  lg(o, 'Plan de entrega: prioridad ' + o.pr + (o.eta ? ', entrega ' + o.eta : ''));
  if (o.eta) note(o.c, '📅 Fecha estimada de entrega de tu equipo ' + o.m + ': ' + o.eta);
  if (o.t)
    note(o.t, '📅 ' + o.m + ': prioridad ' + o.pr + (o.eta ? ', entrega estimada ' + o.eta : ''));
  modal = null;
  toast('Plan de entrega guardado');
  R();
}
