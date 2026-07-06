/* Lumé app — core: icons, data, FruitIcon, Inicio, TabBar */

function AppIcon({ name, size = 24, sw = 1.7 }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const g = {
    home: <g {...p}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9.5h12V10" /><path d="M10 19.5V14h4v5.5" /></g>,
    chat: <g {...p}><path d="M12 3c4.6 0 8 3 8 6.8 0 3.8-3.4 6.8-8 6.8-1 0-1.9-.1-2.8-.4L4 18l1-3.4C4.4 13.5 4 11.7 4 9.8 4 6 7.4 3 12 3Z" /><path d="M12 7.2c.4 2.2.9 2.7 3 3.1-2.1.4-2.6.9-3 3-.4-2.1-.9-2.6-3-3 2.1-.4 2.6-.9 3-3.1Z" /></g>,
    names: <g {...p}><path d="M12 20s-7-4.3-7-9.4C5 7.5 7 6 9 6c1.6 0 2.6.9 3 1.8C12.4 6.9 13.4 6 15 6c2 0 4 1.5 4 4.6 0 5.1-7 9.4-7 9.4Z" /></g>,
    nutri: <g {...p}><path d="M6 18c0-7 5-11 12-11 0 7-5 11-12 11Z" /><path d="M6 18c3-3.4 5.4-5.5 8.5-7.2" /></g>,
    premium: <g {...p}><path d="M4 8l3.5 2.5L12 5l4.5 5.5L20 8l-1.4 9.5H5.4L4 8Z" /></g>,
    spark: <g {...p}><path d="M12 7c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" /></g>,
    scan: <g {...p}><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M7 12c2-2.2 3.3-3.3 5-3.3S15 9.8 17 12c-2 2.2-3.3 3.3-5 3.3S9 14.2 7 12Z" /><circle cx="12" cy="12" r="1.2" /></g>,
    calendar: <g {...p}><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M4 9h16M8 3v4M16 3v4" /></g>,
    pulse: <g {...p}><path d="M3 12h4l2-5 4 10 2-5h6" /></g>,
    leaf: <g {...p}><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z" /><path d="M5 19c3.5-4 6.5-6.5 10-8.5" /></g>,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" style={{ stroke: "rgba(137, 67, 48, 0.55)" }} /><path d="M10 19a2 2 0 0 0 4 0" style={{ stroke: "rgba(137, 67, 48, 0.55)" }} /></g>,
    send: <g {...p}><path d="M5 12l15-7-7 15-2-6-6-2Z" /></g>,
    heart: <g {...p}><path d="M12 20s-7-4.3-7-9.4C5 7.5 7 6 9 6c1.6 0 2.6.9 3 1.8C12.4 6.9 13.4 6 15 6c2 0 4 1.5 4 4.6 0 5.1-7 9.4-7 9.4Z" /></g>,
    x: <g {...p}><path d="M6 6l12 12M18 6L6 18" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></g>,
    flame: <g {...p}><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.4.6-2.4 1.2-3 .2 1 .8 1.6 1.6 1.8C11 8.5 10.5 6 12 3Z" /></g>,
    book: <g {...p}><path d="M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2V5Z" /><path d="M5 19a2 2 0 0 1 2-2h11" /></g>,
    meditation: <g {...p}><circle cx="12" cy="6" r="2" /><path d="M12 9c-2.5 0-4 1.5-4 4l-3 2M12 9c2.5 0 4 1.5 4 4l3 2M12 9v6m0 0-3 4m3-4 3 4" /></g>,
    exercise: <g {...p}><path d="M6 4v6M6 14v6M18 4v6M18 14v6M3 7h6M15 7h6M3 17h6M15 17h6" /></g>,
    star: <g {...p}><path d="M12 4l2.3 4.7 5.2.8-3.8 3.7.9 5.1L12 16.7 7.4 18l.9-5.1L4.5 9.5l5.2-.8L12 4Z" /></g>,
    check: <g {...p}><path d="M5 12l4.5 4.5L19 7" /></g>,
    plus: <g {...p}><path d="M12 5v14M5 12h14" /></g>,
    play: <path d="M8 5l12 7-12 7Z" fill="currentColor" />,
    back: <g {...p}><path d="M19 12H5M12 5l-7 7 7 7" /></g>,
    drop: <g {...p}><path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z" /></g>,
    chevron: <g {...p}><path d="M9 6l6 6-6 6" /></g>,
    award: <g {...p}><circle cx="12" cy="9" r="6" /><path d="M8.2 14.8L7 21l5-2.5L17 21l-1.2-6.2" /></g>,
    weight: <g {...p}><rect x="3" y="8" width="18" height="12" rx="3" /><path d="M9 8a3 3 0 0 1 6 0" /><path d="M12 12v3" /></g>,
    settings: <g {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></g>,
    edit: <g {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></g>,
    trash: <g {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></g>,
    chart: <g {...p}><path d="M3 20h18M5 20V12l5-5 4 4 5-6v15" /></g>,
    info: <g {...p}><circle cx="12" cy="12" r="9" style={{ stroke: "rgb(210, 190, 178)" }} /><path d="M12 8h.01M12 12v5" style={{ stroke: "rgb(205, 185, 175)" }} /></g>,
    photo: <g {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></g>,
    diary: <g {...p}><path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2V5Z"/><path d="M5 19a2 2 0 0 1 2-2h11"/><path d="M9 7h6M9 10.5h4"/></g>,
    music: <g {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></g>,
    wave: <g {...p}><path d="M2 12c2-5 4-7 6-7s4 7 6 7 4-7 6-7"/></g>,
    baby: <g {...p}><circle cx="12" cy="8" r="4"/><path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M5 21c0-3.3 3.1-6 7-6s7 2.7 7 6"/></g>,
    expert: <g {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M15.5 13.5l1.5 2 3-3"/></g>
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ ...{ width: size, height: size, display: "block" }, width: "30px", height: "30px" }}>{g[name] || g.spark}</svg>;
}

/* ── Week milestones ─── */
const WEEKS = [
{ w: 6, tri: 0, fruit: "una lenteja", cm: 0.5, g: 0, note: "Su corazón empieza a latir, aún del tamaño de una semilla." },
{ w: 8, tri: 0, fruit: "una frambuesa", cm: 1.6, g: 1, note: "Se forman los esbozos de brazos y piernas; los rasgos se definen." },
{ w: 10, tri: 0, fruit: "una fresa", cm: 3.1, g: 4, note: "Ya tiene uñas diminutas y puede mover las articulaciones." },
{ w: 12, tri: 0, fruit: "una ciruela", cm: 5.4, g: 14, note: "Sus reflejos despiertan; pronto abrirá y cerrará los dedos." },
{ w: 14, tri: 0, fruit: "un limón", cm: 8.7, g: 43, note: "Su cuerpecito se estira: las piernas son ya más largas que los brazos." },
{ w: 16, tri: 1, fruit: "un aguacate", cm: 11.6, g: 100, note: "Empieza a oír sonidos y tu voz se vuelve familiar para él." },
{ w: 20, tri: 1, fruit: "un plátano", cm: 25, g: 300, note: "Ecuador del embarazo: quizá sientas sus primeros movimientos." },
{ w: 24, tri: 1, fruit: "una mazorca de maíz", cm: 30, g: 600, note: "Sus pulmones desarrollan vasos; cejas y pestañas ya son visibles." },
{ w: 28, tri: 2, fruit: "una berenjena", cm: 37, g: 1000, note: "Abre los ojos y distingue la luz que entra por tu vientre." },
{ w: 32, tri: 2, fruit: "un coco", cm: 42, g: 1700, note: "Practica la respiración y gana grasa para regular su temperatura." },
{ w: 36, tri: 2, fruit: "una lechuga romana", cm: 47, g: 2600, note: "Se coloca cabeza abajo, preparándose para el encuentro." },
{ w: 40, tri: 2, fruit: "una sandía pequeña", cm: 51, g: 3400, note: "A término: cada día es ahora una pequeña eternidad de espera." }];

function weekIndex(w) {let i = 0;for (let j = 0; j < WEEKS.length; j++) if (w >= WEEKS[j].w) i = j;return i;}

/* ── 3D Fruit icons ─── */
const APP_FRUIT_IMGS = [
{ src: "uploads/ue/out/10.png", scale: 0.85 },
{ src: "uploads/ue/out/4.png", scale: 0.95 },
{ src: "uploads/ue/out/6.png", scale: 0.95 },
{ src: "uploads/ue/out/9.png", scale: 0.95 },
{ src: "uploads/ue/out/7.png", scale: 0.92 },
{ src: "uploads/ue/out/2.png", scale: 0.92 },
{ src: "uploads/ue/out/3.png", scale: 0.85 },
{ src: "uploads/ue/out/1.png", scale: 0.90 },
{ src: "uploads/fruits/10_cropped.png", scale: 0.92 },
{ src: "uploads/ue/out/8.png", scale: 0.78 },
{ src: "uploads/fruits/7_cropped.png", scale: 0.95 },
{ src: "uploads/ue/out/5_cropped.png", scale: 0.96 }];

const TRI_HALO = [
"radial-gradient(circle, rgba(255,140,165,.45) 0%, rgba(255,140,165,0) 70%)",
"radial-gradient(circle, rgba(255,168,100,.42) 0%, rgba(255,168,100,0) 70%)",
"radial-gradient(circle, rgba(172,130,220,.42) 0%, rgba(172,130,220,0) 70%)"];

function AppFruitIcon({ idx, size = 100, tri = -1 }) {
  const item = APP_FRUIT_IMGS[Math.max(0, Math.min(APP_FRUIT_IMGS.length - 1, idx))];
  const scaled = Math.round(size * item.scale);
  const hs = Math.round(size * 1.5);
  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
      {tri >= 0 && <div style={{ position: "absolute", width: hs, height: hs, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: TRI_HALO[tri], pointerEvents: "none" }} />}
      <img src={item.src} width={scaled} height={scaled} alt="" style={{ objectFit: "contain", display: "block", position: "relative", filter: "drop-shadow(0 4px 10px rgba(200,100,120,.18))" }} />
    </div>);

}

/* ── BabyHeart illustration ─── */
function BabyHeart({ size = 112, tri = 0 }) {
  const tint = ["rgba(255,140,165,.10)", "rgba(255,168,100,.09)", "rgba(172,130,220,.10)"][tri] || "transparent";
  return (
    <div style={{
      position: "relative", width: size, height: size, flexShrink: 0,
      borderRadius: "22px", overflow: "hidden",
      background: "#e8b8c4"
    }}>
      <img src="uploads/baby-v2.png"
      width={size} height={size} alt="Tu bebé"
      style={{ display: "block", objectFit: "contain", width: "100%", height: "100%", filter: "saturate(1.06)" }} />
      <div style={{ position: "absolute", inset: 0, background: tint, pointerEvents: "none" }} />
    </div>);

}

/* ── Medal icon ─── */
function MedalIcon({ level = "Bronce", size = 44 }) {
  const C = {
    Bronce: { m: "#cd7f32", l: "#f0b060", d: "#8b5010", r: "#a05a1a" },
    Plata: { m: "#b0b8c4", l: "#d8dde6", d: "#7a8290", r: "#9098a0" },
    Oro: { m: "#d4a830", l: "#f0cc50", d: "#907010", r: "#b08418" }
  }[level] || { m: "#cd7f32", l: "#f0b060", d: "#8b5010", r: "#a05a1a" };
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <polygon points="18,16 14,2 22,2 24,9 26,2 34,2 30,16" fill={C.r} opacity="0.95" />
      <polygon points="22,2 24,9 26,2 24,11" fill={C.d} opacity="0.4" />
      <circle cx="24" cy="32" r="15" fill={C.m} />
      <circle cx="24" cy="32" r="12" fill={C.l} opacity="0.38" />
      <circle cx="20" cy="28" r="3.5" fill="white" opacity="0.28" />
      <path d="M24,24l2,5.5h5.8l-4.7,3.4 1.8,5.6L24,35.1l-4.9,3.4 1.8-5.6-4.7-3.4H22Z" fill="white" opacity="0.88" />
    </svg>);

}

/* ── ScreenHeader (shared by sub-screens) ─── */
function ScreenHeader({ title, goBack, right, titleStyle }) {
  return (
    <div className="screen-hdr">
      <button className="back-btn" onClick={goBack} aria-label="Regresar"><AppIcon name="back" size={18} /></button>
      <h2 className="sh-title" style={titleStyle}>{title}</h2>
      {right || <div style={{ width: 38 }} />}
    </div>);
}

/* ── Inicio ─── */
function Inicio({ week, setWeek, push, goToTab, unreadCount=0, onBell }) {
  const idx = weekIndex(week);
  const data = WEEKS[idx];
  const elapsed = week * 7;
  const remaining = (40 - week) * 7;
  const triLabel = data.tri === 0 ? "Primer Trimestre" : data.tri === 1 ? "Segundo Trimestre" : "Tercer Trimestre";

  const calcDue = React.useCallback((w) => {
    const d = new Date(Date.now() + (40 - w) * 7 * 86400000);
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  }, []);
  const fmtDue = (iso) => {try {return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });} catch {return null;}};
  const [customDue, setCustomDue] = React.useState(() => {try {const v = localStorage.getItem("lume_due");return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;} catch {return null;}});
  const [editingDue, setEditingDue] = React.useState(false);
  const [dueTmp, setDueTmp] = React.useState("");
  const dueDisplay = customDue ? fmtDue(customDue) : calcDue(week);

  const saveDue = () => {
    if (dueTmp) {
      setCustomDue(dueTmp);
      try {localStorage.setItem("lume_due", dueTmp);} catch {}
    }
    setEditingDue(false);
  };

  const [nextApptLabel, setNextApptLabel] = React.useState("—");
  const [favCount, setFavCount] = React.useState(2);
  const [points, setPoints] = React.useState(126);
  const [adHover, setAdHover] = React.useState(false);
  React.useEffect(() => {
    try {
      const a = JSON.parse(localStorage.getItem("lume_appts") || "[]");
      const today = new Date().toISOString().slice(0, 10);
      const next = a.filter((x) => x.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
      if (next) setNextApptLabel(new Date(next.date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }));
      setFavCount(parseInt(localStorage.getItem("lume_fav_count") || "2") || 2);
      setPoints(parseInt(localStorage.getItem("lume_points") || "126") || 126);
    } catch {}
  }, []);

  // Clay icon map: key → path
  const CLAY = {
    sintomas:    "uploads/icon-app-34.png",
    citas:       "uploads/icon-app-33.png",
    patadas:     "uploads/icon-app-35.png",
    fotos:       "uploads/icon-app-28.png",
    ultrasonidos:"uploads/icon-app-23.png",
    peso:        "uploads/icon-app-29.png",
    recompensas: "uploads/icon-app-41.png",
    meditaciones:"uploads/icon-app-36.png",
    ejercicios:  "uploads/icon-app-38.png",
    diario:      "uploads/icon-app-27.png",
    pareja:      "uploads/icon-app-37.png",
    ajustes:     "uploads/icons/ajustes.png",
    asistente:   "uploads/icons/asistente.png",
    nombres:     "uploads/icons/nombres.png",
    nutricion:   "uploads/icon-app-16.png",
    premium:     "uploads/icons/premium.png",
    "musica-bebe":  "uploads/icon-app-39.png",
    "medit-musica": "uploads/icon-app-40.png",
    "medit-bebes":  "uploads/icon-app-20.png",
    "nutri-plan":   "uploads/icon-app-15.png",
    contenido:   "uploads/icon-app-32.png",
    expertos:    "uploads/icon-app-30.png",
    historial:   "uploads/icons/checklist.png",
  };

  const QA = [
  /* ── Esencial (gratis) ── */
  { key: "sintomas",    icon: "pulse",     label: "Síntomas" },
  { key: "citas",       icon: "calendar",  label: "Citas" },
  { key: "patadas",     icon: "heart",     label: "Patadas" },
  { key: "peso",        icon: "weight",    label: "Mi peso" },
  { key: "fotos",       icon: "photo",     label: "Mis fotos" },
  { key: "ultrasonidos",icon: "scan",      label: "Ultrasonidos" },
  { key: "recompensas", icon: "award",     label: "Recompensas" },
  /* ── Bienestar ($9) ── */
  { key: "meditaciones",icon: "meditation",label: "Meditación",     plan: "bien" },
  { key: "ejercicios",  icon: "exercise",  label: "Ejercicios",     plan: "bien" },
  { key: "contenido",   icon: "book",      label: "Guía semanal",   plan: "bien" },
  { key: "diario",      icon: "diary",     label: "Diario",         plan: "bien" },
  { key: "nutri-plan",  icon: "leaf",      label: "Plan Nutri.",    plan: "bien" },
  { key: "musica-bebe", icon: "music",     label: "Música Bebé",    plan: "bien" },
  { key: "medit-musica",icon: "wave",      label: "Medit.+Música",  plan: "bien" },
  { key: "pareja",      icon: "heart",     label: "Pareja",         plan: "bien" },
  /* ── Profesional ($19) ── */
  { key: "expertos",    icon: "expert",    label: "Expertos",       plan: "pro" },
  { key: "historial",   icon: "chart",     label: "Historial PDF",  plan: "pro" },
  { key: "medit-bebes", icon: "baby",      label: "Medit. Bebés",   plan: "pro" }];


  const dayName = new Date().toLocaleDateString("es-ES", { weekday: "long" });

  return (
    <div className="screen s-enter" style={{ position: "relative" }}>
        {/* App header */}
      <div className="ah">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="uploads/Coffee.png" alt="Lumé" style={{ height:52, width:52, objectFit:"contain", borderRadius:12 }} />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={onBell} style={{ position:"relative", width:38, height:38, borderRadius:"50%", border:"none",
            background:"rgba(168,73,42,.1)", color:"#A8492A", display:"flex", alignItems:"center",
            justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <AppIcon name="bell" size={20}/>
            {unreadCount>0&&(
              <div style={{ position:"absolute", top:4, right:4, width:14, height:14, borderRadius:"50%",
                background:"#A8492A", border:"2px solid #f9f1eb", display:"flex", alignItems:"center",
                justifyContent:"center" }}>
                <span style={{ fontSize:8, fontWeight:800, color:"#fff5ee", lineHeight:1 }}>{unreadCount}</span>
              </div>
            )}
          </button>
          <div className="ah-ava">{(localStorage.getItem("lume_nombre")||"S").charAt(0).toUpperCase()}</div>
        </div>
      </div>

      {/* Week hero */}
      <div className="wk-hero">
        {/* Decoración luna */}
        <div style={{ position:"absolute", top:-28, right:-28, width:130, height:130, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,220,170,.18), transparent 68%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-20, left:-20, width:90, height:90, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,180,120,.14), transparent 68%)", pointerEvents:"none" }} />

        {/* Top row */}
        <div className="wk-top">
          <span className="wk-tri">{triLabel}</span>
          <span className="wk-chip">S. {week} / 40</span>
        </div>

        {/* Fruta grande */}
        <div className="wk-ring-wrap" style={{ width:240, height:240 }}>
          <svg className="wk-ring" viewBox="0 0 240 240" aria-hidden="true">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E6CFA1" />
                <stop offset="60%" stopColor="#F5E4BC" />
                <stop offset="100%" stopColor="#C8952A" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(255,255,255,.11)" strokeWidth="5" />
            <circle cx="120" cy="120" r="108" fill="none" stroke="url(#ringGrad)" strokeWidth="5"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 108}
              strokeDashoffset={2 * Math.PI * 108 * (1 - Math.min(40, week) / 40)}
              transform="rotate(-90 120 120)"
              style={{ transition:"stroke-dashoffset .9s var(--ease)", filter:"drop-shadow(0 0 5px rgba(230,207,161,.5))" }} />
          </svg>
          <div className="wk-ring-center"><AppFruitIcon idx={idx} size={158} tri={data.tri} /></div>
          <div className="wk-ring-pct">{Math.round(Math.min(40,week)/40*100)}% recorrido</div>
        </div>

        {/* Semana número grande */}
        <div className="wk-num-big-c">
          <span style={{ fontSize:"72px" }}>{week}</span>
          <small>&nbsp;semanas</small>
        </div>
        <div className="wk-fruit-sub" style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"15px", opacity:.9 }}>del tamaño de {data.fruit}</div>

        {/* Barra de progreso */}
        <div className="wk-prog-bar-wrap">
          <div className="wk-prog-bar-track">
            <div className="wk-prog-bar-fill" style={{ width: (Math.min(40,week)/40*100)+"%" }} />
          </div>
          <div className="wk-prog-labels">
            <span>{elapsed}d recorridos</span>
            <span>{remaining}d por delante</span>
          </div>
        </div>

        <div className="wk-due-row">
          <AppIcon name="calendar" size={13} />
          <span>Fecha probable: {dueDisplay}</span>
          <button className="wk-due-edit" onClick={() => {setDueTmp("");setEditingDue(true);}}>Editar</button>
        </div>
      </div>

      {/* Baby card — video bg */}
      <div className="baby-card-v2" style={{ marginTop:12, background:"transparent", minHeight:190, border:"none",
        boxShadow:"0 16px 48px -12px rgba(80,30,10,.28)" }}>
        {/* Video fondo */}
        <video autoPlay muted loop playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:"inherit" }}>
          <source src="uploads/hero-bg-video-app.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradiente para legibilidad */}
        <div style={{ position:"absolute", inset:0, borderRadius:"inherit",
          background:"linear-gradient(to top, rgba(30,10,5,.78) 45%, rgba(30,10,5,.15) 100%)",
          pointerEvents:"none" }} />

        {/* Contenido */}
        <div className="bcv2-top" style={{ position:"relative", zIndex:1 }}>
          <div>
            <div className="baby-label" style={{ color:"rgba(255,210,185,.75)" }}>Tu bebé esta semana</div>
            <div className="baby-fruit-nm" style={{ color:"#fff8f2" }}>{data.fruit}</div>
            <div className="baby-stats">
              <div className="baby-stat-pill" style={{ background:"rgba(255,255,255,.14)", border:"1px solid rgba(255,255,255,.22)" }}>
                <span className="baby-stat-val" style={{ color:"#fff" }}>{data.cm}</span>
                <span className="baby-stat-unit" style={{ color:"rgba(255,210,185,.75)" }}> cm</span>
              </div>
              {data.g > 0 && <div className="baby-stat-pill" style={{ background:"rgba(255,255,255,.14)", border:"1px solid rgba(255,255,255,.22)" }}>
                <span className="baby-stat-val" style={{ color:"#fff" }}>{data.g >= 1000 ? (data.g/1000).toFixed(1) : data.g}</span>
                <span className="baby-stat-unit" style={{ color:"rgba(255,210,185,.75)" }}>{data.g >= 1000 ? " kg" : " g"}</span>
              </div>}
            </div>
          </div>
        </div>
        <div className="bcv2-divider" style={{ position:"relative", zIndex:1, background:"rgba(255,255,255,.12)" }} />
        <div className="bcv2-note" style={{ position:"relative", zIndex:1, color:"rgba(255,232,215,.9)" }}>{data.note}</div>
      </div>

      {/* Quick stats */}
      <div className="stats-3">
        <div className="stat-card stat-card-cita" onClick={() => push("citas")}>
          <div className="stk">Próx. cita</div>
          <div className="stv">{nextApptLabel}</div>
          <div className="stsub">Control</div>
        </div>
        <div className="stat-card stat-card-nombres" onClick={() => push("nombres")}>
          <div className="stk">Nombres</div>
          <div className="stv">♥ {favCount}</div>
          <div className="stsub">favoritos</div>
        </div>
        <div className="stat-card stat-card-puntos" onClick={() => push("recompensas")}>
          <div className="stk">Mis puntos</div>
          <div className="stv">{points}</div>
          <div className="stsub">Bronce ✦</div>
        </div>
      </div>

      {/* ── Earn Points Nudge ── */}
      {(()=>{
        const k = "lume_ads_" + new Date().toISOString().slice(0,10);
        const adsToday = parseInt(localStorage.getItem(k)||"0");
        if (adsToday >= 3) return null;
        const left = 3 - adsToday;
        return (
          <div onClick={() => window.triggerRewardedAd && window.triggerRewardedAd("points")}
            style={{ margin:"8px 0", borderRadius:20, overflow:"hidden", cursor:"pointer",
              background:"linear-gradient(135deg,#3d1a0e 0%,#5a2a14 50%,#7a3a1e 100%)",
              boxShadow:"0 12px 32px rgba(61,26,14,.35)", position:"relative" }}>
            {/* shimmer */}
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,.06) 50%,transparent 65%)", pointerEvents:"none" }} />
            <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
                background:"linear-gradient(135deg,rgba(200,149,42,.35),rgba(168,73,42,.25))",
                border:"1.5px solid rgba(230,207,161,.3)",
                display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6CFA1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:"#fff", lineHeight:1.2, marginBottom:3 }}>
                  Gana 50 puntos ahora
                </div>
                <div style={{ display:"flex", gap:4, marginBottom:6 }}>
                  {[0,1,2].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<adsToday?"#E6CFA1":"rgba(230,207,161,.2)", transition:"background .3s" }} />)}
                </div>
                <div style={{ fontSize:11, color:"rgba(230,207,161,.7)", fontWeight:500 }}>
                  Ver 30 seg · {left} video{left!==1?"s":""} disponible{left!==1?"s":""} hoy
                </div>
              </div>
              <div style={{ padding:"9px 14px", borderRadius:12, flexShrink:0,
                background:"linear-gradient(135deg,#E6CFA1,#C8952A)",
                color:"#3d1a0e", fontSize:12, fontWeight:800 }}>Ver ▶</div>
            </div>
          </div>
        );
      })()}

      {/* Ask */}
      <button className="c ask-btn" onClick={() => goToTab("asistente")}>
        <div className="ask-ic" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <img src="uploads/icon-asistente-virtual.png" style={{ width:64, height:64, objectFit:"contain", display:"block" }} />
        </div>
        <div className="ask-body">
          <div className="ask-t">Pregunta a Lumé</div>
          <div className="ask-s">Tu asistente responde al instante</div>
        </div>
        <AppIcon name="chevron" size={16} />
      </button>

      {/* Quick access */}
      <div className="sec-label">Accesos rápidos</div>
      <div className="qa">
        {QA.map((q) => {
          const QC = {
            sintomas:"#E07876",citas:"#6E86E0",patadas:"#E07AA4",fotos:"#9B72D8",
            ultrasonidos:"#4FB6C2",peso:"#5DAE76",recompensas:"#E4BC5A",
            meditaciones:"#C8952A",ejercicios:"#3A8070",contenido:"#6A4A9E",
            diario:"#8B5A9E",expertos:"#A8492A",pareja:"#C84878",historial:"#5DAE76",
            "nutri-plan":"#3A8070","musica-bebe":"#8B5A9E","medit-musica":"#3A8070","medit-bebes":"#6A4A9E",
          };
          const ac = QC[q.key] || "#A8492A";
          const planBadge = q.plan === "pro" ? {bg:"#C8952A", label:"Pro"} : q.plan === "bien" ? {bg:"#A8492A", label:"+"} : null;
          return (
          <button className="c qa-item" key={q.key} onClick={() => push(q.key)}
            style={{background:`linear-gradient(160deg,${ac}12,rgba(255,248,238,.82))`,borderTop:`2.5px solid ${ac}30`}}>
            {planBadge && <div style={{position:"absolute",top:6,right:6,minWidth:16,height:16,borderRadius:8,background:planBadge.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",boxShadow:`0 2px 6px ${planBadge.bg}80`}}>
              <span style={{fontSize:8,fontWeight:800,color:"#fff",letterSpacing:".04em"}}>{planBadge.label}</span>
            </div>}
            <div className="qa-ic" style={{boxShadow:`0 6px 20px ${ac}30, 0 1px 0 rgba(255,255,255,.6) inset`}}>
              {CLAY[q.key]
                ? <img src={CLAY[q.key]} alt={q.label} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <AppIcon name={q.icon} size={24} />}
            </div>
            <div className="qa-label-row">
              <div className="qa-t">{q.label}</div>
            </div>
          </button>
          );
        })}
      </div>

      {/* ── Native Sponsored Card — contextual por trimestre ── */}
      {(()=>{
        const AFF = [
          { icon:"💊", grad:"linear-gradient(135deg,#A8492A,#C8952A)", title:"Elevit Materna", sub:"Ácido fólico + Hierro + DHA · recomendada por ginecólogos", cta:"Ver oferta", deal:"Envío gratis" },
          { icon:"🛋️", grad:"linear-gradient(135deg,#6a5acd,#9b8ee0)", title:"Almohada embarazo en U", sub:"Soporte lumbar y lateral · funda lavable incluida", cta:"Ver precio", deal:"-15% esta semana" },
          { icon:"👶", grad:"linear-gradient(135deg,#2e7d6e,#4db6a0)", title:"Kit bolsa de hospital", sub:"Lo esencial para el gran día · envío express 24h", cta:"Ver más", deal:"Entrega rápida" }
        ];
        const p = AFF[data.tri]||AFF[0];
        return (
          <div
            onMouseEnter={()=>setAdHover(true)}
            onMouseLeave={()=>setAdHover(false)}
            onClick={()=>window.open("#","_blank")}
            style={{
              margin:"18px 0 8px",borderRadius:20,overflow:"hidden",
              background:"linear-gradient(135deg,rgba(248,235,208,.97) 0%,rgba(242,220,182,.94) 60%,rgba(235,205,160,.92) 100%)",
              border:"1px solid rgba(212,175,128,.5)",
              boxShadow:adHover?"0 20px 48px rgba(168,73,42,.22),0 1px 0 rgba(255,255,255,.9) inset":"0 8px 28px rgba(168,73,42,.1),0 1px 0 rgba(255,255,255,.85) inset",
              cursor:"pointer",
              transform:adHover?"translateY(-3px) scale(1.01)":"translateY(0) scale(1)",
              transition:"all .28s cubic-bezier(.23,1,.32,1)",
              position:"relative"
            }}>
            {/* shimmer top line */}
            <div style={{height:2,background:"linear-gradient(90deg,transparent,rgba(212,175,80,.65) 50%,transparent)"}} />
            <div style={{padding:"12px 14px"}}>
              {/* top row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#C8952A"}} />
                  <span style={{fontSize:9,fontWeight:700,color:"#a08050",letterSpacing:".08em",textTransform:"uppercase"}}>Patrocinado</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  {[1,2,3,4,5].map(i=><svg key={i} width="9" height="9" viewBox="0 0 24 24" fill="#D4A830" stroke="none"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/></svg>)}
                  <span style={{fontSize:10,color:"#a08050",marginLeft:3,fontWeight:700}}>4.8</span>
                </div>
              </div>
              {/* main row */}
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{
                  width:50,height:50,borderRadius:15,flexShrink:0,
                  background:p.grad,display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:26,boxShadow:"0 8px 20px rgba(0,0,0,.18)",
                  transform:adHover?"scale(1.12) rotate(-5deg)":"scale(1) rotate(0)",
                  transition:"transform .3s cubic-bezier(.23,1,.32,1)"
                }}>{p.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:"#3d1a0e",lineHeight:1.2,marginBottom:3}}>{p.title}</div>
                  <div style={{fontSize:11,color:"#a08060",marginBottom:5,lineHeight:1.4}}>{p.sub}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,background:"rgba(168,73,42,.1)",border:"1px solid rgba(168,73,42,.15)"}}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#A8492A" stroke="none"><path d="M13 2L4.09 12.96A1 1 0 0 0 5 14.5h6.5l-1 7.5 8.91-10.96A1 1 0 0 0 18.5 9.5H12l1-7.5Z"/></svg>
                    <span style={{fontSize:9.5,fontWeight:700,color:"#A8492A",letterSpacing:".04em"}}>{p.deal}</span>
                  </div>
                </div>
                <button style={{
                  padding:"10px 14px",borderRadius:12,border:"none",flexShrink:0,
                  background:"linear-gradient(135deg,#c4693a,#A8492A)",
                  color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                  boxShadow:"0 6px 16px rgba(168,73,42,.45)",
                  transform:adHover?"scale(1.07)":"scale(1)",
                  transition:"transform .2s"
                }}>{p.cta}</button>
              </div>
            </div>
          </div>
        );
      })()}
      {editingDue &&
      <div className="due-overlay" onClick={() => setEditingDue(false)}>
          <div className="due-box" onClick={(e) => e.stopPropagation()}>
            <h4>Fecha probable de parto</h4>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>Introduce la fecha indicada por tu médico.</p>
            <input type="date" className="app-field" value={dueTmp} onChange={(e) => setDueTmp(e.target.value)} style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" style={{ flex: 1, justifyContent: "center", background: "var(--surface-2)", color: "var(--ink)" }} onClick={() => setEditingDue(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={saveDue}>Guardar</button>
            </div>
          </div>
        </div>
      }
    </div>);

}

/* ── TabBar ─── */
const TABS = [
{ id: "inicio",     label: "Inicio",     img: "uploads/icon-app-22.png", imgSize:"97%" },
{ id: "ajustes",    label: "Ajustes",    img: "uploads/icon-app-21.png", imgSize:"97%" },
{ id: "nombres",    label: "Nombres",    img: "uploads/icon-app-18.png", imgSize:"97%" },
{ id: "nutricion",  label: "Nutrición",  img: "uploads/icon-app-16.png", imgSize:"97%" },
{ id: "premium",    label: "Premium",    img: "uploads/icon-app-19.png", imgSize:"97%" }];

function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) =>
      <button key={t.id} className={"tab" + (active === t.id ? " on" : "")} onClick={() => onChange(t.id)}>
          <div style={{ width:42, height:42, borderRadius:13, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.92)", boxShadow: active===t.id ? "0 3px 12px rgba(168,73,42,.35)" : "0 1px 4px rgba(0,0,0,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img src={t.img} alt={t.label} style={{ width: t.imgSize||"100%", height: t.imgSize||"100%", objectFit: t.imgSize ? "contain" : "cover", display:"block" }} />
          </div>
          {t.label}
        </button>
      )}
    </nav>);

}

/* ── IA real: proxy seguro ─────────────────────────────────
   Cuando tengas tu Cloudflare Worker publicado (instrucciones en servidor/LEEME.md),
   pega aquí su URL, p.ej. "https://lume-ai.tuusuario.workers.dev".
   Vacío = usa la IA del entorno de diseño (solo funciona aquí dentro). */
const LUME_AI_ENDPOINT = "";

async function lumeAI(prompt) {
  if (LUME_AI_ENDPOINT) {
    const r = await fetch(LUME_AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
    if (!r.ok) throw new Error("AI proxy error " + r.status);
    const j = await r.json();
    return j.text;
  }
  return await window.claude.complete(prompt);
}

Object.assign(window, { AppIcon, AppFruitIcon, BabyHeart, MedalIcon, WEEKS, weekIndex, ScreenHeader, Inicio, TabBar, TABS, lumeAI });