// Panel del cliente.

function client() {
  const mine = O.filter(o => o.c == me.id);
  return `
    <div class="g1 text-white rounded-3xl p-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-extrabold">Hola, ${me.n} 👋</h2>
        <p class="opacity-90">${mine.filter(o => o.st < 4).length} equipos en proceso · ${mine.filter(o => o.q && o.q.s == 'pend').length} presupuestos por responder · ${mine.filter(o => o.st == 3 && !o.paid).length} por pagar</p>
      </div>
      <div class="text-5xl">🧑‍💻</div>
    </div>
    <div class="grid lg:grid-cols-5 gap-5 mt-5">
      <div class="glass rounded-2xl p-5 lg:col-span-2 space-y-3">
        <h3 class="font-bold text-lg">✨ Solicitar servicio</h3>
        <select id="qs" class="inp">${SV.map((s, i) => `<option value="${i}">${s[0]} ${s[1]}</option>`).join('')}</select>
        ${fld('qm', '🖥️', 'Modelo del equipo')}
        <textarea id="qd" class="inp" rows="3" placeholder="Describe el problema"></textarea>
        <label class="block text-sm">
          📷 Fotos del equipo (puedes subir varias)
          <input type="file" accept="image/*" multiple onchange="pic(this)" class="block mt-1">
        </label>
        <div id="pv" class="flex gap-2 flex-wrap"></div>
        <button onclick="req()" class="btn g1 t w-full">Enviar solicitud</button>
      </div>
      <div class="lg:col-span-3 space-y-3">
        <h3 class="font-bold text-lg">Mis equipos</h3>
        ${mine.length
          ? mine
              .map(
                o =>
                  `
                    <div class="glass rounded-2xl p-4">
                      <div class="flex items-center gap-3">
                        ${thumbO(o)}
                        <div class="flex-1">
                          <b>${SV[o.s][1]}</b>
                          <div class="text-sm opacity-70">${o.m} · #${o.id}${o.eta ? ' · 📅 entrega ' + o.eta : ''}</div>
                        </div>
                        <div class="text-right">${badge(o)}</div>
                      </div>
                      <div class="flex gap-1 mt-3">${ST.map(
                        (_, i) => `
                          <div class="h-1.5 flex-1 rounded ${i <= o.st ? 'g1' : 'bg-white/20'}"></div>
                        `
                      ).join('')}</div>
                      ${o.q && o.q.s == 'pend'
                          ? `
                            <div class="mt-3 rounded-xl p-3 g4 text-white">
                              <b>📝 Presupuesto: ${m$(o.q.amt)}</b>
                              <div class="text-sm">${(o.q.L || [])
                                .map(l => `
                                  <div class="flex justify-between">
                                    <span>${l.n}</span>
                                    <span>${m$(l.p)}</span>
                                  </div>
                                `)
                                .join('')}${(o.q.P || [])
                                  .map(
                                    x =>
                                      `
                                        <div class="flex justify-between">
                                          <span>${x.q}× ${x.n}</span>
                                          <span>${m$(x.q * x.p)}</span>
                                        </div>
                                      `
                                  )
                                  .join('')}${o.q.iva != null
                                      ? `
                                        <div class="flex justify-between border-t border-white/40 mt-1 pt-1">
                                          <span>Subtotal</span>
                                          <span>${m$(o.q.sub)}</span>
                                        </div>
                                        <div class="flex justify-between">
                                          <span>IVA (${o.q.rate}%)</span>
                                          <span>${m$(o.q.iva)}</span>
                                        </div>
                                      `
                                      : ''}${o.q.desc || ''}</div>
                              <div class="flex gap-2 mt-2">
                                <button onclick="ansQ(${o.id},1)" class="btn g3 t text-sm">✔ Aceptar</button>
                                <button onclick="ansQ(${o.id},0)" class="btn g1 t text-sm">✖ Rechazar</button>
                              </div>
                            </div>
                          `
                          : o.q && o.q.s == 'no'
                            ? '<div class="text-sm mt-2 text-rose-500">Presupuesto rechazado</div>'
                            : ''}
                      <div class="flex gap-2 mt-3 flex-wrap">${o.st == 3 && !o.paid
                          ? `
                            <button onclick="modal={k:'pay',o:${o.id}};R()" class="btn g3 t">💳 Realizar pago ${m$(pri(o))}</button>
                          `
                          : ''}${o.paid && o.pm
                              ? `
                                <span class="text-sm self-center text-emerald-500">Pagado con ${o.pm}</span>
                              `
                              : ''}${o.paid
                                ? `
                                  <button onclick="receipt(${o.id})" class="btn glass text-sm">🧾 Comprobante PDF</button>
                                `
                                : ''}${o.st == 4 && !o.rt
                                    ? `
                                      <button onclick="modal={k:'rate',o:${o.id},s:0,d:''};R()" class="btn g4 t text-sm">⭐ Calificar</button>
                                    `
                                    : ''}${o.rt ? `<span class="text-sm self-center">${'⭐'.repeat(o.rt.s)}</span>` : ''}${btnTL(o)}${o.t ? chatB(o.id + ':cli', o.t, 'Técnico') : ''}${chatB('dm:' + me.id, 1, 'Administrador')}</div>
                    </div>
                  `
              )
              .join('')
          : '<p class="opacity-60">Aún no tienes solicitudes.</p>'}
      </div>
    </div>
  `;
}
