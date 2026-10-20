// Piezas de interfaz reutilizables.

// Rendimiento por técnico y satisfacción de los clientes
function perfBlock() {
  const T = U.filter(u => u.r == 'tec'),
    rt = O.filter(o => o.rt),
    avg = a => (a.length ? (a.reduce((x, o) => x + o.rt.s, 0) / a.length).toFixed(1) : '—');
  return `
    <div class="glass rounded-2xl p-5 mt-5 sc">
      <b>Rendimiento por técnico</b>
      <table class="w-full text-sm mt-3">
        <tr class="text-left opacity-70">
          <th class="py-2">Técnico</th>
          <th>Activos</th>
          <th>Reparados</th>
          <th>Tiempo promedio</th>
          <th>Calificación</th>
        </tr>
        ${T.map(t => {
          const m = O.filter(o => o.t == t.id),
            dn = m.filter(o => o.st == 4),
            tm = dn.filter(o => o.dl && o.cr);
          return `
            <tr class="border-t border-white/10">
              <td class="py-2">${t.n}</td>
              <td>${m.filter(o => o.st < 4).length}</td>
              <td>${dn.length}</td>
              <td>${tm.length ? dur(tm.reduce((a, o) => a + o.dl - o.cr, 0) / tm.length) : '—'}</td>
              <td>${avg(m.filter(o => o.rt))}${m.some(o => o.rt) ? ' ⭐' : ''}</td>
            </tr>
          `;
        }).join('')}
      </table>
    </div>
    <div class="glass rounded-2xl p-5 mt-5">
      <b>Satisfacción del cliente: ${avg(rt)} ${rt.length ? '⭐ (' + rt.length + ' calificaciones)' : ''}</b>
      ${rt
          .slice()
          .sort((a, b) => b.rt.ts - a.rt.ts)
          .slice(0, 5)
          .map(
            o =>
              `
                <div class="text-sm py-2 border-b border-white/10">${'⭐'.repeat(o.rt.s)} · ${o.m} · ${un(o.c)}${o.rt.c ? ' · ' + o.rt.c : ''}</div>
              `
          )
          .join('') || '<p class="text-sm opacity-60 mt-2">Aún sin calificaciones</p>'}
    </div>
  `;
}
// Campo de formulario con icono
const fld = (id, ic, ph, t) =>
  `
    <label class="inp flex items-center gap-2">
      <span>${ic}</span>
      <input id="${id}" type="${t || 'text'}" placeholder="${ph}">
    </label>
  `;
// Etiquetas de estado, prioridad, pago y atraso
const badge = o =>
  `
    <span class="${SC[o.st]} text-white text-xs rounded-full px-2.5 py-1 whitespace-nowrap">${ST[o.st]}</span>
    ${o.wait
      ? ' <span class="bg-orange-500 text-white text-xs rounded-full px-2 py-1">⏳ Consultando repuesto</span>'
      : ''}${o.paid
        ? ' <span class="bg-emerald-600 text-white text-xs rounded-full px-2 py-1">💳 Pagado</span>'
        : ''}${o.pr && o.pr != 'Normal'
            ? `
              <span class="${o.pr == 'Urgente' ? 'bg-rose-600' : 'bg-amber-600'} text-white text-xs rounded-full px-2 py-1">${o.pr}</span>
            `
            : ''}${late(o)
              ? ' <span class="bg-rose-600 text-white text-xs rounded-full px-2 py-1">⏰ Atrasado</span>'
              : ''}
  `;
// Botón que abre un chat
const chatB = (key, to, t) =>
  `
    <button onclick="modal={k:'chat',key:'${key}',to:${to}};R()" class="btn glass text-sm">💬 ${t}</button>
  `;
// Tarjeta de indicador del dashboard
const kpi = (i, t, n, g) =>
  `
    <div class="${g} text-white rounded-2xl p-5 shadow-lg">
      <div class="text-2xl">${i}</div>
      <div class="text-3xl font-extrabold">${n}</div>
      <div class="text-sm opacity-90">${t}</div>
    </div>
  `;
// Botón para descargar el PDF
const pdfB = () => `<button onclick="pdf()" class="btn g1 t">📄 Descargar PDF</button>`;
