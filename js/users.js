// Registro e ingreso de usuarios y gestión de personal.

// Inicia sesión con correo y contraseña
function login(e, p) {
  const u = U.find(u => u.e == e.trim() && u.p == p);
  if (!u) return toast('Credenciales incorrectas');
  me = u;
  view = 'app';
  tab = 'dash';
  modal = null;
  q = '';
  notes = false;
  R();
}
// Registra un cliente nuevo y lo deja con la sesión iniciada
function register() {
  const n = v('rn'),
    e = v('re'),
    p = v('rp');
  if (!n || !e || !p) return toast('Completa los campos');
  if (U.some(u => u.e == e)) return toast('Ese correo ya existe');
  const u = { id: ++nid, n, e, p, r: 'cli', t: v('rt') };
  U.push(u);
  note(1, '👤 Nuevo cliente registrado: ' + n);
  me = u;
  view = 'app';
  modal = null;
  toast('¡Registro exitoso! 🎉');
  R();
}
// Elimina un usuario (solo el administrador)
function delU(id) {
  if (!confirm('¿Eliminar usuario?')) return;
  U = U.filter(u => u.id != id);
  O.forEach(o => {
    if (o.t == id) o.t = null;
  });
  O = O.filter(o => o.c != id);
  R();
}
// Registra un técnico nuevo (solo el administrador)
function addTec() {
  const n = v('tn'),
    e = v('te'),
    p = v('tp');
  if (!n || !e || !p) return toast('Completa los campos');
  if (U.some(u => u.e == e)) return toast('Correo en uso');
  U.push({ id: ++nid, n, e, p, r: 'tec' });
  toast('Técnico registrado');
  R();
}
