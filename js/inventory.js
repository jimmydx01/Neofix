// Inventario: reposición con proveedores, piezas faltantes y productos nuevos.

// Descuenta del stock los repuestos de un presupuesto
function reserve(o) {
  o.wait = null;
  o.q.P.forEach(x => {
    if (x.r) return;
    const it = I.find(i => i.id == x.id);
    if (it.q >= x.q) {
      it.q -= x.q;
      x.r = 1;
      if (it.q <= it.min) note(1, '⚠️ Stock bajo: ' + it.n + ' (' + it.q + ' uds.)');
    } else if (!o.wait) {
      o.wait = it.id;
      note(1, '🚨 Falta ' + x.q + '× ' + it.n + ' para ' + o.m + '. Realiza un pedido.');
      note(
        o.c,
        '⏳ Tu equipo ' +
          o.m +
          ' tardará más: el repuesto (' +
          it.n +
          ') se solicita a otra sucursal.'
      );
    }
  });
}
// Repone stock con el proveedor elegido y registra el gasto
function pedido() {
  const it = I.find(x => x.id == modal.id),
    qty = +v('pq') || 0,
    s = it.sup[+(document.querySelector('input[name=sp]:checked') || { value: 0 }).value];
  if (qty < 1) return toast('Ingresa la cantidad');
  it.q += qty;
  it.pc = s.p;
  P.unshift({
    it: it.n,
    qty,
    c: qty * s.p,
    sup: s.n,
    obs: v('po'),
    d: new Date().toLocaleDateString('es'),
    ts: Date.now()
  });
  O.filter(o => o.wait == it.id).forEach(o => {
    o.wait = null;
    lg(o, 'Llegó el repuesto: ' + it.n);
    if (o.t) note(o.t, '📦 Llegó ' + it.n + ' para ' + o.m + '. Ya puedes generar el presupuesto.');
    note(
      o.c,
      '✅ Ya contamos con el repuesto de tu equipo ' +
        o.m +
        '. El técnico preparará tu presupuesto.'
    );
  });
  checkMiss();
  modal = null;
  toast('Stock actualizado');
  R();
}
// Busca un producto por id o por un nombre parecido
const findIt = m =>
  I.find(x => x.id == m.it) ||
  I.find(x => {
    const a = x.n.toLowerCase(),
      b = m.n.toLowerCase();
    return a.includes(b) || b.includes(a);
  });
// El técnico reporta una pieza que no está disponible
function missSend() {
  const o = gO(modal.o),
    n = v('mn').trim(),
    q = +v('mq') || 1;
  if (!n) return toast('Indica qué pieza falta');
  const it = findIt({ n });
  if (it && it.q >= q) return toast('Esa pieza sí está en inventario: agrégala al presupuesto');
  o.miss = { n, q, it: it ? it.id : null, obs: v('mo') };
  o.wait = 'm';
  lg(o, 'Pieza no disponible: ' + n);
  note(
    1,
    '🔎 ' +
      me.n +
      ' reporta pieza faltante para ' +
      o.m +
      ': ' +
      q +
      '× ' +
      n +
      (o.miss.obs ? ' (' + o.miss.obs + ')' : '') +
      '. Realiza el pedido y súbela al inventario.'
  );
  note(
    o.c,
    '⏳ Estamos buscando la pieza (' +
      n +
      ') de tu equipo ' +
      o.m +
      '. Habrá una pequeña espera, gracias por tu paciencia.'
  );
  modal = null;
  toast('Se avisó al administrador y al cliente');
  R();
}
// El administrador atiende una pieza solicitada
function missAct(id) {
  const o = gO(id),
    it = findIt(o.miss);
  tab = 'inv';
  if (it) {
    modal = { k: 'item', id: it.id };
    R();
  } else {
    R();
    $('in').value = o.miss.n;
    $('iq').value = o.miss.q;
    $('in').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
// Revisa si ya llegó una pieza reportada y avisa al técnico y al cliente
function checkMiss() {
  O.filter(o => o.miss && o.wait).forEach(o => {
    const it = findIt(o.miss);
    if (it && it.q >= o.miss.q) {
      o.wait = null;
      const n = o.miss.n;
      lg(o, 'Llegó la pieza: ' + n);
      delete o.miss;
      if (o.t)
        note(
          o.t,
          '📦 Ya tenemos la pieza (' + n + ') para ' + o.m + '. Ya puedes generar el presupuesto.'
        );
      note(
        o.c,
        '✅ Ya conseguimos la pieza de tu equipo ' + o.m + '. El técnico preparará tu presupuesto.'
      );
    }
  });
}
// Crea un producto nuevo en el inventario
function addItem() {
  const n = v('in'),
    code = v('ic'),
    br = v('ib');
  if (!n || !code) return toast('Nombre y código son obligatorios');
  if (I.some(x => x.code == code && x.br == br && x.n == n))
    return toast('Ese producto ya existe: usa Reponer stock');
  const sup = [0, 1, 2].map(i => ({
    n: v('sn' + i) || 'Proveedor ' + (i + 1),
    p: +v('pp' + i) || 0
  }));
  I.push({
    id: ++nid,
    n,
    code,
    br,
    pv: +v('iv') || 0,
    pc: Math.min(...sup.map(s => s.p)),
    q: +v('iq') || 0,
    min: +v('im') || 0,
    img: phs[0] || null,
    imgs: phs.slice(),
    sup
  });
  phs = [];
  checkMiss();
  toast('Producto añadido');
  R();
}
