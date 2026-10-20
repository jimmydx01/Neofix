// Notificaciones: cada usuario solo ve las suyas.

// Cantidad de notificaciones sin leer del usuario
const bell = () => N.filter(n => n.to == me.id && !n.r).length;
// Abre o cierra el panel de notificaciones
function toggleN() {
  notes = !notes;
  if (!notes) N.forEach(n => n.to == me.id && (n.r = 1));
  R();
}
