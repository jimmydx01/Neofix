// Chat entre cliente, técnico y administrador.

// Envía un mensaje del chat
function send() {
  const t = v('cm').trim();
  if (!t) return;
  C.push({ key: modal.key, f: me.id, x: t });
  note(modal.to, '💬 ' + me.n + ': ' + t.slice(0, 50));
  R();
}
