// Pagos, autorización de entrega y comprobante en PDF.

// El cliente paga y se avisa al administrador
function doPay() {
  const o = gO(modal.o);
  o.paid = 1;
  o.pd = Date.now();
  o.pm = pmx;
  lg(o, 'Pago recibido (' + pmx + ') ' + m$(pri(o)));
  note(
    1,
    '💳 Pago realizado: ' +
      un(o.c) +
      ' pagó ' +
      m$(pri(o)) +
      ' (' +
      pmx +
      ') por ' +
      o.m +
      '. Autoriza la entrega al técnico.'
  );
  note(o.c, '✔ Pago confirmado de ' + m$(pri(o)) + ' (' + pmx + ')');
  modal = null;
  toast('¡Pago exitoso! 🎉');
  R();
}
// El administrador autoriza la entrega al técnico
function auth(id) {
  const o = gO(id);
  if (!o.t) return toast('Asigna un técnico primero');
  o.auth = 1;
  lg(o, 'Entrega autorizada');
  note(o.t, '✅ Pago recibido de ' + o.m + '. Puedes marcarlo como Entregado.');
  toast('Técnico notificado');
  R();
}
// Comprobante de pago en PDF
function receipt(id) {
  const o = gO(id);
  try {
    const d = new window.jspdf.jsPDF({ format: [100, 150] }),
      c = t => String(t).replace(/[^\x20-\xFF]/g, '');
    let y = 18;
    const L = (t, b) => {
      d.setFontSize(b ? 14 : 10);
      d.text(c(t), 10, y);
      y += b ? 9 : 7;
    };
    L('NexaLab - Comprobante de pago', 1);
    L('N. ' + o.id + '   Fecha: ' + new Date(o.pd || Date.now()).toLocaleDateString('es'));
    y += 2;
    L('Cliente: ' + un(o.c));
    L('Servicio: ' + SV[o.s][1]);
    L('Equipo: ' + o.m);
    L('Metodo de pago: ' + o.pm);
    y += 2;
    if (o.q && o.q.iva != null) {
      L('Subtotal: ' + m$(o.q.sub));
      L('IVA (' + o.q.rate + '%): ' + m$(o.q.iva));
    }
    L('TOTAL PAGADO: ' + m$(pri(o)), 1);
    L('Gracias por confiar en NexaLab');
    saveFile('comprobante-' + o.id + '.pdf', d.output('blob'));
  } catch (e) {
    toast('No se pudo generar el PDF');
  }
}
