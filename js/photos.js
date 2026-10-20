// Fotos de los equipos: carga, reducción de tamaño y vista ampliada.

// Lista de fotos de una orden
const imgs = o => (o.phs && o.phs.length ? o.phs : o.ph ? [o.ph] : []);
// Miniatura de la orden; al hacer clic se amplía
const thumbO = o => {
  const l = imgs(o);
  return l.length
    ? `
      <div class="relative cursor-pointer" onclick="zoom('o',${o.id})">
        <img src="${l[0]}" class="h-10 w-10 rounded-lg object-cover">
        ${l.length > 1
            ? `
              <span class="absolute -bottom-1 -right-1 bg-fuchsia-600 text-white text-[10px] rounded-full px-1">${l.length}</span>
            `
            : ''}
      </div>
    `
    : '<span class="opacity-40">—</span>';
};
// Vista previa de las fotos antes de enviarlas
function prev() {
  const e = $('pv');
  if (e)
    e.innerHTML = phs
      .map(x => `<img src="${x}" class="h-16 w-16 object-cover rounded-lg">`)
      .join('');
}
// Abre las fotos en grande
function zoom(k, id) {
  const l =
    k == 'o'
      ? imgs(gO(id))
      : (() => {
          const x = I.find(z => z.id == id);
          return (x.imgs && x.imgs.length ? x.imgs : [x.img]).filter(Boolean);
        })();
  if (l.length) {
    modal = { k: 'img', l, i: 0 };
    R();
  }
}
// Lee las fotos elegidas y las reduce de tamaño
function pic(inp) {
  [...inp.files].forEach(f => {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 640 / Math.max(im.width, im.height)),
          c = document.createElement('canvas');
        c.width = im.width * k;
        c.height = im.height * k;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        phs.push(c.toDataURL('image/jpeg', 0.7));
        prev();
      };
      im.src = r.result;
    };
    r.readAsDataURL(f);
  });
}
