// Panel del técnico.

function tech() {
  const mine = O.filter(o => o.t == me.id).sort(
    (a, b) =>
      ['Normal', 'Alta', 'Urgente'].indexOf(b.pr || 'Normal') -
      ['Normal', 'Alta', 'Urgente'].indexOf(a.pr || 'Normal')
  );
  return `
    <div class="g2 text-white rounded-3xl p-6">
      <h2 class="text-2xl font-extrabold">Panel técnico · ${me.n}</h2>
      <p>${mine.filter(o => o.st < 4).length} activas · ${mine.filter(o => o.q && o.q.s == 'pend').length} presupuestos por responder · ${mine.filter(o => o.wait).length} esperando stock</p>
      <div class="mt-2">${chatB('dm:' + me.id, 1, 'Hablar con el administrador')}</div>
    </div>
    <div class="grid md:grid-cols-2 gap-4 mt-5">${mine.length
      ? mine
          .map(
            o =>
              `
                <div class="glass rounded-2xl p-4">
                  ${imgs(o).length
                    ? `
                      <div class="relative cursor-pointer" onclick="zoom('o',${o.id})">
                        <img src="${imgs(o)[0]}" class="w-full h-40 object-cover rounded-xl">
                        <span class="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1">🔍 ${imgs(o).length} foto${imgs(o).length > 1 ? 's' : ''} · ampliar</span>
                      </div>
                    `
                    : '<div class="h-40 rounded-xl bg-white/10 flex items-center justify-center text-5xl">📦</div>'}
                  <div class="flex items-center justify-between mt-3">
                    <b>${SV[o.s][0]} ${SV[o.s][1]}</b>
                    <span>${badge(o)}</span>
                  </div>
                  <div class="text-sm opacity-80 mt-1">
                    Ficha #${o.id} · ${o.m}${o.pr && o.pr != 'Normal' ? ' · ' + o.pr : ''}${o.eta ? ' · entrega ' + o.eta : ''}
                    <br>
                    Cliente: ${un(o.c)}
                    <br>
                    Problema: ${o.d || 'Sin descripción'}
                  </div>
                  ${o.miss
                    ? `
                      <div class="text-sm mt-2 text-orange-500">🔎 Pieza solicitada: ${o.miss.q}× ${o.miss.n}</div>
                    `
                    : ''}${o.q
                      ? `
                        <div class="text-sm mt-2">📝 Presupuesto ${m$(o.q.amt)}: ${{ pend: '⏳ pendiente', ok: '✅ aceptado', no: '❌ rechazado' }[o.q.s]}</div>
                      `
                      : ''}
                  <div class="flex gap-2 mt-3 flex-wrap">${chatB(o.id + ':cli', o.c, 'Cliente')}${waBtn(o)}${chatB(o.id + ':adm', 1, 'Admin')}${btnTL(o)}${!o.wait && o.st >= 1 && o.st < 3
                      ? `
                        <button onclick="modal={k:'miss',o:${o.id}};R()" class="btn glass text-sm">🔎 Pieza no disponible</button>
                      `
                      : ''}${o.wait
                        ? '<span class="text-xs self-center text-orange-500">⏳ Esperando stock del administrador</span>'
                        : o.st == 1 && !(o.q && o.q.s != 'no')
                          ? `
                            <button onclick="modal={k:'quote',o:${o.id},L:[],P:[],d:''};R()" class="btn g4 t text-sm">📝 Presupuesto</button>
                          `
                          : ''}</div>
                  <div class="flex gap-2 mt-3">
                    <select class="inp" onchange="setSt(${o.id},this.value)">${ST.slice(0, 4)
                      .map((s, i) => `<option value="${i}" ${i == o.st ? 'selected' : ''}>${s}</option>`)
                      .join('')}${o.st == 4 ? '<option selected>Entregado</option>' : ''}</select>
                    ${o.st == 3
                        ? o.auth
                          ? `
                            <button onclick="setSt(${o.id},4)" class="btn g3 t whitespace-nowrap">Entregar</button>
                          `
                          : `
                            <span class="text-xs self-center opacity-70">${o.paid ? 'Esperando autorización' : 'Esperando pago'}</span>
                          `
                        : ''}
                  </div>
                </div>
              `
          )
          .join('')
      : '<p class="opacity-60">No tienes actividades asignadas.</p>'}</div>
  `;
}
