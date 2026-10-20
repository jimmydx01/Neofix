// Ventanas emergentes (modales) de toda la aplicación.

// Ventana emergente según el tipo de modal activo
function modalBox() {
  if (!modal) return '';
  const k = modal.k;
  let b = '',
    w = 'max-w-md';
  if (k == 'reg' || k == 'login') {
    w = 'max-w-3xl grid md:grid-cols-2';
    b = authForm(k);
  } else if (k == 'item') {
    const it = I.find(x => x.id == modal.id),
      mi = it.sup.findIndex(z => z.p == Math.min(...it.sup.map(y => y.p)));
    b = `
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold">Reponer: ${it.n}</h3>
        <div class="text-sm opacity-70">Código ${it.code} · stock actual ${it.q}</div>
        <div class="text-sm font-bold">Elige proveedor</div>
        ${it.sup
          .map(
            (z, i) =>
              `
                <label class="glass rounded-xl px-3 py-2 flex justify-between text-sm cursor-pointer">
                  <span>
                    <input type="radio" name="sp" value="${i}" ${i == mi ? 'checked' : ''}>
                    ${z.n}${i == mi ? ' · más barato' : ''}
                  </span>
                  <b>${m$(z.p)}</b>
                </label>
              `
          )
          .join('')}${fld('pq', '', 'Cantidad a ingresar', 'number')}
        <textarea id="po" class="inp" rows="2" placeholder="Observación"></textarea>
        <button onclick="pedido()" class="btn g1 t w-full">Reponer stock</button>
      </div>
    `;
  } else if (k == 'pay') {
    const o = gO(modal.o),
      d = {
        Efectivo: 'Pagarás en el local al retirar tu equipo.',
        Transferencia: 'Banco Demo · Cta. 0000-1234 · NexaLab S.A.',
        PayPal: fld('x1', '🅿️', 'correo@paypal.com'),
        Tarjeta:
          fld('x1', '💳', 'Número de tarjeta') +
          '<div class="grid grid-cols-2 gap-2 mt-2">' +
          fld('x2', '📅', 'MM/AA') +
          fld('x3', '🔑', 'CVV') +
          '</div>'
      };
    b = `
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold">Pagar ${o.m}</h3>
        <div class="text-4xl font-extrabold txt">${m$(pri(o))}</div>
        <div class="grid grid-cols-4 gap-2">${PM.map(
          p =>
            `
              <button onclick="pmx='${p[1]}';R()" class="rounded-xl p-2 text-xs glass ${pmx == p[1] ? 'ring-2 ring-fuchsia-500' : ''}">
                <div class="text-2xl">${p[0]}</div>
                ${p[1]}
              </button>
            `
        ).join('')}</div>
        <div class="text-sm opacity-80">${d[pmx]}</div>
        <button onclick="doPay()" class="btn g3 t w-full py-3">Pagar con ${pmx}</button>
      </div>
    `;
  } else if (k == 'prices') {
    const s = SV[modal.s];
    b = `
      <div class="p-6 space-y-3 max-h-[85vh] overflow-y-auto">
        <div class="text-4xl">${s[0]}</div>
        <h3 class="text-xl font-extrabold">${s[1]}</h3>
        <div class="flex justify-between glass rounded-xl px-3 py-2">
          <span>Precio base del servicio</span>
          <b>${m$(s[2])}</b>
        </div>
        <div class="text-sm font-bold">Tarifas base</div>
        ${TF.map(
          l =>
            `
              <div class="flex justify-between text-sm glass rounded-xl px-3 py-2">
                <span>${l.n}</span>
                <b>${m$(l.p)}</b>
              </div>
            `
        ).join('')}
        <p class="text-xs opacity-70">Los repuestos se cotizan en el diagnóstico. Precios referenciales.</p>
        ${me
          ? `
            <button onclick="modal=null;view='app';R()" class="btn g1 t w-full py-3">Ir a mi panel</button>
          `
          : `
            <button onclick="modal={k:'reg'};R()" class="btn g1 t w-full py-3">Registrarme y solicitar</button>
          `}
      </div>
    `;
  } else if (k == 'img') {
    w = 'max-w-3xl';
    b = `
      <div class="p-3">
        <img src="${modal.l[modal.i]}" class="w-full max-h-[75vh] object-contain rounded-xl">
        <div class="flex gap-2 mt-3 justify-center flex-wrap">${modal.l
          .map(
            (x, i) =>
              `
                <img src="${x}" onclick="modal.i=${i};R()" class="h-14 w-14 object-cover rounded-lg cursor-pointer ${i == modal.i ? 'ring-2 ring-fuchsia-500' : ''}">
              `
          )
          .join('')}</div>
      </div>
    `;
  } else if (k == 'rate') {
    const o = gO(modal.o);
    b = `
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold">Califica el servicio · ${o.m}</h3>
        <div class="flex gap-1 text-4xl justify-center">${[1, 2, 3, 4, 5]
          .map(
            n =>
              `
                <button onclick="modal.d=v('rc');modal.s=${n};R()" class="${n <= (modal.s || 0) ? '' : 'opacity-30'}">⭐</button>
              `
          )
          .join('')}</div>
        <textarea id="rc" class="inp" rows="3" placeholder="Cuéntanos tu experiencia (opcional)">${modal.d || ''}</textarea>
        <button onclick="rateSave()" class="btn g4 t w-full">Enviar calificación</button>
      </div>
    `;
  } else if (k == 'tl') {
    const o = gO(modal.o),
      h = o.h && o.h.length ? o.h : [{ ts: o.cr || Date.now(), x: 'Solicitud creada', b: un(o.c) }];
    b = `
      <div class="p-6 space-y-3 max-h-[85vh] overflow-y-auto">
        <h3 class="text-xl font-bold">Historial · ${o.m}</h3>
        <div class="text-sm opacity-70">
          Código de seguimiento:
          <b>NL-${o.id}</b>
        </div>
        <div class="space-y-3 border-l-2 border-fuchsia-500 pl-4">${h
          .slice()
          .reverse()
          .map(
            e =>
              `
                <div>
                  <div class="text-sm font-semibold">${e.x}</div>
                  <div class="text-xs opacity-70">${new Date(e.ts).toLocaleString('es')} · ${e.b}</div>
                </div>
              `
          )
          .join('')}</div>
        <button onclick="ficha(${o.id})" class="btn g1 t w-full">🖨 Ficha PDF con QR</button>
      </div>
    `;
  } else if (k == 'track') {
    const o = gO(modal.o),
      h = o.h && o.h.length ? o.h : [{ ts: o.cr || Date.now(), x: 'Solicitud creada' }];
    b = `
      <div class="p-6 space-y-3 max-h-[85vh] overflow-y-auto">
        <div class="text-sm opacity-70">Seguimiento NL-${o.id}</div>
        <h3 class="text-xl font-extrabold">${SV[o.s][0]} ${SV[o.s][1]}</h3>
        <div class="text-sm">${o.m}${o.eta ? ' · entrega estimada ' + o.eta : ''}</div>
        <div>${badge(o)}</div>
        <div class="flex gap-1">${ST.map(
          (_, i) => `
            <div class="h-1.5 flex-1 rounded ${i <= o.st ? 'g1' : 'bg-white/20'}"></div>
          `
        ).join('')}</div>
        <div class="space-y-3 border-l-2 border-fuchsia-500 pl-4">${h
          .slice()
          .reverse()
          .map(
            e =>
              `
                <div>
                  <div class="text-sm font-semibold">${e.x}</div>
                  <div class="text-xs opacity-70">${new Date(e.ts).toLocaleString('es')}</div>
                </div>
              `
          )
          .join('')}</div>
      </div>
    `;
  } else if (k == 'plan') {
    const o = gO(modal.o);
    b = `
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold">Plan de entrega · ${o.m}</h3>
        <label class="text-xs block">
          Prioridad
          <select id="pr" class="inp">${['Normal', 'Alta', 'Urgente']
            .map(x => `<option ${o.pr == x ? 'selected' : ''}>${x}</option>`)
            .join('')}</select>
        </label>
        <label class="text-xs block">
          Fecha estimada de entrega
          <input id="pe" type="date" value="${o.eta || ''}" class="inp">
        </label>
        <button onclick="planSave()" class="btn g1 t w-full">Guardar</button>
      </div>
    `;
  } else if (k == 'miss') {
    const o = gO(modal.o);
    b = `
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold">🔎 Pieza no disponible · ${o.m}</h3>
        <p class="text-sm opacity-70">Indica qué pieza falta. Se avisa al administrador para que la pida y al cliente que se está buscando.</p>
        <input id="mn" list="il" class="inp" placeholder="¿Qué pieza falta?">
        <datalist id="il">${I.map(x => `<option value="${x.n}">`).join('')}</datalist>
        <input id="mq" type="number" min="1" value="1" class="inp" placeholder="Cantidad">
        <textarea id="mo" class="inp" rows="2" placeholder="Observación (modelo, especificaciones)"></textarea>
        <button onclick="missSend()" class="btn g1 t w-full">Enviar al administrador</button>
      </div>
    `;
  } else if (k == 'quote') {
    const o = gO(modal.o),
      tot = qTot(modal);
    b = `
      <div class="p-6 space-y-3 max-h-[85vh] overflow-y-auto">
        <h3 class="text-xl font-bold">📝 Presupuesto · ${o.m}</h3>
        <div class="text-sm font-bold">Mano de obra y servicios</div>
        ${TF.map(
          l =>
            `
              <label class="flex justify-between text-sm glass rounded-xl px-3 py-2 cursor-pointer">
                <span>
                  <input type="checkbox" ${modal.L.includes(l.id) ? 'checked' : ''} onchange="qL(${l.id})">
                  ${l.n}
                </span>
                <b>${m$(l.p)}</b>
              </label>
            `
        ).join('')}
        <div class="text-sm font-bold">Repuestos del inventario</div>
        <div class="flex gap-2">
          <select id="qi" class="inp">${I.map(
            x => `
              <option value="${x.id}">${x.n} · ${x.code} · ${m$(x.pv)} (stock ${x.q})</option>
            `
          ).join('')}</select>
          <input id="qn" type="number" min="1" value="1" class="inp" style="width:5rem">
          <button onclick="qP()" class="btn g3 t">+</button>
        </div>
        ${modal.P.map((x, i) => {
          const it = I.find(z => z.id == x.id);
          return `
            <div class="flex justify-between text-sm glass rounded-xl px-3 py-2">
              <span>${x.q}× ${it.n}${it.q < x.q ? ' <b class="text-rose-500">(sin stock)</b>' : ''}</span>
              <span>
                ${m$(x.q * it.pv)}
                <button onclick="qX(${i})" class="text-rose-500">✕</button>
              </span>
            </div>
          `;
        }).join('')}${lackQ(modal)
          ? '<div class="text-sm rounded-xl p-2 bg-rose-500/20 text-rose-500">Sin stock: no se genera el presupuesto; se avisa al cliente y al administrador.</div>'
          : ''}
        <textarea id="qt" class="inp" rows="2" placeholder="Diagnóstico / observaciones">${modal.d || ''}</textarea>
        <div class="flex justify-between text-sm opacity-80">
          <span>Servicios</span>
          <span>${m$(qSv(modal))}</span>
        </div>
        <div class="flex justify-between text-sm opacity-80">
          <span>Repuestos del inventario</span>
          <span>${m$(tot - qSv(modal))}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${m$(tot)}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>IVA (${IVA}%)</span>
          <span>${m$((tot * IVA) / 100)}</span>
        </div>
        <div class="flex justify-between text-lg font-extrabold">
          <span>Total</span>
          <span class="txt">${m$(tot * (1 + IVA / 100))}</span>
        </div>
        <button onclick="sendQ()" class="btn g4 t w-full">${lackQ(modal) ? 'Avisar falta de stock' : 'Enviar al cliente'}</button>
      </div>
    `;
  } else if (k == 'chat') {
    const ms = C.filter(x => (x.key || x.o + ':' + x.ch) == modal.key);
    b = `
      <div class="p-5 space-y-3">
        <h3 class="font-bold">💬 Chat con ${un(modal.to)}</h3>
        <div class="h-56 overflow-y-auto space-y-2">${ms
            .map(
              x =>
                `
                  <div class="${x.f == me.id ? 'text-right' : ''}">
                    <span class="inline-block rounded-2xl px-3 py-1.5 text-sm ${x.f == me.id ? 'g2 text-white' : 'glass'}">
                      <b class="text-xs opacity-70">${un(x.f)}</b>
                      <br>
                      ${x.x}
                    </span>
                  </div>
                `
            )
            .join('') || '<p class="text-sm opacity-60">Sin mensajes</p>'}</div>
        <div class="flex gap-2">
          <input id="cm" class="inp" placeholder="Escribe un mensaje…" onkeydown="if(event.key=='Enter')send()">
          <button onclick="send()" class="btn g1 t">➤</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onclick="if(event.target==this){modal=null;phs=[];R()}">
      <div class="rounded-3xl overflow-hidden shadow-2xl w-full ${w}" style="background:var(--mo);border:1px solid var(--bd)">${b}</div>
    </div>
  `;
}
