// Punto de entrada: dibuja la pantalla según el estado actual y la vuelve a dibujar tras cada cambio.

// Redibuja toda la pantalla y guarda el estado
function R() {
  const a = document.activeElement && document.activeElement.id,
    f = a == 'q' || a == 'cm';
  $('app').innerHTML =
    nav() +
    notesBox() +
    (view == 'home' || !me
      ? landing()
      : `
        <main class="max-w-6xl mx-auto px-4 py-6">${me.r == 'admin' ? admin() : me.r == 'tec' ? tech() : client()}</main>
      `) +
    modalBox();
  if (f) {
    const e = $(a);
    e.focus();
    e.setSelectionRange(e.value.length, e.value.length);
  }
  prev();
  save();
}
// Si la dirección trae ?seg=código, abre el seguimiento de esa orden
try {
  const sp = new URLSearchParams(location.search).get('seg');
  if (sp && gO(+sp)) modal = { k: 'track', o: +sp };
} catch (e) {}
// Primer dibujo al cargar la página
R();
