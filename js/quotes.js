// Presupuestos: tarifas más repuestos, IVA y respuesta del cliente.

// Subtotal de servicios de un presupuesto
const qSv = m => m.L.reduce((a, id) => a + TF.find(l => l.id == id).p, 0);
// Indica si falta stock de algún repuesto del presupuesto
const lackQ = m => m.P.some(x => I.find(z => z.id == x.id).q < x.q);
// Subtotal del presupuesto: servicios más repuestos
const qTot = m =>
  m.L.reduce((a, id) => a + TF.find(l => l.id == id).p, 0) +
  m.P.reduce((a, x) => a + x.q * I.find(i => i.id == x.id).pv, 0);
// Marca o desmarca una tarifa en el presupuesto
function qL(id) {
  modal.d = v('qt');
  const a = modal.L,
    i = a.indexOf(id);
  i < 0 ? a.push(id) : a.splice(i, 1);
  R();
}
// Agrega un repuesto al presupuesto
function qP() {
  modal.d = v('qt');
  const id = +v('qi'),
    n = Math.max(1, +v('qn') || 1),
    p = modal.P.find(x => x.id == id);
  p ? (p.q += n) : modal.P.push({ id, q: n });
  R();
}
// Quita un repuesto del presupuesto
function qX(i) {
  modal.d = v('qt');
  modal.P.splice(i, 1);
  R();
}
// Agrega una tarifa base
function addTF() {
  const n = v('tfn'),
    p = +v('tfp');
  if (!n || !p) return toast('Completa nombre y precio');
  TF.push({ id: ++nid, n, p });
  toast('Tarifa añadida');
  R();
}
// El técnico envía el presupuesto; si falta stock, avisa y no lo genera
function sendQ() {
  const o = gO(modal.o);
  if (o.wait) return toast('Espera a que el administrador reponga el stock');
  if (!modal.L.length && !modal.P.length) return toast('Agrega mano de obra o repuestos');
  const lack = modal.P.filter(x => I.find(i => i.id == x.id).q < x.q);
  if (lack.length) {
    const it = I.find(i => i.id == lack[0].id);
    o.wait = it.id;
    lg(o, 'Sin stock: se consulta el repuesto ' + it.n);
    note(
      1,
      '🚨 Falta stock de ' +
        lack.map(x => x.q + '× ' + I.find(i => i.id == x.id).n).join(', ') +
        ' para ' +
        o.m +
        '. Realiza un pedido: el técnico no puede generar el presupuesto hasta tener stock.'
    );
    note(
      o.c,
      '⏳ Estamos consultando el repuesto (' +
        it.n +
        ') de tu equipo ' +
        o.m +
        ' con un proveedor externo. Habrá una pequeña espera, gracias por tu paciencia.'
    );
    modal = null;
    toast('Sin stock: se avisó al administrador y al cliente');
    return R();
  }
  const lab = modal.L.map(id => TF.find(l => l.id == id)),
    parts = modal.P.map(x => {
      const it = I.find(i => i.id == x.id);
      return { id: it.id, n: it.n, q: x.q, p: it.pv, r: 0 };
    }),
    sub = qTot(modal),
    iva = Math.round(sub * IVA) / 100,
    a = sub + iva;
  o.q = {
    sub,
    iva,
    rate: IVA,
    amt: a,
    desc: v('qt'),
    s: 'pend',
    L: lab.map(l => ({ n: l.n, p: l.p })),
    P: parts
  };
  reserve(o);
  lg(o, 'Presupuesto enviado: ' + m$(a));
  note(o.c, '📝 Presupuesto para ' + o.m + ': ' + m$(a) + '. Revísalo y acepta o rechaza.');
  note(1, '📝 ' + me.n + ' envió un presupuesto de ' + m$(a) + ' para ' + o.m);
  modal = null;
  toast('Presupuesto enviado al cliente');
  R();
}
// El cliente acepta o rechaza el presupuesto
function ansQ(id, ok) {
  const o = gO(id);
  o.q.s = ok ? 'ok' : 'no';
  lg(o, ok ? 'Presupuesto aceptado' : 'Presupuesto rechazado');
  if (!ok) {
    (o.q.P || []).forEach(x => {
      if (x.r) {
        I.find(i => i.id == x.id).q += x.q;
        x.r = 0;
      }
    });
    o.wait = null;
  }
  if (ok && o.st < 2) o.st = 2;
  const m =
    un(o.c) +
    (ok ? ' ACEPTÓ' : ' RECHAZÓ') +
    ' el presupuesto de ' +
    o.m +
    ' (' +
    m$(o.q.amt) +
    ')';
  if (o.t) note(o.t, (ok ? '✅ ' : '❌ ') + m + (ok ? '. Procede a reparar el equipo.' : ''));
  note(1, (ok ? '✅ ' : '❌ ') + m);
  note(
    o.c,
    ok
      ? 'Presupuesto aceptado. Iniciamos la reparación 🔧'
      : 'Presupuesto rechazado. El técnico te contactará.'
  );
  R();
}
