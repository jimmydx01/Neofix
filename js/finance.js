// Finanzas: filtros por fecha, gastos, reportes, CSV, PDF y gráfico mensual.

// Indica si una fecha cae dentro del periodo filtrado
const inR = ts => {
  const a = fd ? new Date(fd + 'T00:00:00').getTime() : 0,
    b = fh ? new Date(fh + 'T23:59:59').getTime() : Infinity;
  return ts >= a && ts <= b;
};
// Ingresos, gastos y pérdidas del periodo filtrado
const per = () => {
  const rp = O.filter(o => o.paid && inR(o.pd)),
    rg = P.filter(p => inR(p.ts)),
    rm = G.filter(x => inR(x.ts)),
    gm = rm.filter(x => x.t == 'Gasto').reduce((a, x) => a + x.m, 0);
  return {
    rp,
    rg,
    rm,
    ri: rp.reduce((a, o) => a + pri(o), 0),
    rv: rp.reduce((a, o) => a + ((o.q && o.q.iva) || 0), 0),
    rgg: rg.reduce((a, p) => a + p.c, 0) + gm,
    rl: rm.filter(x => x.t == 'Pérdida').reduce((a, x) => a + x.m, 0)
  };
};
// Registra un gasto o una pérdida
function addG() {
  const t = v('gt'),
    c = v('gc').trim(),
    m = +v('gm');
  if (!c || !m) return toast('Escribe el concepto y el monto');
  G.unshift({
    id: ++nid,
    t,
    c,
    m,
    ts: v('gf') ? new Date(v('gf') + 'T12:00:00').getTime() : Date.now()
  });
  toast('Registrado');
  R();
}
// Bloque del periodo de reporte en la pestaña Reportes
function repBlock() {
  const r = per();
  return `
    <div class="glass rounded-2xl p-5 mb-4">
      <b>Periodo de reporte</b>
      <div class="grid sm:grid-cols-4 gap-3 mt-3 items-end">
        <label class="text-xs">
          Desde
          <input type="date" value="${fd}" class="inp" onchange="fd=this.value;R()">
        </label>
        <label class="text-xs">
          Hasta
          <input type="date" value="${fh}" class="inp" onchange="fh=this.value;R()">
        </label>
        <button onclick="fd='';fh='';R()" class="btn glass">Limpiar</button>
        <button onclick="csv()" class="btn g3 t">⬇ Exportar Excel (CSV)</button>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">${kpi('💵', 'Cobrado', m$(r.ri), 'g3')}${kpi('🧾', 'IVA incluido', m$(r.rv), 'g2')}${kpi('📦', 'Gastos', m$(r.rgg), 'g4')}${kpi('📉', 'Pérdidas', m$(r.rl), 'g1')}${kpi('📈', 'Resultado', m$(r.ri - r.rv - r.rgg - r.rl), 'g2')}</div>
      ${r.rp
          .slice(0, 8)
          .map(
            o =>
              `
                <div class="flex justify-between text-sm py-2 border-b border-white/10">
                  <span>${new Date(o.pd).toLocaleDateString('es')} · ${o.m} · ${un(o.c)} · ${o.pm}</span>
                  <b>${m$(pri(o))}</b>
                </div>
              `
          )
          .join('') || '<p class="text-sm opacity-60 mt-3">Sin pagos en el periodo</p>'}
    </div>
    <p class="text-xs opacity-70 mb-2">Acumulado general (incluye meses de ejemplo)</p>
  `;
}
// Exporta los movimientos del periodo a CSV (se abre en Excel)
function csv() {
  const r = per(),
    qc = x => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"',
    dt = t => new Date(t).toLocaleDateString('es'),
    rows = [
      [
        'Tipo',
        'Fecha',
        'Orden',
        'Cliente',
        'Servicio',
        'Equipo',
        'Metodo o proveedor',
        'Subtotal',
        'IVA',
        'Total'
      ]
    ];
  r.rp.forEach(o =>
    rows.push([
      'Ingreso',
      dt(o.pd),
      o.id,
      un(o.c),
      SV[o.s][1],
      o.m,
      o.pm,
      o.q && o.q.sub != null ? o.q.sub : pri(o),
      (o.q && o.q.iva) || 0,
      pri(o)
    ])
  );
  r.rg.forEach(g =>
    rows.push(['Gasto', dt(g.ts), '', '', g.it + ' x' + g.qty, g.obs || '', g.sup, '', '', g.c])
  );
  r.rm.forEach(x => rows.push([x.t, dt(x.ts), '', '', x.c, '', '', '', '', x.m]));
  saveFile('reporte-nexalab.csv', '\ufeff' + rows.map(x => x.map(qc).join(',')).join('\n'));
}
// Reporte del administrador en PDF
function pdf() {
  const s = stats(),
    r = per(),
    pe = O.filter(o => o.q && o.q.s == 'pend').length,
    es = O.filter(o => o.wait).length,
    co = O.filter(o => o.q && o.q.s == 'ok' && !o.paid).reduce((a, o) => a + o.q.amt, 0);
  try {
    const d = new window.jspdf.jsPDF();
    let y = 20;
    const c = t => String(t).replace(/[^\x20-\xFF]/g, ''),
      L = (t, b) => {
        if (y > 275) {
          d.addPage();
          y = 20;
        }
        d.setFontSize(b ? 15 : 11);
        d.text(c(t), 15, y);
        y += b ? 10 : 7;
      };
    L('NexaLab - Reporte administrativo', 1);
    L('Fecha: ' + new Date().toLocaleDateString('es'));
    y += 3;
    L(
      'Servicios activos: ' +
        O.filter(o => o.st < 4).length +
        '   Entregados: ' +
        O.filter(o => o.st == 4).length
    );
    L('Presupuestos pendientes: ' + pe + '   Esperando repuesto: ' + es);
    L('Equipos atrasados: ' + O.filter(late).length + '   Por cobrar: ' + m$(co));
    L(
      'Clientes: ' +
        U.filter(u => u.r == 'cli').length +
        '   Tecnicos: ' +
        U.filter(u => u.r == 'tec').length +
        '   Stock bajo: ' +
        lows().length
    );
    L('Ingresos (pagos): ' + m$(s.inc) + '   Gastos (pedidos): ' + m$(s.g));
    y += 3;
    L('Periodo: ' + (fd || 'inicio') + ' a ' + (fh || 'hoy'), 1);
    L(
      'Cobrado: ' +
        m$(r.ri) +
        '   IVA incluido: ' +
        m$(r.rv) +
        '   Gastos: ' +
        m$(r.rgg) +
        '   Perdidas: ' +
        m$(r.rl)
    );
    y += 3;
    L('Ventas por servicio', 1);
    SV.forEach((x, i) => {
      const l = O.filter(o => o.s == i && o.paid);
      L(x[1] + ': ' + l.length + ' servicios = ' + m$(l.reduce((a, o) => a + pri(o), 0)));
    });
    y += 3;
    L('Servicios en curso', 1);
    O.filter(o => o.st < 4).forEach(o => L('#' + o.id + ' ' + o.m + ' - ' + ST[o.st]));
    saveFile('reporte-nexalab.pdf', d.output('blob'));
  } catch (e) {
    toast('No se pudo generar el PDF');
  }
}
// Totales generales de ingresos, gastos y pérdidas
function stats() {
  return {
    inc: O.filter(o => o.paid).reduce((a, o) => a + pri(o), 0),
    g: P.reduce((a, p) => a + p.c, 0) + G.filter(x => x.t == 'Gasto').reduce((a, x) => a + x.m, 0),
    l: G.filter(x => x.t == 'Pérdida').reduce((a, x) => a + x.m, 0)
  };
}
// Gráfico de barras: meses de ejemplo más el mes actual con datos reales
function bars() {
  const n = new Date(),
    sm = ts => {
      const t = new Date(ts);
      return t.getMonth() == n.getMonth() && t.getFullYear() == n.getFullYear();
    },
    cm = {
      m: n.toLocaleDateString('es', { month: 'short' }),
      i: O.filter(o => o.paid && sm(o.pd)).reduce((a, o) => a + pri(o), 0),
      g:
        P.filter(p => sm(p.ts)).reduce((a, p) => a + p.c, 0) +
        G.filter(x => x.t == 'Gasto' && sm(x.ts)).reduce((a, x) => a + x.m, 0),
      l: G.filter(x => x.t == 'Pérdida' && sm(x.ts)).reduce((a, x) => a + x.m, 0)
    },
    d = [...H, cm],
    mx = Math.max(...d.map(x => Math.max(x.i, x.g, x.l)));
  return `
    <div class="flex items-end gap-3 h-48 mt-4">${d
      .map(
        x =>
          `
            <div class="flex-1 flex flex-col items-center">
              <div class="flex items-end gap-1 h-40 w-full justify-center">${[
                ['i', 'bg-emerald-400'],
                ['g', 'bg-amber-400'],
                ['l', 'bg-rose-500']
              ]
                .map(
                  a =>
                    `
                      <div title="${m$(x[a[0]])}" class="${a[1]} w-1/4 rounded-t" style="height:${(x[a[0]] / mx) * 100}%"></div>
                    `
                )
                .join('')}</div>
              <span class="text-xs mt-1 opacity-70">${x.m}</span>
            </div>
          `
      )
      .join('')}</div>
    <div class="flex gap-4 text-xs mt-2 justify-center">
      <span>🟩 Ingresos</span>
      <span>🟨 Gastos</span>
      <span>🟥 Pérdidas</span>
    </div>
  `;
}
