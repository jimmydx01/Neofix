// Pantallas públicas: barra superior, página de inicio y formularios de acceso.

// Barra superior
function nav() {
  const l = document.documentElement.dataset.theme == 'light';
  return `
    <nav class="sticky top-0 z-40 glass">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <a href="#" onclick="view='home';R()" class="text-xl font-extrabold">
          <span class="txt">NexaLab</span>
        </a>
        <div class="flex items-center gap-2 text-sm">
          <button onclick="theme()" class="btn glass" title="Día / Noche">${l ? '🌙' : '☀️'}</button>
          ${me
            ? `
              <button onclick="toggleN()" class="relative btn glass">🔔${bell()
                ? `
                  <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5">${bell()}</span>
                `
                : ''}</button>
              <button onclick="view='app';R()" class="btn glass hidden sm:block">${me.n}</button>
              <button onclick="me=null;view='home';notes=false;R()" class="btn glass">Salir</button>
            `
            : `
              <a href="#servicios" class="hidden sm:block px-2">Servicios</a>
              <a href="#seguimiento" class="hidden sm:block px-2">Seguimiento</a>
              <button onclick="modal={k:'login'};R()" class="btn glass">Ingresar</button>
              <button onclick="modal={k:'reg'};R()" class="btn g1 t">Registro</button>
            `}
        </div>
      </div>
    </nav>
  `;
}
// Panel de notificaciones del usuario
function notesBox() {
  if (!me || !notes) return '';
  const l = N.filter(n => n.to == me.id);
  return `
    <div class="max-w-6xl mx-auto px-4 mt-4">
      <div class="glass rounded-2xl p-4">
        <b>🔔 Mis notificaciones</b>
        ${l.length
          ? l
              .slice(0, 10)
              .map(
                n =>
                  `
                    <div class="text-sm py-1.5 border-b border-white/10 ${n.r ? 'opacity-60' : 'font-semibold'}">
                      ${n.text}
                      <span class="text-slate-400 text-xs">${n.t}</span>
                    </div>
                  `
              )
              .join('')
          : '<p class="text-sm text-slate-400">Sin notificaciones</p>'}
      </div>
    </div>
  `;
}
// Página de inicio
function landing() {
  return `
    <header class="landing-hero">
      <div class="relative max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div class="relative z-10">
          <span class="section-kicker">Reparación tecnológica, sin vueltas</span>
          <h1 class="text-4xl md:text-6xl font-extrabold mt-4 leading-tight tracking-tight">
            Tu equipo en buenas manos.
            <span class="txt">Tu día, en marcha.</span>
          </h1>
          <p class="mt-5 opacity-80 text-lg max-w-xl">Diagnóstico transparente, presupuesto antes de reparar y seguimiento de cada paso. Cuidamos tus equipos para que vuelvas a lo importante.</p>
          <div class="mt-8 flex gap-3 flex-wrap">
            <button onclick="modal={k:'reg'};R()" class="btn g1 t text-base md:text-lg px-6 py-3">Solicitar una reparación <span aria-hidden="true">→</span></button>
            <a href="#servicios" class="btn glass px-6 py-3 text-base md:text-lg">Explorar servicios</a>
          </div>
          <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-80">
            <span>✓ Presupuesto aprobado por ti</span><span>✓ Seguimiento digital</span>
          </div>
        </div>
        <div class="hero-photo-wrap">
          <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=90" alt="Especialista trabajando en un equipo electrónico" class="hero-photo w-full" />
          <div class="hero-note p-4">
            <div class="flex items-center gap-3">
              <span class="g3 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl">✓</span>
              <div><b class="block">Todo bajo control</b><span class="text-sm opacity-70">Estado y avances en un solo lugar</span></div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-3">${[
      ["Diagnóstico claro", "Sabes qué necesita tu equipo"],
      ["Tú decides", "Reparamos con tu autorización"],
      ["Siempre al tanto", "Consulta el avance cuando quieras"],
    ]
      .map(
        (a, i) =>
          `
            <div class="glass rounded-2xl p-5 flex items-center gap-4">
              <span class="g${i + 1} text-white w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-bold">${String(i + 1).padStart(2, '0')}</span>
              <div><div class="font-extrabold">${a[0]}</div><div class="text-sm opacity-70">${a[1]}</div></div>
            </div>
          `,
      )
      .join("")}</section>
    <section id="seguimiento" class="max-w-6xl mx-auto px-4 pt-14 pb-2">
      <div class="glass rounded-3xl p-6 flex flex-col sm:flex-row gap-3 items-center">
        <div class="flex-1">
          <h3 class="text-xl font-extrabold">Consulta el estado de tu equipo</h3>
          <p class="text-sm opacity-70">Ingresa tu código de seguimiento (ej. NL-101). No necesitas iniciar sesión.</p>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          ${fld("tc", "", "Código")}
          <button onclick="track()" class="btn g2 t">Consultar</button>
        </div>
      </div>
    </section>
    <section id="servicios" class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center max-w-2xl mx-auto">
        <span class="section-kicker">Lo que hacemos</span>
        <h2 class="text-3xl md:text-4xl font-extrabold mt-2">Soluciones para tus <span class="txt">dispositivos</span></h2>
        <p class="opacity-70 mt-3">Un equipo preparado para reparar, optimizar y alargar la vida de tu tecnología.</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">${SV.map(
        (s, i) =>
          `
            <div onclick="modal={k:'prices',s:${i}};R()" class="service-card glass rounded-2xl overflow-hidden cursor-pointer">
              <div class="aspect-[3/2] w-full overflow-hidden">
                <img src="${s[3]}" alt="${s[1]}" class="w-full h-full object-cover object-center" />
              </div>
              <div class="p-6">
                <h3 class="font-bold text-lg">${s[1]}</h3>
                <p class="text-sm opacity-70 mt-1">Revisión profesional y opciones claras para tu equipo.</p>
                <p class="text-sm font-bold mt-3 txt">Consultar servicio y precio →</p>
              </div>
            </div>
          `,
      ).join("")}</div>
    </section>
    <section class="max-w-6xl mx-auto px-4 pb-16 pt-4 grid md:grid-cols-3 gap-5">${[
      ["1", "Regístrate", "Crea tu cuenta en segundos"],
      ["2", "Cuéntanos tu equipo", "Servicio, modelo y fotos"],
      ["3", "Paga y recoge", "Te avisamos en cada paso"],
    ]
      .map(
        (a, i) =>
          `
            <div class="glass rounded-2xl p-6">
              <div class="g${i + 1} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">${a[0]}</div>
              <h3 class="font-bold mt-3">${a[1]}</h3>
              <p class="text-sm opacity-70">${a[2]}</p>
            </div>
          `,
      )
      .join("")}</section>
    <footer class="max-w-6xl mx-auto px-4 pb-8 pt-5 border-t border-black/10 flex items-center justify-between gap-3 text-sm opacity-70">
      <span class="flex items-center gap-2"><img src="img/nexalab-mark.svg" alt="" class="brand-mark" /> <b>NexaLab</b></span>
      <span>Reparación confiable. Tecnología en marcha.</span>
    </footer>
  `;
}
// Formulario de registro o ingreso
function authForm(k) {
  const r = k == 'reg';
  return `
    <div class="hidden md:flex g1 text-white p-8 flex-col justify-center">
      <img src="img/nexalab-mark.svg" alt="" class="brand-mark fl" />
      <h3 class="text-3xl font-extrabold mt-4">${r ? 'Únete a NexaLab' : '¡Qué bueno verte!'}</h3>
      <p class="mt-2 opacity-90">${r
        ? 'Registra tus equipos, sigue su reparación y paga en línea.'
        : 'Gestiona tus servicios, notificaciones y pagos.'}</p>
    </div>
    <div class="p-8 space-y-3">
      <h3 class="text-2xl font-extrabold txt">${r ? 'Crear cuenta' : 'Ingresar'}</h3>
      ${r
        ? fld('rn', '👤', 'Nombre completo') +
          fld('re', '✉️', 'Correo', 'email') +
          fld('rt', '📞', 'Teléfono') +
          fld('rp', '🔒', 'Contraseña', 'password') +
          '<button onclick="register()" class="btn g1 t w-full py-3">Registrarme</button>'
        : fld('le', '✉️', 'Correo') +
          fld('lp', '🔒', 'Contraseña', 'password') +
          `
            <button onclick="login(v('le'),v('lp'))" class="btn g1 t w-full py-3">Entrar</button>
            <p class="text-xs opacity-70 text-center">Acceso demo (clave 1234)</p>
            <div class="grid grid-cols-3 gap-2 text-sm">
              <button class="btn g2 t" onclick="login('admin@demo.com','1234')">Admin</button>
              <button class="btn g3 t" onclick="login('tecnico@demo.com','1234')">Técnico</button>
              <button class="btn g4 t" onclick="login('cliente@demo.com','1234')">Cliente</button>
            </div>
          `}
    </div>
  `;
}
