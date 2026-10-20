// Panel del administrador: dashboard, servicios, personal, clientes, inventario, tarifas, gastos y reportes.

// Panel del administrador
function admin() {
  const T = [
    ['dash', '📊 Dashboard', 'g1'],
    ['srv', '🛠️ Servicios', 'g2'],
    ['per', '👥 Personal', 'g3'],
    ['cli', '🧑 Clientes', 'g4'],
    ['inv', '📦 Inventario', 'g1'],
    ['tar', '💲 Tarifas', 'g4'],
    ['gas', '💸 Gastos', 'g1'],
    ['rep', '💰 Reportes', 'g2']
  ];
  const s = stats(),
    act = O.filter(o => o.st < 4),
    ql = q.toLowerCase(),
    pe = O.filter(o => o.q && o.q.s == 'pend').length,
    es = O.filter(o => o.wait).length,
    co = O.filter(o => o.q && o.q.s == 'ok' && !o.paid).reduce((a, o) => a + o.q.amt, 0);
  let b = '';
  if (tab == 'dash')
    b = `
      <div class="flex justify-end mb-3">${pdfB()}</div>
      ${lateBanner()}
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">${kpi('🛠️', 'Servicios activos', act.length, 'g1')}${kpi('📝', 'Presupuestos pendientes', pe, 'g4')}${kpi('⏳', 'Esperando repuesto', es, 'g1')}${kpi('🧑', 'Clientes', U.filter(u => u.r == 'cli').length, 'g2')}${kpi('👨‍🔧', 'Técnicos', U.filter(u => u.r == 'tec').length, 'g3')}${kpi('✅', 'Entregados', O.length - act.length, 'g4')}${kpi('💳', 'Pagos recibidos', m$(s.inc), 'g3')}${kpi('🧾', 'Por cobrar', m$(co), 'g2')}${kpi('⚠️', 'Stock bajo', lows().length, 'g1')}</div>
      <div class="glass rounded-2xl p-5 mt-5">
        <b>Ingresos vs gastos vs pérdidas</b>
        ${bars()}
      </div>
      <div class="glass rounded-2xl p-5 mt-5">
        <b>Servicios en curso</b>
        ${act
            .map(
              o =>
                `
                  <div class="flex justify-between text-sm py-2 border-b border-white/10">
                    <span>${SV[o.s][0]} ${o.m} · ${un(o.c)}</span>
                    <span>${badge(o)}</span>
                  </div>
                `
            )
            .join('') || '<p class="opacity-60 text-sm">Nada activo</p>'}
      </div>
      ${perfBlock()}
    `;
  if (tab == 'srv')
    b = `
      <input id="q" class="inp mb-3" placeholder="🔍 Buscar servicio, cliente o equipo" value="${q}" oninput="q=this.value;R()">
      <div class="sc">
        <table class="w-full text-sm glass rounded-2xl">
          <tr class="text-left opacity-70">
            <th class="p-3">#</th>
            <th>Foto</th>
            <th>Servicio</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Técnico</th>
            <th></th>
          </tr>
          ${O.filter(o => (SV[o.s][1] + o.m + un(o.c)).toLowerCase().includes(ql))
            .map(
              o =>
                `
                  <tr class="border-t border-white/10">
                    <td class="p-3">${o.id}</td>
                    <td>${thumbO(o)}</td>
                    <td>
                      ${SV[o.s][1]}
                      <br>
                      <span class="opacity-70">${o.m}</span>
                    </td>
                    <td>${un(o.c)}</td>
                    <td>${badge(o)}</td>
                    <td>
                      <select class="inp" onchange="assign(${o.id},this.value)">
                        <option value="">Sin asignar</option>
                        ${U.filter(u => u.r == 'tec')
                          .map(t => `
                            <option value="${t.id}" ${o.t == t.id ? 'selected' : ''}>${t.n}</option>
                          `)
                          .join('')}
                      </select>
                    </td>
                    <td class="whitespace-nowrap">
                      ${chatB('dm:' + o.c, o.c, 'Cliente')}${waBtn(o)}${o.t ? chatB(o.id + ':adm', o.t, 'Técnico') : ''}
                      <button onclick="modal={k:'plan',o:${o.id}};R()" class="btn glass text-xs">📅 Plan</button>
                      ${btnTL(o).replace('text-sm', 'text-xs')}${o.paid && !o.auth
                          ? `
                            <button onclick="auth(${o.id})" class="btn g3 t text-xs">Autorizar entrega</button>
                          `
                          : ''}
                      <button onclick="delO(${o.id})" class="text-rose-500">🗑️</button>
                    </td>
                  </tr>
                `
            )
            .join('')}
        </table>
      </div>
    `;
  if (tab == 'per')
    b = `
      <div class="glass rounded-2xl p-5 grid sm:grid-cols-4 gap-3 items-end">
        ${fld('tn', '👤', 'Nombre')}${fld('te', '✉️', 'Correo')}${fld('tp', '🔒', 'Contraseña')}
        <button onclick="addTec()" class="btn g3 t">+ Registrar técnico</button>
      </div>
      <input id="q" class="inp my-3" placeholder="🔍 Buscar personal" value="${q}" oninput="q=this.value;R()">
      ${U.filter(u => u.r == 'tec' && (u.n + u.e).toLowerCase().includes(ql))
        .map(
          u =>
            `
              <div class="glass rounded-2xl p-4 mb-2 flex justify-between items-center">
                <div>
                  👨‍🔧
                  <b>${u.n}</b>
                  <span class="opacity-70 text-sm">${u.e} · ${O.filter(o => o.t == u.id && o.st < 4).length} activos</span>
                </div>
                <div class="flex gap-2 items-center">
                  ${chatB('dm:' + u.id, u.id, 'Contactar')}
                  <button onclick="delU(${u.id})" class="text-rose-500">Eliminar</button>
                </div>
              </div>
            `
        )
        .join('')}
    `;
  if (tab == 'cli')
    b = `
      <input id="q" class="inp mb-3" placeholder="🔍 Buscar cliente" value="${q}" oninput="q=this.value;R()">
      ${U.filter(u => u.r == 'cli' && (u.n + u.e).toLowerCase().includes(ql))
        .map(
          u =>
            `
              <div class="glass rounded-2xl p-4 mb-2 flex justify-between items-center">
                <div>
                  🧑
                  <b>${u.n}</b>
                  <span class="opacity-70 text-sm">${u.e} ${u.t || ''} · ${O.filter(o => o.c == u.id).length} servicios</span>
                </div>
                <div class="flex gap-2 items-center">
                  ${chatB('dm:' + u.id, u.id, 'Contactar')}
                  <button onclick="delU(${u.id})" class="text-rose-500">Eliminar</button>
                </div>
              </div>
            `
        )
        .join('')}
    `;
  if (tab == 'inv')
    b = `
      ${O.some(o => o.miss)
        ? `
          <div class="glass rounded-2xl p-4 mb-4 ring-2 ring-orange-500">
            <b>Piezas solicitadas por técnicos</b>
            ${O.filter(o => o.miss)
              .map(
                o =>
                  `
                    <div class="flex justify-between items-center text-sm py-2 border-b border-white/10 gap-2">
                      <span>
                        ${o.miss.q}×
                        <b>${o.miss.n}</b>
                        · ${o.m} · ${un(o.t)}${o.miss.obs ? ' · ' + o.miss.obs : ''}
                      </span>
                      <button onclick="missAct(${o.id})" class="btn g1 t text-xs">${findIt(o.miss) ? 'Pedir' : 'Añadir al inventario'}</button>
                    </div>
                  `
              )
              .join('')}
          </div>
        `
        : ''}
      <div class="glass rounded-2xl p-5 mb-4">
        <b>Nuevo producto, marca o proveedor</b>
        <p class="text-xs opacity-70 mb-3">Para reponer un producto existente usa «Reponer stock» en su tarjeta.</p>
        <div class="grid sm:grid-cols-3 gap-3">${fld('in', '', 'Nombre')}${fld('ic', '', 'Código')}${fld('ib', '', 'Marca')}${fld('iv', '', 'Costo de venta ($)', 'number')}${fld('iq', '', 'Stock inicial', 'number')}${fld('im', '', 'Stock mínimo', 'number')}</div>
        <div class="grid sm:grid-cols-3 gap-3 mt-3">${[0, 1, 2]
          .map(
            i =>
              `
                <div class="grid grid-cols-2 gap-2">${fld('sn' + i, '', 'Proveedor ' + (i + 1))}${fld('pp' + i, '', 'Precio', 'number')}</div>
              `
          )
          .join('')}</div>
        <div class="flex items-center gap-3 mt-3 flex-wrap">
          <label class="text-sm">
            Foto del producto
            <input type="file" accept="image/*" multiple onchange="pic(this)" class="block mt-1">
          </label>
          <div id="pv" class="flex gap-2 flex-wrap"></div>
          <button onclick="addItem()" class="btn g3 t ml-auto">+ Añadir producto</button>
        </div>
      </div>
      ${lows().length
        ? `
          <div class="bg-rose-500/20 border border-rose-500/60 rounded-2xl p-4 mb-4">⚠️ Stock bajo: ${lows()
            .map(x => x.n)
            .join(', ')}</div>
        `
        : ''}
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${I.map(
        x =>
          `
            <div class="glass rounded-2xl p-4 ${x.q <= x.min ? 'ring-2 ring-rose-500' : ''}">
              ${x.img
                ? `
                  <img src="${x.img}" onclick="zoom('p',${x.id})" class="w-full h-28 object-cover rounded-xl cursor-pointer">
                `
                : '<div class="w-full h-28 rounded-xl bg-white/10 flex items-center justify-center text-xs opacity-60">Sin foto</div>'}
              <b class="block mt-2">${x.n}</b>
              <div class="text-xs opacity-70">Código ${x.code}${x.br ? ' · ' + x.br : ''}</div>
              <div class="text-sm mt-1">
                Venta:
                <b>${m$(x.pv)}</b>
                · Pedido:
                <b>${m$(x.pc)}</b>
              </div>
              <div class="text-sm ${x.q <= x.min ? 'text-rose-500' : 'opacity-70'}">Stock: ${x.q} (mín. ${x.min})</div>
              <button onclick="modal={k:'item',id:${x.id}};R()" class="btn g1 t w-full mt-3 text-sm">Reponer stock</button>
            </div>
          `
      ).join('')}</div>
      <h3 class="font-bold mt-6 mb-2">Pedidos realizados</h3>
      ${P.map(
          p =>
            `
              <div class="glass rounded-2xl p-3 mb-2 flex items-center gap-3 text-sm">
                <span class="flex-1">${p.it} ×${p.qty} · ${p.sup || '—'}${p.obs ? ' · ' + p.obs : ''}</span>
                <b>${m$(p.c)}</b>
                <span class="opacity-60">${p.d}</span>
              </div>
            `
        ).join('') || '<p class="opacity-60 text-sm">Aún sin pedidos</p>'}
    `;
  if (tab == 'tar')
    b = `
      <div class="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
        <span class="flex-1">Impuesto (IVA) %</span>
        <input type="number" value="${IVA}" class="inp" style="width:6rem" onchange="IVA=+this.value||0;R()">
      </div>
      <div class="glass rounded-2xl p-5 grid sm:grid-cols-3 gap-3 items-end">
        ${fld('tfn', '', 'Servicio (ej. Limpieza de equipo)')}${fld('tfp', '', 'Precio ($)', 'number')}
        <button onclick="addTF()" class="btn g3 t">+ Añadir tarifa</button>
      </div>
      <div class="mt-4 space-y-2">${TF.map(
        l =>
          `
            <div class="glass rounded-2xl p-3 flex items-center gap-3">
              <span class="flex-1">${l.n}</span>
              <input type="number" value="${l.p}" class="inp" style="width:6rem" onchange="TF.find(x=>x.id==${l.id}).p=+this.value;R()">
              <button onclick="TF=TF.filter(x=>x.id!=${l.id});R()" class="text-rose-500">Eliminar</button>
            </div>
          `
      ).join('')}</div>
    `;
  if (tab == 'gas') {
    const gt = G.filter(x => x.t == 'Gasto').reduce((a, x) => a + x.m, 0),
      pt = G.filter(x => x.t == 'Pérdida').reduce((a, x) => a + x.m, 0);
    b = `
      <div class="glass rounded-2xl p-5 grid sm:grid-cols-5 gap-3 items-end">
        <select id="gt" class="inp">
          <option>Gasto</option>
          <option>Pérdida</option>
        </select>
        ${fld('gc', '', 'Concepto (ej. garantía, equipo dañado)')}${fld('gm', '', 'Monto ($)', 'number')}
        <input id="gf" type="date" class="inp">
        <button onclick="addG()" class="btn g3 t">+ Registrar</button>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">${kpi('🧾', 'Otros gastos', m$(gt), 'g4')}${kpi('📉', 'Pérdidas', m$(pt), 'g1')}</div>
      <div class="mt-4 space-y-2">${G.map(
          x =>
            `
              <div class="glass rounded-2xl p-3 flex items-center gap-3 text-sm">
                <span class="${x.t == 'Pérdida' ? 'bg-rose-600' : 'bg-amber-600'} text-white text-xs rounded-full px-2 py-1">${x.t}</span>
                <span class="flex-1">${x.c}</span>
                <span class="opacity-60">${new Date(x.ts).toLocaleDateString('es')}</span>
                <b>${m$(x.m)}</b>
                <button onclick="G=G.filter(z=>z.id!=${x.id});R()" class="text-rose-500">Eliminar</button>
              </div>
            `
        ).join('') ||
        '<p class="opacity-60 text-sm">Aún sin registros. Los pedidos de inventario ya cuentan solos como gasto.</p>'}</div>
    `;
  }
  if (tab == 'rep') {
    const hi = H.reduce((a, x) => a + x.i, 0) + s.inc,
      hg = H.reduce((a, x) => a + x.g, 0) + s.g,
      hl = H.reduce((a, x) => a + x.l, 0) + s.l;
    b = `
      <div class="flex justify-end mb-3">${pdfB()}</div>
      ${repBlock()}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${kpi('💵', 'Ingresos', m$(hi), 'g3')}${kpi('🧾', 'Gastos', m$(hg), 'g4')}${kpi('📉', 'Pérdidas', m$(hl), 'g1')}${kpi('📈', 'Utilidad neta', m$(hi - hg - hl), 'g2')}</div>
      <div class="glass rounded-2xl p-5 mt-5">
        <b>Ventas por servicio (pagados)</b>
        ${SV.map((x, i) => {
          const l = O.filter(o => o.s == i && o.paid);
          return `
            <div class="flex justify-between text-sm py-2 border-b border-white/10">
              <span>${x[0]} ${x[1]}</span>
              <span>
                ${l.length} servicios =
                <b>${m$(l.reduce((a, o) => a + pri(o), 0))}</b>
              </span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="glass rounded-2xl p-5 mt-5">
        <b>Evolución mensual</b>
        ${bars()}
      </div>
    `;
  }
  return `
    <div class="g2 text-white rounded-3xl p-6 mb-4 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-extrabold">Panel de administración</h2>
        <p class="opacity-90">Control total de servicios, personal, inventario y finanzas</p>
      </div>
      <div class="text-5xl">📊</div>
    </div>
    <div class="flex gap-2 overflow-x-auto pb-3">${T.map(
      t =>
        `
          <button onclick="tab='${t[0]}';q='';R()" class="btn whitespace-nowrap ${tab == t[0] ? t[2] + ' t shadow-lg' : 'glass'}">${t[1]}</button>
        `
    ).join('')}</div>
    ${b}
  `;
}
