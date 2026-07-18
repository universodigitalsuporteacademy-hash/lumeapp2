/* Lumé Premium — landing sections (self-contained) */

/* ── Idioma (ES/EN) — se lee una vez; el toggle recarga la página ── */
const LANG_KEY = "lume_lang";
function getLang() { try { return localStorage.getItem(LANG_KEY) || "es"; } catch { return "es"; } }
function setLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch {} window.location.reload(); }
const CUR_LANG = getLang();

const WEEKS_ES = [
{ w: 6,  tri: 0, fruit: "una lenteja",         cm: 0.5,  g: 0,    note: "Su corazón empieza a latir, aún del tamaño de una semilla." },
{ w: 8,  tri: 0, fruit: "una frambuesa",       cm: 1.6,  g: 1,    note: "Se forman los esbozos de brazos y piernas; los rasgos se definen." },
{ w: 10, tri: 0, fruit: "una fresa",           cm: 3.1,  g: 4,    note: "Ya tiene uñas diminutas y puede mover las articulaciones." },
{ w: 12, tri: 0, fruit: "una ciruela",         cm: 5.4,  g: 14,   note: "Sus reflejos despiertan; pronto abrirá y cerrará los dedos." },
{ w: 14, tri: 0, fruit: "un limón",           cm: 8.7,  g: 43,   note: "Su cuerpecito se estira: las piernas son ya más largas que los brazos." },
{ w: 16, tri: 1, fruit: "un aguacate",         cm: 11.6, g: 100,  note: "Empieza a oír sonidos y tu voz se vuelve familiar para él." },
{ w: 20, tri: 1, fruit: "un plátano",          cm: 25,   g: 300,  note: "Ecuador del embarazo: quizá sientas sus primeros movimientos." },
{ w: 24, tri: 1, fruit: "una mazorca de maíz", cm: 30,   g: 600,  note: "Sus pulmones desarrollan vasos; cejas y pestañas ya son visibles." },
{ w: 28, tri: 2, fruit: "una berenjena",       cm: 37,   g: 1000, note: "Abre los ojos y distingue la luz que entra por tu vientre." },
{ w: 32, tri: 2, fruit: "un coco",             cm: 42,   g: 1700, note: "Practica la respiración y gana grasa para regular su temperatura." },
{ w: 36, tri: 2, fruit: "una lechuga romana",  cm: 47,   g: 2600, note: "Se coloca cabeza abajo, preparándose para el encuentro." },
{ w: 40, tri: 2, fruit: "una sandía pequeña", cm: 51,   g: 3400, note: "A término: cada día es ahora una pequeña eternidad de espera." }];

const WEEKS_EN = [
{ w: 6,  tri: 0, fruit: "a lentil",         cm: 0.5,  g: 0,    note: "Her heart starts beating, still the size of a seed." },
{ w: 8,  tri: 0, fruit: "a raspberry",      cm: 1.6,  g: 1,    note: "Arm and leg buds are forming; features are taking shape." },
{ w: 10, tri: 0, fruit: "a strawberry",     cm: 3.1,  g: 4,    note: "Tiny nails are forming and joints can already move." },
{ w: 12, tri: 0, fruit: "a plum",           cm: 5.4,  g: 14,   note: "Reflexes are waking up; soon fingers will open and close." },
{ w: 14, tri: 0, fruit: "a lemon",          cm: 8.7,  g: 43,   note: "Her little body stretches out: legs are now longer than arms." },
{ w: 16, tri: 1, fruit: "an avocado",       cm: 11.6, g: 100,  note: "She starts hearing sounds, and your voice becomes familiar." },
{ w: 20, tri: 1, fruit: "a banana",         cm: 25,   g: 300,  note: "Halfway there: you may feel her first movements." },
{ w: 24, tri: 1, fruit: "an ear of corn",   cm: 30,   g: 600,  note: "Her lungs develop blood vessels; eyebrows and lashes are visible." },
{ w: 28, tri: 2, fruit: "an eggplant",      cm: 37,   g: 1000, note: "She opens her eyes and can sense light through your belly." },
{ w: 32, tri: 2, fruit: "a coconut",        cm: 42,   g: 1700, note: "She practices breathing and gains fat to regulate her temperature." },
{ w: 36, tri: 2, fruit: "a romaine lettuce",cm: 47,   g: 2600, note: "She turns head-down, getting ready to meet you." },
{ w: 40, tri: 2, fruit: "a small watermelon", cm: 51, g: 3400, note: "Full term: every day now feels like a small eternity of waiting." }];
const WEEKS = CUR_LANG === "en" ? WEEKS_EN : WEEKS_ES;

const TRI_LABELS = CUR_LANG === "en"
  ? ["First trimester", "Second trimester", "Third trimester"]
  : ["Primer trimestre", "Segundo trimestre", "Tercer trimestre"];
const TRI_SHORT = CUR_LANG === "en" ? ["1st", "2nd", "3rd"] : ["1.er", "2.º", "3.er"];

/* ── Textos traducibles ── */
const TR_ES = {
  topbar_strong: "Lumé Bienestar", topbar_rest: "· 7 días gratis para nuevas mamás", topbar_cta: "Ver planes →",
  nav_producto: "Producto", nav_semana: "Semana a semana", nav_expertos: "Respaldo médico", nav_precios: "Precios",
  nav_login: "Iniciar sesión", nav_cta: "Empezar gratis",
  hero_secondary_cta: "Conocer el producto", hero_early_access: "Acceso anticipado",
  hero_based: "Basada", hero_based_rest: "en guías médicas de referencia",
  hero_slider_hint: "Pruébalo · mueve la semana", hero_baby_like: "Tu bebé es como", week_label: "Semana", tri_suffix: "trim.",
  hero_eyebrow: "Tu viaje, iluminado", hero_title: "El embarazo, <em>acompañado</em> como mereces.",
  hero_sub: "La guía semana a semana más completa en español: inteligencia con calidez, basada en guías médicas de referencia.", hero_cta: "Empezar gratis",
  trust_label: "Todo lo que Lumé acompaña, semana a semana",
  vp_eyebrow: "Qué incluye", vp_h2: "Vive tu embarazo<br />con todo Lumé.", vp_lead: "Acompañamiento completo, semana a semana, con la tecnología más avanzada.",
  sh1_num: "01 — Asistente IA", sh1_h2: "Respuestas claras cuando más las necesitas.",
  sh1_p: "Pregunta lo que sea —médico o emocional— y recibe una respuesta serena y fundamentada, a las 3 de la mañana o entre dos reuniones.",
  sh1_li1: "Basado en guías clínicas actualizadas", sh1_li2: "Detecta señales de alerta y te orienta", sh1_li3: "Recuerda tu semana y tu historial",
  sh1_tag_b: "Respuesta en segundos", sh1_tag_s: "siempre con tacto humano",
  sh2_num: "02 — Semana a semana", sh2_h2: "Mira crecer a tu bebé, semana tras semana.",
  sh2_p: "Desarrollo verificado, cambios en tu cuerpo y hábitos de bienestar, con comparaciones de tamaño que te sacarán una sonrisa.",
  sh2_li1: "Hitos del desarrollo por trimestre", sh2_li2: "Qué esperar y cómo cuidarte",
  sh3_num: "03 — Nutrición", sh3_h2: "Comer bien, sin complicarte.",
  sh3_p: "Recetas y nutrientes clave según tu trimestre y tus síntomas. Menos dudas, más energía para las dos.",
  sh3_li1: "Planes adaptados a náuseas, acidez o anemia", sh3_li2: "Lista de la compra automática",
  sh3_tag_b: "+200 recetas", sh3_tag_s: "por trimestre y síntoma",
  wk_size_label: "Tamaño del bebé", wk_como: "Como",
  exp_eyebrow: "Fuentes y rigor", exp_h2: "Construido sobre guías médicas de referencia.",
  exp_p: "El contenido de Lumé se elabora contrastando guías clínicas públicas de organismos de referencia en salud materna. Porque en el embarazo, la confianza no se improvisa.",
  exp_committee: "Comité en formación · 2026", exp_join: "¿Eres profesional de la salud? Únete al comité asesor →",
  exp_stat1: "del contenido contrastado con guías clínicas de referencia", exp_stat2: "comité clínico asesor en formación — con verificación colegiada",
  exp_stat3: "asistente IA disponible a cualquier hora, sin esperas", exp_stat4: "datos cifrados, privados y nunca cedidos a terceros",
  tst_eyebrow: "Mamás Lumé", tst_h2: "Cuidadas de verdad.", tst_lead: "Así queremos que lo viva cada mamá.",
  tst_note: "Historias ilustrativas. Pronto, los testimonios reales de nuestras primeras usuarias.",
  desc_eyebrow: "Descárgala", desc_h2: "Lumé en tu bolsillo,<br/><em>desde el primer día.</em>",
  desc_p: "Disponible pronto en App Store y Google Play. Únete ahora y sé de las primeras en acceder — 7 días completos de Bienestar sin tarjeta.",
  desc_soon: "Próximamente", desc_appstore: "App Store", desc_googleplay: "Google Play",
  desc_pill1_n: "Pronto", desc_pill1_l: "App Store & Play", desc_pill2_n: "7 días", desc_pill2_l: "Prueba gratis", desc_pill3_n: "Sin tarjeta", desc_pill3_l: "Cancela cuando quieras",
  desc_tag1_t: "Sin tarjeta", desc_tag1_s: "7 días gratis", desc_tag2_t: "Ejercicios prenatales", desc_tag2_s: "seguros en cada trimestre",
  pricing_eyebrow: "Planes", pricing_h2: "Elige cómo vivirlo.", pricing_lead: "Empieza gratis. Mejora cuando quieras. Cancela en cualquier momento.",
  bill_monthly: "Mensual", bill_annual: "Anual", bill_save: "ahorra hasta 37%", per_month: "/mes", billed: "Facturado", per_year: "/año", saves: "ahorras", free_label: "Gratis",
  pricing_disclaimer: "Bienestar mensual incluye 7 días de prueba gratis · Sin tarjeta de crédito · Cancela cuando quieras",
  faq_eyebrow: "Dudas frecuentes", faq_h2: "Lo que toda mamá pregunta.", faq_lead: "Respuestas directas, sin rodeos.",
  final_badge: "✦ Acceso anticipado · Beta 2026", final_badge2: "· 7 días gratis",
  final_h2: "Tu embarazo merece<br /><em>esta calma.</em>",
  final_p: "Lumé te acompaña semana a semana con contenido clínico, herramientas de seguimiento y un asistente que no duerme.",
  final_quote_meta: "· Beta Lumé",
  final_items: ["Tracker semanal del bebé","Asistente IA 24/7","Seguimiento de síntomas","Plan nutricional","Control de citas","Sistema de recompensas"],
  final_cta1: "Empezar gratis — 7 días", final_cta2: "Ver planes", final_note: "Sin tarjeta de crédito · cancela cuando quieras · datos protegidos RGPD",
  footer_tagline: "Tu compañera de maternidad consciente.", footer_tagline2: "Semana a semana, con calma y ciencia.",
  footer_col_producto: "Producto", footer_caracteristicas: "Características", footer_seguimiento: "Seguimiento semanal", footer_precios: "Precios", footer_faq: "Preguntas frecuentes",
  footer_col_compania: "Compañía", footer_fuentes: "Fuentes y rigor", footer_profesional: "¿Eres profesional? Únete →", footer_contacto: "Contacto",
  footer_col_legal: "Legal", footer_privacidad: "Privacidad", footer_terminos: "Términos de uso", footer_cookies: "Cookies",
  footer_copyright: "© 2026 Lumé · Hecho con cuidado, semana a semana.",
  cookie_text: "Usamos cookies esenciales y de analítica para mejorar tu experiencia. Consulta nuestra", cookie_link: "Política de privacidad",
  cookie_reject: "Solo esenciales", cookie_accept: "Aceptar todo",
  login_tab_login: "Iniciar sesión", login_tab_registro: "Crear cuenta",
  label_nombre: "Nombre", label_email: "Correo electrónico", label_pass: "Contraseña",
  ph_nombre: "Tu nombre", ph_email: "tu@correo.com", ph_pass: "Mínimo 8 caracteres",
  btn_loading: "Cargando…", btn_login: "Entrar a Lumé", btn_registro: "Crear mi cuenta gratis",
  or_continue: "O continúa con", google_btn: "Google",
  no_account: "¿No tienes cuenta?", create_free: "Crear cuenta gratis", forgot_pass: "¿Olvidaste tu contraseña?",
  terms_pre: "Al registrarte aceptas nuestros", terms_link: "Términos", terms_and: "y", privacy_link: "Privacidad",
  welcome_title: "¡Bienvenida a Lumé!", welcome_sub: "Tu cuenta está lista. Empieza tu viaje.", open_app: "Abrir la app →",
  stripe_title: "Completa tu suscripción", stripe_sub: "Pago seguro con Stripe. Dentro del recuadro puedes elegir facturación mensual o anual.",
  stripe_note: "¿No ves el botón de pago o no redirige? Prueba en tu sitio ya publicado — esta vista previa de diseño bloquea el redireccionamiento de Stripe.", stripe_loading: "Cargando pago seguro…",
};
const TR_EN = {
  topbar_strong: "Lumé Wellness", topbar_rest: "· 7 days free for new moms", topbar_cta: "See plans →",
  nav_producto: "Product", nav_semana: "Week by week", nav_expertos: "Medical backing", nav_precios: "Pricing",
  nav_login: "Log in", nav_cta: "Start free",
  hero_secondary_cta: "See the product", hero_early_access: "Early access",
  hero_based: "Based", hero_based_rest: "on reference medical guidelines",
  hero_slider_hint: "Try it · move the week", hero_baby_like: "Your baby is like", week_label: "Week", tri_suffix: "tri.",
  hero_eyebrow: "Your journey, illuminated", hero_title: "Pregnancy, <em>accompanied</em> the way you deserve.",
  hero_sub: "The most complete week-by-week guide: intelligence with warmth, based on reference medical guidelines.", hero_cta: "Start free",
  trust_label: "Everything Lumé supports, week by week",
  vp_eyebrow: "What's included", vp_h2: "Live your pregnancy<br />with all of Lumé.", vp_lead: "Complete companionship, week by week, with the most advanced technology.",
  sh1_num: "01 — AI Assistant", sh1_h2: "Clear answers exactly when you need them.",
  sh1_p: "Ask anything —medical or emotional— and get a calm, well-founded answer, at 3am or between two meetings.",
  sh1_li1: "Based on up-to-date clinical guidelines", sh1_li2: "Detects warning signs and guides you", sh1_li3: "Remembers your week and your history",
  sh1_tag_b: "Answers in seconds", sh1_tag_s: "always with a human touch",
  sh2_num: "02 — Week by week", sh2_h2: "Watch your baby grow, week after week.",
  sh2_p: "Verified development, body changes and wellness habits, with size comparisons that will make you smile.",
  sh2_li1: "Developmental milestones by trimester", sh2_li2: "What to expect and how to take care of yourself",
  sh3_num: "03 — Nutrition", sh3_h2: "Eat well, without the hassle.",
  sh3_p: "Recipes and key nutrients based on your trimester and symptoms. Fewer doubts, more energy for both of you.",
  sh3_li1: "Plans adapted to nausea, heartburn or anemia", sh3_li2: "Automatic shopping list",
  sh3_tag_b: "+200 recipes", sh3_tag_s: "by trimester and symptom",
  wk_size_label: "Baby's size", wk_como: "Like",
  exp_eyebrow: "Sources & rigor", exp_h2: "Built on reference medical guidelines.",
  exp_p: "Lumé's content is developed by cross-checking public clinical guidelines from leading maternal health organizations. Because in pregnancy, trust isn't improvised.",
  exp_committee: "Committee forming · 2026", exp_join: "Healthcare professional? Join our advisory board →",
  exp_stat1: "of content cross-checked against reference clinical guidelines", exp_stat2: "clinical advisory committee forming — with peer verification",
  exp_stat3: "AI assistant available anytime, no waiting", exp_stat4: "encrypted, private data, never sold to third parties",
  tst_eyebrow: "Lumé moms", tst_h2: "Truly cared for.", tst_lead: "This is how we want every mom to experience it.",
  tst_note: "Illustrative stories. Real testimonials from our first users, coming soon.",
  desc_eyebrow: "Download it", desc_h2: "Lumé in your pocket,<br/><em>from day one.</em>",
  desc_p: "Coming soon to the App Store and Google Play. Join now and be among the first to access it — 7 full days of Wellness, no card required.",
  desc_soon: "Coming soon", desc_appstore: "App Store", desc_googleplay: "Google Play",
  desc_pill1_n: "Soon", desc_pill1_l: "App Store & Play", desc_pill2_n: "7 days", desc_pill2_l: "Free trial", desc_pill3_n: "No card", desc_pill3_l: "Cancel anytime",
  desc_tag1_t: "No card", desc_tag1_s: "7 days free", desc_tag2_t: "Prenatal exercises", desc_tag2_s: "safe for every trimester",
  pricing_eyebrow: "Plans", pricing_h2: "Choose how to live it.", pricing_lead: "Start free. Upgrade whenever you want. Cancel anytime.",
  bill_monthly: "Monthly", bill_annual: "Annual", bill_save: "save up to 37%", per_month: "/mo", billed: "Billed", per_year: "/yr", saves: "you save", free_label: "Free",
  pricing_disclaimer: "Monthly Wellness includes a 7-day free trial · No credit card · Cancel anytime",
  faq_eyebrow: "FAQ", faq_h2: "What every mom asks.", faq_lead: "Direct answers, no detours.",
  final_badge: "✦ Early access · Beta 2026", final_badge2: "· 7 days free",
  final_h2: "Your pregnancy deserves<br /><em>this calm.</em>",
  final_p: "Lumé supports you week by week with clinical content, tracking tools, and an assistant that never sleeps.",
  final_quote_meta: "· Lumé Beta",
  final_items: ["Weekly baby tracker","24/7 AI assistant","Symptom tracking","Nutrition plan","Appointment tracking","Rewards system"],
  final_cta1: "Start free — 7 days", final_cta2: "See plans", final_note: "No credit card · cancel anytime · GDPR-protected data",
  footer_tagline: "Your mindful maternity companion.", footer_tagline2: "Week by week, with calm and science.",
  footer_col_producto: "Product", footer_caracteristicas: "Features", footer_seguimiento: "Weekly tracking", footer_precios: "Pricing", footer_faq: "FAQ",
  footer_col_compania: "Company", footer_fuentes: "Sources & rigor", footer_profesional: "Healthcare pro? Join →", footer_contacto: "Contact",
  footer_col_legal: "Legal", footer_privacidad: "Privacy", footer_terminos: "Terms of use", footer_cookies: "Cookies",
  footer_copyright: "© 2026 Lumé · Made with care, week by week.",
  cookie_text: "We use essential and analytics cookies to improve your experience. See our", cookie_link: "Privacy policy",
  cookie_reject: "Essential only", cookie_accept: "Accept all",
  login_tab_login: "Log in", login_tab_registro: "Create account",
  label_nombre: "Name", label_email: "Email", label_pass: "Password",
  ph_nombre: "Your name", ph_email: "you@email.com", ph_pass: "At least 8 characters",
  btn_loading: "Loading…", btn_login: "Enter Lumé", btn_registro: "Create my free account",
  or_continue: "Or continue with", google_btn: "Google",
  no_account: "Don't have an account?", create_free: "Create a free account", forgot_pass: "Forgot your password?",
  terms_pre: "By signing up you agree to our", terms_link: "Terms", terms_and: "and", privacy_link: "Privacy",
  welcome_title: "Welcome to Lumé!", welcome_sub: "Your account is ready. Start your journey.", open_app: "Open the app →",
  stripe_title: "Complete your subscription", stripe_sub: "Secure payment with Stripe. Inside the box you can choose monthly or annual billing.",
  stripe_note: "Don't see the payment button, or it won't redirect? Try it on your published site — this design preview blocks Stripe's redirect.", stripe_loading: "Loading secure payment…",
};
const TR = CUR_LANG === "en" ? TR_EN : TR_ES;

function I({ d, fill }) {
  const p = fill ?
  { fill: "currentColor" } :
  { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>{d}</svg>;
}
const ICONS = {
  spark: <path d="M12 3c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4C10.4 7.8 11.4 6.8 12 3Z M18 14c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5Z" />,
  seed: <g><path d="M12 21c0-5 0-9 5-13-1 6-2 9-5 13Z" /><path d="M12 21c0-4-.2-7-4-10 .6 4.6 1.4 7 4 10Z" /></g>,
  leaf: <g><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z" /><path d="M5 19c3.5-4 6.5-6.5 10-8.5" /></g>,
  scan: <g><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M7 12c2-2.4 3.4-3.6 5-3.6S15 9.6 17 12c-2 2.4-3.4 3.6-5 3.6S9 14.4 7 12Z" /><circle cx="12" cy="12" r="1.3" /></g>,
  shield: <g><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></g>,
  check: <path d="M5 12l4.5 4.5L19 7" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  send: <path d="M5 12l15-7-7 15-2-6-6-2Z" />,
  ig: <g><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></g>,
  heart: <path d="M12 20s-7-4.3-7-9.4C5 7.5 7 6 9 6c1.6 0 2.6.9 3 1.8C12.4 6.9 13.4 6 15 6c2 0 4 1.5 4 4.6 0 5.1-7 9.4-7 9.4Z" />,
  split: <g><path d="M10 7l-4 5 4 5" /><path d="M14 7l4 5-4 5" /></g>,
  meditation: <g><circle cx="12" cy="5" r="1.8"/><path d="M7 11c0-2.8 2.2-5 5-5s5 2.2 5 5"/><path d="M5 13c1.5-1 3.5-1.5 7-1.5s5.5.5 7 1.5"/><path d="M8 15c0 3 1.5 5 4 5s4-2 4-5"/></g>,
  book: <g><path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z"/><path d="M16 3v18"/><path d="M8 7h4M8 11h4"/></g>,
  pulse: <polyline points="3,12 7,12 9,5 11,19 13,9 15,15 17,12 21,12"/>,
  exercise: <g><circle cx="12" cy="4" r="2"/><path d="M8 10l4-3 4 3M8 10l-2 8h12l-2-8"/><path d="M10 18v3M14 18v3"/></g>,
  bell: <g><path d="M18 8a6 6 0 1 0-12 0c0 5-3 7-3 7h18s-3-2-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></g>
};

function WaveDivider({ top = 'transparent', bottom = 'transparent', flip = false, height = 56 }) {
  const h = height;
  const m = h / 2;
  const d = `M0,${m} C180,${h} 360,0 540,${m} C720,${h} 900,0 1080,${m} C1260,${h} 1350,${m/2} 1440,${m} L1440,${h} L0,${h} Z`;
  return (
    <div style={{ display:'block', lineHeight:0, overflow:'hidden', background: top, marginBottom: -1 }}>
      <svg viewBox={`0 0 1440 ${h}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display:'block', width:'100%', height: h, transform: flip ? 'scaleX(-1)' : 'none' }}>
        <path d={d} style={{ fill: bottom }} />
      </svg>
    </div>
  );
}

function Stars({ n = 5 }) {
  return <span className="stars" aria-label={n + " de 5"}>{Array.from({ length: n }).map((_, i) => <I key={i} fill d={ICONS.star} />)}</span>;
}

/* ── Fruit images (uploaded PNGs, transparent background) ── */
const FRUIT_IMGS = [
  { src: "uploads/ue/out/10.png", scale: 0.85 },  // 0  lenteja   w6
  { src: "uploads/ue/out/4.png",  scale: 0.95 },  // 1  frambuesa w8
  { src: "uploads/ue/out/6.png",  scale: 0.95 },  // 2  fresa     w10
  { src: "uploads/ue/out/9.png",  scale: 0.95 },  // 3  ciruela   w12
  { src: "uploads/ue/out/7.png",  scale: 0.92 },  // 4  limón     w14
  { src: "uploads/ue/out/2.png",  scale: 0.92 },  // 5  aguacate  w16
  { src: "uploads/ue/out/3.png",  scale: 0.85 },  // 6  plátano   w20  (ancho)
  { src: "uploads/ue/out/1.png",  scale: 0.90 },  // 7  maíz      w24
  { src: "uploads/fruits/10_cropped.png", scale: 0.92 },  // 8  berenjena w28
  { src: "uploads/ue/out/8.png",  scale: 0.78 },  // 9  coco      w32  (grande)
  { src: "uploads/fruits/7_cropped.png",  scale: 0.95 },  // 10 lechuga   w36 (más grande que coco)
  { src: "uploads/ue/out/5_cropped.png", scale: 0.96 },  // 11 sandía    w40  (la más grande)
];
const TRI_HALO = [
  "radial-gradient(circle, rgba(255,140,165,0.45) 0%, rgba(255,140,165,0) 70%)",  // T1 rosado
  "radial-gradient(circle, rgba(255,168,100,0.42) 0%, rgba(255,168,100,0) 70%)",  // T2 durazno
  "radial-gradient(circle, rgba(172,130,220,0.42) 0%, rgba(172,130,220,0) 70%)",  // T3 lavanda
];
function FruitIcon({ idx, size = 120, tri = -1 }) {
  const item = FRUIT_IMGS[Math.max(0, Math.min(FRUIT_IMGS.length - 1, idx))];
  const scaled = Math.round(size * item.scale);
  const haloSize = Math.round(size * 1.5);
  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
      {tri >= 0 && (
        <div style={{
          position: "absolute",
          width: haloSize, height: haloSize,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: TRI_HALO[tri] || TRI_HALO[0],
          pointerEvents: "none",
        }} />
      )}
      <img src={item.src} width={scaled} height={scaled} alt="" style={{ objectFit: "contain", display: "block", position: "relative", filter: "drop-shadow(0 6px 18px rgba(200,100,110,.22))" }} />
    </div>
  );
}
function weekIndex(week) {let k = 0;WEEKS.forEach((it, i) => {if (week >= it.w) k = i;});return k;}
function Logo() {
  return (
    <span className="logo">
      <img src="uploads/Coffee-3df04102.png" alt="Lumé" className="logo-img" style={{width:52,height:52,objectFit:'contain',display:'block'}} />
      <span className="logo-name">Lumé</span>
    </span>
  );
}

function useReveal() {
  React.useEffect(() => {
    const pass = () => {
      const h = window.innerHeight || 800;
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.94 && r.bottom > -40) el.classList.add("in");
      });
    };
    pass();
    const timers = [50, 220, 520].map((d) => setTimeout(pass, d));
    window.addEventListener("scroll", pass, { passive: true });
    window.addEventListener("resize", pass);
    return () => {window.removeEventListener("scroll", pass);window.removeEventListener("resize", pass);timers.forEach(clearTimeout);};
  }, []);
}

function TopBar() {
  return (
    <div className="topbar">
      <strong>{TR.topbar_strong}</strong> {TR.topbar_rest}
      <a href="#precios">{TR.topbar_cta}</a>
    </div>);

}

function LoginModal({ onClose, appHref, initialTab }) {
  const [tab, setTab] = React.useState(initialTab || "login");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [authError, setAuthError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      if (window.lumeAuth && window.lumeAuth.isConfigured()) {
        if (tab === "registro") await window.lumeAuth.signUp(email, pass, name);
        else await window.lumeAuth.signIn(email, pass);
      } else {
        await new Promise((r) => setTimeout(r, 1200)); // Sin Supabase conectado aún: modo demo
      }
      if (tab === "registro") {
        try {
          if (name.trim()) localStorage.setItem("lume_nombre", name.trim());
          if (email.trim()) localStorage.setItem("lume_email", email.trim());
          localStorage.setItem("lume_plan", "esencial");
          localStorage.removeItem("lume_onboarded"); // cuenta nueva: siempre debe pasar por onboarding en este dispositivo
        } catch {}
        window.location.href = "confirmacion.html";
        return;
      }
      setDone(true);
    } catch (err) {
      setAuthError((err && err.message) || "No se pudo completar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(20,10,6,.68)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:"var(--paper)",border:"1px solid var(--line)",borderRadius:28,padding:"36px 32px",boxShadow:"0 40px 100px rgba(20,10,6,.4)",position:"relative"}}>
        {/* Close */}
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:32,height:32,borderRadius:"50%",border:"1px solid var(--line)",background:"var(--surface-2)",color:"var(--muted)",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <img src="uploads/Coffee-3df04102.png" alt="Lumé" style={{width:56,height:56,objectFit:"contain"}}/>
        </div>

        {!done ? (<>
          {/* Tabs */}
          <div style={{display:"flex",background:"var(--surface-2)",borderRadius:12,padding:4,marginBottom:24,border:"1px solid var(--line)"}}>
            {["login","registro"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:600,
                background:tab===t?"var(--surface)":"transparent",
                color:tab===t?"var(--ink)":"var(--muted)",
                boxShadow:tab===t?"var(--sh-1)":"none",transition:"all .2s"}}>
                {t==="login"?TR.login_tab_login:TR.login_tab_registro}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:14}}>
            {tab==="registro" && (
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:6}}>{TR.label_nombre}</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder={TR.ph_nombre} required
                  style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--surface)",fontFamily:"inherit",fontSize:14,color:"var(--ink)",outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="var(--primary)"} onBlur={e=>e.target.style.borderColor="var(--line)"}/>
              </div>
            )}
            <div>
              <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:6}}>{TR.label_email}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={TR.ph_email} required
                style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--surface)",fontFamily:"inherit",fontSize:14,color:"var(--ink)",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="var(--primary)"} onBlur={e=>e.target.style.borderColor="var(--line)"}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:6}}>{TR.label_pass}</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={TR.ph_pass} required minLength={8}
                style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--surface)",fontFamily:"inherit",fontSize:14,color:"var(--ink)",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="var(--primary)"} onBlur={e=>e.target.style.borderColor="var(--line)"}/>
            </div>

            <button type="submit" disabled={loading} style={{marginTop:4,padding:"14px",borderRadius:12,border:"none",
              background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#FBF3EB",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",
              fontFamily:"inherit",opacity:loading?.7:1,transition:"all .2s",boxShadow:"0 8px 24px rgba(168,73,42,.35)"}}>
              {loading ? TR.btn_loading : tab==="login" ? TR.btn_login : TR.btn_registro}
            </button>
            {authError && <div style={{fontSize:12.5,color:"#c0392b",textAlign:"center",marginTop:-4}}>{authError}</div>}
          </form>

          <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}>
            <div style={{flex:1,height:1,background:"var(--line)"}}/>
            <span style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{TR.or_continue}</span>
            <div style={{flex:1,height:1,background:"var(--line)"}}/>
          </div>

          <button style={{width:"100%",padding:"12px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--surface)",fontFamily:"inherit",fontSize:14,fontWeight:600,color:"var(--ink)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {TR.google_btn}
          </button>

          {tab==="login" && (
            <div style={{textAlign:"center",marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
              <p style={{margin:0,fontSize:12,color:"var(--muted)"}}>{TR.no_account} <button onClick={()=>setTab("registro")} style={{background:"none",border:"none",color:"var(--primary)",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:12,padding:0}}>{TR.create_free}</button></p>
              <button onClick={()=>alert("Disponible en la versión de producción. Escíbenos a soporte@lume-app.com")} style={{background:"none",border:"none",color:"var(--muted)",fontSize:11.5,cursor:"pointer",fontFamily:"inherit",padding:0,opacity:.65}}>{TR.forgot_pass}</button>
            </div>
          )}
          {tab==="registro" && (
            <p style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:14,lineHeight:1.5}}>
              {TR.terms_pre} <a href="#" style={{color:"var(--primary)"}}>{TR.terms_link}</a> {TR.terms_and} <a href="#" style={{color:"var(--primary)"}}>{TR.privacy_link}</a>
            </p>
          )}
        </>) : (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#A8492A,#C8952A)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 12px 32px rgba(168,73,42,.35)"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>
            </div>
            <div style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:600,color:"var(--ink)",marginBottom:8}}>{TR.welcome_title}</div>
            <p style={{fontSize:14,color:"var(--muted)",marginBottom:24,lineHeight:1.6}}>{TR.welcome_sub}</p>
            <a href={appHref} style={{display:"block",padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#FBF3EB",fontSize:15,fontWeight:700,textDecoration:"none",textAlign:"center",boxShadow:"0 8px 24px rgba(168,73,42,.35)"}}>
              {TR.open_app}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Nav({ appHref }) {
  const [solid, setSolid] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  React.useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  React.useEffect(() => {
    window.__lumeOpenModal = () => setShowLogin(true);
    return () => { delete window.__lumeOpenModal; };
  }, [setShowLogin]);
  return (
    <>
    <header className={"nav" + (solid ? " solid" : "")}>
      <div className="wrap nav-in">
        <a href="#top"><Logo /></a>
        <nav className="nav-links">
          <a href="#producto">{TR.nav_producto}</a>
          <a href="#semana">{TR.nav_semana}</a>
          <a href="#expertos">{TR.nav_expertos}</a>
          <a href="#precios">{TR.nav_precios}</a>
        </nav>
        <div className="nav-actions">
          <button className="nav-login" onClick={() => setLang(CUR_LANG === "es" ? "en" : "es")} style={{fontWeight:700,letterSpacing:".04em"}} title="Language / Idioma">{CUR_LANG === "es" ? "EN" : "ES"}</button>
          <button className="nav-login" onClick={() => setShowLogin(true)}>{TR.nav_login}</button>
          <button className="btn btn-primary nav-cta" onClick={() => setShowLogin(true)}>{TR.nav_cta}</button>
        </div>
      </div>
    </header>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} appHref={appHref}/>}
    </>
  );
}


function Hero({ t, appHref }) {
  const [week, setWeek] = React.useState(24);
  const data = React.useMemo(() => {let c = WEEKS[0];for (const it of WEEKS) if (week >= it.w) c = it;return c;}, [week]);
  const dot = Math.max(0.4, Math.min(1, data.cm / 51));
  const idx = weekIndex(week);
  const [split, setSplit] = React.useState(52);
  const splitRef = React.useRef(null);
  const heroEyebrow = CUR_LANG === "en" ? TR.hero_eyebrow : t.eyebrow;
  const heroTitle = CUR_LANG === "en" ? TR.hero_title : t.heroTitle;
  const heroSub = CUR_LANG === "en" ? TR.hero_sub : t.heroSub;
  const heroCta = CUR_LANG === "en" ? TR.hero_cta : t.ctaText;
  const startDrag = (e) => {
    e.preventDefault();
    const rect = splitRef.current.getBoundingClientRect();
    const mm = (ev) => {const pct = (ev.clientX - rect.left) / rect.width * 100;setSplit(Math.max(34, Math.min(66, pct)));};
    const up = () => {document.removeEventListener("pointermove", mm);document.removeEventListener("pointerup", up);};
    document.addEventListener("pointermove", mm);document.addEventListener("pointerup", up);
  };
  return (
    <section className="hero" id="top">
      <div className="hero-split">
        <div className="hero-right">
          <video autoPlay muted loop playsInline preload="none" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}>
            <source src="uploads/hero-baby-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-left">
          <div className="hero-left-in">
            <span className="eyebrow reveal">{heroEyebrow}</span>
            <h1 className="hero-h1 reveal" dangerouslySetInnerHTML={{ __html: heroTitle }}></h1>
            <p className="hero-sub reveal">{heroSub}</p>
            <div className="hero-cta reveal">
              <a className="btn btn-primary btn-lg" href="#" onClick={(e)=>{e.preventDefault();window.__lumeOpenModal?.();}}>{heroCta}</a>
              <a className="btn btn-line btn-lg" href="#producto">{TR.hero_secondary_cta}</a>
            </div>
            <div className="hero-meta reveal">
              <div className="hero-rating">
                <div className="r-top" style={{fontSize:11,fontWeight:800,letterSpacing:".1em",color:"var(--primary)"}}>✦ BETA 2026</div>
                <span className="r-sub">{TR.hero_early_access}</span>
              </div>
              <span className="divider"></span>
              <div className="hero-endorse-row">
                <span className="hero-avas" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <p className="hero-endorse"><strong>{TR.hero_based}</strong> {TR.hero_based_rest}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fc fc-week glass" ref={React.useRef(null)} onMouseMove={e => {
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - .5) * 14;
          const y = -((e.clientY - r.top) / r.height - .5) * 14;
          el.style.transition = 'transform .08s ease';
          el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px) scale(1.02)`;
        }} onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
          el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        }} style={{transformStyle:'preserve-3d',cursor:'default'}}>
          <span className="fc-k">{TR.hero_slider_hint}</span>
          <div className="fc-week-row">
            <button className="fc-step" onClick={() => setWeek((w) => Math.max(5, w - 1))} aria-label="Anterior">−</button>
            <strong className="fc-wknum">{TR.week_label} {week}</strong>
            <button className="fc-step" onClick={() => setWeek((w) => Math.min(40, w + 1))} aria-label="Siguiente">+</button>
          </div>
          <input className="fc-slider" type="range" min="5" max="40" value={week} onChange={(e) => setWeek(+e.target.value)} aria-label="Semana" />
          <div className="fc-size"><span className="fc-fruit-ic" style={{ transform: `scale(${0.62 + dot * 0.45})` }}><FruitIcon idx={idx} size={36} tri={data.tri} /></span><span className="fc-sub">{TR.hero_baby_like} {data.fruit}</span></div>
        </div>
      </div>
    </section>);
}

function Trust() {
  const PRESS_ES = [
    ["Tracker semanal",1],["NUTRICIÓN PRENATAL",0],["Asistente 24/7",1],
    ["MEDITACIÓN",0],["Control de peso",1],["CITAS MÉDICAS",0],["Diario del embarazo",1],
    ["PATADAS",0],["Nombres de bebé",1],["MODO PAREJA",0],
  ];
  const PRESS_EN = [
    ["Weekly tracker",1],["PRENATAL NUTRITION",0],["24/7 Assistant",1],
    ["MEDITATION",0],["Weight tracking",1],["MEDICAL APPOINTMENTS",0],["Pregnancy diary",1],
    ["KICK COUNTER",0],["Baby names",1],["PARTNER MODE",0],
  ];
  const PRESS = CUR_LANG === "en" ? PRESS_EN : PRESS_ES;
  const render = (pfx) => PRESS.map(([n, s], i) => (
    <span key={pfx+i} className={s ? "ser" : ""}>{n}</span>
  ));
  return (
    <section className="trust">
      <div className="wrap trust-in">
        <span className="trust-label">{TR.trust_label}</span>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">{render("a")}{render("b")}{render("c")}</div>
        </div>
      </div>
    </section>
  );
}

const VALUES_ES = [
  { ic:"spark",     plan:"bien", t:"Asistente IA ilimitado",         d:"Pregunta sin límites, a cualquier hora. Responde con calidez y precisión clínica." },
  { ic:"leaf",      plan:"bien", t:"Plan nutricional a medida",       d:"Recetas generadas por IA según tus síntomas y trimestre. Actualizable en tiempo real." },
  { ic:"meditation",plan:"bien", t:"Meditaciones prenatales",         d:"Sesiones guiadas para calmar el cuerpo y la mente en cada etapa del embarazo." },
  { ic:"book",      plan:"bien", t:"Contenido premium semanal",       d:"Guías nuevas cada semana, verificadas por especialistas y adaptadas a tu etapa." },
  { ic:"pulse",     plan:null,   t:"Seguimiento de síntomas",         d:"Historial detallado con alertas inteligentes que te ayudan a estar siempre tranquila." },
  { ic:"exercise",  plan:"bien", t:"Ejercicios y posturas",           d:"Rutinas seguras diseñadas para cada trimestre, desde el sofá o donde estés." },
  { ic:"bell",      plan:"bien", t:"Música para tu bebé",             d:"Selecciones musicales para estimular a tu bebé desde el vientre. Curadas por especialistas." },
  { ic:"heart",     plan:"pro",  t:"Meditación para bebés",           d:"Sonidos y frecuencias pensados para crear calma alrededor del bebé. Solo en Profesional." },
  { ic:"star",      plan:"bien", t:"Meditación con música para mamá", d:"Fusión de música envolvente y meditación guiada para reducir el estrés prenatal." },
];
const VALUES_EN = [
  { ic:"spark",     plan:"bien", t:"Unlimited AI assistant",         d:"Ask without limits, anytime. Answers with warmth and clinical accuracy." },
  { ic:"leaf",      plan:"bien", t:"Tailored nutrition plan",       d:"AI-generated recipes based on your symptoms and trimester. Updatable in real time." },
  { ic:"meditation",plan:"bien", t:"Prenatal meditations",         d:"Guided sessions to calm the body and mind at every stage of pregnancy." },
  { ic:"book",      plan:"bien", t:"Weekly premium content",       d:"New guides every week, verified by specialists and adapted to your stage." },
  { ic:"pulse",     plan:null,   t:"Symptom tracking",         d:"Detailed history with smart alerts that help you always feel at ease." },
  { ic:"exercise",  plan:"bien", t:"Exercises and postures",           d:"Safe routines designed for every trimester, from the couch or wherever you are." },
  { ic:"bell",      plan:"bien", t:"Music for your baby",             d:"Musical selections to stimulate your baby from the womb. Curated by specialists." },
  { ic:"heart",     plan:"pro",  t:"Meditation for babies",           d:"Sounds and frequencies designed to create calm around your baby. Professional only." },
  { ic:"star",      plan:"bien", t:"Meditation with music for mom", d:"A blend of ambient music and guided meditation to reduce prenatal stress." },
];
const VALUES = CUR_LANG === "en" ? VALUES_EN : VALUES_ES;


function ValueProps() {
  const PLAN_BADGE = { bien: { label:CUR_LANG==="en"?"Wellness":"Bienestar", col:"#A8492A" }, pro: { label:(CUR_LANG==="en"?"Professional":"Profesional")+" ✦", col:"#C8952A" } };
  return (
    <section className="section vp-band" id="producto">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">{TR.vp_eyebrow}</span>
          <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: TR.vp_h2 }}></h2>
          <p className="sec-lead">{TR.vp_lead}</p>
        </div>
        <div className="vp-grid">
          {VALUES.map((v, i) => {
            const badge = PLAN_BADGE[v.plan];
            return (
              <article className="vp glass reveal" key={i} style={{ animationDelay: i * 80 + "ms", position:"relative" }}>
                {badge && (
                  <span style={{ position:"absolute", top:14, right:14, fontSize:9, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:badge.col, background:`${badge.col}14`, border:`1px solid ${badge.col}30`, borderRadius:99, padding:"2px 8px" }}>{badge.label}</span>
                )}
                <span className="vp-ic"><I d={ICONS[v.ic]} /></span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WeekPanel() {
  const [week, setWeek] = React.useState(24);
  const idx = weekIndex(week);
  const data = WEEKS[idx];
  const scale = Math.max(0.5, Math.min(1, data.cm / 51));
  const cardRef = React.useRef(null);
  const onMove = e => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 16;
    const y = -((e.clientY - r.top) / r.height - .5) * 16;
    el.style.transition = 'transform .08s ease, box-shadow .3s';
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.02)`;
  };
  const onLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1), box-shadow .3s';
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  };
  return (
    <div className="wk-panel glass" ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{transformStyle:'preserve-3d',cursor:'default',maxWidth:340,margin:'0 auto',
        background:'rgba(255,255,255,.48)',
        backdropFilter:'blur(28px) saturate(180%)',
        WebkitBackdropFilter:'blur(28px) saturate(180%)',
        border:'1px solid rgba(255,255,255,.80)',
        boxShadow:'0 30px 80px -14px rgba(80,30,16,.44), 0 8px 24px rgba(80,30,16,.14), 0 1px 0 rgba(255,255,255,.9) inset',
        borderRadius:28}}>
      <div className="wk-panel-top">
        <div className="tri-pills">{TRI_LABELS.map((l, i) => <span key={i} className={"tri-pill" + (i === data.tri ? " on" : "")}>{TRI_SHORT[i]} {TR.tri_suffix}</span>)}</div>
        <span className="wk-num2">{TR.week_label} {week}</span>
      </div>
      <div className="wk-orb-wrap">
        <div className="wk-orb-bg"></div>
        <div className="wk-fruit-wrap" style={{ transform: `scale(${scale})` }}>
          <div className="fruit-float"><FruitIcon idx={idx} size={160} tri={data.tri} /></div>
        </div>
      </div>
      <div className="wk-meta">
        <span className="lbl">{TR.wk_size_label}</span>
        <div className="fruit">{TR.wk_como} {data.fruit}</div>
        <span className="dims">{data.cm} cm{data.g ? ` · ${data.g >= 1000 ? (data.g / 1000).toFixed(1) + " kg" : data.g + " g"}` : ""}</span>
      </div>
      <p className="wk-note">{data.note}</p>
      <input className="wk-slider2" type="range" min="4" max="40" value={week} onChange={(e) => setWeek(+e.target.value)} aria-label="Semana" />
      <div className="wk-scale"><span>4</span><span>16</span><span>28</span><span>40</span></div>
    </div>);

}

function Showcase() {
  return (
    <section className="section section-paper" id="showcase">
      <div className="wrap">
        <div className="show">
          <div className="show-copy reveal">
            <span className="num">{TR.sh1_num}</span>
            <h2>{TR.sh1_h2}</h2>
            <p>{TR.sh1_p}</p>
            <ul className="show-list">
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh1_li1}</li>
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh1_li2}</li>
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh1_li3}</li>
            </ul>
          </div>
          <div className="show-media reveal">
            <div className="mockup-wrap" style={{width:'58%'}}>
              <img src="uploads/asistente-mockup.png" alt="Asistente Lumé" className="mockup-img"/>
            </div>
            <div className="show-tag glass"><span className="ti"><I d={ICONS.spark} /></span><div><b>{TR.sh1_tag_b}</b><span>{TR.sh1_tag_s}</span></div></div>
          </div>
        </div>

        <div className="show flip" id="semana" style={{scrollMarginTop:100}}>
          <div className="show-copy reveal">
            <span className="num">{TR.sh2_num}</span>
            <h2>{TR.sh2_h2}</h2>
            <p>{TR.sh2_p}</p>
            <ul className="show-list">
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh2_li1}</li>
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh2_li2}</li>
            </ul>
          </div>
          <div className="show-media reveal">
            <div style={{position:'relative',padding:'32px',borderRadius:36,background:'linear-gradient(135deg,rgba(168,73,42,.22) 0%,rgba(212,175,80,.26) 45%,rgba(168,73,42,.18) 100%)',backdropFilter:'blur(8px)'}}>
              <WeekPanel />
            </div>
          </div>
        </div>

        <div className="show">
          <div className="show-copy reveal">
            <span className="num">{TR.sh3_num}</span>
            <h2>{TR.sh3_h2}</h2>
            <p>{TR.sh3_p}</p>
            <ul className="show-list">
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh3_li1}</li>
              <li><span className="ck"><I d={ICONS.check} /></span>{TR.sh3_li2}</li>
            </ul>
          </div>
          <div className="show-media reveal">
            <img src="uploads/ue (1).png" alt="Comida saludable para el embarazo" className="show-photo" style={{aspectRatio:"500/180",objectFit:"cover",objectPosition:"center"}} />
            <div className="show-tag glass"><span className="ti"><I d={ICONS.leaf} /></span><div><b>{TR.sh3_tag_b}</b><span>{TR.sh3_tag_s}</span></div></div>
          </div>
        </div>
      </div>
    </section>);

}

const SOURCES_ES = [
  { role:"Salud materna y perinatal", name:"Organización Mundial de la Salud", badge:"Guías públicas",    initials:"OMS", color:"#3A8070", from:"Recomendaciones de cuidado prenatal" },
  { role:"Ginecología y Obstetricia",  name:"Sociedades de ginecología",       badge:"Guías clínicas",   initials:"GO",  color:"#C4693A", from:"Protocolos de seguimiento del embarazo" },
  { role:"Nutrición perinatal",        name:"Guías de nutrición prenatal",     badge:"Fuentes oficiales", initials:"NP",  color:"#8B72CF", from:"Recomendaciones nutricionales públicas" },
];
const SOURCES_EN = [
  { role:"Maternal & perinatal health", name:"World Health Organization", badge:"Public guidelines",    initials:"WHO", color:"#3A8070", from:"Prenatal care recommendations" },
  { role:"Gynecology & Obstetrics",  name:"Gynecology societies",       badge:"Clinical guidelines",   initials:"GO",  color:"#C4693A", from:"Pregnancy monitoring protocols" },
  { role:"Perinatal nutrition",        name:"Prenatal nutrition guidelines",     badge:"Official sources", initials:"PN",  color:"#8B72CF", from:"Public nutritional recommendations" },
];
const SOURCES_LIST = CUR_LANG === "en" ? SOURCES_EN : SOURCES_ES;

function ExpertFiche({ e }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{display:"flex",alignItems:"center",gap:12,padding:"12px 15px",borderRadius:16,
        background: hov ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.07)",
        border:"1px solid rgba(255,255,255,.12)",backdropFilter:"blur(8px)",
        transform: hov ? "translateX(6px) scale(1.015)" : "translateX(0) scale(1)",
        boxShadow: hov ? "0 10px 28px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.1) inset" : "none",
        transition:"transform .22s cubic-bezier(.23,1,.32,1), background .22s, box-shadow .22s",
        cursor:"default"}}>
      <div style={{width:56,height:56,flexShrink:0,borderRadius:"50%",background:`linear-gradient(135deg,${e.color}ee,${e.color}88)`,border:"2px solid rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${e.color}55`,transition:"transform .22s",transform:hov?"scale(1.08)":"scale(1)"}}>
        <span style={{fontSize:17,fontWeight:800,color:"rgba(255,255,255,.95)",letterSpacing:".02em",fontFamily:"'Cormorant Garamond',serif"}}>{e.initials}</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13.5,fontWeight:700,color:"rgba(255,255,255,.95)",lineHeight:1.2}}>{e.name}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>{e.role}</div>
        <div style={{fontSize:10.5,color:"rgba(212,175,80,.75)",marginTop:2,fontWeight:600}}>{e.from}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
        <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(100,200,80,.18)",border:"1.5px solid rgba(100,200,80,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(120,210,90,.9)" strokeWidth="3.2" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:600,letterSpacing:".04em"}}>{e.badge}</div>
      </div>
    </div>
  );
}

function Experts() {
  return (
    <section className="section" id="expertos">
      <div className="wrap">
        <div className="experts reveal">
          <div className="experts-glow" aria-hidden="true"></div>
          <div className="experts-in">
            <div>
              <span className="eyebrow">{TR.exp_eyebrow}</span>
              <h2>{TR.exp_h2}</h2>
              <p>{TR.exp_p}</p>

              <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:22}}>
                {SOURCES_LIST.map((e,i)=>(<ExpertFiche key={i} e={e} />))}
              </div>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 12px",borderRadius:99,background:"rgba(212,175,80,.1)",border:"1px solid rgba(212,175,80,.22)",marginBottom:12,marginTop:16}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.8)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 3c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4C10.4 7.8 11.4 6.8 12 3Z"/></svg>
                <span style={{fontSize:11,fontWeight:700,color:"rgba(212,175,80,.85)",letterSpacing:".04em"}}>{TR.exp_committee}</span>
              </div>
              <div style={{marginTop:16,display:"flex",alignItems:"center",gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.75)" strokeWidth="2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>
                <a href="expertos.html" style={{fontSize:12,color:"rgba(212,175,80,.8)",fontWeight:600,textDecoration:"none",letterSpacing:".02em",borderBottom:"1px solid rgba(212,175,80,.28)",paddingBottom:1}}>{TR.exp_join}</a>
              </div>
            </div>

            <div className="exp-stats">
              {[
                { svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.85)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>, n:"100%", l:TR.exp_stat1 },
                { svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.85)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><path d="M6.3 14.5A9 9 0 0 0 3 21h18a9 9 0 0 0-3.3-6.5"/></svg>, n:"2026", l:TR.exp_stat2 },
                { svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.85)" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, n:"24/7", l:TR.exp_stat3 },
                { svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.85)" strokeWidth="2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>, n:"RGPD", l:TR.exp_stat4 },
              ].map((s,i) => (
                <div className="exp-stat" key={i} style={{position:"relative",overflow:"hidden"}}>
                  <div style={{marginBottom:8,opacity:.9}}>{s.svg}</div>
                  <div className="n" style={{fontFamily:"var(--font-display)",fontSize:"clamp(28px,3.5vw,42px)",fontWeight:700,color:"var(--gold)",lineHeight:1,marginBottom:8}}>{s.n}</div>
                  <div className="l" style={{fontSize:13.5,color:"color-mix(in srgb, var(--invert-ink) 65%, transparent)",lineHeight:1.45}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>);
}

const TST_ES = [
  { q: "Me sentí acompañada en cada cambio. El asistente me sacó de dudas a las 3 de la mañana, sin hacerme sentir tonta.", n: "Camila R.", a: "Semana 32", tag: "Asistente" },
  { q: "Saber que todo se apoya en guías médicas oficiales me dio una tranquilidad enorme. Es la única app que recomendé a mi grupo.", n: "Valeria M.", a: "Semana 18", tag: "Confianza" },
  { q: "El plan de nutrición me ayudó muchísimo con las náuseas. Por fin algo pensado de verdad para nosotras.", n: "Lucía F.", a: "Semana 26", tag: "Nutrición" },
  { q: "Nunca pensé que una app me haría llorar de emoción. Ver crecer a mi bebé semana a semana es algo especial.", n: "Andrea P.", a: "Semana 14", tag: "Emoción" },
  { q: "Entré con muchos miedos al primer trimestre y Lumé me acompañó en cada síntoma. Me sentí menos sola.", n: "Sofía T.", a: "Semana 10", tag: "Tranquilidad" },
  { q: "Los nombres favoritos con mi pareja fueron un momento precioso. Llevamos 47 marcados y seguimos sin decidir.", n: "Isabel C.", a: "Semana 22", tag: "Nombres" },
  { q: "La sección de síntomas me alertó de que debía llamar a mi matrona. Gracias a Lumé fui a tiempo.", n: "María G.", a: "Semana 28", tag: "Salud" },
  { q: "Las recetas del plan nutricional son ricas de verdad. Por fin puedo comer sano sin que me dé asco.", n: "Paula S.", a: "Semana 20", tag: "Nutrición" },
];
const TST_EN = [
  { q: "I felt truly accompanied through every change. The assistant answered my doubts at 3am without making me feel silly.", n: "Camila R.", a: "Week 32", tag: "Assistant" },
  { q: "Knowing everything is backed by official medical guidelines gave me huge peace of mind. It's the only app I recommended to my group.", n: "Valeria M.", a: "Week 18", tag: "Trust" },
  { q: "The nutrition plan helped me so much with nausea. Finally something truly designed for us.", n: "Lucía F.", a: "Week 26", tag: "Nutrition" },
  { q: "I never thought an app would make me cry with joy. Watching my baby grow week by week is something special.", n: "Andrea P.", a: "Week 14", tag: "Emotion" },
  { q: "I entered the first trimester full of fears and Lumé was with me through every symptom. I felt less alone.", n: "Sofía T.", a: "Week 10", tag: "Reassurance" },
  { q: "Marking favorite names with my partner was a precious moment. We have 47 marked and still can't decide.", n: "Isabel C.", a: "Week 22", tag: "Names" },
  { q: "The symptoms section alerted me to call my midwife. Thanks to Lumé I got there in time.", n: "María G.", a: "Week 28", tag: "Health" },
  { q: "The nutrition plan recipes are genuinely delicious. I can finally eat healthy without feeling sick.", n: "Paula S.", a: "Week 20", tag: "Nutrition" },
];
const TST = CUR_LANG === "en" ? TST_EN : TST_ES;

function TstCard({ t }) {
  const ref = React.useRef(null);
  const onMove = e => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 14;
    const y = -((e.clientY - r.top) / r.height - .5) * 14;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px) scale(1.02)`;
    el.style.transition = 'transform .08s ease';
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = 'transform .45s cubic-bezier(.23,1,.32,1)';
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  };
  return (
    <figure className="tst-card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tst-top"><Stars /><span className="tst-tag">{t.tag}</span></div>
      <blockquote>{t.q}</blockquote>
      <figcaption>
        <span className="tst-ava" aria-hidden="true"></span>
        <span className="tst-meta"><strong>{t.n}</strong><span className="tst-age">{t.a}</span></span>
      </figcaption>
    </figure>
  );
}

function Testimonials() {
  const trackRef = React.useRef(null);
  const pausedRef = React.useRef(false);
  React.useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let pos = 0;
    const speed = 0.5;
    let raf;
    const tick = () => {
      if (!pausedRef.current) {
        pos += speed;
        if (pos >= track.scrollWidth / 2) pos -= track.scrollWidth / 2;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    return () => { cancelAnimationFrame(raf); track.removeEventListener('mouseenter', pause); track.removeEventListener('mouseleave', resume); };
  }, []);
  const doubled = [...TST, ...TST];
  return (
    <section className="section tst-section">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">{TR.tst_eyebrow}</span>
          <h2 className="sec-title">{TR.tst_h2}</h2>
          <p className="sec-lead">{TR.tst_lead}</p>
          <p style={{fontSize:11,color:"var(--muted)",opacity:.65,marginTop:6,fontStyle:"italic"}}>{TR.tst_note}</p>
        </div>
      </div>
      <div className="tst-track-wrap">
        <div className="tst-fade tst-fade-l" aria-hidden="true"></div>
        <div className="tst-fade tst-fade-r" aria-hidden="true"></div>
        <div className="tst-track" ref={trackRef}>
          {doubled.map((t, i) => <TstCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}

function DescargaSection({ appHref }) {
  return (
    <section style={{padding:"80px 0",background:"var(--tint)",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
      <div className="wrap">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
          {/* Copy */}
          <div className="reveal">
            <span className="eyebrow">{TR.desc_eyebrow}</span>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(32px,4vw,52px)",lineHeight:1.05,letterSpacing:"-.03em",margin:"16px 0 0"}} dangerouslySetInnerHTML={{ __html: TR.desc_h2 }}>
            </h2>
            <p style={{fontSize:16.5,color:"var(--ink-2)",margin:"20px 0 32px",lineHeight:1.65,maxWidth:420}}>
              {TR.desc_p}
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {/* App Store */}
              <a href="#" onClick={(e)=>{e.preventDefault();window.__lumeOpenModal?.();}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 22px",borderRadius:14,background:"var(--ink)",color:"var(--invert-ink)",textDecoration:"none",boxShadow:"0 6px 20px rgba(20,10,6,.25)",transition:"transform .2s, box-shadow .2s",fontFamily:"inherit"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(20,10,6,.35)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 20px rgba(20,10,6,.25)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div style={{fontSize:10,fontWeight:600,opacity:.7,letterSpacing:".04em"}}>{TR.desc_soon}</div>
                  <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.01em"}}>{TR.desc_appstore}</div>
                </div>
              </a>
              {/* Google Play */}
              <a href="#" onClick={(e)=>{e.preventDefault();window.__lumeOpenModal?.();}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 22px",borderRadius:14,background:"var(--ink)",color:"var(--invert-ink)",textDecoration:"none",boxShadow:"0 6px 20px rgba(20,10,6,.25)",transition:"transform .2s, box-shadow .2s",fontFamily:"inherit"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(20,10,6,.35)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 20px rgba(20,10,6,.25)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" fill="#34A853"/><path d="M3 3.5l9 9-9 8V3.5z" fill="#4285F4"/><path d="M12 12.5l3 3-12 7 9-10z" fill="#EA4335"/><path d="M3 3.5l12 7-3 3-9-10z" fill="#FBBC05"/></svg>
                <div>
                  <div style={{fontSize:10,fontWeight:600,opacity:.7,letterSpacing:".04em"}}>{TR.desc_soon}</div>
                  <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.01em"}}>{TR.desc_googleplay}</div>
                </div>
              </a>
            </div>
            {/* Social proof pills */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:28}}>
              {[[TR.desc_pill1_n,TR.desc_pill1_l],[TR.desc_pill2_n,TR.desc_pill2_l],[TR.desc_pill3_n,TR.desc_pill3_l]].map(([n,l],i)=>(

                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:99,background:"var(--surface)",border:"1px solid var(--line)",boxShadow:"var(--sh-1)"}}>
                  <span style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>{n}</span>
                  <span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <div className="reveal" style={{position:"relative",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{position:"relative",width:"min(280px,85%)"}}>
              <div
                onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*18;const y=-((e.clientY-r.top)/r.height-.5)*18;e.currentTarget.style.transform=`perspective(700px) rotateX(${y}deg) rotateY(${x}deg) scale(1.03)`;e.currentTarget.style.transition='transform .08s ease';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';e.currentTarget.style.transition='transform .5s cubic-bezier(.23,1,.32,1)';}}
                style={{transformStyle:'preserve-3d',cursor:'default',
                  background:'rgba(255,255,255,.48)',
                  backdropFilter:'blur(24px) saturate(180%)',
                  WebkitBackdropFilter:'blur(24px) saturate(180%)',
                  border:'1px solid rgba(255,255,255,.75)',
                  borderRadius:28,
                  padding:'16px 16px 10px',
                  boxShadow:'0 32px 80px rgba(80,30,16,.28), 0 8px 24px rgba(80,30,16,.14), 0 1px 0 rgba(255,255,255,.9) inset'}}>
                <img src="uploads/showcase-image-27.png" alt="Lumé app" style={{width:"100%",display:"block",borderRadius:16,transition:"box-shadow .3s"}}/>
              </div>
              <div style={{position:"absolute",bottom:24,right:-28,
                background:"rgba(255,255,255,.52)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",
                border:"1px solid rgba(255,255,255,.75)",borderRadius:16,padding:"12px 16px",
                boxShadow:"0 12px 32px rgba(80,30,16,.18), 0 1px 0 rgba(255,255,255,.9) inset",
                display:"flex",alignItems:"center",gap:10,minWidth:160,
                animation:"tagFloat 3.8s ease-in-out infinite"}}>
                <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#A8492A,#C8952A)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>
                </div>
                <div><div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>{TR.desc_tag1_t}</div><div style={{fontSize:11,color:"var(--muted)"}}>{TR.desc_tag1_s}</div></div>
              </div>
              <div style={{position:"absolute",bottom:200,left:-24,
                background:"rgba(255,255,255,.52)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",
                border:"1px solid rgba(255,255,255,.75)",borderRadius:16,padding:"10px 14px",
                boxShadow:"0 12px 32px rgba(80,30,16,.18), 0 1px 0 rgba(255,255,255,.9) inset",
                display:"flex",alignItems:"center",gap:8,
                animation:"tagFloat 3.2s ease-in-out .6s infinite"}}>
                <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#E4BC7E,#A8492A)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>
                </div>
                <div><div style={{fontSize:12,fontWeight:700,color:"var(--ink)"}}>{TR.desc_tag2_t}</div><div style={{fontSize:10,color:"var(--muted)"}}>{TR.desc_tag2_s}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stripe: pagos reales ──────────────────────────────────────────
   STRIPE_PK es la clave PUBLICABLE (pk_live): es pública y segura aquí.
   ⚠ NUNCA pongas la clave secreta (sk_live) en este archivo ni en el sitio. */
const STRIPE_PK = "pk_live_51TnAQ9BhWru5s2tMzCzwglAFtcaLPiJ5gWVL1yCEXglG31CdgESwcImyg7rlDIdvqgKijnZshgZz2k1CMMEnMPDU00bQgYBL0S";
const STRIPE_TABLES = {
  esencial:    "prctbl_1TphGPBhWru5s2tMQ8U9eugq",
  bienestar:   "prctbl_1TpjEgBhWru5s2tMV9UD1eUP",
  profesional: "prctbl_1TpjcWBhWru5s2tMgy3wgs2o",
};

function StripeCheckoutModal({ planId, onClose }) {
  const [ready, setReady] = React.useState(() => !!(window.customElements && window.customElements.get("stripe-pricing-table")));
  React.useEffect(() => {
    if (window.customElements && window.customElements.get("stripe-pricing-table")) { setReady(true); return; }
    let s = document.querySelector('script[data-stripe-pt]');
    if (!s) {
      s = document.createElement("script");
      s.src = "https://js.stripe.com/v3/pricing-table.js";
      s.async = true;
      s.setAttribute("data-stripe-pt", "1");
      document.head.appendChild(s);
    }
    const t = setInterval(() => {
      if (window.customElements && window.customElements.get("stripe-pricing-table")) { setReady(true); clearInterval(t); }
    }, 150);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9500,background:"rgba(28,12,6,.55)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={(e) => e.stopPropagation()} style={{width:"min(480px, 100%)",maxHeight:"88vh",overflowY:"auto",background:"#FBF3EB",borderRadius:24,boxShadow:"0 32px 80px rgba(0,0,0,.4)",padding:"22px 18px 26px",position:"relative"}}>
        <button onClick={onClose} aria-label="Cerrar" style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",border:"1px solid rgba(168,73,42,.2)",background:"#fff",color:"#A8492A",fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontFamily:"var(--font-display, Georgia, serif)",fontSize:24,color:"#3d1a0e"}}>{TR.stripe_title}</div>
          <div style={{fontSize:13,color:"#8a6a5a",marginTop:4}}>{TR.stripe_sub}</div>
          <div style={{fontSize:11,color:"#a08070",marginTop:6,fontStyle:"italic"}}>{TR.stripe_note}</div>
        </div>
        {ready
          ? <stripe-pricing-table pricing-table-id={STRIPE_TABLES[planId] || STRIPE_TABLES.bienestar} publishable-key={STRIPE_PK}></stripe-pricing-table>
          : <div style={{padding:"48px 0",textAlign:"center",color:"#8a6a5a",fontSize:14}}>{TR.stripe_loading}</div>}
      </div>
    </div>
  );
}

function Pricing({ appHref }) {
  const [annual, setAnnual] = React.useState(true);
  const [stripePlan, setStripePlan] = React.useState(null);
  const [showSignup, setShowSignup] = React.useState(false);

  const PLANS_ES = [
    {
      id: "esencial",
      name: "Esencial",
      tag: "Para empezar tu viaje",
      price: 0,
      annualTotal: 0,
      annualMonthly: 0,
      badge: null,
      accent: "#8a6a5a",
      cta: "Crear cuenta gratis",
      ctaClass: "btn btn-line price-btn",
      features: [
        { t:"Tracker bebé semanal",              inc:true },
        { t:"Registro de citas médicas",         inc:true },
        { t:"Síntomas y bienestar",              inc:true },
        { t:"Control de peso y patadas",         inc:true },
        { t:"Fotos y ultrasonidos básicos",      inc:true },
        { t:"Nombres de bebé",                   inc:true },
        { t:"3 consultas/día al asistente",      inc:true },
        { t:"Asistente IA ilimitado",            inc:false },
        { t:"Meditaciones y música prenatal",    inc:false },
        { t:"Consultas con expertos",            inc:false },
      ]
    },
    {
      id: "bienestar",
      name: "Bienestar",
      tag: "El acompañamiento completo",
      price: 9,
      annualTotal: 75,
      annualMonthly: 6.25,
      annualSaving: 31,
      badge: "Más popular",
      accent: "#A8492A",
      cta: "Probar 7 días gratis",
      ctaClass: "btn btn-primary price-btn",
      featured: true,
      features: [
        { t:"Todo lo de Esencial",                   inc:true },
        { t:"Asistente IA ilimitado",                inc:true },
        { t:"Plan nutricional personalizado por IA", inc:true },
        { t:"Meditaciones prenatales",               inc:true },
        { t:"Música para tu bebé",                   inc:true },
        { t:"Meditación con música para mamá",       inc:true },
        { t:"Ejercicios y posturas prenatales",      inc:true },
        { t:"Guía semanal premium",                  inc:true },
        { t:"Diario del embarazo",                   inc:true },
        { t:"Ultrasonidos ilimitados",                inc:true },
        { t:"Modo pareja",                           inc:true },
        { t:"Meditación para bebés",                 inc:false },
        { t:"Consultas con expertos",                inc:false },
      ]
    },
    {
      id: "profesional",
      name: "Profesional",
      tag: "Sin límites, sin compromisos",
      price: 19,
      annualTotal: 144,
      annualMonthly: 12,
      annualSaving: 37,
      badge: "✦ Premium",
      badgeGold: true,
      accent: "#C8952A",
      cta: "Elegir Profesional",
      ctaClass: "btn btn-line price-btn",
      features: [
        { t:"Todo lo de Bienestar",              inc:true },
        { t:"Meditación para bebés (Hz)",        inc:true },
        { t:"Historial médico exportable",       inc:true },
        { t:"Acceso anticipado a novedades",     inc:true },
        { t:"Soporte prioritario 24/7",          inc:true },
        { t:"── PRÓXIMAMENTE ──",               inc:true, soon:true, divider:true },
        { t:"Consultas con expertos del comité", inc:true, soon:true },
        { t:"Seguimiento post-parto y recién nacido", inc:true, soon:true },
        { t:"Dashboard médico compartido",      inc:true, soon:true },
        { t:"Modo bebé: primeros meses de vida", inc:true, soon:true },
        { t:"Red de clínicas aliadas",           inc:true, soon:true },
      ]
    },
  ];

  const PLANS_EN = [
    {
      id: "esencial",
      name: "Essential",
      tag: "To start your journey",
      price: 0,
      annualTotal: 0,
      annualMonthly: 0,
      badge: null,
      accent: "#8a6a5a",
      cta: "Create a free account",
      ctaClass: "btn btn-line price-btn",
      features: [
        { t:"Weekly baby tracker",              inc:true },
        { t:"Medical appointment log",         inc:true },
        { t:"Symptoms & wellness",              inc:true },
        { t:"Weight and kick tracking",         inc:true },
        { t:"Basic photos and ultrasounds",      inc:true },
        { t:"Baby names",                   inc:true },
        { t:"3 assistant chats/day",      inc:true },
        { t:"Unlimited AI assistant",            inc:false },
        { t:"Prenatal meditations & music",    inc:false },
        { t:"Expert consultations",            inc:false },
      ]
    },
    {
      id: "bienestar",
      name: "Wellness",
      tag: "The complete companion",
      price: 9,
      annualTotal: 75,
      annualMonthly: 6.25,
      annualSaving: 31,
      badge: "Most popular",
      accent: "#A8492A",
      cta: "Try 7 days free",
      ctaClass: "btn btn-primary price-btn",
      featured: true,
      features: [
        { t:"Everything in Essential",                   inc:true },
        { t:"Unlimited AI assistant",                inc:true },
        { t:"AI-personalized nutrition plan", inc:true },
        { t:"Prenatal meditations",               inc:true },
        { t:"Music for your baby",                   inc:true },
        { t:"Meditation with music for mom",       inc:true },
        { t:"Prenatal exercises and postures",      inc:true },
        { t:"Weekly premium guide",                  inc:true },
        { t:"Pregnancy diary",                   inc:true },
        { t:"Unlimited ultrasounds",                inc:true },
        { t:"Partner mode",                           inc:true },
        { t:"Meditation for babies",                 inc:false },
        { t:"Expert consultations",                inc:false },
      ]
    },
    {
      id: "profesional",
      name: "Professional",
      tag: "No limits, no commitments",
      price: 19,
      annualTotal: 144,
      annualMonthly: 12,
      annualSaving: 37,
      badge: "✦ Premium",
      badgeGold: true,
      accent: "#C8952A",
      cta: "Choose Professional",
      ctaClass: "btn btn-line price-btn",
      features: [
        { t:"Everything in Wellness",              inc:true },
        { t:"Meditation for babies (Hz)",        inc:true },
        { t:"Exportable medical history",       inc:true },
        { t:"Early access to new features",     inc:true },
        { t:"24/7 priority support",          inc:true },
        { t:"── COMING SOON ──",               inc:true, soon:true, divider:true },
        { t:"Consultations with committee experts", inc:true, soon:true },
        { t:"Postpartum and newborn tracking", inc:true, soon:true },
        { t:"Shared medical dashboard",      inc:true, soon:true },
        { t:"Baby mode: first months of life", inc:true, soon:true },
        { t:"Network of partner clinics",           inc:true, soon:true },
      ]
    },
  ];
  const PLANS = CUR_LANG === "en" ? PLANS_EN : PLANS_ES;

  return (
    <section className="section" id="precios">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">{TR.pricing_eyebrow}</span>
          <h2 className="sec-title">{TR.pricing_h2}</h2>
          <p className="sec-lead">{TR.pricing_lead}</p>
          <div className="bill" role="group" aria-label="Facturación">
            <button className={!annual ? "on" : ""} onClick={() => setAnnual(false)}>{TR.bill_monthly}</button>
            <button className={annual ? "on" : ""} onClick={() => setAnnual(true)}>{TR.bill_annual} <em>{TR.bill_save}</em></button>
          </div>
        </div>

        <div className="price-grid reveal">
          {PLANS.map((plan) => {
            const displayPrice = annual ? plan.annualMonthly : plan.price;
            return (
              <article key={plan.id} className={"card price" + (plan.featured ? " feat" : "")}>
                {plan.badge && (
                  <span className="price-badge" style={plan.badgeGold ? { background:"linear-gradient(135deg,#C8952A,#A8492A)", color:"#fff" } : {}}>{plan.badge}</span>
                )}
                <div className="price-name">{plan.name}</div>
                <div className="price-tag">{plan.tag}</div>
                <div className="price-amt">
                  {displayPrice === 0
                    ? <span className="price-big">{TR.free_label}</span>
                    : <><span className="price-cur">$</span><span className="price-big">{displayPrice}</span><span className="price-per">{TR.per_month}</span></>}
                  {displayPrice > 0 && annual && (
                    <div style={{ fontSize:11, color:plan.accent, opacity:.8, marginTop:3, fontWeight:600 }}>{TR.billed} ${plan.annualTotal}{TR.per_year} · {TR.saves} {plan.annualSaving}%</div>
                  )}
                </div>

                <ul className="price-feats">
                  {plan.features.map((f, i) => f.divider ? (
                    <li key={i} style={{ display:"flex", alignItems:"center", gap:8, margin:"8px 0 4px", listStyle:"none" }}>
                      <div style={{ flex:1, height:1, background:`${plan.accent}25` }} />
                      <span style={{ fontSize:9, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:plan.accent, padding:"2px 8px", borderRadius:99, background:`${plan.accent}12`, border:`1px solid ${plan.accent}25`, whiteSpace:"nowrap" }}>{TR.desc_soon}</span>
                      <div style={{ flex:1, height:1, background:`${plan.accent}25` }} />
                    </li>
                  ) : (
                    <li key={i} style={{ opacity: f.inc ? 1 : 0.35, display:"flex", alignItems:"center", gap:7 }}>
                      <span style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                        background: f.soon ? `${plan.accent}10` : f.inc ? `${plan.accent}18` : "rgba(0,0,0,.05)",
                        border: `1px solid ${f.soon ? plan.accent+"22" : f.inc ? plan.accent : "rgba(0,0,0,.08)"}30`
                      }}>
                        {f.soon
                          ? <svg viewBox="0 0 24 24" width={9} height={9} fill="none" stroke={plan.accent} strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".5"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>
                          : f.inc
                            ? <svg viewBox="0 0 24 24" width={9} height={9} fill="none" stroke={plan.accent} strokeWidth="3" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>
                            : <svg viewBox="0 0 24 24" width={8} height={8} fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        }
                      </span>
                      <span style={{ opacity: f.soon ? 0.55 : 1, fontStyle: f.soon ? "italic" : "normal" }}>{f.t}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === 0
                  ? <button className={plan.ctaClass} style={{cursor:"pointer"}} onClick={() => {
                      setShowSignup(true);
                      try { if (window.gtag) window.gtag("event", "begin_signup", { plan: "esencial" }); } catch (e) {}
                    }}>{plan.cta}</button>
                  : <button className={plan.ctaClass} style={{cursor:"pointer"}} onClick={() => {
                      setStripePlan(plan.id);
                      try { if (window.gtag) window.gtag("event", "begin_checkout", { plan: plan.id }); } catch (e) {}
                    }}>{(plan.id==="bienestar" && annual) ? `${CUR_LANG==="en"?"Choose":"Elegir"} ${plan.name}` : plan.cta}</button>}
              </article>
            );
          })}
        </div>

        <p className="sec-lead center reveal" style={{ marginTop:28, fontSize:13, opacity:.6 }}>
          {TR.pricing_disclaimer}
        </p>

        {stripePlan && <StripeCheckoutModal planId={stripePlan} onClose={() => setStripePlan(null)} />}
        {showSignup && <LoginModal onClose={() => setShowSignup(false)} appHref={appHref} initialTab="registro" />}
      </div>
    </section>
  );
}

const FAQS_ES = [
  { ico:"shield", tag:"Contenido",  q:"¿La información está revisada por profesionales?", a:"El contenido de Lumé se elabora contrastando guías clínicas públicas de organismos de referencia en salud materna (como la OMS y las sociedades de ginecología). Además, estamos formando un comité clínico asesor con verificación colegiada; si eres profesional, puedes unirte desde nuestra página de expertos." },
  { ico:"spark",  tag:"Asistente",  q:"¿El asistente reemplaza a mi médico?",              a:"No, y nunca lo hará. Lumé te informa, te tranquiliza y te ayuda a preparar tus consultas, pero siempre te orientará a tu profesional de salud ante cualquier señal de alerta." },
  { ico:"check",  tag:"Planes",     q:"¿Puedo cancelar cuando quiera?",                    a:"Por supuesto. Puedes cancelar tu suscripción en cualquier momento desde la app, sin preguntas ni penalizaciones. Conservarás el acceso hasta el final del periodo pagado." },
  { ico:"shield", tag:"Privacidad", q:"¿Mis datos están seguros?",                         a:"Tu privacidad es sagrada. Ciframos toda tu información, cumplimos el RGPD y nunca vendemos tus datos a terceros. Tú decides qué compartir." },
  { ico:"leaf",   tag:"Inicio",     q:"¿Desde qué semana puedo empezar a usar Lumé?",      a:"Desde el primer día que sabes que estás embarazada. La app crece contigo semana a semana, adaptándose al trimestre y a los hitos de tu bebé." },
  { ico:"heart",  tag:"Planes",     q:"¿Hay alguna versión gratuita?",                     a:"Sí: los primeros 7 días son completamente gratis, sin tarjeta de crédito. También tenemos un plan básico gratuito con funciones esenciales." },
];
const FAQS_EN = [
  { ico:"shield", tag:"Content",  q:"Is the information reviewed by professionals?", a:"Lumé's content is developed by cross-checking public clinical guidelines from leading maternal health organizations (like the WHO and gynecology societies). We're also forming a clinical advisory committee with peer verification; if you're a healthcare professional, you can join from our experts page." },
  { ico:"spark",  tag:"Assistant",  q:"Does the assistant replace my doctor?",              a:"No, and it never will. Lumé informs you, reassures you and helps you prepare for your appointments, but will always direct you to your healthcare provider for any warning sign." },
  { ico:"check",  tag:"Plans",     q:"Can I cancel anytime?",                    a:"Of course. You can cancel your subscription at any time from the app, no questions asked and no penalties. You'll keep access until the end of the paid period." },
  { ico:"shield", tag:"Privacy", q:"Is my data safe?",                         a:"Your privacy is sacred. We encrypt all your information, comply with GDPR, and never sell your data to third parties. You decide what to share." },
  { ico:"leaf",   tag:"Getting started",     q:"From what week can I start using Lumé?",      a:"From the first day you know you're pregnant. The app grows with you week by week, adapting to your trimester and your baby's milestones." },
  { ico:"heart",  tag:"Plans",     q:"Is there a free version?",                     a:"Yes: the first 7 days are completely free, no credit card required. We also have a free basic plan with essential features." },
];
const FAQS = CUR_LANG === "en" ? FAQS_EN : FAQS_ES;

function FAQ() {
  const [open, setOpen] = React.useState(null);
  return (
    <section className="section faq-premium" id="faq">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">{TR.faq_eyebrow}</span>
          <h2 className="sec-title">{TR.faq_h2}</h2>
          <p className="sec-lead">{TR.faq_lead}</p>
        </div>
        <div className="faq-grid reveal">
          {FAQS.map(({ ico, tag, q, a }, i) => (
            <div className={"faq-item" + (open === i ? " open" : "")} key={i}
              style={{background: open===i
                ? "linear-gradient(135deg,rgba(255,245,235,.96) 0%,rgba(255,248,238,.92) 100%)"
                : "linear-gradient(135deg,rgba(255,255,255,.82) 0%,rgba(255,248,235,.72) 100%)",
                backdropFilter:"blur(20px) saturate(160%)",
                WebkitBackdropFilter:"blur(20px) saturate(160%)",
                border: open===i ? "1px solid rgba(168,73,42,.3)" : "1px solid rgba(255,255,255,.85)",
                boxShadow: open===i
                  ? "0 16px 48px rgba(80,30,16,.16),0 1px 0 rgba(255,255,255,.9) inset"
                  : "0 4px 20px rgba(80,30,16,.08),0 1px 0 rgba(255,255,255,.9) inset"}}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span className="faq-q-ico"><I d={ICONS[ico]}/></span>
                <span className="faq-q-body">
                  <span className="faq-tag-lbl">{tag}</span>
                  <span className="faq-q-text">{q}</span>
                </span>
                <span className="faq-ico" aria-hidden="true"></span>
              </button>
              <div className="faq-a"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>);
}

function FinalCTA({ appHref }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, dots = [], raf;
    const makeDots = () => {
      dots = [];
      for (let i = 0; i < 55; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 3 + 0.8,
          vx: (Math.random() - .5) * 0.38, vy: (Math.random() - .5) * 0.38,
          a: Math.random() * 0.65 + 0.25,
          gold: Math.random() > 0.45
        });
      }
    };
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      makeDots();
    };
    resize();
    window.addEventListener('resize', resize);
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.gold ? `rgba(212,180,100,${d.a})` : `rgba(200,130,110,${d.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <section className="final">
      <div className="wrap">
        <div className="final-box reveal">
          <canvas ref={canvasRef} aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',borderRadius:'inherit',pointerEvents:'none',zIndex:0}}></canvas>
          <div className="final-glow" aria-hidden="true"></div>
          <div style={{position:'relative',zIndex:1}}>

            {/* Beta badge */}
            <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 16px',borderRadius:99,background:'rgba(212,175,80,.12)',border:'1px solid rgba(212,175,80,.28)',marginBottom:24}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.9)" strokeWidth="2" strokeLinecap="round"><path d="M12 3c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4C10.4 7.8 11.4 6.8 12 3Z"/></svg>
              <span style={{fontSize:12.5,fontWeight:700,color:'rgba(212,175,80,.9)'}}>{TR.final_badge}</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{TR.final_badge2}</span>
            </div>

            <h2 dangerouslySetInnerHTML={{ __html: TR.final_h2 }}></h2>
            <p style={{marginBottom:22}}>{TR.final_p}</p>

            {/* Testimonial pull quote */}
            <div style={{padding:"18px 20px",borderRadius:18,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.11)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",marginBottom:26}}>
              <p style={{fontSize:14.5,fontStyle:"italic",color:"rgba(255,255,255,.82)",lineHeight:1.72,margin:"0 0 14px"}}>"{TST[0].q}"</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,rgba(168,73,42,.75),rgba(200,149,42,.65))",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid rgba(212,175,80,.32)"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"rgba(255,255,255,.92)",fontFamily:"'Cormorant Garamond',serif"}}>C</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)"}}>{TST[0].n}</div>
                  <div style={{fontSize:11,color:"rgba(212,175,80,.65)",fontWeight:500}}>{TST[0].a} {TR.final_quote_meta}</div>
                </div>
                <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="rgba(212,175,80,.85)" stroke="none"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/></svg>)}</div>
              </div>
            </div>

            {/* What you get */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 16px',marginBottom:28,textAlign:'left'}}>
              {TR.final_items.map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:16,height:16,borderRadius:'50%',background:'rgba(100,200,80,.18)',border:'1px solid rgba(100,200,80,.4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(120,210,90,.9)" strokeWidth="3.5" strokeLinecap="round"><path d="M5 12l4 4L19 7"/></svg>
                  </div>
                  <span style={{fontSize:13,color:'rgba(255,255,255,.7)',fontWeight:500}}>{item}</span>
                </div>
              ))}
            </div>

            <div className="final-cta">
              <a className="btn btn-primary" href="#" onClick={e=>{e.preventDefault();window.__lumeOpenModal?.();}}>{TR.final_cta1}</a>
              <a className="btn btn-ghost-inv" href="#precios">{TR.final_cta2}</a>
            </div>
            <p className="final-note">{TR.final_note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer-prem">
      <div className="wrap">
        <div className="fp-top">
          <div className="fp-brand">
            <Logo />
            <p>{TR.footer_tagline}<br/>{TR.footer_tagline2}</p>
            <div className="fp-social">
              <a href="#" aria-label="Instagram" className="fp-soc-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
              <a href="#" aria-label="TikTok" className="fp-soc-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3a4 4 0 01-4-4h-3v14.5a2.5 2.5 0 11-2.5-2.4V8a6.5 6.5 0 106.5 6.5V7.2a7.5 7.5 0 004.5 1.5V5.5A4 4 0 0119.6 3z"/></svg></a>
              <a href="#" aria-label="YouTube" className="fp-soc-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/></svg></a>
            </div>
          </div>
          <div className="fp-links-group">
            <div className="fp-col">
              <h5>{TR.footer_col_producto}</h5>
              <a href="#caracteristicas">{TR.footer_caracteristicas}</a>
              <a href="#semana">{TR.footer_seguimiento}</a>
              <a href="#precios">{TR.footer_precios}</a>
              <a href="#faq">{TR.footer_faq}</a>
            </div>
            <div className="fp-col">
              <h5>{TR.footer_col_compania}</h5>
              <a href="#expertos">{TR.footer_fuentes}</a>
              <a href="expertos.html" style={{color:"var(--gold,#E6CFA1)",fontWeight:600}}>{TR.footer_profesional}</a>
              <a href="mailto:contacto@lume-app.com">{TR.footer_contacto}</a>
            </div>
            <div className="fp-col">
              <h5>{TR.footer_col_legal}</h5>
              <a href="legal.html">{TR.footer_privacidad}</a>
              <a href="legal.html">{TR.footer_terminos}</a>
              <a href="legal.html">{TR.footer_cookies}</a>
            </div>
          </div>
        </div>
        <div className="fp-bottom">
          <span>{TR.footer_copyright}</span>
          <div className="fp-badges">
            <span className="fp-badge">RGPD</span>
            <span className="fp-badge">Beta 2026</span>
            <span className="fp-badge">Basado en guías clínicas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [shown, setShown] = React.useState(() => !localStorage.getItem("lume_cookie_consent"));
  if (!shown) return null;
  const accept = () => { localStorage.setItem("lume_cookie_consent", "accepted"); setShown(false); };
  const reject = () => { localStorage.setItem("lume_cookie_consent", "rejected"); setShown(false); };
  return (
    <div style={{
      position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)",
      zIndex:9000, width:"min(580px, calc(100vw - 32px))",
      background:"rgba(28,12,6,.93)", backdropFilter:"blur(28px) saturate(160%)",
      WebkitBackdropFilter:"blur(28px) saturate(160%)",
      border:"1px solid rgba(212,175,80,.22)", borderRadius:20,
      padding:"18px 22px", boxShadow:"0 24px 60px rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.06) inset",
      display:"flex", alignItems:"center", gap:16, flexWrap:"wrap"
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.8)" strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0}}>
        <path d="M12 3c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4C10.4 7.8 11.4 6.8 12 3Z"/>
      </svg>
      <p style={{flex:1, fontSize:13, color:"rgba(255,255,255,.68)", lineHeight:1.55, margin:0, minWidth:200}}>
        {TR.cookie_text} <a href="legal.html" style={{color:"rgba(212,175,80,.9)", textDecoration:"none", fontWeight:600}}>{TR.cookie_link}</a>.
      </p>
      <div style={{display:"flex", gap:10, flexShrink:0}}>
        <button onClick={reject} style={{padding:"9px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.18)", background:"transparent", color:"rgba(255,255,255,.5)", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.8)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>
          {TR.cookie_reject}
        </button>
        <button onClick={accept} style={{padding:"9px 20px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#A8492A,#8B3520)", color:"#FBF3EB", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(168,73,42,.45)"}}>
          {TR.cookie_accept}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { TopBar, Nav, Hero, Trust, ValueProps, Showcase, Experts, Testimonials, DescargaSection, Pricing, FAQ, FinalCTA, Footer, CookieBanner, useReveal, WaveDivider });