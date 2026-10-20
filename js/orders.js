// Órdenes de servicio: solicitud del cliente, asignación y cambios de estado.

// El cliente envía una solicitud de servicio
function req() {
  const m = v('qm');
  if (!m) return toast('Ingresa el modelo del equipo');
  const o = {
    id: ++nid,
    c: me.id,
    s: +v('qs'),
    m,
    d: v('qd'),
    st: 0,
    t: null,
    ph: phs[0] || null,
    phs: phs.slice(),
    cr: Date.now(),
    pr: 'Normal',
    h: [{ ts: Date.now(), x: 'Solicitud creada', b: me.n }]
  };
  O.unshift(o);
  phs = [];
  note(1, '🆕 Nuevo servicio de ' + me.n + ': ' + SV[o.s][1] + ' (' + m + ')');
  toast('Solicitud enviada ✔');
  R();
}
// El administrador asigna un técnico a la orden
function assign(id, t) {
  const o = gO(id);
  o.t = t ? +t : null;
  if (t) {
    lg(o, 'Técnico asignado: ' + un(t));
    if (o.st == 0) o.st = 1;
    note(+t, '🔧 Se te asignó: ' + SV[o.s][1] + ' – ' + o.m);
    note(o.c, '👨‍🔧 Un técnico fue asignado a tu equipo ' + o.m);
    toast('Técnico asignado');
  }
  R();
}
// Cambia el estado de una orden y avisa al cliente
function setSt(id, s) {
  const o = gO(id);
  s = +s;
  if (s >= 2 && s < 4 && !(o.q && o.q.s == 'ok')) {
    toast('Se necesita un presupuesto aceptado por el cliente');
    return R();
  }
  o.st = s;
  lg(o, 'Estado: ' + ST[s]);
  if (s == 4) o.dl = Date.now();
  note(
    o.c,
    s == 4
      ? '✅ Tu equipo ' + o.m + ' fue ENTREGADO. ¡Gracias! Califica el servicio en tu panel.'
      : s == 3
        ? '🎉 Tu equipo ' + o.m + ' está LISTO. Ya puedes realizar el pago.'
        : 'Tu equipo ' + o.m + ' ahora está: ' + ST[s]
  );
  if (s == 3) note(1, '📦 Equipo listo: ' + o.m);
  R();
}
// Elimina una orden
function delO(id) {
  O = O.filter(o => o.id != id);
  R();
}
