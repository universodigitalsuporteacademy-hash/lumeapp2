/* Lumé app — sub-screens: Citas, Síntomas, Recompensas, Ultrasonidos, Peso, Ajustes */

const LS = {
  get: (k, def) => {try {const v = localStorage.getItem(k);return v !== null ? JSON.parse(v) : def !== undefined ? def : null;} catch {return def !== undefined ? def : null;}},
  set: (k, v) => {try {localStorage.setItem(k, JSON.stringify(v));} catch {}}
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const addPoints = (n) => {const p = (LS.get("lume_points") || 126) + n;LS.set("lume_points", p);};

/* ── CITAS ─── */
function CitasScreen({ goBack }) {
  const citasLang = getAppLang2();
  const CT = citasLang==="en" ? {
    eyebrow:"OB check-ups", title:"Medical appointments", sub:"Tap + to schedule · Never miss a check-up",
    reminderToday:"Reminder · Today", reminderTomorrow:"Reminder · Tomorrow", reminderIn:(n)=>`Reminder · in ${n} days`,
    newAppt:"New appointment", apptType:"Appointment type", apptTypePh:"e.g. OB check-up, Ultrasound…",
    date:"Date", time:"Time", notes:"Notes", notesPh:"Doctor, address, preparation…", schedule:"Schedule appointment",
    toast:"✓ Appointment scheduled · +5 points", emptyTitle:"No appointments scheduled",
    emptyBody:"Tap the ", emptyBody2:" to add your first OB check-up.",
    upcoming:"Upcoming", past:"Past",
  } : {
    eyebrow:"Controles obstétricos", title:"Citas médicas", sub:"Toca + para agendar · No pierdas ningún control",
    reminderToday:"Recordatorio · Hoy", reminderTomorrow:"Recordatorio · Mañana", reminderIn:(n)=>`Recordatorio · en ${n} días`,
    newAppt:"Nueva cita", apptType:"Tipo de cita", apptTypePh:"ej. Control obstétrico, Ecografía…",
    date:"Fecha", time:"Hora", notes:"Notas", notesPh:"Médico, dirección, preparación…", schedule:"Agendar cita",
    toast:"✓ Cita agendada · +5 puntos", emptyTitle:"Sin citas agendadas",
    emptyBody:"Toca el ", emptyBody2:" para añadir tu primer control obstétrico.",
    upcoming:"Próximas", past:"Pasadas",
  };
  const dtLocale = citasLang==="en" ? "en-US" : "es-ES";
  const APPT_DEFAULTS = [
    { id: 1, title: "Control obstétrico", date: "2026-04-10", time: "10:30", notes: "Dr. Ramírez — Clínica del Valle" },
    { id: 2, title: "Ecografía morfológica", date: "2026-07-18", time: "09:00", notes: "Llevar resultados anteriores" }
  ];
  const stored = LS.get("lume_appts");
  const [appts, setAppts] = React.useState(() => (stored && stored.length > 0) ? stored : APPT_DEFAULTS);
  const [titulo, setTitulo] = React.useState("");
  const [fecha, setFecha] = React.useState("");
  const [hora, setHora] = React.useState("");
  const [notas, setNotas] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [showPast, setShowPast] = React.useState(false);

  const addAppt = () => {
    if (!titulo || !fecha) return;
    const a = [...appts, { id: Date.now(), title: titulo, date: fecha, time: hora, notes: notas }];
    a.sort((x, y) => x.date.localeCompare(y.date));
    setAppts(a); LS.set("lume_appts", a);
    addPoints(5);
    setTitulo(""); setFecha(""); setHora(""); setNotas("");
    setSaved(true); setShowForm(false);
    setTimeout(() => setSaved(false), 2800);
  };

  const delAppt = (id) => {
    const a = appts.filter((x) => x.id !== id);
    setAppts(a); LS.set("lume_appts", a);
  };

  const upcoming = appts.filter((a) => a.date >= todayISO());
  const past     = appts.filter((a) => a.date < todayISO());

  const nextAppt = upcoming[0];
  const daysUntil = nextAppt ? Math.round((new Date(nextAppt.date + "T00:00:00") - new Date(todayISO() + "T00:00:00")) / 86400000) : null;

  const glassCard = {
    background: "rgba(255,255,255,.52)",
    backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)",
    border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 20px 50px -14px rgba(80,30,16,.44), 0 2px 0 rgba(255,255,255,.9) inset"
  };

  const fmtDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return {
      day: d.getDate(),
      mon: d.toLocaleDateString(dtLocale, { month: "short" }),
      full: d.toLocaleDateString(dtLocale, { weekday: "long", day: "numeric", month: "long" })
    };
  };

  const ApptCard = ({ a, dim }) => {
    const dt = fmtDate(a.date);
    return (
      <div style={{ display: "flex", gap: 13, marginBottom: 12, opacity: dim ? .5 : 1 }}>
        {/* Nodo fecha */}
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: dim ? "linear-gradient(140deg,#b09080,#8a6a5a)" : "linear-gradient(140deg,#d4693a 0%,#8B3520 100%)", border: "3px solid #f0e2d6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: dim ? "none" : "0 8px 24px rgba(168,73,42,.38), 0 0 0 1px rgba(255,255,255,.3) inset" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{dt.day}</span>
            <span style={{ fontSize: 7, fontWeight: 800, color: "rgba(255,255,255,.7)", letterSpacing: ".06em", textTransform: "uppercase", marginTop: 1 }}>{dt.mon}</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ flex: 1, minWidth: 0, ...glassCard, borderRadius: 20, padding: "13px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: "#3d1a0e", lineHeight: 1.2, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: "#b09080", letterSpacing: ".01em" }}>{dt.full}{a.time ? " · " + a.time + (citasLang==="en"?"":" h") : ""}</div>
              {a.notes && (
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginTop: 9, padding: "8px 10px", borderRadius: 10, background: "rgba(168,73,42,.05)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1, opacity: .5 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: 12, color: "#6a4a3a", lineHeight: 1.55 }}>{a.notes}</p>
                </div>
              )}
            </div>
            <button onClick={() => delAppt(a.id)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(200,60,60,.2)", background: "rgba(220,60,60,.07)", color: "#c04040", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f0e2d6", backgroundImage: "linear-gradient(160deg,rgba(249,241,235,.82) 0%,rgba(240,226,214,.8) 45%,rgba(232,213,198,.78) 100%), url('uploads/citas-bg.png')", backgroundSize: "100% 100%, auto 68%", backgroundPosition: "0 0, right -10px top 180px", backgroundRepeat: "no-repeat, no-repeat", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header sticky glass ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.08)", padding: "52px 20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 5 }}>{CT.eyebrow}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px", lineHeight: 1, marginBottom: 4 }}>{CT.title}</h2>
          <p style={{ margin: 0, fontSize: 11.5, color: "#a08070" }}>{CT.sub}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: showForm ? "#A8492A" : "rgba(168,73,42,.12)", color: showForm ? "#fff" : "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .3s cubic-bezier(.23,1,.32,1)", transform: showForm ? "rotate(45deg)" : "none", boxShadow: showForm ? "0 8px 24px rgba(168,73,42,.42)" : "none", flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div style={{ padding: "20px 16px 56px" }}>

        {/* ── Recordatorio próxima cita (notificación) ── */}
        {nextAppt && !showForm && (
          <div style={{ borderRadius: 22, padding: "16px 18px", marginBottom: 16, background: "linear-gradient(145deg,#5E1C08 0%,#7A3218 30%,#A8492A 70%)", boxShadow: "0 18px 44px -14px rgba(80,24,8,.5)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -20, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,128,.25),transparent 65%)", pointerEvents: "none" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 3 }}>
                  {daysUntil === 0 ? CT.reminderToday : daysUntil === 1 ? CT.reminderTomorrow : CT.reminderIn(daysUntil)}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>{nextAppt.title}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.72)", marginTop: 3 }}>
                  {new Date(nextAppt.date + "T00:00:00").toLocaleDateString(dtLocale, { weekday: "long", day: "numeric", month: "long" })}{nextAppt.time ? " · " + nextAppt.time + (citasLang==="en"?"":" h") : ""}
                </div>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div style={{ ...glassCard, borderRadius: 26, padding: "22px 18px", marginBottom: 22, animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#A8492A", marginBottom: 18 }}>{CT.newAppt}</div>

            <div style={{ marginBottom: 12 }}>
              <div className="field-label">{CT.apptType}</div>
              <input className="app-field" placeholder={CT.apptTypePh} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div className="field-label">{CT.date}</div>
                <input type="date" className="app-field" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
              <div>
                <div className="field-label">{CT.time}</div>
                <input type="time" className="app-field" value={hora} onChange={(e) => setHora(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="field-label">{CT.notes}</div>
              <textarea className="app-field" style={{ minHeight: 64, resize: "none" }} placeholder={CT.notesPh} value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
            </div>

            <button
              onClick={addAppt}
              style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", background: titulo && fecha ? "linear-gradient(135deg,#c4693a,#A8492A)" : "rgba(200,185,180,.3)", color: titulo && fecha ? "#fff" : "#b0a09a", fontWeight: 700, fontSize: 15, cursor: titulo && fecha ? "pointer" : "default", boxShadow: titulo && fecha ? "0 12px 32px rgba(168,73,42,.42)" : "none", fontFamily: "inherit", transition: "all .25s" }}
            >
              {CT.schedule}
            </button>
          </div>
        )}

        {/* ── Toast ── */}
        {saved && (
          <div style={{ padding: "14px 18px", borderRadius: 16, background: "rgba(123,191,106,.14)", color: "#3e8836", fontWeight: 700, textAlign: "center", fontSize: 13.5, border: "1px solid rgba(123,191,106,.28)", marginBottom: 20, animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
            ✓ {CT.toast.replace("✓ ","")}
          </div>
        )}

        {/* ── Estado vacío ── */}
        {appts.length === 0 && (
          <div style={{ textAlign: "center", padding: "52px 24px 32px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(168,73,42,.07)", border: "1.5px solid rgba(168,73,42,.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="1.6" strokeLinecap="round" style={{ opacity: .65 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#5a3a2a", marginBottom: 8 }}>{CT.emptyTitle}</div>
            <p style={{ fontSize: 13.5, color: "#a08070", lineHeight: 1.65, margin: 0 }}>{CT.emptyBody}<strong style={{ color: "#A8492A" }}>+</strong>{CT.emptyBody2}</p>
          </div>
        )}

        {/* ── Próximas ── */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#A8492A" }}></div>
              {CT.upcoming} · {upcoming.length}
            </div>
            {upcoming.map((a) => <ApptCard key={a.id} a={a} dim={false} />)}
          </div>
        )}

        {/* ── Pasadas (colapsable) ── */}
        {past.length > 0 && (
          <div>
            <button
              onClick={() => setShowPast(!showPast)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, marginBottom: showPast ? 14 : 0, marginTop: upcoming.length > 0 ? 12 : 0, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "inherit" }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#b09080" }}></div>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#b09080" }}>{CT.past} · {past.length}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b09080" strokeWidth="2.4" strokeLinecap="round" style={{ marginLeft: "auto", transition: "transform .25s", transform: showPast ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {showPast && (
              <div style={{ animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
                {past.map((a) => <ApptCard key={a.id} a={a} dim={true} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ── SÍNTOMAS ─── */
const ALL_SX = ["Náuseas", "Cansancio", "Dolor lumbar", "Acidez", "Insomnio", "Mareos", "Calambres", "Antojos", "Hinchazón", "Buen ánimo"];
const SX_ADVICE = {
  "Náuseas": "Come poco y seguido; jengibre o infusión calientita. Si vomitas +3 veces al día, llama a tu médico.",
  "Cansancio": "Siestas de 20 min y hierro en tu dieta. Tu cuerpo trabaja las 24 h para dos.",
  "Dolor lumbar": "Calor local 15 min, estiramientos gato-camello, almohada entre rodillas al dormir.",
  "Acidez": "Cena ligera 2 h antes de acostarte; evita fritos y café; sorbos de agua fría alivian.",
  "Insomnio": "Lado izquierdo con almohada de embarazo, respiración 4-7-8, sin pantallas 1 h antes.",
  "Mareos": "Levántate despacio, come algo ligero al despertar. Si persiste, avisa a tu médico.",
  "Calambres": "Estira el pie hacia arriba, masajea el músculo; hidratación y magnesio.",
  "Antojos": "Date el gusto con moderación. Antojo intenso de hielo puede indicar déficit de hierro.",
  "Hinchazón": "Eleva las piernas, reduce la sal, camina a diario. Hinchazón brusca en cara: llama ya.",
  "Buen ánimo": "¡Aprovéchalo! Conecta con tu bebé, camina, prepara algo que te ilusione."
};


/* ─── SÍNTOMAS PREMIUM v3 ────────────────────────── */
const SX_ICONS = {
  "Náuseas":      (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M2 12c2-4 4-6 6-6s4 4 6 4 4-2 6-2"/><path d="M2 17c2-3 4-4.5 6-4.5s4 3 6 3 4-1.5 6-1.5"/></svg>,
  "Cansancio":    (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  "Dolor lumbar": (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M8 6l-2-2M18 6l2-2M8 18l-2 2M18 18l2 2"/><circle cx="12" cy="12" r="4"/></svg>,
  "Acidez":       (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c0 1.5-1 2.5-1 4"/><path d="M12 2c0 3.5-3 5-3 8s2 4 3 4 3-1.5 3-4-3-4.5-3-8Z"/></svg>,
  "Insomnio":     (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4M21 5h-4"/></svg>,
  "Mareos":       (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 9h.01M15 9h.01"/><path d="M9 15a4 4 0 0 1 6 0"/></svg>,
  "Calambres":    (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M13 2 4.09 12.96A1 1 0 0 0 5 14.5h6.5l-1 7.5 8.91-10.96A1 1 0 0 0 18.5 9.5H12l1-7.5Z"/></svg>,
  "Antojos":      (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  "Hinchazón":    (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z"/></svg>,
  "Buen ánimo":   (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
};
const SX_META = {
  "Náuseas":      { color: "#5b8dd9", bg: "rgba(91,141,217,.12)",  advice: "Come poco y seguido; jengibre o infusión calientita. Si vomitas +3 veces al día, consulta a tu médico." },
  "Cansancio":    { color: "#9b72cf", bg: "rgba(155,114,207,.12)", advice: "Siestas de 20 min y hierro en tu dieta. Tu cuerpo trabaja las 24 h produciendo vida." },
  "Dolor lumbar": { color: "#e07b54", bg: "rgba(224,123,84,.12)",  advice: "Calor local 15 min, estiramientos gato-camello, almohada entre rodillas al dormir." },
  "Acidez":       { color: "#d4a843", bg: "rgba(212,168,67,.12)",  advice: "Cena ligera 2 h antes; evita fritos y café. Sorbos de agua fría alivian al instante." },
  "Insomnio":     { color: "#6b9bd2", bg: "rgba(107,155,210,.12)", advice: "Lado izquierdo con almohada prenatal, respiración 4-7-8, sin pantallas 1 h antes." },
  "Mareos":       { color: "#8bc4a8", bg: "rgba(139,196,168,.12)", advice: "Levántate despacio, come algo ligero al despertar. Si persiste, avisa a tu médico." },
  "Calambres":    { color: "#cf7272", bg: "rgba(207,114,114,.12)", advice: "Estira el pie hacia arriba, masajea el músculo; hidratación y magnesio ayudan." },
  "Antojos":      { color: "#e87da0", bg: "rgba(232,125,160,.12)", advice: "Date el gusto con moderación. Antojo intenso de hielo puede indicar déficit de hierro." },
  "Hinchazón":    { color: "#5ba8d9", bg: "rgba(91,168,217,.12)",  advice: "Eleva las piernas, reduce la sal, camina a diario. Hinchazón brusca en cara: llama ya." },
  "Buen ánimo":   { color: "#7bbf6a", bg: "rgba(123,191,106,.12)", advice: "¡Aprovéchalo! Conecta con tu bebé, camina, prepara algo que te ilusione." }
};
const SX_LABEL_EN = {
  "Náuseas":"Nausea", "Cansancio":"Fatigue", "Dolor lumbar":"Lower back pain", "Acidez":"Heartburn",
  "Insomnio":"Insomnia", "Mareos":"Dizziness", "Calambres":"Cramps", "Antojos":"Cravings",
  "Hinchazón":"Bloating", "Buen ánimo":"Feeling good"
};
const SX_ADVICE_EN = {
  "Náuseas":      "Eat small, frequent meals; ginger or warm tea helps. If you vomit 3+ times a day, call your doctor.",
  "Cansancio":    "20-min naps and iron in your diet. Your body works 24/7 building a life.",
  "Dolor lumbar": "15 min of local heat, cat-cow stretches, pillow between knees while sleeping.",
  "Acidez":       "Eat a light dinner 2h before bed; avoid fried food and coffee. Sips of cold water bring instant relief.",
  "Insomnio":     "Left side with a prenatal pillow, 4-7-8 breathing, no screens 1h before bed.",
  "Mareos":       "Get up slowly, eat something light when you wake up. If it persists, tell your doctor.",
  "Calambres":    "Flex your foot upward, massage the muscle; hydration and magnesium help.",
  "Antojos":      "Indulge in moderation. Intense ice cravings can signal an iron deficiency.",
  "Hinchazón":    "Elevate your legs, cut back on salt, walk daily. Sudden facial swelling: call right away.",
  "Buen ánimo":   "Make the most of it! Connect with your baby, take a walk, do something you love.",
};

const SEV_DATA = [
{ key: "Leve", dot: "#7bbf6a", glow: "rgba(123,191,106,.3)", tip: "Sin preocupación mayor. Solo monitorea cómo evoluciona." },
{ key: "Moderado", dot: "#d4a843", glow: "rgba(212,168,67,.3)", tip: "Anótalo y coméntalo en tu próxima cita médica." },
{ key: "Intenso", dot: "#cf7272", glow: "rgba(207,114,114,.3)", tip: "Busca atención médica pronto. No esperes a la próxima cita." }];
const SEV_LABEL_EN = { "Leve":"Mild", "Moderado":"Moderate", "Intenso":"Intense" };
const SEV_TIP_EN = {
  "Leve":"Nothing to worry about. Just keep an eye on how it develops.",
  "Moderado":"Note it down and mention it at your next check-up.",
  "Intenso":"Seek medical attention soon. Don't wait for your next appointment.",
};


function SxButtons({ sel, toggle }) {
  const [pressed, setPressed] = React.useState(null);
  const entries = Object.entries(SX_META);
  const total = entries.length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {entries.map(([name, meta], idx) => {
        const on = sel.includes(name);
        const Icon = SX_ICONS[name];
        const isLastAlone = idx === total - 1 && total % 3 === 1;
        return (
          <button key={name}
            onClick={() => toggle(name)}
            onTouchStart={() => setPressed(name)}
            onTouchEnd={() => setPressed(null)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              padding: "13px 6px 11px", borderRadius: 16,
              gridColumn: isLastAlone ? "1 / -1" : "auto",
              maxWidth: isLastAlone ? "calc(33.33% - 6px)" : "100%",
              margin: isLastAlone ? "0 auto" : "0",
              border: on ? `1.5px solid ${meta.color}70` : "1.5px solid rgba(255,255,255,.72)",
              background: on
                ? `linear-gradient(160deg,${meta.color}38,${meta.color}18)`
                : `linear-gradient(160deg,rgba(255,255,255,.88),${meta.color}12)`,
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              color: on ? meta.color : "#8a6a5a",
              fontWeight: on ? 700 : 500, fontSize: 11, cursor: "pointer",
              boxShadow: on
                ? `0 6px 20px ${meta.color}40, 0 1px 0 rgba(255,255,255,.8) inset`
                : `0 2px 8px rgba(0,0,0,.05), 0 1px 0 rgba(255,255,255,.92) inset`,
              transform: pressed === name ? "scale(.92)" : on ? "translateY(-2px) scale(1.01)" : "none",
              transition: "all .2s cubic-bezier(.23,1,.32,1)", fontFamily: "inherit",
              position: "relative"
            }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: on ? `${meta.color}25` : `${meta.color}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
              boxShadow: on ? `0 0 0 5px ${meta.color}18` : `0 0 0 0px transparent`
            }}>
              {Icon && Icon(on ? meta.color : meta.color + "99")}
            </div>
            <span style={{ lineHeight: 1.25, textAlign: "center" }}>{name}</span>
            {on && <div style={{ position: "absolute", bottom: 5, width: 18, height: 3, borderRadius: 99, background: meta.color, boxShadow: `0 1px 4px ${meta.color}60` }} />}
          </button>
        );
      })}
    </div>
  );
}

function SintomasScreen({ goBack }) {
  const sxLang = getAppLang2();
  const ST = sxLang==="en" ? {
    historyEyebrow:"History · health log", wellnessPrefix:"Wellness · ", yourLog:"Your log", howFeel:"How are you feeling?",
    noRecords:"No records yet", today:"Today", todaySx:"Today's symptoms · tap to select", otherSx:"Other symptom…",
    guidance:"Guidance · ", intensity:"Overall intensity", saved:"✓ Saved to your log · +3 points", watchAd:"Watch short ad → ", points50:"+50 points",
    saveBtn:"Save to my log →", selectOne:"Select at least one symptom", prevRecords:"Previous records · ",
  } : {
    historyEyebrow:"Historial · bitácora de salud", wellnessPrefix:"Bienestar · ", yourLog:"Tu bitácora", howFeel:"¿Cómo te sientes?",
    noRecords:"Sin registros todavía", today:"Hoy", todaySx:"Síntomas de hoy · toca para seleccionar", otherSx:"Otro síntoma…",
    guidance:"Orientación · ", intensity:"Intensidad general", saved:"✓ Guardado en tu bitácora · +3 puntos", watchAd:"Ver anuncio breve → ", points50:"+50 puntos",
    saveBtn:"Guardar en mi bitácora →", selectOne:"Selecciona al menos un síntoma", prevRecords:"Registros anteriores · ",
  };
  const sxLabel = (s) => sxLang==="en" ? (SX_LABEL_EN[s]||s) : s;
  const sxAdvice = (s) => sxLang==="en" ? SX_ADVICE_EN[s] : SX_META[s]?.advice;
  const sevLabel = (k) => sxLang==="en" ? (SEV_LABEL_EN[k]||k) : k;
  const sevTip = (k) => sxLang==="en" ? SEV_TIP_EN[k] : SEV_DATA.find(d=>d.key===k)?.tip;
  const [sel, setSel] = React.useState([]);
  const [sev, setSev] = React.useState("Leve");
  const [nota, setNota] = React.useState("");
  const [hist, setHist] = React.useState(() => LS.get("lume_sx_hist") || []);
  const [saved, setSaved] = React.useState(false);
  const [showHist, setShowHist] = React.useState(false);

  const toggle = (s) => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const curSev = SEV_DATA.find(d => d.key === sev);
  const hasContent = sel.length > 0 || nota.trim();

  const addEntry = () => {
    const syms = nota.trim() ? [...sel, nota.trim()] : [...sel];
    if (!syms.length) return;
    const entry = { id: Date.now(), symptoms: syms, sev, date: new Date().toLocaleDateString(sxLang==="en"?"en-US":"es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) };
    const h = [entry, ...hist].slice(0, 30);
    setHist(h); LS.set("lume_sx_hist", h);
    addPoints(3); setSel([]); setNota(""); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const today = new Date().toLocaleDateString(sxLang==="en"?"en-US":"es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ background: "linear-gradient(170deg,#faf2ec 0%,#f2e3d8 50%,#ead5c5 100%)", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(22px) saturate(160%)", WebkitBackdropFilter: "blur(22px) saturate(160%)", background: "rgba(250,242,236,.91)", borderBottom: "1px solid rgba(168,73,42,.07)", padding: "52px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={showHist ? () => setShowHist(false) : goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 3 }}>
              {showHist ? ST.historyEyebrow : ST.wellnessPrefix + today}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: "#3d1a0e", lineHeight: 1 }}>
              {showHist ? ST.yourLog : ST.howFeel}
            </div>
          </div>
          {!showHist && hist.length > 0 && (
            <button onClick={() => setShowHist(true)} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.08)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 16px 56px", display: "flex", flexDirection: "column", gap: 14 }}>

        {showHist ? (
          /* ── HISTORY VIEW ── */
          <div>
            {hist.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#a08070", fontSize: 14 }}>{ST.noRecords}</div>
            )}
            {hist.map((h, i) => {
              const sevCfg = SEV_DATA.find(d => d.key === h.sev);
              return (
                <div key={h.id} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: sevCfg ? sevCfg.dot : "#A8492A", flexShrink: 0, marginTop: 6 }} />
                    {i < hist.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 20, background: "rgba(168,73,42,.1)", marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,.65)", backdropFilter: "blur(12px)", borderRadius: 18, padding: "13px 15px", border: "1px solid rgba(255,255,255,.82)", boxShadow: "0 4px 16px rgba(168,73,42,.06)", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#a08070", fontWeight: 500 }}>{h.date}</span>
                      <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", background: sevCfg ? sevCfg.dot + "18" : "rgba(168,73,42,.1)", color: sevCfg ? sevCfg.dot : "#A8492A" }}>{h.sev}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {h.symptoms.map((s, j) => {
                        const meta = SX_META[s];
                        return <span key={j} style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: meta ? meta.bg : "rgba(168,73,42,.07)", color: meta ? meta.color : "#A8492A" }}>{sxLabel(s)}</span>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* ── SELECTED TRAY ── */}
            {sel.length > 0 && (
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "11px 14px", borderRadius: 18, background: "rgba(168,73,42,.07)", border: "1px solid rgba(168,73,42,.12)", animation: "fadeSlideUp .25s cubic-bezier(.23,1,.32,1)" }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#A8492A", opacity: .7, alignSelf: "center", marginRight: 2 }}>{ST.today}</span>
                {sel.map(s => {
                  const meta = SX_META[s];
                  return (
                    <button key={s} onClick={() => toggle(s)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px 5px 8px", borderRadius: 99, border: "1px solid " + (meta ? meta.color + "40" : "rgba(168,73,42,.3)"), background: meta ? meta.bg : "rgba(168,73,42,.1)", cursor: "pointer", fontFamily: "inherit" }}>
                      <span style={{ color: meta ? meta.color : "#A8492A" }}>{SX_ICONS[s] && SX_ICONS[s](meta ? meta.color : "#A8492A")}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: meta ? meta.color : "#A8492A" }}>{sxLabel(s)}</span>
                      <span style={{ fontSize: 14, color: meta ? meta.color : "#A8492A", opacity: .5, lineHeight: 1 }}>×</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── SYMPTOM GRID 2-col ── */}
            <div style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderRadius: 24, padding: "18px 14px 14px", boxShadow: "0 14px 40px -10px rgba(90,40,24,.28), 0 1px 0 rgba(255,255,255,.95) inset", border: "1px solid rgba(255,255,255,.85)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .7, marginBottom: 12 }}>{ST.todaySx}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(SX_META).map(([name, meta]) => {
                  const on = sel.includes(name);
                  return (
                    <button key={name} onClick={() => toggle(name)} style={{
                      display: "flex", alignItems: "center", gap: 0,
                      borderRadius: 16, overflow: "hidden",
                      background: "rgba(255,255,255,.68)",
                      backdropFilter: "blur(20px) saturate(155%)",
                      WebkitBackdropFilter: "blur(20px) saturate(155%)",
                      border: on ? "1px solid " + meta.color + "55" : "1px solid rgba(255,255,255,.85)",
                      boxShadow: on
                        ? "0 14px 36px -6px " + meta.color + "50, 0 1px 0 rgba(255,255,255,.92) inset"
                        : "0 6px 20px " + meta.color + "18, 0 1px 0 rgba(255,255,255,.9) inset",
                      transform: on ? "translateY(-2px) scale(1.02)" : "scale(1)",
                      transition: "all .22s cubic-bezier(.23,1,.32,1)",
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left"
                    }}>
                      <div style={{ width: 4, alignSelf: "stretch", background: "linear-gradient(to bottom," + meta.color + "," + meta.color + "88)", flexShrink: 0 }} />
                      <div style={{ width: 34, height: 34, margin: "11px 10px", borderRadius: 10, background: meta.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {SX_ICONS[name] && SX_ICONS[name](meta.color)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? "#3d1a0e" : "#7a5a4a", flex: 1, lineHeight: 1.3, paddingRight: 8 }}>{sxLabel(name)}</span>
                    </button>
                  );
                })}
              </div>
              {/* Custom input */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 13, border: "1.5px solid rgba(168,73,42,.1)", background: "rgba(255,255,255,.5)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, opacity: .45 }}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                <input style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: "#5a3a2a", fontFamily: "inherit", outline: "none" }} placeholder={ST.otherSx} value={nota} onChange={e => setNota(e.target.value)} />
              </div>
            </div>

            {/* ── ADVICE CARDS — one per selected symptom ── */}
            {sel.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sel.map(s => {
                  const meta = SX_META[s];
                  if (!meta) return null;
                  return (
                    <div key={s} style={{ borderRadius: 18, padding: "14px 16px", background: "linear-gradient(135deg," + meta.color + "14,rgba(255,255,255,.45))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid " + meta.color + "22", animation: "fadeSlideUp .22s cubic-bezier(.23,1,.32,1)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: meta.color + "18", border: "1.5px solid " + meta.color + "28", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {SX_ICONS[s] && SX_ICONS[s](meta.color)}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: meta.color }}>{ST.guidance}{sxLabel(s)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#5a3a2a", lineHeight: 1.65 }}>{sxAdvice(s)}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── INTENSIDAD ── */}
            <div style={{ background: "rgba(255,255,255,.62)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 22, padding: "16px 14px", boxShadow: "0 6px 22px rgba(168,73,42,.06), 0 1px 0 rgba(255,255,255,.9) inset", border: "1px solid rgba(255,255,255,.78)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", marginBottom: 12 }}>{ST.intensity}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: curSev ? 11 : 0 }}>
                {SEV_DATA.map(cfg => {
                  const on = sev === cfg.key;
                  return (
                    <button key={cfg.key} onClick={() => setSev(cfg.key)} style={{
                      flex: 1, padding: "13px 4px", borderRadius: 14,
                      border: on ? "2px solid " + cfg.dot : "1.5px solid rgba(168,73,42,.1)",
                      background: on ? "radial-gradient(ellipse at 50% 0%," + cfg.glow + " 0%,rgba(255,255,255,0) 70%), rgba(255,255,255,.9)" : "rgba(255,255,255,.5)",
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                      boxShadow: on ? "0 4px 16px " + cfg.glow + ", 0 1px 0 rgba(255,255,255,.9) inset" : "0 2px 4px rgba(0,0,0,.03)",
                      transform: on ? "scale(1.03) translateY(-1px)" : "scale(1)",
                      transition: "all .2s cubic-bezier(.23,1,.32,1)"
                    }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: on ? cfg.dot : "#d8ccc5", boxShadow: on ? "0 0 0 4px " + cfg.glow : "none", transition: "all .2s" }} />
                      <span style={{ fontSize: 12, fontWeight: on ? 800 : 500, color: on ? cfg.dot : "#a09090" }}>{sevLabel(cfg.key)}</span>
                    </button>
                  );
                })}
              </div>
              {curSev && (
                <div style={{ padding: "10px 13px", borderRadius: 11, background: curSev.dot + "0d", border: "1px solid " + curSev.dot + "22", display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: curSev.dot, boxShadow: "0 0 0 3px " + curSev.glow, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 12.5, color: "#5a3a2a", lineHeight: 1.5 }}>{sevTip(curSev.key)}</p>
                </div>
              )}
            </div>

            {/* ── GUARDAR ── */}
            {saved ? (
              <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(123,191,106,.25)", animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
                <div style={{ padding: "14px 16px", background: "rgba(123,191,106,.14)", color: "#4a9940", fontWeight: 700, textAlign: "center", fontSize: 13.5 }}>{ST.saved}</div>
                <button onClick={() => window.triggerRewardedAd && window.triggerRewardedAd("points")} style={{ width: "100%", padding: "11px 16px", border: "none", borderTop: "1px solid rgba(168,73,42,.1)", background: "linear-gradient(135deg,rgba(61,26,14,.96),rgba(90,42,20,.92))", color: "#E6CFA1", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E6CFA1" strokeWidth="2" strokeLinecap="round"><path d="M20 12v10H4V12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  {ST.watchAd}<strong style={{ color: "#fff" }}>{ST.points50}</strong>
                </button>
              </div>
            ) : (
              <button onClick={addEntry} style={{
                width: "100%", padding: "17px", borderRadius: 18, border: "none",
                background: hasContent ? "linear-gradient(135deg,#c4693a 0%,#A8492A 100%)" : "rgba(200,185,180,.3)",
                color: hasContent ? "#fff" : "#b0a09a", fontWeight: 700, fontSize: 15,
                cursor: hasContent ? "pointer" : "default",
                boxShadow: hasContent ? "0 14px 32px rgba(168,73,42,.38), 0 1px 0 rgba(255,255,255,.2) inset" : "none",
                fontFamily: "inherit", letterSpacing: ".01em", transition: "all .25s"
              }}>
                {hasContent ? ST.saveBtn : ST.selectOne}
              </button>
            )}

            {/* ── HISTORIAL PREVIEW ── */}
            {hist.length > 0 && !saved && (
              <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(168,73,42,.1)", background: "rgba(255,255,255,.5)", backdropFilter: "blur(10px)" }}>
                <button onClick={() => setShowHist(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#A8492A", flex: 1, textAlign: "left" }}>{ST.prevRecords}{hist.length}</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                {hist.slice(0, 2).map((h, i) => {
                  const sevCfg = SEV_DATA.find(d => d.key === h.sev);
                  return (
                    <div key={h.id} style={{ padding: "10px 16px", borderTop: "1px solid rgba(168,73,42,.07)", display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: sevCfg ? sevCfg.dot : "#A8492A", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#a08070", flexShrink: 0, minWidth: 70 }}>{h.date}</span>
                      <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {h.symptoms.slice(0, 3).map((s, j) => {
                          const meta = SX_META[s];
                          return <span key={j} style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: meta ? meta.bg : "rgba(168,73,42,.07)", color: meta ? meta.color : "#A8492A" }}>{sxLabel(s)}</span>;
                        })}
                        {h.symptoms.length > 3 && <span style={{ fontSize: 10.5, color: "#a08070" }}>+{h.symptoms.length - 3}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── RECOMPENSAS ─── */
const LEVELS = [
  { name: "Bronce", min: 0,    next: 500,  benefit: "5% de descuento en suscripciones",                    color: "#C47A2A", light: "#F0B060", bg: "rgba(196,122,42,.12)" },
  { name: "Plata",  min: 500,  next: 1500, benefit: "10% de descuento + 1 meditación premium/semana",      color: "#8090A8", light: "#C0CCE0", bg: "rgba(128,144,168,.12)" },
  { name: "Oro",    min: 1500, next: 5000, benefit: "20% de descuento + plan nutricional completo",         color: "#C8961A", light: "#F0CC50", bg: "rgba(200,150,26,.12)" }
];
const LEVEL_NAME_EN = { "Bronce":"Bronze", "Plata":"Silver", "Oro":"Gold" };
const LEVEL_BENEFIT_EN = {
  "Bronce":"5% discount on subscriptions",
  "Plata":"10% discount + 1 premium meditation/week",
  "Oro":"20% discount + full nutrition plan",
};

const ACTIONS = [
  { ic: "leaf",     col: "#2ea050", label: "Suscríbete al plan Esencial",    pts: 30 },
  { ic: "heart",    col: "#e05080", label: "Suscríbete al plan Bienestar",   pts: 50 },
  { ic: "scan",     col: "#4080d0", label: "Registra una ecografía",         pts: 10 },
  { ic: "calendar", col: "#8040c0", label: "Agenda una cita médica",         pts: 5  },
  { ic: "names",    col: "#d06090", label: "Elige un nombre favorito",       pts: 5  },
  { ic: "pulse",    col: "#c04040", label: "Registra un síntoma",            pts: 3  },
  { ic: "nutri",    col: "#408050", label: "Registra una comida saludable",  pts: 3  }
];
const ACTIONS_LABEL_EN = [
  "Subscribe to the Essential plan","Subscribe to the Wellness plan","Log an ultrasound",
  "Schedule a medical appointment","Pick a favorite name","Log a symptom","Log a healthy meal"
];

const REWARDS_FREE = [
  { id:"med",   title:"Meditación guiada",        desc:"1 sesión prenatal de 20 min",           pts:150,  color:"#8B5A9E", bg:"rgba(139,90,158,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3c0 0-4 4-4 8s4 8 4 8M12 3c0 0 4 4 4 8s-4 8-4 8"/><circle cx="12" cy="11" r="2"/><path d="M6 11h12"/></svg> },
  { id:"mus",   title:"Playlist prenatal 24h",    desc:"Música para ti y tu bebé",              pts:200,  color:"#4080D0", bg:"rgba(64,128,208,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { id:"nut",   title:"Plan nutricional 3 días",  desc:"Menú personalizado por IA",             pts:400,  color:"#3A8050", bg:"rgba(58,128,80,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2a5 5 0 0 1 5 5c0 5-5 9-5 9S7 12 7 7a5 5 0 0 1 5-5z"/><path d="M8.5 10.5C9.5 12 11 13 12 13"/></svg> },
  { id:"pro",   title:"1 mes Premium gratis",     desc:"Acceso completo sin costo",             pts:1500, color:"#C8961A", bg:"rgba(200,150,26,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];
const REWARDS_FREE_EN = { med:{title:"Guided meditation",desc:"1 prenatal session, 20 min"}, mus:{title:"24h prenatal playlist",desc:"Music for you and your baby"}, nut:{title:"3-day nutrition plan",desc:"AI-personalized menu"}, pro:{title:"1 month Premium free",desc:"Full access at no cost"} };

const REWARDS_PREMIUM = [
  { id:"theme", title:"Tema visual exclusivo",    desc:"Paleta Medianoche o Jardín en la app",  pts:200,  color:"#A8492A", bg:"rgba(168,73,42,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 6v6l4 2"/></svg> },
  { id:"pdf",   title:"Guía PDF Diario Lumé",     desc:"Diario de embarazo exclusivo imprimible",pts:300, color:"#8B5A9E", bg:"rgba(139,90,158,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg> },
  { id:"disc",  title:"Descuento marca aliada",   desc:"15% en Mustela o Amazon bebé",          pts:500,  color:"#3A8070", bg:"rgba(58,128,112,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { id:"mes",   title:"Mes extra de suscripción", desc:"30 días gratis en tu próxima renovación",pts:1000, color:"#4A6A9E", bg:"rgba(74,106,158,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id:"box",   title:"Caja regalo Lumé",         desc:"Cuaderno + accesorios bebé premium",    pts:3500, color:"#C8961A", bg:"rgba(200,150,26,.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg> },
];
const REWARDS_PREMIUM_EN = { theme:{title:"Exclusive visual theme",desc:"Midnight or Garden palette in the app"}, pdf:{title:"Lumé Diary PDF guide",desc:"Exclusive printable pregnancy diary"}, disc:{title:"Partner brand discount",desc:"15% off Mustela or Amazon Baby"}, mes:{title:"Extra month of subscription",desc:"30 days free on your next renewal"}, box:{title:"Lumé gift box",desc:"Notebook + premium baby accessories"} };

const REWARDS = REWARDS_FREE; // legacy alias

function RecompensasScreen({ goBack }) {
  const rcLang = getAppLang2();
  const RC = rcLang==="en" ? {
    program:"Loyalty program", title:"Rewards", yourLevel:"Your current level", level:"Level ", points:"points",
    maxLevel:"🏆 Max level reached!", missing:(n,lvl)=>({pre:"Only ",post:` to level ${lvl}`,n}),
    activeBenefit:"Your active benefit", redeemPoints:"Redeem your points", freePlan:"Free plan", subscribers:"Subscribers",
    premiumOnly:"✦ These rewards are exclusive to paying subscribers", claimed:"✓ Claimed", redeem:"Redeem",
    earnFast:"Earn points fast", watchAd:"Watch a short ad", dailyLimit:"Daily limit · come back tomorrow",
    available:(n)=>`+50 points · ${n} available today`, tomorrow:"Tomorrow", watch:"Watch",
    howToEarn:"How to earn points", current:"Current",
    cancel:"Cancel", confirmRedeem:"Confirm redemption", ptsWord:"points", leftYou:"→ you'll have ",
    claimedTitle:"✓ Reward claimed", great:"Great!", ad:"Ad", close:"Close",
    proMsg:"Your Premium month has been activated. Enjoy full access!", nutMsg:"Your nutrition plan was sent to your email. Check your inbox!", genMsg:(t)=>`${t} is now available in your app. Enjoy!`,
  } : {
    program:"Programa de lealtad", title:"Recompensas", yourLevel:"Tu nivel actual", level:"Nivel ", points:"puntos",
    maxLevel:"🏆 ¡Nivel máximo alcanzado!", missing:(n,lvl)=>({pre:"Faltan ",post:` para nivel ${lvl}`,n}),
    activeBenefit:"Tu beneficio activo", redeemPoints:"Canjea tus puntos", freePlan:"Plan gratuito", subscribers:"Suscriptoras",
    premiumOnly:"✦ Estas recompensas son exclusivas para suscriptoras de pago", claimed:"✓ Canjeado", redeem:"Canjear",
    earnFast:"Gana puntos rápido", watchAd:"Ver un anuncio breve", dailyLimit:"Límite diario · vuelve mañana",
    available:(n)=>`+50 puntos · ${n} disponible${n!==1?"s":""} hoy`, tomorrow:"Mañana", watch:"Ver",
    howToEarn:"Cómo ganar puntos", current:"Actual",
    cancel:"Cancelar", confirmRedeem:"Confirmar canje", ptsWord:"puntos", leftYou:"→ te quedan ",
    claimedTitle:"✓ Premio reclamado", great:"¡Genial!", ad:"Anuncio", close:"Cerrar",
    proMsg:"Tu mes Premium ha sido activado. ¡Disfruta acceso completo!", nutMsg:"Tu plan nutricional fue enviado a tu email. ¡Revisa tu bandeja!", genMsg:(t)=>`${t} ya está disponible en tu app. ¡Disfrútalo!`,
  };
  const levelName = (n) => rcLang==="en" ? (LEVEL_NAME_EN[n]||n) : n;
  const levelBenefit = (n) => rcLang==="en" ? LEVEL_BENEFIT_EN[n] : LEVELS.find(l=>l.name===n)?.benefit;
  const actionLabel = (i) => rcLang==="en" ? ACTIONS_LABEL_EN[i] : ACTIONS[i].label;
  const rewardText = (r, tab) => {
    const en = tab==="free" ? REWARDS_FREE_EN[r.id] : REWARDS_PREMIUM_EN[r.id];
    return rcLang==="en" && en ? en : { title:r.title, desc:r.desc };
  };
  const [pts, setPts] = React.useState(() => LS.get("lume_points") || 126);
  const [claimed, setClaimed] = React.useState(() => LS.get("lume_claimed") || []);
  const [confirmReward, setConfirmReward] = React.useState(null);
  const [successReward, setSuccessReward] = React.useState(null);
  const [showRewardedAd, setShowRewardedAd] = React.useState(false);
  const [adCountdown, setAdCountdown] = React.useState(5);
  const [adDone, setAdDone] = React.useState(false);
  const [adsToday, setAdsToday] = React.useState(() => { const k="lume_ads_"+new Date().toISOString().slice(0,10); return LS.get(k)||0; });
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const activeRewards = isPremium ? REWARDS_PREMIUM : REWARDS_FREE;
  const [rewardTab, setRewardTab] = React.useState(isPremium ? "premium" : "free");

  const claimReward = (r) => {
    if (pts < r.pts || claimed.includes(r.id)) return;
    const newPts = pts - r.pts;
    const newClaimed = [...claimed, r.id];
    setPts(newPts); LS.set("lume_points", newPts);
    setClaimed(newClaimed); LS.set("lume_claimed", newClaimed);
    setConfirmReward(null);
    setSuccessReward(r);
  };

  const startRewardedAd = () => {
    if (adsToday >= 3) return;
    setAdCountdown(5); setAdDone(false); setShowRewardedAd(true);
  };
  const earnRewardedPts = () => {
    const k = "lume_ads_" + new Date().toISOString().slice(0,10);
    const n = (LS.get(k)||0)+1; LS.set(k,n);
    const np = pts+50; setPts(np); LS.set("lume_points",np);
    setAdsToday(n);
  };
  React.useEffect(() => {
    if (!showRewardedAd || adDone) return;
    if (adCountdown <= 0) { setAdDone(true); return; }
    const t = setTimeout(() => setAdCountdown(c => c-1), 1000);
    return () => clearTimeout(t);
  }, [showRewardedAd, adCountdown, adDone]);

  const level    = LEVELS.filter((l) => pts >= l.min).slice(-1)[0] || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const pct = Math.min(100, (pts - level.min) / (level.next - level.min) * 100);
  const ptsToNext = nextLevel ? nextLevel.min - pts : 0;

  const glassCard = {
    background: "rgba(255,255,255,.52)",
    backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)",
    border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 20px 50px -14px rgba(80,30,16,.44), 0 2px 0 rgba(255,255,255,.9) inset"
  };

  return (
    <div style={{ background: "linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header sticky glass ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.08)", padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 5 }}>{RC.program}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px", lineHeight: 1 }}>{RC.title}</h2>
        </div>
      </div>

      <div style={{ padding: "20px 16px 52px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Hero card nivel ── */}
        <div style={{ borderRadius: 26, padding: "24px 22px", background: "linear-gradient(145deg,#5E1C08 0%,#7A3218 28%,#A8492A 62%,#B85A32 100%)", boxShadow: "0 24px 60px -16px rgba(80,24,8,.54), 0 0 0 1px rgba(255,255,255,.1) inset", overflow: "hidden", position: "relative" }}>
          {/* Decoración fondo */}
          <div style={{ position: "absolute", top: -40, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,128,.28),transparent 65%)", pointerEvents: "none" }}></div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 6 }}>{RC.yourLevel}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MedalIcon level={level.name} size={44} />
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-.02em", lineHeight: 1 }}>{RC.level}{levelName(level.name)}</div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 5, lineHeight: 1.5, maxWidth: 200 }}>{levelBenefit(level.name)}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-.02em" }}>{pts}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.6)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>{RC.points}</div>
            </div>
          </div>

          {/* Barra progreso */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 600 }}>{level.min} pts</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 600 }}>{level.next} pts</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,.2)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", borderRadius: 99, background: "rgba(255,255,255,.88)", transition: "width .6s cubic-bezier(.23,1,.32,1)" }}></div>
            </div>
            {nextLevel && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                <MedalIcon level={nextLevel.name} size={16} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.72)", fontWeight: 600 }}>
                  {RC.missing(ptsToNext, levelName(nextLevel.name)).pre}<strong style={{ color: "#fff" }}>{ptsToNext} pts</strong>{RC.missing(ptsToNext, levelName(nextLevel.name)).post}
                </span>
              </div>
            )}
            {!nextLevel && (
              <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,.75)", fontWeight: 600 }}>
                {RC.maxLevel}
              </div>
            )}
          </div>
        </div>

        {/* ── 3 niveles en tarjetas ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {LEVELS.map((l) => {
            const active = pts >= l.min;
            const isCurrent = l.name === level.name;
            return (
              <div key={l.name} style={{ ...glassCard, borderRadius: 20, padding: "16px 12px", textAlign: "center", opacity: active ? 1 : .45, border: isCurrent ? `1.5px solid ${l.color}55` : "1px solid rgba(255,255,255,.78)", background: isCurrent ? `linear-gradient(160deg,${l.bg},rgba(255,255,255,.48))` : "rgba(255,255,255,.52)", boxShadow: isCurrent ? `0 12px 32px -8px ${l.color}44, 0 1px 0 rgba(255,255,255,.9) inset` : glassCard.boxShadow }}>
                <MedalIcon level={l.name} size={isCurrent ? 44 : 36} />
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isCurrent ? 16 : 14, fontWeight: 700, color: isCurrent ? l.color : "#5a3a2a", marginTop: 8, lineHeight: 1.1 }}>{levelName(l.name)}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#b09080", marginTop: 4, letterSpacing: ".04em" }}>{l.min}+ pts</div>
                {isCurrent && <div style={{ marginTop: 8, fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: l.color, padding: "3px 8px", borderRadius: 99, background: l.bg, display: "inline-block" }}>{RC.current}</div>}
              </div>
            );
          })}
        </div>

        {/* ── Beneficio activo ── */}
        <div style={{ ...glassCard, borderRadius: 22, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", marginBottom: 12 }}>{RC.activeBenefit}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: level.bg, border: `1.5px solid ${level.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MedalIcon level={level.name} size={28} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#3d1a0e", lineHeight: 1.2 }}>{RC.level}{levelName(level.name)}</div>
              <div style={{ fontSize: 13, color: "#7a5a4a", marginTop: 3, lineHeight: 1.5 }}>{levelBenefit(level.name)}</div>
            </div>
          </div>
        </div>

        {/* ── Canjea tus puntos ── */}
        <div style={{ ...glassCard, borderRadius: 22, overflow: "hidden" }}>
          <div style={{ padding: "18px 18px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", marginBottom: 12 }}>{RC.redeemPoints}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {[{key:"free",label:RC.freePlan},{key:"premium",label:RC.subscribers}].map(t=>(
                <button key={t.key} onClick={()=>setRewardTab(t.key)}
                  style={{ flex:1, padding:"8px 4px", borderRadius:12, border:"none", fontFamily:"inherit",
                    fontWeight:700, fontSize:11.5, cursor:"pointer", transition:"all .2s",
                    background:rewardTab===t.key?"linear-gradient(135deg,#c4693a,#A8492A)":"rgba(168,73,42,.07)",
                    color:rewardTab===t.key?"#fff":"#a08070",
                    boxShadow:rewardTab===t.key?"0 4px 14px rgba(168,73,42,.3)":"none" }}>
                  {t.label}
                </button>
              ))}
            </div>
            {rewardTab==="premium" && !isPremium && (
              <div style={{ marginBottom:12, padding:"10px 14px", borderRadius:12, background:"rgba(168,73,42,.07)", border:"1px solid rgba(168,73,42,.14)", fontSize:12, color:"#8a6a5a", lineHeight:1.5 }}>
                ✦ {RC.premiumOnly.replace("✦ ","")}
              </div>
            )}
          </div>
          {(rewardTab==="free" ? REWARDS_FREE : REWARDS_PREMIUM).map((r, i) => {
            const canClaim = pts >= r.pts && !claimed.includes(r.id) && (rewardTab==="free" || isPremium);
            const isClaimed = claimed.includes(r.id);
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 18px", borderTop: "1px solid rgba(168,73,42,.07)" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: r.bg, border: `1px solid ${r.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: r.color, flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#3d1a0e", lineHeight: 1.2 }}>{rewardText(r, rewardTab).title}</div>
                  <div style={{ fontSize: 11.5, color: "#a08070", marginTop: 2 }}>{rewardText(r, rewardTab).desc}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: r.color, padding: "3px 9px", borderRadius: 99, background: r.bg }}>{r.pts} pts</div>
                  <button
                    onClick={() => !isClaimed && canClaim && setConfirmReward(r)}
                    style={{ padding: "5px 12px", borderRadius: 99, border: "none", fontFamily: "inherit", fontWeight: 700, fontSize: 11.5, cursor: canClaim ? "pointer" : "default",
                      background: isClaimed ? "rgba(123,191,106,.15)" : canClaim ? "linear-gradient(135deg,#c4693a,#A8492A)" : "rgba(200,185,180,.3)",
                      color: isClaimed ? "#3e8836" : canClaim ? "#fff" : "#b0a09a",
                      boxShadow: canClaim && !isClaimed ? "0 4px 14px rgba(168,73,42,.32)" : "none",
                      transition: "all .2s"
                    }}
                  >{isClaimed ? RC.claimed : RC.redeem}</button>
                </div>
              </div>
            );
          })}
        </div>


        {/* ── Rewarded Ads ── */}
        <div style={{ ...glassCard, borderRadius:22, padding:"18px" }}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", color:"#A8492A", marginBottom:14 }}>{RC.earnFast}</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,rgba(168,73,42,.12),rgba(200,150,26,.1))", border:"1px solid rgba(168,73,42,.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#A8492A"><polygon points="5 3 19 12 5 21 5 3" opacity=".9"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#3d1a0e", marginBottom:3 }}>{RC.watchAd}</div>
              <div style={{ fontSize:12, color:"#a08070" }}>
                {adsToday >= 3 ? RC.dailyLimit : RC.available(3-adsToday)}
              </div>
            </div>
            <button onClick={adsToday < 3 ? startRewardedAd : undefined}
              style={{ padding:"9px 16px", borderRadius:12, border:"none", fontFamily:"inherit", fontWeight:700, fontSize:13,
                cursor:adsToday < 3 ? "pointer":"default",
                background:adsToday < 3 ? "linear-gradient(135deg,#c4693a,#A8492A)":"rgba(200,185,180,.3)",
                color:adsToday < 3 ? "#fff":"#b0a09a",
                boxShadow:adsToday < 3 ? "0 6px 18px rgba(168,73,42,.35)":"none",
                flexShrink:0, transition:"all .2s" }}>
              {adsToday >= 3 ? RC.tomorrow : RC.watch}
            </button>
          </div>
          {adsToday > 0 && (
            <div style={{ display:"flex", gap:6, marginTop:12 }}>
              {[0,1,2].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<adsToday?"#A8492A":"rgba(168,73,42,.15)", transition:"background .3s" }} />)}
            </div>
          )}
        </div>

        <div style={{ ...glassCard, borderRadius: 22, overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", padding: "18px 18px 12px" }}>{RC.howToEarn}</div>
          {ACTIONS.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid rgba(168,73,42,.07)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: a.col + "18", display: "flex", alignItems: "center", justifyContent: "center", color: a.col, flexShrink: 0 }}>
                <AppIcon name={a.ic} size={18} />
              </div>
              <span style={{ flex: 1, fontSize: 13.5, color: "#5a3a2a", lineHeight: 1.4 }}>{actionLabel(i)}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 99, background: "rgba(168,73,42,.08)", border: "1px solid rgba(168,73,42,.14)", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#A8492A" }}>+{a.pts}</span>
                <span style={{ fontSize: 10, color: "#c08060", fontWeight: 600 }}>pts</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal confirmar */}
      {confirmReward && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(20,8,4,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end" }} onClick={() => setConfirmReward(null)}>
          <div style={{ width: "100%", boxSizing: "border-box", background: "rgba(246,237,228,.97)", borderRadius: "28px 28px 0 0", padding: "10px 24px 36px", boxShadow: "0 -12px 48px rgba(0,0,0,.22)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 38, height: 4, borderRadius: 99, background: "rgba(168,73,42,.2)", margin: "0 auto 20px" }}></div>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: confirmReward.bg, display: "flex", alignItems: "center", justifyContent: "center", color: confirmReward.color, margin: "0 auto 16px" }}>{React.cloneElement(confirmReward.icon, {width:36,height:36})}</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#3d1a0e", marginBottom: 6 }}>{rewardText(confirmReward, rewardTab).title}</div>
              <div style={{ fontSize: 13, color: "#8a6a5a", lineHeight: 1.5, marginBottom: 12 }}>{rewardText(confirmReward, rewardTab).desc}</div>
              <div style={{ display: "inline-flex", gap: 8, padding: "8px 18px", borderRadius: 99, background: confirmReward.bg }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: confirmReward.color }}>{confirmReward.pts} {RC.ptsWord}</span>
                <span style={{ fontSize: 13, color: "#a08070" }}>{RC.leftYou}{pts - confirmReward.pts}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmReward(null)} style={{ flex: 1, padding: "14px", borderRadius: 16, border: "1px solid rgba(168,73,42,.18)", background: "rgba(255,255,255,.7)", color: "#8a6a5a", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>{RC.cancel}</button>
              <button onClick={() => claimReward(confirmReward)} style={{ flex: 2, padding: "14px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#c4693a,#A8492A)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 10px 28px rgba(168,73,42,.4)" }}>{RC.confirmRedeem}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {successReward && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(20,8,4,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", boxSizing: "border-box", background: "rgba(246,237,228,.97)", borderRadius: "28px 28px 0 0", padding: "10px 24px 36px", boxShadow: "0 -12px 48px rgba(0,0,0,.22)" }}>
            <div style={{ width: 38, height: 4, borderRadius: 99, background: "rgba(168,73,42,.2)", margin: "0 auto 20px" }}></div>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: successReward.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px", boxShadow: `0 12px 32px ${successReward.color}33` }}>{successReward.icon}</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#7bbf6a", marginBottom: 8 }}>{RC.claimedTitle}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#3d1a0e", marginBottom: 8 }}>{rewardText(successReward, rewardTab).title}</div>
              <div style={{ fontSize: 13.5, color: "#8a6a5a", lineHeight: 1.55, marginBottom: 16 }}>
                {successReward.id === "pro" ? RC.proMsg :
                 successReward.id === "nut" ? RC.nutMsg :
                 RC.genMsg(rewardText(successReward, rewardTab).title)}
              </div>
              {successReward.id === "pro" && (
                <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(200,150,26,.1)", border: "1px solid rgba(200,150,26,.25)", fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#A8492A", letterSpacing: ".14em" }}>LUME-PRE-2026</div>
              )}
            </div>
            <button onClick={() => setSuccessReward(null)} style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#c4693a,#A8492A)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 10px 28px rgba(168,73,42,.4)" }}>{RC.great}</button>
          </div>
        </div>
      )}

      {/* ── Rewarded Ad Modal ── */}
      {showRewardedAd && (
        <div style={{ position:"absolute", inset:0, zIndex:60, background:"rgba(8,3,1,.95)", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"52px 20px 14px", background:"rgba(0,0,0,.15)" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>{RC.ad}</div>
            {adDone
              ? <button onClick={() => { earnRewardedPts(); setShowRewardedAd(false); setAdDone(false); }}
                  style={{ padding:"7px 18px", borderRadius:99, background:"#A8492A", color:"#fff", border:"none", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(168,73,42,.5)" }}>
                  {RC.close}
                </button>
              : <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"2px solid rgba(255,255,255,.16)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:15, fontWeight:800, color:"rgba(255,255,255,.6)" }}>{adCountdown}</span>
                </div>
            }
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 28px" }}>
            {!adDone ? (
              <div style={{ width:"100%" }}>
                <div style={{ borderRadius:22, background:"linear-gradient(160deg,#1a2e40,#0d1a28)", padding:"32px 24px 28px", textAlign:"center", border:"1px solid rgba(255,255,255,.07)", boxShadow:"0 24px 60px rgba(0,0,0,.5)" }}>
                  <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#2e6fdb,#6bb5f8)", margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, boxShadow:"0 8px 24px rgba(46,111,219,.4)" }}>💊</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:"#fff", marginBottom:8, lineHeight:1.2 }}>Elevit {rcLang==="en"?"Maternity":"Materna"}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.58)", lineHeight:1.65, marginBottom:22 }}>{rcLang==="en"?"The #1 prenatal vitamin recommended by OB-GYNs. Folic acid, iron, and DHA for your baby's development.":"La vitamina prenatal n.º1 recomendada por ginecólogos. Ácido fólico, hierro y DHA para el desarrollo de tu bebé."}</div>
                  <div style={{ display:"inline-flex", padding:"5px 14px", borderRadius:99, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)" }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.38)", fontWeight:600 }}>elevit.com · {RC.ad}</span>
                  </div>
                </div>
                <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,.08)", marginTop:20, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:99, background:"#A8492A", width:((5-adCountdown)/5*100)+"%", transition:"width 1s linear" }} />
                </div>
                <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:"rgba(255,255,255,.25)" }}>{rcLang==="en"?`Wait ${adCountdown}s to close`:`Espera ${adCountdown}s para cerrar`}</div>
              </div>
            ) : (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:600, color:"#fff", marginBottom:8, letterSpacing:"-.02em" }}>+50 {RC.points}</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,.5)", marginBottom:32, lineHeight:1.5 }}>{rcLang==="en"?"Thanks for watching the ad!":"¡Gracias por ver el anuncio!"}</div>
                <button onClick={() => { earnRewardedPts(); setShowRewardedAd(false); setAdDone(false); }}
                  style={{ padding:"16px 48px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#c4693a,#A8492A)", color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 12px 32px rgba(168,73,42,.55)" }}>
                  {rcLang==="en"?"Claim points ✓":"Cobrar puntos ✓"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ULTRASONIDOS ─── */
function UltrasonidosScreen({ goBack, goToTab }) {
  const usLang = getAppLang2();
  const US = usLang==="en" ? {
    eyebrow:"Medical monitoring", title:"Ultrasounds", sub:"Tap + to add · Every scan is saved to your history",
    limitReached:(n)=>`You've reached the ${n}-scan limit on the free plan · Activate Wellness for unlimited`,
    newScan:"New ultrasound", week:"Week", heartRate:"Heart rate", doctorNotes:"Doctor's notes",
    notesPh:"Observations, measurements, baby's position...", photo:"Ultrasound photo", saveScan:"Save ultrasound",
    toast:"✓ Ultrasound saved · +10 points", emptyTitle:"No ultrasounds yet",
    emptyBody:"Tap the ", emptyBody2:" to log your first ultrasound and save your baby's images.",
    editingWeek:(w)=>`Editing week ${w}`, bpmLabel:"BPM", notes:"Notes", cancel:"Cancel", saveChanges:"Save changes",
    deleteUs:"Delete ultrasound", weekWord:"Week", ultrasoundPh:"Ultrasound",
  } : {
    eyebrow:"Seguimiento médico", title:"Ultrasonidos", sub:"Toca + para añadir · Cada eco se guarda en tu historial",
    limitReached:(n)=>`Alcanzaste el límite de ${n} ecografías del plan gratis · Activa Bienestar para ilimitadas`,
    newScan:"Nueva ecografía", week:"Semana", heartRate:"Ritmo cardíaco", doctorNotes:"Notas del médico",
    notesPh:"Observaciones, medidas, posición del bebé...", photo:"Foto ecografía", saveScan:"Guardar ecografía",
    toast:"✓ Ecografía guardada · +10 puntos", emptyTitle:"Sin ecografías aún",
    emptyBody:"Toca el ", emptyBody2:" para registrar tu primera ecografía y guardar las imágenes de tu bebé.",
    editingWeek:(w)=>`Editando semana ${w}`, bpmLabel:"BPM", notes:"Notas", cancel:"Cancelar", saveChanges:"Guardar cambios",
    deleteUs:"Eliminar ultrasonido", weekWord:"Semana", ultrasoundPh:"Ecografía",
  };
  const usLocale = usLang==="en"?"en-US":"es-ES";
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const FREE_LIMIT = 2;
  const [semana, setSemana] = React.useState("");
  const [notas, setNotas] = React.useState("");
  const [bpm, setBpm] = React.useState("");
  const [records, setRecords] = React.useState(() => LS.get("lume_ultrasound") || [
    { id: 1, week: 12, date: "14 de mayo de 2026", notes: "Todo normal. Posición cefálica.", bpm: "162", slots: ["us-1-a", "us-1-b"] }
  ]);
  const [saved, setSaved] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editData, setEditData] = React.useState({});

  const addRecord = () => {
    if (!semana) return;
    const id = Date.now();
    const r = [...records, {
      id, week: +semana,
      date: new Date().toLocaleDateString(usLocale, { day: "numeric", month: "long", year: "numeric" }),
      notes: notas, bpm,
      slots: [`us-${id}-a`, `us-${id}-b`]
    }];
    r.sort((a, b) => a.week - b.week);
    setRecords(r); LS.set("lume_ultrasound", r);
    addPoints(10);
    setSemana(""); setNotas(""); setBpm("");
    setSaved(true); setShowForm(false);
    setTimeout(() => setSaved(false), 2800);
  };

  const startEdit = (rid, rweek, rbpm, rnotes) => {
    setEditId(rid);
    setEditData({ week: String(rweek), bpm: rbpm || "", notes: rnotes || "" });
  };

  const saveEdit = (rid) => {
    const updated = records.map(rec =>
      rec.id === rid ? { ...rec, week: +editData.week || rec.week, bpm: editData.bpm, notes: editData.notes } : rec
    );
    updated.sort((a, b) => a.week - b.week);
    setRecords(updated); LS.set("lume_ultrasound", updated);
    setEditId(null);
  };

  const deleteRecord = (rid) => {
    const updated = records.filter(rec => rec.id !== rid);
    setRecords(updated); LS.set("lume_ultrasound", updated);
    setEditId(null);
  };

  /* ── estilos de vidrio compartidos ── */
  const glassCard = {
    background: "rgba(255,255,255,.52)",
    backdropFilter: "blur(28px) saturate(170%)",
    WebkitBackdropFilter: "blur(28px) saturate(170%)",
    border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 22px 56px -14px rgba(80,30,16,.48), 0 2px 0 rgba(255,255,255,.9) inset, 0 -1px 0 rgba(168,73,42,.06) inset"
  };

  return (
    <div style={{ backgroundColor: "#f0e2d6", backgroundImage: "linear-gradient(160deg,rgba(249,241,235,.78) 0%,rgba(240,226,214,.76) 45%,rgba(232,213,198,.74) 100%), url('uploads/ultrasound-bg.png')", backgroundSize: "100% 100%, auto 100%", backgroundPosition: "0 0, center center", backgroundRepeat: "no-repeat, no-repeat", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header sticky glass ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.1)", padding: "52px 20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.11)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 7 }}>{US.eyebrow}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px", lineHeight: 1, marginBottom: 4 }}>{US.title}</h2>
          <p style={{ margin: 0, fontSize: 11.5, color: "#a08070", lineHeight: 1.4 }}>{US.sub}</p>
        </div>
        <button
          onClick={() => { if (!isPremium && records.length >= FREE_LIMIT) { goToTab && goToTab("premium"); return; } setShowForm(!showForm); }}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: showForm ? "#A8492A" : "rgba(168,73,42,.12)", color: showForm ? "#fff" : "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .3s cubic-bezier(.23,1,.32,1)", transform: showForm ? "rotate(45deg)" : "none", boxShadow: showForm ? "0 8px 24px rgba(168,73,42,.42)" : "none", flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div style={{ padding: "20px 16px 56px" }}>
        {!isPremium && records.length >= FREE_LIMIT && !showForm && (
          <div onClick={() => goToTab && goToTab("premium")} style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(168,73,42,.07)", border: "1px dashed rgba(168,73,42,.28)", marginBottom: 18, cursor: "pointer", fontSize: 12.5, color: "#A8492A", fontWeight: 600, textAlign: "center" }}>
            {US.limitReached(FREE_LIMIT)}
          </div>
        )}

        {/* ── Formulario nueva ecografía ── */}
        {showForm && (
          <div style={{ ...glassCard, borderRadius: 26, padding: "22px 18px", marginBottom: 22, animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#A8492A", marginBottom: 18 }}>{US.newScan}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div className="field-label">{US.week}</div>
                <input type="number" className="app-field" min="6" max="40" placeholder="ej. 20" value={semana} onChange={(e) => setSemana(e.target.value)} />
              </div>
              <div>
                <div className="field-label">{US.heartRate}</div>
                <input type="number" className="app-field" placeholder="bpm" value={bpm} onChange={(e) => setBpm(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="field-label">{US.doctorNotes}</div>
              <textarea className="app-field" style={{ minHeight: 72, resize: "none" }} placeholder={US.notesPh} value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[1, 2].map((n) => (
                <image-slot key={n} id={"us-add-" + n} shape="rounded" radius="12" placeholder={US.photo} style={{ width: "100%", height: "90px", display: "block" }}></image-slot>
              ))}
            </div>

            <button
              onClick={addRecord}
              style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", background: semana ? "linear-gradient(135deg,#c4693a,#A8492A)" : "rgba(200,185,180,.3)", color: semana ? "#fff" : "#b0a09a", fontWeight: 700, fontSize: 15, cursor: semana ? "pointer" : "default", boxShadow: semana ? "0 12px 32px rgba(168,73,42,.42), 0 1px 0 rgba(255,255,255,.25) inset" : "none", fontFamily: "inherit", transition: "all .25s", letterSpacing: ".01em" }}
            >
              {US.saveScan}
            </button>
          </div>
        )}

        {/* ── Toast guardado ── */}
        {saved && (
          <div style={{ padding: "14px 18px", borderRadius: 16, background: "rgba(123,191,106,.14)", color: "#3e8836", fontWeight: 700, textAlign: "center", fontSize: 13.5, border: "1px solid rgba(123,191,106,.28)", marginBottom: 20, animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
            ✓ {US.toast.replace("✓ ","")}
          </div>
        )}

        {/* ── Estado vacío ── */}
        {records.length === 0 && (
          <div style={{ textAlign: "center", padding: "52px 24px 32px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(168,73,42,.07)", border: "1.5px solid rgba(168,73,42,.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="1.6" strokeLinecap="round" style={{ opacity: .65 }}>
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#5a3a2a", marginBottom: 8 }}>{US.emptyTitle}</div>
            <p style={{ fontSize: 13.5, color: "#a08070", lineHeight: 1.65, margin: 0 }}>{US.emptyBody}<strong style={{ color: "#A8492A" }}>+</strong>{US.emptyBody2}</p>
          </div>
        )}

        {/* ── Timeline ── */}
        {records.length > 0 && (
          <div style={{ position: "relative" }}>
            {records.length > 1 && (
              <div style={{ position: "absolute", left: 25, top: 28, bottom: 28, width: 2, background: "linear-gradient(180deg, rgba(168,73,42,.4) 0%, rgba(168,73,42,.06) 100%)", borderRadius: 2, zIndex: 0 }}></div>
            )}

            {records.map((r, idx) => {
              const isEditing = editId === r.id;
              return (
                <div key={r.id} style={{ display: "flex", gap: 14, marginBottom: idx < records.length - 1 ? 16 : 0, position: "relative", zIndex: 1 }}>

                  {/* Nodo semana */}
                  <div style={{ flexShrink: 0, paddingTop: 6 }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(140deg,#d4693a 0%,#8B3520 100%)", border: "3px solid #f0e2d6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 26px rgba(168,73,42,.42), 0 0 0 1px rgba(255,255,255,.3) inset" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{r.week}</span>
                      <span style={{ fontSize: 7, fontWeight: 800, color: "rgba(255,255,255,.68)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 1 }}>sem</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0, ...glassCard, borderRadius: 22, padding: "16px 16px 15px", overflow: "hidden" }}>

                    {isEditing ? (
                      /* ── Modo edición ── */
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#A8492A", marginBottom: 14 }}>{US.editingWeek(r.week)}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 10 }}>
                          <div>
                            <div className="field-label">{US.week}</div>
                            <input type="number" className="app-field" value={editData.week} onChange={(e) => setEditData({ ...editData, week: e.target.value })} />
                          </div>
                          <div>
                            <div className="field-label">{US.bpmLabel}</div>
                            <input type="number" className="app-field" placeholder="bpm" value={editData.bpm} onChange={(e) => setEditData({ ...editData, bpm: e.target.value })} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <div className="field-label">{US.notes}</div>
                          <textarea className="app-field" style={{ minHeight: 60, resize: "none" }} value={editData.notes} onChange={(e) => setEditData({ ...editData, notes: e.target.value })}></textarea>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <button onClick={() => setEditId(null)} style={{ flex: 1, padding: "11px", borderRadius: 13, border: "1px solid rgba(168,73,42,.18)", background: "rgba(255,255,255,.55)", color: "#8a6a5a", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{US.cancel}</button>
                          <button onClick={() => saveEdit(r.id)} style={{ flex: 2, padding: "11px", borderRadius: 13, border: "none", background: "linear-gradient(135deg,#c4693a,#A8492A)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 22px rgba(168,73,42,.36)" }}>{US.saveChanges}</button>
                        </div>
                        <button onClick={() => deleteRecord(r.id)} style={{ width: "100%", padding: "11px", borderRadius: 13, border: "1px solid rgba(200,60,60,.22)", background: "rgba(220,60,60,.07)", color: "#c04040", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          {US.deleteUs}
                        </button>
                      </div>
                    ) : (
                      /* ── Modo visualización ── */
                      <div>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                          <div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 19, color: "#3d1a0e", letterSpacing: "-.2px", lineHeight: 1.1 }}>{US.weekWord} {r.week}</div>
                            <div style={{ fontSize: 12, color: "#b09080", marginTop: 5, letterSpacing: ".01em" }}>{r.date}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            {r.bpm && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 99, background: "rgba(168,73,42,.08)", border: "1px solid rgba(168,73,42,.16)" }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.5" strokeLinecap="round"><path d="M2 12h4l3-9 4 18 3-9h4"/></svg>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#A8492A", letterSpacing: ".02em" }}>{r.bpm} bpm</span>
                              </div>
                            )}
                            <button onClick={() => startEdit(r.id, r.week, r.bpm, r.notes)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(168,73,42,.2)", background: "rgba(168,73,42,.09)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background .15s" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                            </button>
                          </div>
                        </div>

                        {r.slots && r.slots.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: r.notes ? 12 : 0 }}>
                            {r.slots.map((sid) => (
                              <image-slot key={sid} id={sid} shape="rounded" radius="11" placeholder={US.ultrasoundPh} style={{ width: "100%", height: "98px", display: "block" }}></image-slot>
                            ))}
                          </div>
                        )}

                        {r.notes && (
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 12px", borderRadius: 12, background: "rgba(168,73,42,.05)" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, opacity: .5 }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>
                            </svg>
                            <p style={{ margin: 0, fontSize: 12.5, color: "#5a3a2a", lineHeight: 1.6 }}>{r.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CONTROL DE PESO ─── */
function PesoScreen({ goBack }) {
  const wLang = getAppLang2();
  const WG = wLang==="en" ? {
    eyebrow:"Physical tracking", title:"Weight tracker", sub:"Tap + to log your weight",
    currentWeight:"Current weight", updated:"Updated · ", total:"total",
    newRecord:"New record", weightKg:"Weight (kg)", noteOpt:"Note (optional)", notePh:"After breakfast…", saveRecord:"Save record",
    toast:"✓ Weight logged", watchAd:"Watch short ad → ", points50:"+50 points",
    history:"History · ", infoNote:"Healthy weight gain varies based on your prior BMI. Check with your doctor for the recommended ranges for you.",
  } : {
    eyebrow:"Seguimiento físico", title:"Control de peso", sub:"Toca + para registrar tu peso",
    currentWeight:"Peso actual", updated:"Actualizado · ", total:"en total",
    newRecord:"Nuevo registro", weightKg:"Peso (kg)", noteOpt:"Nota (opcional)", notePh:"Después de desayunar…", saveRecord:"Guardar registro",
    toast:"✓ Peso registrado", watchAd:"Ver anuncio breve → ", points50:"+50 puntos",
    history:"Historial · ", infoNote:"La ganancia de peso saludable varía según tu IMC previo. Consulta con tu médico los rangos recomendados para ti.",
  };
  const wLocale = wLang==="en"?"en-US":"es-ES";
  const [weight, setWeight] = React.useState("");
  const [note, setNote] = React.useState("");
  const stored = LS.get("lume_weight");
  const [log, setLog] = React.useState(() => (stored && stored.length > 0) ? stored : [
    { id: 1, date: "1 jun", w: 63.5, note: "" },
    { id: 2, date: "8 jun", w: 63.9, note: "" },
    { id: 3, date: "14 jun", w: 64.2, note: "Después del desayuno" }
  ]);
  const [saved, setSaved] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const addEntry = () => {
    if (!weight || isNaN(+weight)) return;
    const entry = { id: Date.now(), date: new Date().toLocaleDateString(wLocale, { day: "numeric", month: "short" }), w: parseFloat((+weight).toFixed(1)), note };
    const l = [...log, entry];
    setLog(l); LS.set("lume_weight", l);
    setWeight(""); setNote(""); setSaved(true); setShowForm(false);
    setTimeout(() => setSaved(false), 2800);
  };
  const delEntry = (id) => { const l = log.filter((x) => x.id !== id); setLog(l); LS.set("lume_weight", l); };

  const last = log[log.length - 1];
  const prevLast = log[log.length - 2];
  const first = log[0];
  const totalGain = last && first ? last.w - first.w : 0;

  const glassCard = {
    background: "rgba(255,255,255,.52)",
    backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)",
    border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 20px 50px -14px rgba(80,30,16,.44), 0 2px 0 rgba(255,255,255,.9) inset"
  };

  // ── Gráfico SVG ──
  const W = 320, H = 130, padX = 14, padY = 18;
  const chart = (() => {
    if (log.length < 2) return null;
    const ws = log.map((r) => r.w);
    const min = Math.min(...ws) - 0.5, max = Math.max(...ws) + 0.5;
    const range = max - min || 1;
    const pts = log.map((r, i) => {
      const x = padX + (i / (log.length - 1)) * (W - padX * 2);
      const y = padY + (1 - (r.w - min) / range) * (H - padY * 2);
      return { x, y, w: r.w, date: r.date };
    });
    const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
    const area = path + ` L${pts[pts.length-1].x.toFixed(1)} ${H-padY} L${pts[0].x.toFixed(1)} ${H-padY} Z`;
    return { pts, path, area };
  })();

  return (
    <div style={{ background: "linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header sticky glass ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.08)", padding: "52px 20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 5 }}>{WG.eyebrow}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px", lineHeight: 1, marginBottom: 4 }}>{WG.title}</h2>
          <p style={{ margin: 0, fontSize: 11.5, color: "#a08070" }}>{WG.sub}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: showForm ? "#A8492A" : "rgba(168,73,42,.12)", color: showForm ? "#fff" : "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .3s cubic-bezier(.23,1,.32,1)", transform: showForm ? "rotate(45deg)" : "none", boxShadow: showForm ? "0 8px 24px rgba(168,73,42,.42)" : "none", flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div style={{ padding: "20px 16px 56px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Hero card peso actual + gráfico ── */}
        {last && (
          <div style={{ borderRadius: 26, padding: "22px 20px 18px", background: "linear-gradient(145deg,#5E1C08 0%,#7A3218 30%,#A8492A 72%,#B85A32 100%)", boxShadow: "0 24px 60px -16px rgba(80,24,8,.54), 0 0 0 1px rgba(255,255,255,.1) inset", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: -40, right: -30, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,128,.26),transparent 65%)", pointerEvents: "none" }}></div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 6 }}>{WG.currentWeight}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-.02em" }}>{last.w}</span>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>kg</span>
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", marginTop: 4 }}>{WG.updated}{last.date}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 99, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.22)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d={totalGain >= 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7"}/></svg>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>{totalGain >= 0 ? "+" : ""}{totalGain.toFixed(1)} kg</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.55)", marginTop: 5, fontWeight: 600 }}>{WG.total}</div>
              </div>
            </div>

            {/* Gráfico */}
            {chart && (
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,.25)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                  </linearGradient>
                </defs>
                <path d={chart.area} fill="url(#wgrad)"/>
                <path d={chart.path} fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {chart.pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={i === chart.pts.length - 1 ? 5 : 3.5} fill="#fff"/>
                    {i === chart.pts.length - 1 && <circle cx={p.x} cy={p.y} r={8} fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>}
                  </g>
                ))}
              </svg>
            )}
          </div>
        )}

        {/* ── Formulario ── */}
        {showForm && (
          <div style={{ ...glassCard, borderRadius: 26, padding: "22px 18px", animation: "fadeSlideUp .3s cubic-bezier(.23,1,.32,1)" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#A8492A", marginBottom: 18 }}>{WG.newRecord}</div>
            <div style={{ marginBottom: 12 }}>
              <div className="field-label">{WG.weightKg}</div>
              <input type="number" className="app-field" step="0.1" placeholder="ej. 64.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <div className="field-label">{WG.noteOpt}</div>
              <input className="app-field" placeholder={WG.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button
              onClick={addEntry}
              style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", background: weight ? "linear-gradient(135deg,#c4693a,#A8492A)" : "rgba(200,185,180,.3)", color: weight ? "#fff" : "#b0a09a", fontWeight: 700, fontSize: 15, cursor: weight ? "pointer" : "default", boxShadow: weight ? "0 12px 32px rgba(168,73,42,.42)" : "none", fontFamily: "inherit", transition: "all .25s" }}
            >
              {WG.saveRecord}
            </button>
          </div>
        )}

        {/* ── Toast ── */}
        {saved && (
          <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(123,191,106,.22)", animation:"fadeSlideUp .3s cubic-bezier(.23,1,.32,1)", marginTop:4 }}>
            <div style={{ padding:"13px 16px", background:"rgba(123,191,106,.14)", color:"#3e8836", fontWeight:700, textAlign:"center", fontSize:13.5 }}>{WG.toast}</div>
            <button onClick={()=> window.triggerRewardedAd && window.triggerRewardedAd("points")}
              style={{ width:"100%", padding:"11px 16px", border:"none", borderTop:"1px solid rgba(168,73,42,.1)",
                background:"linear-gradient(135deg,rgba(61,26,14,.96),rgba(90,42,20,.92))",
                color:"#E6CFA1", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E6CFA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> {WG.watchAd}<strong style={{color:"#fff"}}>{WG.points50}</strong>
            </button>
          </div>
        )}

        {/* ── Historial ── */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .7, marginBottom: 12, paddingLeft: 2 }}>{WG.history}{log.length}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[...log].reverse().map((r) => {
              const origIdx = log.findIndex((x) => x.id === r.id);
              const prev = origIdx > 0 ? log[origIdx - 1] : null;
              const d = prev ? r.w - prev.w : null;
              return (
                <div key={r.id} style={{ ...glassCard, borderRadius: 18, padding: "13px 15px", display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(168,73,42,.08)", border: "1px solid rgba(168,73,42,.14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#A8492A", lineHeight: 1 }}>{r.w}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#c08060", letterSpacing: ".04em" }}>kg</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#3d1a0e" }}>{r.date}</div>
                    {r.note && <div style={{ fontSize: 11.5, color: "#a08070", marginTop: 2, lineHeight: 1.4 }}>{r.note}</div>}
                  </div>
                  {d !== null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 9px", borderRadius: 99, background: d >= 0 ? "rgba(168,73,42,.08)" : "rgba(123,191,106,.12)", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: d >= 0 ? "#A8492A" : "#3e8836" }}>{d >= 0 ? "+" : ""}{d.toFixed(1)}</span>
                    </div>
                  )}
                  <button onClick={() => delEntry(r.id)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(200,60,60,.16)", background: "rgba(220,60,60,.06)", color: "#c04040", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Nota informativa ── */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 16px", borderRadius: 16, background: "rgba(168,73,42,.05)", border: "1px solid rgba(168,73,42,.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1, opacity: .6 }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p style={{ margin: 0, fontSize: 12.5, color: "#7a5a4a", lineHeight: 1.55 }}>{WG.infoNote}</p>
        </div>

      </div>
    </div>
  );
}

/* ── AJUSTES ─── */
/* ── AJUSTES ─── */
function AjustesScreen({ goBack, setWeek }) {
  const ajLang = getAppLang2();
  const AT = ajLang==="en" ? {
    yourAccount:"Your account", settings:"Settings", weekOf:"Week ", pts:" pts", premium:"✦ Premium",
    progress:"Pregnancy progress", wk4:"Wk. 4", wk42:"Wk. 42",
    myProfile:"My profile", name:"Name", cancel:"Cancel", save:"Save", edit:"Edit",
    pregWeeks:"Pregnancy weeks", weekTri:(w,t)=>`Week ${w} · Trimester ${t}`,
    dueDate:"Estimated due date", notSet:"Not set",
    notifications:"Notifications", apptReminder:"Appointment reminders", apptSub:"Alerts 24h before",
    dailyTip:"Daily tip", dailyTipSub:"Nutrition tip every morning", kickReminder:"Kick reminders", kickSub:"Count your baby's movements",
    notifNote:"In the real app, these preferences turn on alerts on your phone",
    language:"Language", appLanguage:"App language", langSub:"Spanish / English",
    langNote:"Every screen in the app, the landing page, and the legal pages are available in English.",
    yourPlan:"Your plan", planEssential:"Essential", planWellness:"Wellness", activeFull:"Active · Full access", freeVersion:"Free version", upgrade:"Upgrade",
    unlockMsg:"Unlock ", unlockBold:"Meditation, Nutrition plan, Baby music, Diary", unlockRest:" and much more.", tryFree:"Try 7 days free",
    application:"Application", appName:"Lumé — Mindful motherhood", version:"Version 1.0 Beta",
    rateApp:"Rate the app", howRate:"How would you rate Lumé?", submitRating:"Submit rating", thanksRating:"Thanks for your rating!", ratingHelps:"Your feedback helps us improve",
    privacyTerms:"Privacy and terms",
    activated:"✓ Activated", deactivated:"Deactivated",
    privacyBack:"Privacy and terms",
    privacySections:[
      {t:"Data we collect",b:"Lumé collects information you provide directly: name, pregnancy weeks, symptoms, weight logs, photos, and diary notes. This information is stored securely and never shared with third parties without your explicit consent."},
      {t:"How we use your information",b:"We use your data exclusively to personalize your experience: tailoring nutrition tips, calculating your baby's progress, reminding you of appointments, and showing content relevant to your pregnancy week."},
      {t:"Data security",b:"All your information is encrypted in transit and at rest. We use hospital-grade security standards to protect your most sensitive data."},
      {t:"Your rights",b:"You can request export or deletion of all your data at any time from this screen or by writing to privacy@lume.app. We comply with GDPR and applicable data protection laws."},
      {t:"Terms of use",b:"By using Lumé you agree that the app's content is informational and does not replace your doctor's or midwife's opinion. Always consult a health professional for any medical concerns."},
    ],
    lastUpdated:"Last updated: January 2025 · v1.0",
  } : {
    yourAccount:"Tu cuenta", settings:"Ajustes", weekOf:"Semana ", pts:" pts", premium:"✦ Premium",
    progress:"Progreso del embarazo", wk4:"Sem. 4", wk42:"Sem. 42",
    myProfile:"Mi perfil", name:"Nombre", cancel:"Cancelar", save:"Guardar", edit:"Editar",
    pregWeeks:"Semanas de embarazo", weekTri:(w,t)=>`Semana ${w} · Trimestre ${t}`,
    dueDate:"Fecha probable de parto", notSet:"Sin configurar",
    notifications:"Notificaciones", apptReminder:"Recordatorio de citas", apptSub:"Alertas 24h antes",
    dailyTip:"Consejo diario", dailyTipSub:"Tip nutricional cada mañana", kickReminder:"Recordatorio de patadas", kickSub:"Contar movimientos del bebé",
    notifNote:"En la app real, estas preferencias activan alertas en tu teléfono",
    language:"Idioma", appLanguage:"Idioma de la app", langSub:"Español / English",
    langNote:"Todas las pantallas de la app, la landing y las páginas legales están disponibles en inglés.",
    yourPlan:"Tu plan", planEssential:"Esencial", planWellness:"Bienestar", activeFull:"Activo · Acceso completo", freeVersion:"Versión gratuita", upgrade:"Mejorar",
    unlockMsg:"Desbloquea ", unlockBold:"Meditaciones, Plan nutricional, Música Bebé, Diario", unlockRest:" y mucho más.", tryFree:"Probar 7 días gratis",
    application:"Aplicación", appName:"Lumé — Maternidad consciente", version:"Versión 1.0 Beta",
    rateApp:"Calificar la app", howRate:"¿Cómo valoras Lumé?", submitRating:"Enviar valoración", thanksRating:"¡Gracias por tu valoración!", ratingHelps:"Tu opinión nos ayuda a mejorar",
    privacyTerms:"Privacidad y términos",
    activated:"✓ Activado", deactivated:"Desactivado",
    privacyBack:"Privacidad y términos",
    privacySections:[
      {t:"Datos que recopilamos",b:"Lumé recopila información que tú nos proporcionas directamente: nombre, semanas de embarazo, síntomas, registros de peso, fotos y notas del diario. Esta información se almacena de forma segura y nunca se comparte con terceros sin tu consentimiento explícito."},
      {t:"Cómo usamos tu información",b:"Usamos tus datos exclusivamente para personalizar tu experiencia: adaptar los consejos nutricionales, calcular el progreso del bebé, recordarte citas y mostrarte contenido relevante a tu semana de embarazo."},
      {t:"Seguridad de los datos",b:"Toda tu información se cifra en tránsito y en reposo. Utilizamos estándares de seguridad de nivel hospitalario para proteger tus datos más sensibles."},
      {t:"Tus derechos",b:"Puedes solicitar la exportación o eliminación de todos tus datos en cualquier momento desde esta pantalla o escribiéndonos a privacidad@lume.app. Cumplimos con el RGPD y la Ley Orgánica de Protección de Datos."},
      {t:"Términos de uso",b:"Al usar Lumé aceptas que el contenido de la app es informativo y no reemplaza la opinión de tu médico o matrona. Siempre consulta a un profesional de salud ante cualquier duda médica."},
    ],
    lastUpdated:"Última actualización: enero 2025 · v1.0",
  };
  const ajLocale = ajLang==="en"?"en-US":"es-ES";
  const [nombre, setNombre] = React.useState(() => {try{return localStorage.getItem("lume_nombre")||"Sofía";}catch{return "Sofía";}});
  const [notif,  setNotif]  = React.useState(() => localStorage.getItem("lume_notif")  !== "false");
  const [tips,   setTips]   = React.useState(() => localStorage.getItem("lume_tips")   !== "false");
  const [kicks,  setKicks]  = React.useState(() => localStorage.getItem("lume_kicks_notif") !== "false");
  const [editNombre, setEditNombre] = React.useState(false);
  const [editSemanas, setEditSemanas] = React.useState(false);
  const [editFpp, setEditFpp] = React.useState(false);
  const [tmpFpp, setTmpFpp] = React.useState("");
  const [notifToast, setNotifToast] = React.useState("");
  const [showRate, setShowRate] = React.useState(false);
  const [stars, setStars] = React.useState(0);
  const [rated, setRated] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [tmp, setTmp] = React.useState("");
  const [tmpSemanas, setTmpSemanas] = React.useState("15");
  const [pressRow, setPressRow] = React.useState(null);

  const saveNombre = () => {
    if(tmp.trim()){setNombre(tmp.trim());try{localStorage.setItem("lume_nombre",tmp.trim());}catch{}}
    setEditNombre(false);
  };
  const saveSemanas = () => {
    const w = parseInt(tmpSemanas);
    if(w>=4&&w<=42){try{localStorage.setItem("lume_weeks",String(w));if(setWeek)setWeek(w);}catch{}}
    setEditSemanas(false);
  };
  const saveFpp = () => {
    if(tmpFpp){try{localStorage.setItem("lume_due",tmpFpp);}catch{}}
    setEditFpp(false);
  };
  const requestNotif = (key, val, setter) => {
    setter(val);
    try{localStorage.setItem(key,String(val));}catch{}
    setNotifToast(val ? AT.activated : AT.deactivated);
    setTimeout(()=>setNotifToast(""),2000);
  };
  const tog = (key,val,setter) => {setter(val);try{localStorage.setItem(key,String(val));}catch{}};

  const [due, setDue] = React.useState(()=>{try{return localStorage.getItem("lume_due")||"";}catch{return "";}});
  const weeks   = (()=>{try{return parseInt(localStorage.getItem("lume_weeks")||"15")||15;}catch{return 15;}})();
  const points  = (()=>{try{return parseInt(localStorage.getItem("lume_points")||"126")||126;}catch{return 126;}})();
  const isPremium = (()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}})();
  const tri   = weeks<=13?1:weeks<=26?2:3;
  const initial = nombre.charAt(0).toUpperCase();

  const GlassSection = ({children}) => (
    <div style={{background:"rgba(255,255,255,.54)",backdropFilter:"blur(22px) saturate(165%)",WebkitBackdropFilter:"blur(22px) saturate(165%)",border:"1px solid rgba(255,255,255,.88)",borderRadius:20,overflow:"hidden",boxShadow:"0 10px 32px rgba(168,73,42,.1), 0 1px 0 rgba(255,255,255,.9) inset"}}>
      {children}
    </div>
  );

  const Row = ({id,icon,title,value,onPress,toggle,togVal,border=true,chevron=false}) => {
    const pressed = pressRow===id;
    return (
      <div onPointerDown={()=>setPressRow(id)} onPointerUp={()=>setPressRow(null)} onPointerLeave={()=>setPressRow(null)}
        onClick={onPress}
        style={{display:"flex",alignItems:"center",gap:13,padding:"15px 18px",
          borderTop:border?"1px solid rgba(168,73,42,.06)":"none",
          cursor:onPress||toggle?"pointer":"default",
          background:pressed&&(onPress||toggle)?"rgba(168,73,42,.04)":"transparent",
          transition:"background .15s"}}>
        <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <AppIcon name={icon} size={17}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e",lineHeight:1.2}}>{title}</div>
          {value&&<div style={{fontSize:11.5,color:"#a08070",marginTop:3}}>{value}</div>}
        </div>
        {toggle!==undefined&&(
          <button onClick={e=>{e.stopPropagation();toggle();}}
            style={{width:44,height:26,borderRadius:99,border:"none",cursor:"pointer",flexShrink:0,
              background:togVal?"linear-gradient(90deg,#C8952A,#A8492A)":"rgba(200,185,180,.3)",
              boxShadow:togVal?"0 4px 14px rgba(168,73,42,.38)":"none",
              position:"relative",transition:"all .28s cubic-bezier(.34,1.56,.64,1)"}}>
            <div style={{position:"absolute",top:3,left:togVal?20:3,width:20,height:20,borderRadius:"50%",
              background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,.2)",transition:"left .28s cubic-bezier(.34,1.56,.64,1)"}}></div>
          </button>
        )}
        {chevron&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0a090" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100%",overflowY:"auto",overflowX:"hidden",background:"linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)",position:"relative"}}>

      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:20,backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",
        background:"rgba(249,241,235,.88)",borderBottom:"1px solid rgba(168,73,42,.08)",
        padding:"52px 20px 18px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={goBack} style={{width:38,height:38,borderRadius:"50%",border:"none",
          background:"rgba(168,73,42,.1)",color:"#A8492A",display:"flex",alignItems:"center",
          justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.7,marginBottom:4}}>{AT.yourAccount}</div>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#3d1a0e",letterSpacing:"-.3px"}}>{AT.settings}</h2>
        </div>
      </div>

      <div style={{padding:"20px 16px 100px",display:"flex",flexDirection:"column",gap:16}}>

        {/* Tarjeta de perfil */}
        <div style={{position:"relative",overflow:"hidden",borderRadius:24,padding:"22px 20px",
          background:"linear-gradient(135deg,#8B3520 0%,#A8492A 55%,#C8952A 100%)",
          boxShadow:"0 20px 52px rgba(168,73,42,.38),0 1px 0 rgba(255,255,255,.15) inset"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(255,255,255,.12),transparent 65%)",pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,.18)",
              border:"2px solid rgba(255,255,255,.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#fff5ee"}}>{initial}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#fff5ee",lineHeight:1.1,marginBottom:6}}>{nombre}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <div style={{padding:"3px 10px",borderRadius:99,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"rgba(255,245,238,.9)"}}>{AT.weekOf}{weeks} · T{tri}</span>
                </div>
                <div style={{padding:"3px 10px",borderRadius:99,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",gap:4}}>
                  <svg viewBox="0 0 24 24" width={10} height={10} fill="#E6CFA1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{fontSize:11,fontWeight:700,color:"rgba(255,245,238,.9)"}}>{points}{AT.pts}</span>
                </div>
                {isPremium&&<div style={{padding:"3px 10px",borderRadius:99,background:"rgba(230,207,161,.25)",border:"1px solid rgba(230,207,161,.45)"}}>
                  <span style={{fontSize:11,fontWeight:800,color:"#E6CFA1"}}>{AT.premium}</span>
                </div>}
              </div>
            </div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:10,color:"rgba(255,245,238,.55)",fontWeight:600}}>{AT.progress}</span>
              <span style={{fontSize:10,color:"rgba(255,245,238,.55)",fontWeight:600}}>{Math.round(((weeks-4)/38)*100)}%</span>
            </div>
            <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,.15)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,Math.round(((weeks-4)/38)*100))}%`,
                background:"linear-gradient(90deg,rgba(230,207,161,.7),rgba(230,207,161,.95))",borderRadius:4}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:9.5,color:"rgba(255,245,238,.4)"}}>{AT.wk4}</span>
              <span style={{fontSize:9.5,color:"rgba(255,245,238,.4)"}}>{AT.wk42}</span>
            </div>
          </div>
        </div>

        {/* Mi perfil */}
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:10,paddingLeft:2}}>{AT.myProfile}</div>
          <GlassSection>
            {/* Nombre editable inline */}
            <div style={{display:"flex",alignItems:"center",gap:13,padding:"13px 18px",borderBottom:"1px solid rgba(168,73,42,.06)"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <AppIcon name="edit" size={17}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                {editNombre ? (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={tmp} onChange={e=>setTmp(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&saveNombre()}
                      autoFocus
                      style={{width:"100%",padding:"8px 12px",borderRadius:10,border:"1.5px solid rgba(168,73,42,.3)",
                        background:"rgba(255,255,255,.85)",fontSize:14,fontFamily:"inherit",color:"#3d1a0e",outline:"none",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setEditNombre(false)} style={{flex:1,padding:"7px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                        background:"transparent",color:"#a08070",fontSize:12,cursor:"pointer"}}>{AT.cancel}</button>
                      <button onClick={saveNombre} style={{flex:2,padding:"7px",borderRadius:10,border:"none",
                        background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#fff5ee",fontSize:12,fontWeight:700,cursor:"pointer"}}>{AT.save}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.name}</div>
                      <div style={{fontSize:11.5,color:"#a08070",marginTop:2}}>{nombre}</div>
                    </div>
                    <button onClick={()=>{setTmp(nombre);setEditNombre(true);}} style={{padding:"6px 12px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                      background:"rgba(168,73,42,.06)",color:"#A8492A",fontSize:11,fontWeight:700,cursor:"pointer"}}>{AT.edit}</button>
                  </div>
                )}
              </div>
            </div>
            {/* Semanas editables inline */}
            <div style={{display:"flex",alignItems:"center",gap:13,padding:"13px 18px",borderBottom:"1px solid rgba(168,73,42,.06)"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <AppIcon name="spark" size={17}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                {editSemanas ? (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input type="number" min="4" max="42" value={tmpSemanas} onChange={e=>setTmpSemanas(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&saveSemanas()}
                      autoFocus
                      style={{width:"100%",padding:"8px 12px",borderRadius:10,border:"1.5px solid rgba(168,73,42,.3)",
                        background:"rgba(255,255,255,.85)",fontSize:14,fontFamily:"inherit",color:"#A8492A",fontWeight:700,outline:"none",textAlign:"center",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setEditSemanas(false)} style={{flex:1,padding:"7px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                        background:"transparent",color:"#a08070",fontSize:12,cursor:"pointer"}}>{AT.cancel}</button>
                      <button onClick={saveSemanas} style={{flex:2,padding:"7px",borderRadius:10,border:"none",
                        background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#fff5ee",fontSize:12,fontWeight:700,cursor:"pointer"}}>{AT.save}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.pregWeeks}</div>
                      <div style={{fontSize:11.5,color:"#a08070",marginTop:2}}>{AT.weekTri(weeks,tri)}</div>
                    </div>
                    <button onClick={()=>{setTmpSemanas(String(weeks));setEditSemanas(true);}} style={{padding:"6px 12px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                      background:"rgba(168,73,42,.06)",color:"#A8492A",fontSize:11,fontWeight:700,cursor:"pointer"}}>{AT.edit}</button>
                  </div>
                )}
              </div>
            </div>
            {/* FPP editable inline */}
            <div style={{display:"flex",alignItems:"center",gap:13,padding:"13px 18px"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <AppIcon name="calendar" size={17}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                {editFpp ? (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input type="date" value={tmpFpp} onChange={e=>setTmpFpp(e.target.value)}
                      style={{width:"100%",padding:"8px 12px",borderRadius:10,border:"1.5px solid rgba(168,73,42,.3)",
                        background:"rgba(255,255,255,.85)",fontSize:14,fontFamily:"inherit",color:"#3d1a0e",outline:"none",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setEditFpp(false)} style={{flex:1,padding:"7px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                        background:"transparent",color:"#a08070",fontSize:12,cursor:"pointer"}}>{AT.cancel}</button>
                      <button onClick={saveFpp} style={{flex:2,padding:"7px",borderRadius:10,border:"none",
                        background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#fff5ee",fontSize:12,fontWeight:700,cursor:"pointer"}}>{AT.save}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.dueDate}</div>
                      <div style={{fontSize:11.5,color:"#a08070",marginTop:2}}>{due ? new Date(due+"T12:00:00").toLocaleDateString(ajLocale,{day:"numeric",month:"long",year:"numeric"}) : AT.notSet}</div>
                    </div>
                    <button onClick={()=>{setTmpFpp(due||new Date().toISOString().slice(0,10));setEditFpp(true);}} style={{padding:"6px 12px",borderRadius:10,border:"1px solid rgba(168,73,42,.2)",
                      background:"rgba(168,73,42,.06)",color:"#A8492A",fontSize:11,fontWeight:700,cursor:"pointer"}}>{AT.edit}</button>
                  </div>
                )}
              </div>
            </div>
          </GlassSection>
        </div>

        {/* Notificaciones */}
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:10,paddingLeft:2}}>{AT.notifications}</div>
          <GlassSection>
            {[
              {id:"notif", icon:"bell",  title:AT.apptReminder,   sub:AT.apptSub,            key:"lume_notif",        val:notif,  set:setNotif},
              {id:"tips",  icon:"leaf",  title:AT.dailyTip,          sub:AT.dailyTipSub,  key:"lume_tips",         val:tips,   set:setTips},
              {id:"kicks", icon:"heart", title:AT.kickReminder, sub:AT.kickSub,  key:"lume_kicks_notif",  val:kicks,  set:setKicks},
            ].map((n,i)=>(
              <div key={n.id} style={{display:"flex",alignItems:"center",gap:13,padding:"15px 18px",
                borderTop:i>0?"1px solid rgba(168,73,42,.06)":"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <AppIcon name={n.icon} size={17}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{n.title}</div>
                  <div style={{fontSize:11.5,color:"#a08070",marginTop:2}}>{n.sub}</div>
                </div>
                <div onClick={()=>{
                    const next = !n.val;
                    n.set(next);
                    try{localStorage.setItem(n.key,String(next));}catch{}
                    setNotifToast(next?AT.activated:AT.deactivated);
                    setTimeout(()=>setNotifToast(""),2000);
                  }}
                  style={{width:44,height:26,borderRadius:99,flexShrink:0,cursor:"pointer",
                    background:n.val?"linear-gradient(90deg,#C8952A,#A8492A)":"rgba(200,185,180,.3)",
                    boxShadow:n.val?"0 4px 14px rgba(168,73,42,.38)":"none",
                    position:"relative",transition:"all .28s cubic-bezier(.34,1.56,.64,1)"}}>
                  <div style={{position:"absolute",top:3,left:n.val?20:3,width:20,height:20,borderRadius:"50%",
                    background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,.2)",transition:"left .28s cubic-bezier(.34,1.56,.64,1)"}}/>
                </div>
              </div>
            ))}
          </GlassSection>
          <div style={{fontSize:11,color:"#b09080",lineHeight:1.6,padding:"8px 4px 0",textAlign:"center"}}>
            {AT.notifNote}
          </div>
        </div>

        {/* Idioma */}
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:10,paddingLeft:2}}>{AT.language}</div>
          <GlassSection>
            <div style={{display:"flex",alignItems:"center",gap:13,padding:"15px 18px"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="#A8492A" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9Z"/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.appLanguage}</div>
                <div style={{fontSize:11.5,color:"#a08070"}}>{AT.langSub}</div>
              </div>
              <div style={{display:"flex",borderRadius:99,background:"rgba(168,73,42,.08)",padding:3,gap:2}}>
                {["es","en"].map(l => (
                  <button key={l} onClick={() => { try{localStorage.setItem("lume_lang", l);}catch{}; window.location.reload(); }}
                    style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,
                      background:(()=>{try{return (localStorage.getItem("lume_lang")||"es")===l;}catch{return l==="es";}})()?"#A8492A":"transparent",
                      color:(()=>{try{return (localStorage.getItem("lume_lang")||"es")===l;}catch{return l==="es";}})()?"#fff":"#a08070"}}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </GlassSection>
          <div style={{fontSize:11,color:"#b09080",lineHeight:1.6,padding:"8px 4px 0",textAlign:"center"}}>
            {AT.langNote}
          </div>
        </div>

        {/* Tu plan */}
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:10,paddingLeft:2}}>{AT.yourPlan}</div>
          <div style={{borderRadius:20,overflow:"hidden",background:"rgba(255,255,255,.54)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",border:"1px solid rgba(255,255,255,.88)",boxShadow:"0 10px 32px rgba(168,73,42,.1)"}}>
            <div style={{padding:"16px 18px",borderBottom:!isPremium?"1px solid rgba(168,73,42,.06)":"none",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:11,background:isPremium?"rgba(200,149,42,.12)":"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={isPremium?"#C8952A":"#a08070"} strokeWidth="1.8" strokeLinecap="round"><path d="M4 8l3.5 2.5L12 5l4.5 5.5L20 8l-1.4 9.5H5.4L4 8Z"/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#3d1a0e"}}>{isPremium?AT.planWellness:AT.planEssential}</div>
                <div style={{fontSize:11.5,color:"#a08070"}}>{isPremium?AT.activeFull:AT.freeVersion}</div>
              </div>
              {!isPremium&&<span style={{fontSize:11,fontWeight:700,color:"#A8492A",background:"rgba(168,73,42,.08)",padding:"4px 10px",borderRadius:99,border:"1px solid rgba(168,73,42,.15)"}}>{AT.upgrade}</span>}
            </div>
            {!isPremium&&(
              <div style={{padding:"14px 18px 18px",background:"linear-gradient(135deg,rgba(168,73,42,.06),rgba(200,149,42,.04))"}}>
                <div style={{fontSize:12.5,color:"#5a3a2a",lineHeight:1.6,marginBottom:12}}>
                  {AT.unlockMsg}<strong>{AT.unlockBold}</strong>{AT.unlockRest}
                </div>
                <button onClick={()=>goBack&&goBack()} style={{width:"100%",padding:"12px",borderRadius:99,border:"none",cursor:"pointer",
                  background:"linear-gradient(90deg,#A8492A,#8B3520)",color:"#fff5ee",fontFamily:"inherit",
                  fontSize:13.5,fontWeight:800,boxShadow:"0 8px 24px rgba(168,73,42,.38)"}}>
                  {AT.tryFree}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* App */}
        <div>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:10,paddingLeft:2}}>{AT.application}</div>
          <div style={{background:"rgba(255,255,255,.54)",backdropFilter:"blur(22px) saturate(165%)",WebkitBackdropFilter:"blur(22px) saturate(165%)",border:"1px solid rgba(255,255,255,.88)",borderRadius:20,overflow:"hidden",boxShadow:"0 10px 32px rgba(168,73,42,.1)"}}>
            {/* Versión */}
            <div style={{display:"flex",alignItems:"center",gap:13,padding:"15px 18px"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><AppIcon name="leaf" size={17}/></div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.appName}</div><div style={{fontSize:11.5,color:"#a08070",marginTop:2}}>{AT.version}</div></div>
            </div>
            {/* Calificar */}
            <div style={{borderTop:"1px solid rgba(168,73,42,.06)"}}>
              <div onClick={()=>setShowRate(r=>!r)} style={{display:"flex",alignItems:"center",gap:13,padding:"15px 18px",cursor:"pointer"}}>
                <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><AppIcon name="star" size={17}/></div>
                <div style={{flex:1,fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.rateApp}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0a090" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
              {showRate && (
                <div style={{padding:"14px 18px 16px",borderTop:"1px solid rgba(168,73,42,.06)",background:"rgba(255,248,240,.6)"}}>
                  {!rated ? (<>
                    <div style={{fontSize:12,color:"#8a6a5a",marginBottom:10,textAlign:"center"}}>{AT.howRate}</div>
                    <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>
                      {[1,2,3,4,5].map(s=>(
                        <div key={s} onClick={()=>setStars(s)} style={{fontSize:30,cursor:"pointer",transition:"transform .15s",
                          transform:stars>=s?"scale(1.15)":"scale(1)",color:stars>=s?"#C8952A":"#d0c0b0"}}>★</div>
                      ))}
                    </div>
                    {stars>0 && (
                      <div onClick={()=>setRated(true)} style={{textAlign:"center",padding:"10px",borderRadius:12,cursor:"pointer",
                        background:"linear-gradient(135deg,#A8492A,#8B3520)",color:"#fff5ee",fontSize:13,fontWeight:700}}>
                        {AT.submitRating}
                      </div>
                    )}
                  </>) : (
                    <div style={{textAlign:"center",padding:"4px 0"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#3d1a0e",marginBottom:4}}>{AT.thanksRating}</div>
                      <div style={{fontSize:11.5,color:"#a08070"}}>{AT.ratingHelps}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Privacidad */}
            <div onClick={()=>setShowPrivacy(true)} style={{borderTop:"1px solid rgba(168,73,42,.06)",display:"flex",alignItems:"center",gap:13,padding:"15px 18px",cursor:"pointer"}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,73,42,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><AppIcon name="book" size={17}/></div>
              <div style={{flex:1,fontSize:14,fontWeight:600,color:"#3d1a0e"}}>{AT.privacyTerms}</div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0a090" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>
        </div>

      </div>



      {/* Pantalla Privacidad */}
      {showPrivacy && (
        <div style={{position:"absolute",inset:0,zIndex:50,background:"linear-gradient(160deg,#f9f1eb,#f0e2d6)",overflowY:"auto"}}>
          <div style={{position:"sticky",top:0,zIndex:10,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
            background:"rgba(249,241,235,.9)",borderBottom:"1px solid rgba(168,73,42,.08)",padding:"52px 20px 16px",
            display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setShowPrivacy(false)} style={{width:34,height:34,borderRadius:"50%",border:"none",
              background:"rgba(168,73,42,.1)",color:"#A8492A",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#3d1a0e"}}>{AT.privacyBack}</div>
          </div>
          <div style={{padding:"20px 20px 100px",display:"flex",flexDirection:"column",gap:20}}>
            {AT.privacySections.map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.6)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
                border:"1px solid rgba(255,255,255,.85)",borderRadius:18,padding:"16px 18px",
                boxShadow:"0 6px 20px rgba(168,73,42,.08)"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#A8492A",marginBottom:8}}>{s.t}</div>
                <div style={{fontSize:12.5,color:"#5a3a2a",lineHeight:1.7}}>{s.b}</div>
              </div>
            ))}
            <div style={{textAlign:"center",fontSize:11,color:"#b09080",paddingTop:4}}>{AT.lastUpdated}</div>
          </div>
        </div>
      )}
      {/* Toast notificaciones */}
      {notifToast && (
        <div style={{position:"sticky",bottom:16,left:0,right:0,zIndex:200,display:"flex",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{background:"rgba(30,10,4,.88)",backdropFilter:"blur(12px)",borderRadius:99,
            padding:"10px 20px",color:"#fff5ee",fontSize:12,fontWeight:700,
            boxShadow:"0 8px 32px rgba(0,0,0,.3)",whiteSpace:"nowrap"}}>
            {notifToast}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── TRACKER DE PATADAS ─── */
function KickTrackerScreen({ goBack }) {
  const kLang = getAppLang2();
  const KT = kLang==="en" ? {
    title:"Kicks & movements", sub1:"Tap the button with every movement you feel. Medical goal: ", sub2:"10 kicks in 2 hours",
    goalMet:"Goal reached!", tapHere:"Tap here", kicksWord:"kicks", elapsed:" elapsed",
    doneMsg:(t)=>`10 movements in ${t}!`, perfectMsg:"Perfect · +5 points logged", newSession:"New session",
    history:"Session history", movements:"movements", warning:"If you feel ", warningBold:"fewer than 10 movements", warningRest:" in 2 hours frequently, contact your doctor.",
  } : {
    title:"Patadas y movimientos", sub1:"Toca el botón con cada movimiento que sientas. Meta médica: ", sub2:"10 patadas en 2 horas",
    goalMet:"¡Meta lograda!", tapHere:"Toca aquí", kicksWord:"patadas", elapsed:" transcurridos",
    doneMsg:(t)=>`¡10 movimientos en ${t}!`, perfectMsg:"Perfecto · +5 puntos registrados", newSession:"Nueva sesión",
    history:"Historial de sesiones", movements:"movimientos", warning:"Si sientes ", warningBold:"menos de 10 movimientos", warningRest:" en 2 horas con frecuencia, consulta a tu médico.",
  };
  const kLocale = kLang==="en"?"en-US":"es-ES";
  const [sessions, setSessions] = React.useState(() => LS.get("lume_kicks") || []);
  const [count, setCount] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const [elapsed, setElapsed] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [anim, setAnim] = React.useState(false);

  React.useEffect(() => {
    if (!startTime || done) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime, done]);

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleKick = () => {
    if (done) return;
    const now = Date.now();
    if (!startTime) setStartTime(now);
    const nc = count + 1;
    setCount(nc);setAnim(true);setTimeout(() => setAnim(false), 300);
    if (nc >= 10) {
      setDone(true);
      const secs = startTime ? Math.floor((now - startTime) / 1000) : 0;
      const s = { id: now, date: new Date().toLocaleDateString(kLocale, { day: "numeric", month: "short" }), time: new Date().toLocaleTimeString(kLocale, { hour: "2-digit", minute: "2-digit" }), elapsed: secs, kicks: nc };
      const arr = [s, ...sessions].slice(0, 20);
      setSessions(arr);LS.set("lume_kicks", arr);addPoints(5);
    }
  };

  const reset = () => {setCount(0);setStartTime(null);setElapsed(0);setDone(false);};
  const pct = Math.min(100, count / 10 * 100);

  return (
    <div className="screen s-enter kick-screen" style={{ position: 'relative', backgroundImage: 'url("uploads/kicks-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,6,6,.18) 0%, rgba(20,8,8,.32) 60%, rgba(10,4,4,.5) 100%)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: '54px 16px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={goBack} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 6px 18px rgba(0,0,0,.25)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ padding: '16px 18px', borderRadius: 20, background: 'linear-gradient(160deg, rgba(255,255,255,.18), rgba(255,255,255,.08) 60%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.3)', boxShadow: '0 12px 32px rgba(0,0,0,.22), 0 1px 0 rgba(255,255,255,.25) inset' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-.4px', textShadow: '0 2px 12px rgba(0,0,0,.3)' }}>{KT.title}</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.55 }}>{KT.sub1}<strong style={{color:'rgba(255,255,255,.95)'}}>{KT.sub2}</strong>.</p>
        </div>
      </div>
      <div className="kick-center" style={{ margin: "10px 0px 0px" }}>
        <button className={"kick-btn" + (anim ? " kick-pop" : "")} onClick={handleKick} disabled={done}>
          <svg viewBox="0 0 48 48" width={52} height={52} fill="none">
            <path d="M24 42s-16-10-16-22a10 10 0 0 1 16-8 10 10 0 0 1 16 8c0 12-16 22-16 22Z" fill="rgba(255,255,255,.9)"/>
          </svg>
          <div className="kick-hint">{done ? KT.goalMet : count === 0 ? KT.tapHere : `${count}/10`}</div>
        </button>
        <div className="kick-count">
          <span className="kick-num">{count}</span>
          <span className="kick-sep">/</span>
          <span className="kick-goal">10</span>
          <span className="kick-lbl">{KT.kicksWord}</span>
        </div>
        {startTime && !done && <div className="kick-timer"><AppIcon name="clock" size={13}/> {fmt(elapsed)}{KT.elapsed}</div>}
        <div className="kick-bar-wrap"><div className="kick-bar" style={{ width: pct + "%" }}></div></div>
        {done && <div className="kick-done"><AppIcon name="check" size={20}/><div>{KT.doneMsg(fmt(elapsed))}</div><div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>{KT.perfectMsg}</div></div>}
        {count > 0 && <button className="btn" style={{ marginTop: 14, justifyContent: "center", background: "var(--surface-2)", color: "var(--ink)" }} onClick={reset}>{KT.newSession}</button>}
      </div>
      {sessions.length > 0 && <>
        <div className="sec-label">{KT.history}</div>
        <div className="c" style={{ padding: "6px 0" }}>
          {sessions.map((s, i) =>
            <div key={s.id} className="kick-hist-item" style={{ borderBottom: i < sessions.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className={"kick-dot" + (s.kicks >= 10 ? " ok" : " warn")}></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.kicks} {KT.movements}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{s.date} · {s.time}</div></div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{fmt(s.elapsed)}</div>
            </div>
          )}
        </div>
      </>}
      <div style={{ margin: "24px 16px 20px", padding: "16px 18px", borderRadius: 20, background: 'linear-gradient(160deg, rgba(255,255,255,.18), rgba(255,255,255,.08) 60%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.3)', boxShadow: '0 12px 32px rgba(0,0,0,.22), 0 1px 0 rgba(255,255,255,.25) inset' }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,220,100,.2)', border: '1.5px solid rgba(255,220,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,100,.95)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,.88)", lineHeight: 1.6 }}>{KT.warning}<strong style={{color:'#fff'}}>{KT.warningBold}</strong>{KT.warningRest}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ── GALERÍA DE FOTOS ─── */
function FotosScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const fLang = getAppLang2();
  const FT = fLang==="en" ? {
    eyebrow:"Visual diary", title:"My memories", sub:"Tap a frame to add your photo",
    tris:[
      { label: "First Trimester",  sub: "Weeks 1 – 13" },
      { label: "Second Trimester", sub: "Weeks 14 – 26" },
      { label: "Third Trimester",  sub: "Weeks 27 – 40" },
    ],
    wellness:"Wellness", yourPhoto:"Your photo",
    infoPremium:"Your photos are saved only on your device and never shared.",
    infoFree:(n)=>`Free plan: up to ${n} photos. Activate Wellness for an unlimited album.`,
  } : {
    eyebrow:"Diario visual", title:"Mis recuerdos", sub:"Toca un marco para añadir tu foto",
    tris:[
      { label: "Primer Trimestre",  sub: "Semanas 1 – 13" },
      { label: "Segundo Trimestre", sub: "Semanas 14 – 26" },
      { label: "Tercer Trimestre",  sub: "Semanas 27 – 40" },
    ],
    wellness:"Bienestar", yourPhoto:"Tu foto",
    infoPremium:"Tus fotos se guardan solo en tu dispositivo y nunca se comparten.",
    infoFree:(n)=>`Plan gratis: hasta ${n} fotos. Activa Bienestar para álbum ilimitado.`,
  };
  const FREE_LIMIT = 6;
  const TRIS = [
    { label: FT.tris[0].label,  sub: FT.tris[0].sub,  weeks: "1–13",  slots: ["ft1a", "ft1b", "ft1c", "ft1d"], color: "#C9849E" },
    { label: FT.tris[1].label, sub: FT.tris[1].sub, weeks: "14–26", slots: ["ft2a", "ft2b", "ft2c", "ft2d"], color: "#C4693A" },
    { label: FT.tris[2].label,  sub: FT.tris[2].sub, weeks: "27–40", slots: ["ft3a", "ft3b", "ft3c", "ft3d"], color: "#6B2410" }
  ];
  const glassCard = {
    background: "rgba(255,255,255,.52)", backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)", border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 20px 50px -14px rgba(80,30,16,.44), 0 2px 0 rgba(255,255,255,.9) inset"
  };
  return (
    <div style={{ background: "linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)", minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.08)", padding: "52px 20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 5 }}>{FT.eyebrow}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px" }}>{FT.title}</h2>
          <p style={{ margin: 0, fontSize: 11.5, color: "#a08070" }}>{FT.sub}</p>
        </div>
      </div>
      <div style={{ padding: "20px 16px 56px", display: "flex", flexDirection: "column", gap: 18 }}>
        {TRIS.map((tri, ti) => (
          <div key={tri.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13, paddingLeft: 2 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(140deg,${tri.color},${tri.color}cc)`, border: "2.5px solid #f0e2d6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 22px ${tri.color}99`, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{ti + 1}</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#3d1a0e" }}>{tri.label}</div>
                <div style={{ fontSize: 11, color: "#b09080", marginTop: 2, fontWeight: 600 }}>{tri.sub}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 34, columnGap: 10 }}>
              {tri.slots.map((id, si) => {
                const globalIdx = ti * 4 + si;
                const locked = !isPremium && globalIdx >= FREE_LIMIT;
                return (
                <div key={id} style={{ ...glassCard, borderRadius: 18, padding: 6, position: "relative", boxShadow: `0 14px 30px -6px ${tri.color}, 0 4px 12px -2px ${tri.color}cc, 0 2px 0 rgba(255,255,255,.9) inset` }}>
                  {locked ? (
                    <div onClick={() => goToTab && goToTab("premium")} style={{ width: "100%", height: "130px", borderRadius: 13, background: "rgba(168,73,42,.06)", border: "1.5px dashed rgba(168,73,42,.28)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#A8492A" }}>{FT.wellness}</span>
                    </div>
                  ) : (
                    <image-slot id={id} shape="rounded" radius="13" placeholder={FT.yourPhoto} style={{ width: "100%", height: "130px", display: "block" }}></image-slot>
                  )}
                </div>
              );})}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 16px", borderRadius: 16, background: "rgba(168,73,42,.05)", border: "1px solid rgba(168,73,42,.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1, opacity: .6 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p style={{ margin: 0, fontSize: 12.5, color: "#7a5a4a", lineHeight: 1.55 }}>{isPremium ? FT.infoPremium : FT.infoFree(FREE_LIMIT)}</p>
        </div>
      </div>
    </div>
  );
}


/* ── MEDITACIONES PREMIUM v4 ─── */
const MEDITATIONS_DATA = [
  { id:1,  title:"Respira con calma",        sub:"Respiración 4-7-8",          duration:10, tag:"Todo el embarazo",  colors:["#B8872A","#E4BC7E"], phase:[4,7,8] },
  { id:2,  title:"Conexión con tu bebé",     sub:"Meditación de vínculo",      duration:15, tag:"Semanas 16+",       colors:["#8B5A9E","#C4A0D8"], phase:[4,2,6] },
  { id:3,  title:"Suelo del cuerpo",         sub:"Relajación progresiva",      duration:12, tag:"2º Trimestre",      colors:["#3A8070","#72C4B0"], phase:[5,3,7] },
  { id:4,  title:"Sueño profundo",           sub:"Para antes de dormir",       duration:20, tag:"Todo el embarazo",  colors:["#3A4E80","#7890C0"], phase:[4,7,8] },
  { id:5,  title:"Preparación al parto",     sub:"Visualización positiva",     duration:18, tag:"3er Trimestre",     colors:["#A8492A","#D08060"], phase:[4,4,8] },
  { id:6,  title:"Manejo del estrés",        sub:"Técnica 4-4-4",              duration:8,  tag:"Todo el embarazo",  colors:["#7A6040","#C8A870"], phase:[4,4,4] },
  { id:7,  title:"Amor propio",              sub:"Afirmaciones positivas",     duration:10, tag:"Todo el embarazo",  colors:["#C4506A","#E8A0B0"], phase:[4,2,6] },
  { id:8,  title:"Escaneo corporal",         sub:"Body scan prenatal",         duration:16, tag:"1er y 2º Trim.",    colors:["#2A7A5A","#70C09A"], phase:[5,5,7] },
  { id:9,  title:"Gratitud del embarazo",    sub:"Meditación de gratitud",     duration:12, tag:"Todo el embarazo",  colors:["#6A4A9E","#B090D8"], phase:[4,4,6] },
  { id:10, title:"Calma antes del parto",    sub:"Técnica de anclaje",         duration:15, tag:"3er Trimestre",     colors:["#1A6A8A","#50A0C8"], phase:[5,3,8] },
  { id:11, title:"Energía matinal",          sub:"Despertar consciente",       duration:8,  tag:"Todo el embarazo",  colors:["#C87820","#E8B060"], phase:[4,2,4] },
  { id:12, title:"Latido a latido",          sub:"Sincronía con tu bebé",      duration:14, tag:"Semanas 20+",       colors:["#8A3A6A","#C880A8"], phase:[4,4,6] },
];

const SOUND_TRACKS = [
  { id:"none",   label:"Silencio" },
  { id:"rain",   label:"Lluvia"   },
  { id:"ocean",  label:"Olas"     },
  { id:"forest", label:"Bosque"   },
  { id:"fire",   label:"Hogar"    },
];

const MEDITATIONS_DATA_EN = [
  { id:1,  title:"Breathe with calm",       sub:"4-7-8 breathing",          duration:10, tag:"Whole pregnancy",  colors:["#B8872A","#E4BC7E"], phase:[4,7,8] },
  { id:2,  title:"Bonding with your baby",  sub:"Bonding meditation",       duration:15, tag:"Weeks 16+",        colors:["#8B5A9E","#C4A0D8"], phase:[4,2,6] },
  { id:3,  title:"Grounding the body",       sub:"Progressive relaxation",   duration:12, tag:"2nd trimester",    colors:["#3A8070","#72C4B0"], phase:[5,3,7] },
  { id:4,  title:"Deep sleep",              sub:"Before bedtime",           duration:20, tag:"Whole pregnancy",  colors:["#3A4E80","#7890C0"], phase:[4,7,8] },
  { id:5,  title:"Birth preparation",       sub:"Positive visualization",   duration:18, tag:"3rd trimester",    colors:["#A8492A","#D08060"], phase:[4,4,8] },
  { id:6,  title:"Stress management",       sub:"4-4-4 technique",          duration:8,  tag:"Whole pregnancy",  colors:["#7A6040","#C8A870"], phase:[4,4,4] },
  { id:7,  title:"Self-love",               sub:"Positive affirmations",    duration:10, tag:"Whole pregnancy",  colors:["#C4506A","#E8A0B0"], phase:[4,2,6] },
  { id:8,  title:"Body scan",               sub:"Prenatal body scan",       duration:16, tag:"1st & 2nd trim.",  colors:["#2A7A5A","#70C09A"], phase:[5,5,7] },
  { id:9,  title:"Pregnancy gratitude",     sub:"Gratitude meditation",     duration:12, tag:"Whole pregnancy",  colors:["#6A4A9E","#B090D8"], phase:[4,4,6] },
  { id:10, title:"Calm before birth",       sub:"Grounding technique",      duration:15, tag:"3rd trimester",    colors:["#1A6A8A","#50A0C8"], phase:[5,3,8] },
  { id:11, title:"Morning energy",          sub:"Mindful waking",           duration:8,  tag:"Whole pregnancy",  colors:["#C87820","#E8B060"], phase:[4,2,4] },
  { id:12, title:"Heartbeat to heartbeat",  sub:"In sync with your baby",   duration:14, tag:"Weeks 20+",        colors:["#8A3A6A","#C880A8"], phase:[4,4,6] },
];

const SOUND_TRACKS_EN = [
  { id:"none",   label:"Silence" },
  { id:"rain",   label:"Rain"    },
  { id:"ocean",  label:"Waves"   },
  { id:"forest", label:"Forest"  },
  { id:"fire",   label:"Fireplace" },
];

/* ── SVG icons ── */
const SND_ICON_NONE   = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;
const SND_ICON_RAIN   = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M20 16.2A4.5 4.5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25"/><line x1="8" y1="19" x2="8.01" y2="19"/><line x1="8" y1="22" x2="8.01" y2="22"/><line x1="12" y1="17" x2="12.01" y2="17"/><line x1="12" y1="20" x2="12.01" y2="20"/><line x1="16" y1="19" x2="16.01" y2="19"/><line x1="16" y1="22" x2="16.01" y2="22"/></svg>;
const SND_ICON_OCEAN  = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 7c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/></svg>;
/* Pine tree + bird exactly as reference */
const SND_ICON_FOREST = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
  {/* Bird on top: two wing curves */}
  <path d="M9.5 4.5 Q11 3 12.5 4.5"/>
  {/* Pine tree: two layers */}
  <path d="M12 7 L8 13 h8 Z"/>
  <path d="M12 11 L7 18 h10 Z"/>
  {/* Trunk */}
  <line x1="12" y1="18" x2="12" y2="21"/>
</svg>;
const SND_ICON_FIRE   = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 .8-3.5 2-4.5.2 1.5 1 2.5 2 3C10 8.5 9.5 6 12 2z"/><path d="M12 18a2 2 0 0 1-2-2"/></svg>;

const SOUND_ICONS = { none:<SND_ICON_NONE/>, rain:<SND_ICON_RAIN/>, ocean:<SND_ICON_OCEAN/>, forest:<SND_ICON_FOREST/>, fire:<SND_ICON_FIRE/> };

/* ── Audio engine ── */
function createAudioCtx() { try { return new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; } }

function mkNoiseBuf(ctx) {
  const buf = ctx.createBuffer(1, 4*ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  const src = ctx.createBufferSource(); src.buffer=buf; src.loop=true; return src;
}

/* RAIN — pure noise only, no oscillators, no chirps */
function makeRain(ctx) {
  const dest=ctx.destination;
  const master=ctx.createGain(); master.gain.setValueAtTime(0,ctx.currentTime); master.gain.linearRampToValueAtTime(0.38,ctx.currentTime+2); master.connect(dest);
  // Fine drizzle: high-freq filtered noise
  const s1=mkNoiseBuf(ctx);
  const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=4000;
  const shelf=ctx.createBiquadFilter(); shelf.type='highshelf'; shelf.frequency.value=8000; shelf.gain.value=4;
  s1.connect(hp); hp.connect(shelf); shelf.connect(master); s1.start();
  // Medium rain body
  const s2=mkNoiseBuf(ctx);
  const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=0.5;
  const g2=ctx.createGain(); g2.gain.value=0.55; s2.connect(bp); bp.connect(g2); g2.connect(master); s2.start();
  // Low rumble of heavy rain on surface
  const s3=mkNoiseBuf(ctx);
  const lp=ctx.createBiquadFilter(); lp.type='bandpass'; lp.frequency.value=600; lp.Q.value=0.7;
  const g3=ctx.createGain(); g3.gain.value=0.28; s3.connect(lp); lp.connect(g3); g3.connect(master); s3.start();
  return { stop:()=>{ master.gain.linearRampToValueAtTime(0,ctx.currentTime+1.8); setTimeout(()=>{try{s1.stop();s2.stop();s3.stop();}catch(e){}},2500); } };
}

/* OCEAN — deep LFO swells, no similarity to rain */
function makeOcean(ctx) {
  const master=ctx.createGain(); master.gain.setValueAtTime(0,ctx.currentTime); master.gain.linearRampToValueAtTime(0.28,ctx.currentTime+3); master.connect(ctx.destination);
  const src=mkNoiseBuf(ctx);
  const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500; lp.Q.value=2.2;
  const lfo=ctx.createOscillator(); lfo.frequency.value=0.065; lfo.type='sine';
  const lg=ctx.createGain(); lg.gain.value=260; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  const ampLfo=ctx.createOscillator(); ampLfo.frequency.value=0.048; ampLfo.type='sine';
  const alg=ctx.createGain(); alg.gain.value=0.10; ampLfo.connect(alg); alg.connect(master.gain); ampLfo.start();
  src.connect(lp); lp.connect(master); src.start();
  return { stop:()=>{ master.gain.linearRampToValueAtTime(0,ctx.currentTime+2.2); setTimeout(()=>{try{src.stop();lfo.stop();ampLfo.stop();}catch(e){}},3500); } };
}

/* FOREST — gentle wind + realistic bird chirps */
function makeForest(ctx) {
  const dest=ctx.destination;
  const windG=ctx.createGain(); windG.gain.setValueAtTime(0,ctx.currentTime); windG.gain.linearRampToValueAtTime(0.12,ctx.currentTime+2.5); windG.connect(dest);
  const src=mkNoiseBuf(ctx); const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=650; bp.Q.value=0.4;
  const windLfo=ctx.createOscillator(); windLfo.frequency.value=0.09; windLfo.type='sine';
  const wlg=ctx.createGain(); wlg.gain.value=220; windLfo.connect(wlg); wlg.connect(bp.frequency); windLfo.start();
  src.connect(bp); bp.connect(windG); src.start();
  const CHIRPS=[{f:3400,sw:1.5,dur:0.13},{f:2600,sw:1.3,dur:0.2},{f:4200,sw:0.8,dur:0.09},{f:3000,sw:1.6,dur:0.07},{f:3700,sw:1.2,dur:0.16},{f:2200,sw:1.4,dur:0.25}];
  let alive=true;
  const chirp=()=>{
    if(!alive) return;
    const t=CHIRPS[Math.floor(Math.random()*CHIRPS.length)]; const vol=0.04+Math.random()*0.03;
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='sine'; o.connect(g); g.connect(dest);
    o.frequency.setValueAtTime(t.f,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(t.f*t.sw,ctx.currentTime+t.dur*0.6); o.frequency.exponentialRampToValueAtTime(t.f*(t.sw>1?1.05:0.95),ctx.currentTime+t.dur);
    g.gain.setValueAtTime(0,ctx.currentTime); g.gain.linearRampToValueAtTime(vol,ctx.currentTime+0.01); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t.dur+0.04);
    o.start(); o.stop(ctx.currentTime+t.dur+0.08);
    if(Math.random()>0.45){ const o2=ctx.createOscillator(); const g2=ctx.createGain(); o2.type='sine'; o2.connect(g2); g2.connect(dest); const t2=ctx.currentTime+t.dur+0.07; o2.frequency.setValueAtTime(t.f*1.35,t2); o2.frequency.exponentialRampToValueAtTime(t.f*1.6,t2+0.065); g2.gain.setValueAtTime(0,t2); g2.gain.linearRampToValueAtTime(vol*0.6,t2+0.01); g2.gain.exponentialRampToValueAtTime(0.001,t2+0.085); o2.start(t2); o2.stop(t2+0.11); }
    setTimeout(chirp,1000+Math.random()*3800);
  };
  setTimeout(chirp,700);
  return { stop:()=>{ alive=false; windG.gain.linearRampToValueAtTime(0,ctx.currentTime+1.8); setTimeout(()=>{try{src.stop();windLfo.stop();}catch(e){}},2800); } };
}

/* FIRE/HOGAR — warm low rumble + clear wood crackle + ember hiss */
function makeFire(ctx) {
  const dest=ctx.destination;
  // Warm deep base (fire body)
  const baseG=ctx.createGain(); baseG.gain.setValueAtTime(0,ctx.currentTime); baseG.gain.linearRampToValueAtTime(0.36,ctx.currentTime+2.5); baseG.connect(dest);
  const src=mkNoiseBuf(ctx);
  const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=280; lp.Q.value=1.2;
  const ls=ctx.createBiquadFilter(); ls.type='lowshelf'; ls.frequency.value=120; ls.gain.value=8;
  src.connect(lp); lp.connect(ls); ls.connect(baseG); src.start();
  // Ember mid hiss
  const src2=mkNoiseBuf(ctx);
  const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1100; bp.Q.value=2.0;
  const emberG=ctx.createGain(); emberG.gain.setValueAtTime(0,ctx.currentTime); emberG.gain.linearRampToValueAtTime(0.12,ctx.currentTime+2); emberG.connect(dest);
  src2.connect(bp); bp.connect(emberG); src2.start();
  // Slow flame LFO swell on base
  const flameLfo=ctx.createOscillator(); flameLfo.frequency.value=0.22; flameLfo.type='sine';
  const flg=ctx.createGain(); flg.gain.value=0.08; flameLfo.connect(flg); flg.connect(baseG.gain); flameLfo.start();
  // Loud distinct wood crackle pops
  let alive=true;
  const crackle=()=>{
    if(!alive) return;
    // Sharp pop burst using noise
    const popBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.06),ctx.sampleRate);
    const pd=popBuf.getChannelData(0); for(let i=0;i<pd.length;i++) pd[i]=(Math.random()*2-1)*Math.exp(-i/(pd.length*0.18));
    const pop=ctx.createBufferSource(); pop.buffer=popBuf;
    const popF=ctx.createBiquadFilter(); popF.type='lowpass'; popF.frequency.value=1800;
    const popG=ctx.createGain(); popG.gain.value=0.55+Math.random()*0.45;
    pop.connect(popF); popF.connect(popG); popG.connect(dest); pop.start();
    setTimeout(crackle, 180+Math.random()*700);
  };
  setTimeout(crackle,500);
  return { stop:()=>{ alive=false; baseG.gain.linearRampToValueAtTime(0,ctx.currentTime+2); emberG.gain.linearRampToValueAtTime(0,ctx.currentTime+1.5); setTimeout(()=>{try{src.stop();src2.stop();flameLfo.stop();}catch(e){}},3000); } };
}

function makeNoise(ctx, type) {
  if(type==='rain')   return makeRain(ctx);
  if(type==='ocean')  return makeOcean(ctx);
  if(type==='forest') return makeForest(ctx);
  if(type==='fire')   return makeFire(ctx);
  return null;
}

function chime(ctx) {
  if(!ctx) return;
  [261,329,392,523].forEach((f,i)=>{ const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=f; const t=ctx.currentTime+i*0.07; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.07/(i+1),t+0.1); g.gain.exponentialRampToValueAtTime(0.001,t+3.8); o.start(t); o.stop(t+4); });
}

function MeditacionesScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const [sel, setSel] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const [phase, setPhase] = React.useState(0);
  const [tick, setTick] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [sound, setSound] = React.useState("rain");
  const ctxRef = React.useRef(null);
  const nodeRef = React.useRef(null);
  const medLang = getAppLang2();
  const MDATA = medLang==="en" ? MEDITATIONS_DATA_EN : MEDITATIONS_DATA;
  const STRACKS = medLang==="en" ? SOUND_TRACKS_EN : SOUND_TRACKS;
  const MT = medLang==="en" ? {
    title:"Meditations", premiumBadge:"✦ Wellness Premium", heroTitle:"Prenatal meditations",
    heroDesc:"12 guided sessions with relaxing sounds and a breathing visualizer.",
    availableIn:"Available in Wellness", availableSub:"12 sessions · relaxing sounds · visualizer",
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card required · cancel anytime",
    listSub:"12 sessions · relaxing sounds · breathing visualizer",
    headphones:"Use headphones for the full experience. Pick the sound that relaxes you most before you start.",
    sessionActive:"✦ Active session", ready:"✦ Ready",
    chooseSound:"Choose a sound · tap ▶ to begin",
    labels:["Inhale","Hold","Exhale"],
  } : {
    title:"Meditaciones", premiumBadge:"✦ Bienestar Premium", heroTitle:"Meditaciones prenatales",
    heroDesc:"12 sesiones guiadas con sonidos relajantes y visualizador de respiración.",
    availableIn:"Disponible en Bienestar", availableSub:"12 sesiones · sonidos relajantes · visualizador",
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    listSub:"12 sesiones · sonidos relajantes · visualizador de respiración",
    headphones:"Usa auriculares para una experiencia completa. Elige el sonido que más te relaje antes de comenzar.",
    sessionActive:"✦ Sesión activa", ready:"✦ Listo",
    chooseSound:"Elige sonido · toca ▶ para comenzar",
    labels:["Inhala","Sostén","Exhala"],
  };
  const med = sel !== null ? MDATA[sel] : null;
  const LABELS = MT.labels;

  const getCtx = () => {
    if(!ctxRef.current) ctxRef.current = createAudioCtx();
    if(ctxRef.current?.state==='suspended') ctxRef.current.resume();
    return ctxRef.current;
  };
  const startSnd = (t) => { if(nodeRef.current){nodeRef.current.stop();nodeRef.current=null;} if(t!=='none'){const c=getCtx();if(c)nodeRef.current=makeNoise(c,t);} };
  const stopSnd  = () => { if(nodeRef.current){nodeRef.current.stop();nodeRef.current=null;} };

  React.useEffect(()=>{
    if(!playing||!med) return;
    const id=setInterval(()=>{ setElapsed(e=>e+1); setTick(t=>{ const dur=med.phase[phase]; if(t+1>=dur){setPhase(p=>(p+1)%3);return 0;} return t+1; }); },1000);
    return ()=>clearInterval(id);
  },[playing,phase,med]);

  React.useEffect(()=>{ const scr=document.querySelector('.screen'); if(sel!==null&&scr){scr.style.overflow='hidden';scr.style.padding='0';scr.scrollTo(0,0);} return()=>{if(scr){scr.style.overflow='';scr.style.padding='';}}; },[sel]);
  React.useEffect(()=>{ if(sel===null) stopSnd(); },[sel]);

  const getScale=()=>{ if(!med)return 1; const t=tick/med.phase[phase]; if(phase===0)return 1+0.40*t; if(phase===1)return 1.40; return 1.40-0.40*t; };
  const fmt=(s)=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const doPlay=()=>{ chime(getCtx()); startSnd(sound); setPhase(0);setTick(0); setTimeout(()=>setPlaying(true),700); };
  const doPause=()=>{ setPlaying(false); stopSnd(); };

  /* PAYWALL */
  if(!isPremium){
    return (
      <div className="screen s-enter">
        <ScreenHeader title={MT.title} goBack={goBack}/>
        <div style={{textAlign:"center",padding:"20px 0 16px"}}>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:".12em",color:"#C8952A",textTransform:"uppercase"}}>{MT.premiumBadge}</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:"#3d1a0e",margin:"8px 0 6px",lineHeight:1.2}}>{MT.heroTitle}</h2>
          <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:0}}>{MT.heroDesc}</p>
        </div>
        <div style={{position:"relative",borderRadius:24,overflow:"hidden",marginBottom:20}}>
          <div style={{filter:"blur(3px)",pointerEvents:"none",opacity:.5}}>
            {MDATA.slice(0,3).map((m,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",marginBottom:10,background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderRadius:18,border:"1px solid "+m.colors[0]+"20",boxShadow:"0 8px 28px -6px "+m.colors[0]+"38"}}>
                <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,"+m.colors[0]+","+m.colors[1]+")",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <SND_ICON_FIRE/>
                </div>
                <div><div style={{fontSize:15,fontWeight:600,color:"#3d1a0e"}}>{m.title}</div><div style={{fontSize:12,color:"#8a6a5a"}}>{m.sub} · {m.duration} min</div></div>
              </div>
            ))}
          </div>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(to bottom,rgba(249,241,235,.0),rgba(249,241,235,.82))"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#C8952A,#E4BC7E)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(200,149,42,.4)",marginBottom:10}}>
              <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:"#3d1a0e",marginBottom:3}}>{MT.availableIn}</div>
            <div style={{fontSize:12.5,color:"#8a6a5a"}}>{MT.availableSub}</div>
          </div>
        </div>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#C8952A,#E4BC7E,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#2A1400",boxShadow:"0 10px 32px rgba(200,149,42,.4)"}}>
          {MT.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{MT.noCard}</p>
      </div>
    );
  }

  /* PLAYER */
  if(sel!==null&&med){
    const sc=getScale(); const c0=med.colors[0]; const c1=med.colors[1]; const rem=Math.max(0,med.duration*60-elapsed);
    return (
      <div style={{position:"absolute",inset:0,zIndex:55,overflow:"hidden",background:"linear-gradient(170deg,"+c0+"22 0%,#080402 35%,"+c1+"10 100%)"}}>
        <div style={{position:"absolute",width:440,height:440,borderRadius:"50%",top:"18%",left:"50%",transform:"translateX(-50%)",background:"radial-gradient(circle,"+c0+"18 0%,transparent 65%)",pointerEvents:"none"}}/>
        {/* Header */}
        <div style={{position:"absolute",top:0,left:0,right:0,paddingTop:66,paddingBottom:14,paddingLeft:20,paddingRight:20,display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to bottom,rgba(8,4,2,.6),transparent)"}}>
          <button onClick={()=>{setSel(null);setPlaying(false);setTick(0);setElapsed(0);setPhase(0);stopSnd();}}
            style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.18)",width:42,height:42,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="rgba(255,255,255,.88)" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",color:c1,textTransform:"uppercase",marginBottom:2}}>{MT.sessionActive}</div>
            <div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,.9)"}}>{med.title}</div>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.55)",fontVariantNumeric:"tabular-nums",background:"rgba(255,255,255,.08)",padding:"6px 12px",borderRadius:99,border:"1px solid rgba(255,255,255,.12)"}}>{fmt(rem)}</div>
        </div>
        {/* Orb at 40% */}
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {[2.8,2.05,1.45].map((r,i)=>(
            <div key={i} style={{position:"absolute",width:220*r,height:220*r,borderRadius:"50%",background:"radial-gradient(circle,"+c0+["1C","0E","05"][i]+" 0%,transparent 68%)",transform:"scale("+sc+")",transition:"transform 1.1s cubic-bezier(.37,0,.63,1)",pointerEvents:"none"}}/>
          ))}
          <div style={{width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle at 30% 28%,"+c1+","+c0+" 60%,rgba(0,0,0,.2))",boxShadow:"0 0 90px "+c0+"60,0 0 180px "+c0+"18,inset 0 2px 0 rgba(255,255,255,.3)",transform:"scale("+sc+")",transition:"transform 1.1s cubic-bezier(.37,0,.63,1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{fontSize:24,fontWeight:700,color:"rgba(255,255,255,.96)",letterSpacing:"0.04em",textShadow:"0 2px 12px rgba(0,0,0,.3)"}}>{playing?LABELS[phase]:MT.ready}</div>
            {playing
              ? <div style={{fontSize:56,fontWeight:200,color:"rgba(255,255,255,.92)",lineHeight:1,fontVariantNumeric:"tabular-nums",textShadow:"0 4px 20px rgba(0,0,0,.25)"}}>{med.phase[phase]-tick}</div>
              : <div style={{fontSize:13,color:"rgba(255,255,255,.55)",fontWeight:500}}>{med.sub}</div>}
          </div>
        </div>
        {/* Bottom panel — clearly below orb */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(8,4,2,.9) 55%,transparent)",padding:"0 22px",paddingBottom:110,paddingTop:28,display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          {/* Sound selector */}
          <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",width:"100%"}}>
            {STRACKS.map(s=>(
              <button key={s.id} onClick={()=>{setSound(s.id);if(playing)startSnd(s.id);}}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"10px 0",flex:1,
                  background:sound===s.id?"linear-gradient(135deg,"+c0+"55,"+c1+"38)":"rgba(255,255,255,.06)",
                  border:sound===s.id?"1.5px solid "+c1+"60":"1px solid rgba(255,255,255,.1)",
                  borderRadius:16,cursor:"pointer",backdropFilter:"blur(12px)",
                  boxShadow:sound===s.id?"0 4px 18px "+c0+"45":"none",
                  transition:"all .2s",color:sound===s.id?c1:"rgba(255,255,255,.38)"}}>
                {SOUND_ICONS[s.id]}
                <span style={{fontSize:9,fontWeight:800,letterSpacing:".04em",textTransform:"uppercase"}}>{s.label}</span>
              </button>
            ))}
          </div>
          {/* Phase indicators */}
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            {LABELS.map((l,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,opacity:playing&&phase===i?1:0.22,transition:"opacity .5s"}}>
                <div style={{width:playing&&phase===i?36:6,height:5,borderRadius:99,background:playing&&phase===i?c1:"rgba(255,255,255,.35)",transition:"all .45s cubic-bezier(.34,1.56,.64,1)",boxShadow:playing&&phase===i?"0 0 12px "+c1:"none"}}/>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".07em",color:"rgba(255,255,255,.72)",textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
          {/* Progress */}
          <div style={{width:"100%",height:3,background:"rgba(255,255,255,.07)",borderRadius:99}}>
            <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+c0+","+c1+")",width:Math.min(100,(elapsed/(med.duration*60))*100)+"%",transition:"width 1s linear",boxShadow:"0 0 10px "+c0+"80"}}/>
          </div>
          {/* Play btn */}
          <button onClick={()=>playing?doPause():doPlay()}
            style={{width:74,height:74,borderRadius:"50%",border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+c0+","+c1+")",boxShadow:"0 18px 50px "+c0+"60,inset 0 1.5px 0 rgba(255,255,255,.35)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .18s cubic-bezier(.34,1.56,.64,1)"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(.91)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {playing
              ? <svg viewBox="0 0 24 24" width={32} height={32} fill="#1A0900"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg viewBox="0 0 24 24" width={32} height={32} fill="#1A0900" style={{marginLeft:3}}><path d="M8 5l12 7-12 7Z"/></svg>}
          </button>
          <div style={{fontSize:12,color:"rgba(255,255,255,.32)",letterSpacing:".03em"}}>{playing?fmt(elapsed)+" · "+STRACKS.find(s=>s.id===sound)?.label:MT.chooseSound}</div>
        </div>
      </div>
    );
  }

  /* LIST */
  return (
    <div className="screen s-enter">
      <ScreenHeader title={MT.title} goBack={goBack}/>
      <div style={{textAlign:"center",marginBottom:18}}>
        <span style={{fontSize:11,fontWeight:800,letterSpacing:".1em",color:"#C8952A",textTransform:"uppercase"}}>{MT.premiumBadge}</span>
        <p style={{fontSize:13,color:"#8a6a5a",margin:"4px 0 0"}}>{MT.listSub}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {MDATA.map((m,i)=>(
          <button key={m.id} onClick={()=>{setSel(i);setPlaying(false);setPhase(0);setTick(0);setElapsed(0);}}
            style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",textAlign:"left",background:"linear-gradient(135deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.48) 100%)",backdropFilter:"blur(20px) saturate(165%)",WebkitBackdropFilter:"blur(20px) saturate(165%)",borderRadius:20,border:"1px solid "+m.colors[0]+"22",cursor:"pointer",fontFamily:"inherit",width:"100%",boxShadow:"0 10px 32px -8px "+m.colors[0]+"42,0 2px 6px rgba(80,30,10,.06),inset 0 1px 0 rgba(255,255,255,.9)",transition:"transform .18s cubic-bezier(.34,1.56,.64,1)"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(.97)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:"linear-gradient(135deg,"+m.colors[0]+","+m.colors[1]+")",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 20px "+m.colors[0]+"50,inset 0 1px 0 rgba(255,255,255,.22)",color:"rgba(255,255,255,.92)"}}>
              <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 7c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:700,color:"#3d1a0e",marginBottom:2}}>{m.title}</div>
              <div style={{fontSize:12.5,color:"#8a6a5a"}}>{m.sub}</div>
              <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:m.colors[0]+"14",border:"1px solid "+m.colors[0]+"28",color:m.colors[0]}}>{m.tag}</span>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"rgba(168,73,42,.06)",border:"1px solid rgba(168,73,42,.12)",color:"#8a6a5a"}}>{m.duration} min</span>
              </div>
            </div>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="rgba(168,73,42,.32)" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        ))}
      </div>
      <div style={{marginTop:14,marginBottom:8,padding:"13px 14px",borderRadius:16,background:"linear-gradient(135deg,rgba(200,149,42,.09),rgba(228,188,126,.13))",border:"1px solid rgba(200,149,42,.18)",display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:15}}>✦</span>
        <p style={{margin:0,fontSize:12.5,color:"#7a5a30",lineHeight:1.6}}>{MT.headphones}</p>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════
   EJERCICIOS PREMIUM
══════════════════════════════════════════════ */
const EJERCICIOS_DATA = {
  1: [
    { id:1, title:"Respiración diafragmática", muscle:"Respiratorio", dur:"10 min", level:"Suave", desc:"Aprende a respirar profundo para calmar el sistema nervioso y oxigenar a tu bebé.", steps:["Siéntate cómoda con la espalda recta","Coloca una mano en el pecho y otra en el abdomen","Inhala 4 seg por la nariz, sintiendo el abdomen expandirse","Exhala 6 seg lentamente por la boca","Repite 8 veces"] },
    { id:2, title:"Caminata consciente", muscle:"Cardio", dur:"20 min", level:"Suave", desc:"Caminar a ritmo moderado mejora la circulación y reduce el cansancio del primer trimestre.", steps:["Usa calzado cómodo y de soporte","Camina a un ritmo donde puedas conversar sin ahogarte","Mantén los hombros relajados y la vista al frente","Hidratate antes y después","Descansa si sientes mareo o náuseas"] },
    { id:3, title:"Yoga prenatal: Cat-Cow", muscle:"Espalda baja", dur:"8 min", level:"Suave", desc:"Alivia la tensión lumbar y mejora la movilidad espinal durante el primer trimestre.", steps:["Arrodíllate en cuatro patas, muñecas bajo hombros","Inhala: baja el abdomen, eleva cabeza y cóccix (vaca)","Exhala: arquea la espalda hacia el techo, mete barbilla (gato)","Muévete lento y fluido con la respiración","10 repeticiones"] },
    { id:4, title:"Estiramiento de caderas", muscle:"Caderas / Glúteos", dur:"12 min", level:"Suave", desc:"Abre y relaja la pelvis, preparando el cuerpo para los cambios posturales del embarazo.", steps:["Siéntate en el borde de una silla firme","Cruza el tobillo derecho sobre la rodilla izquierda","Mantén la espalda recta e inclínate suavemente hacia adelante","Sostén 30 segundos, siente el estiramiento en la cadera","Cambia de lado y repite 3 veces"] },
  ],
  2: [
    { id:5, title:"Sentadillas suaves", muscle:"Piernas / Glúteos", dur:"15 min", level:"Moderado", desc:"Fortalece piernas y glúteos, mejora la postura y prepara el periné para el parto.", steps:["Párate con pies a la altura de los hombros, puntas hacia afuera","Desciende lentamente como si fueras a sentarte en una silla","Mantén rodillas alineadas con los dedos de los pies","No bajes más de lo cómodo — 90° máximo","Sube lentamente, aprieta glúteos. 3 series de 10"] },
    { id:6, title:"Natación prenatal", muscle:"Cuerpo completo", dur:"30 min", level:"Moderado", desc:"El agua sostiene tu cuerpo y alivia presión articular. Ideal para el segundo trimestre.", steps:["Nada a ritmo cómodo: braza o espalda son ideales","Evita el crol si hay molestia en el abdomen","Alterna: 2 min nadando, 1 min flotando","El agua a temperatura moderada (no caliente)","Máximo 30 min, hidratate al salir"] },
    { id:7, title:"Fortalecimiento de suelo pélvico", muscle:"Suelo pélvico", dur:"10 min", level:"Moderado", desc:"Los ejercicios Kegel fortalecen el periné, reducen incontinencia y facilitan la recuperación postparto.", steps:["Identifica el músculo: como si cortaras el chorro de orina","Contrae ese músculo durante 5 segundos","Relaja completamente 5 segundos","Repite 10 veces, 3 series al día","Puedes hacerlos sentada, de pie o acostada"] },
    { id:8, title:"Pilates prenatal: Bird-Dog", muscle:"Core / Espalda", dur:"12 min", level:"Moderado", desc:"Estabiliza el core sin presionar el abdomen, mejorando el equilibrio y la postura.", steps:["En cuatro patas, columna neutral","Extiende el brazo derecho y pierna izquierda simultáneamente","Mantén 3 segundos sin arquear la espalda","Regresa y cambia de lado","3 series de 8 repeticiones por lado"] },
  ],
  3: [
    { id:9, title:"Meditación de apertura pélvica", muscle:"Pelvis / Mente", dur:"15 min", level:"Suave", desc:"Combina respiración y visualización para relajar la pelvis y prepararte mentalmente para el parto.", steps:["Recuéstate de lado con una almohada entre las rodillas","Cierra los ojos y respira profundo y lento","Visualiza tu pelvis abriéndose suavemente con cada exhalación","Repite afirmación: 'Mi cuerpo sabe lo que hace'","Practica 15 min antes de dormir"] },
    { id:10, title:"Caminata en cuclillas", muscle:"Piernas / Pelvis", dur:"10 min", level:"Suave", desc:"Desciende al bebé y abre el canal de parto de manera natural y activa.", steps:["Párate con pies bien separados y puntas hacia afuera","Desciende a una posición de cuclillas cómoda","Camina lateralmente 5 pasos en cada dirección","Usa una silla o pared de apoyo si lo necesitas","5 minutos de movimiento continuo"] },
    { id:11, title:"Balanceo en pelota de parto", muscle:"Pelvis / Espalda", dur:"20 min", level:"Suave", desc:"Balancea suavemente la pelvis sobre la pelota para aliviar presión lumbar y acomodar al bebé.", steps:["Siéntate al centro de la pelota, pies bien apoyados","Haz círculos lentos con la pelvis (adelante, lado, atrás, lado)","Luego balancea adelante-atrás suavemente","Mantén una mano en la pelota para equilibrio","20 minutos con música relajante"] },
    { id:12, title:"Respiración para el parto", muscle:"Respiratorio", dur:"12 min", level:"Suave", desc:"Técnica de respiración en oleadas para manejar las contracciones durante el parto.", steps:["Posición cómoda sentada o de lado","Al inicio de cada 'ola': inhala lento 4 seg por la nariz","Exhala 6-8 seg por la boca con labios fruncidos","Visualiza que la ola llega y se va con tu respiración","Practica diariamente para que sea automático"] },
  ],
};

const EJERCICIOS_DATA_EN = {
  1: [
    { id:1, title:"Diaphragmatic breathing", muscle:"Respiratory", dur:"10 min", level:"Gentle", desc:"Learn to breathe deeply to calm your nervous system and oxygenate your baby.", steps:["Sit comfortably with a straight back","Place one hand on your chest and the other on your belly","Inhale for 4 sec through your nose, feeling your belly expand","Exhale slowly for 6 sec through your mouth","Repeat 8 times"] },
    { id:2, title:"Mindful walking", muscle:"Cardio", dur:"20 min", level:"Gentle", desc:"Walking at a moderate pace improves circulation and reduces first-trimester fatigue.", steps:["Wear comfortable, supportive shoes","Walk at a pace where you can talk without gasping","Keep your shoulders relaxed and eyes forward","Hydrate before and after","Rest if you feel dizzy or nauseous"] },
    { id:3, title:"Prenatal yoga: Cat-Cow", muscle:"Lower back", dur:"8 min", level:"Gentle", desc:"Relieves lower-back tension and improves spinal mobility during the first trimester.", steps:["Kneel on all fours, wrists under shoulders","Inhale: drop your belly, lift head and tailbone (cow)","Exhale: arch your back toward the ceiling, tuck your chin (cat)","Move slowly and smoothly with your breath","10 repetitions"] },
    { id:4, title:"Hip stretch", muscle:"Hips / Glutes", dur:"12 min", level:"Gentle", desc:"Opens and relaxes the pelvis, preparing your body for pregnancy's postural changes.", steps:["Sit on the edge of a sturdy chair","Cross your right ankle over your left knee","Keep your back straight and lean gently forward","Hold 30 seconds, feel the stretch in your hip","Switch sides and repeat 3 times"] },
  ],
  2: [
    { id:5, title:"Gentle squats", muscle:"Legs / Glutes", dur:"15 min", level:"Moderate", desc:"Strengthens legs and glutes, improves posture and prepares the pelvic floor for birth.", steps:["Stand with feet shoulder-width apart, toes out","Lower slowly as if sitting into a chair","Keep knees aligned with your toes","Don't go lower than comfortable — 90° max","Rise slowly, squeeze glutes. 3 sets of 10"] },
    { id:6, title:"Prenatal swimming", muscle:"Full body", dur:"30 min", level:"Moderate", desc:"Water supports your body and relieves joint pressure. Ideal for the second trimester.", steps:["Swim at a comfortable pace: breaststroke or backstroke are ideal","Avoid freestyle if you feel abdominal discomfort","Alternate: 2 min swimming, 1 min floating","Water at a moderate temperature (not hot)","Max 30 min, hydrate after getting out"] },
    { id:7, title:"Pelvic floor strengthening", muscle:"Pelvic floor", dur:"10 min", level:"Moderate", desc:"Kegel exercises strengthen the perineum, reduce incontinence and ease postpartum recovery.", steps:["Find the muscle: as if stopping your urine flow","Contract that muscle for 5 seconds","Relax completely for 5 seconds","Repeat 10 times, 3 sets a day","You can do these sitting, standing or lying down"] },
    { id:8, title:"Prenatal Pilates: Bird-Dog", muscle:"Core / Back", dur:"12 min", level:"Moderate", desc:"Stabilizes the core without pressing on the belly, improving balance and posture.", steps:["On all fours, neutral spine","Extend your right arm and left leg at the same time","Hold 3 seconds without arching your back","Return and switch sides","3 sets of 8 reps per side"] },
  ],
  3: [
    { id:9, title:"Pelvic-opening meditation", muscle:"Pelvis / Mind", dur:"15 min", level:"Gentle", desc:"Combines breath and visualization to relax the pelvis and prepare you mentally for birth.", steps:["Lie on your side with a pillow between your knees","Close your eyes and breathe deep and slow","Visualize your pelvis gently opening with each exhale","Repeat the affirmation: 'My body knows what to do'","Practice 15 min before sleep"] },
    { id:10, title:"Squat walk", muscle:"Legs / Pelvis", dur:"10 min", level:"Gentle", desc:"Helps the baby descend and opens the birth canal naturally and actively.", steps:["Stand with feet wide apart, toes out","Lower into a comfortable squat","Walk sideways 5 steps in each direction","Use a chair or wall for support if needed","5 minutes of continuous movement"] },
    { id:11, title:"Birthing ball rocking", muscle:"Pelvis / Back", dur:"20 min", level:"Gentle", desc:"Gently rocks the pelvis on the ball to relieve lower-back pressure and help position the baby.", steps:["Sit centered on the ball, feet firmly planted","Make slow circles with your pelvis (front, side, back, side)","Then rock gently forward and back","Keep one hand on the ball for balance","20 minutes with relaxing music"] },
    { id:12, title:"Labor breathing", muscle:"Respiratory", dur:"12 min", level:"Gentle", desc:"A wave-breathing technique to manage contractions during labor.", steps:["Comfortable position, sitting or on your side","At the start of each 'wave': inhale slowly for 4 sec through your nose","Exhale for 6-8 sec through pursed lips","Visualize the wave arriving and leaving with your breath","Practice daily so it becomes automatic"] },
  ],
};


/* ── Anatomical animated exercise player ── */

/* Body part paths for a pregnant silhouette - reusable segments */
function PregBody({ cx=100, cy=100, scale=1, rotate=0, bellyScale=1, color="rgba(220,180,160,.85)", strokeC="rgba(180,120,90,.6)" }) {
  const s = scale;
  return (
    <g transform={"translate("+cx+","+cy+") scale("+s+") rotate("+rotate+")"}>
      {/* Head */}
      <circle cx="0" cy="-85" r="16" fill={color} stroke={strokeC} strokeWidth="1.5"/>
      {/* Neck */}
      <rect x="-6" y="-70" width="12" height="12" rx="4" fill={color}/>
      {/* Torso */}
      <path d={"M-22,-58 Q-26,-20 -24,10 Q-22,28 0,32 Q22,28 24,10 Q26,-20 22,-58 Z"} fill={color} stroke={strokeC} strokeWidth="1.5"/>
      {/* Pregnant belly overlay */}
      <ellipse cx="0" cy="8" rx={20*bellyScale} ry={16*bellyScale} fill="rgba(255,230,210,.7)" stroke={strokeC} strokeWidth="1"/>
    </g>
  );
}

/* Muscle highlight overlay */
function Muscle({ d, active, color="#A8492A", opacity=0.55 }) {
  return <path d={d} fill={active ? color : "rgba(180,130,110,.12)"} stroke={active ? color : "none"} strokeWidth="0.5" opacity={active ? opacity : 0.2} style={{transition:"fill .4s,opacity .4s"}}/>;
}

const EXER_ANIM_DATA = {
  /* id: { bg, bgText, muscles: [{label,d}], frames: [{joints, bellyScale, label}], cycleSec } */
  1: { // Respiración
    bg:"#F2EBE4", accent:"#3A8070",
    label:"Músculos trabajados",
    muscleLabel:"Diafragma · Core",
    render: (t) => {
      const breathe = Math.sin(t*Math.PI*2);
      const belly = 1 + breathe*0.18;
      const chestW = 44 + breathe*6;
      return (
        <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
          <rect width="200" height="260" fill="#F2EBE4"/>
          {/* Floor / mat */}
          <ellipse cx="100" cy="230" rx="55" ry="8" fill="rgba(168,73,42,.08)"/>
          {/* Chair */}
          <rect x="62" y="170" width="76" height="10" rx="4" fill="rgba(168,73,42,.15)"/>
          <rect x="65" y="180" width="8" height="42" rx="3" fill="rgba(168,73,42,.12)"/>
          <rect x="127" y="180" width="8" height="42" rx="3" fill="rgba(168,73,42,.12)"/>
          {/* Body */}
          <g transform="translate(100,110)">
            {/* Head */}
            <circle cx="0" cy="-72" r="15" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.5)" strokeWidth="1.5"/>
            {/* Hair */}
            <path d="M-14,-80 Q0,-92 14,-80 Q18,-68 14,-62 Q0,-56 -14,-62 Q-18,-68 -14,-80Z" fill="rgba(80,40,20,.6)"/>
            {/* Neck */}
            <rect x="-5" y="-58" width="10" height="10" rx="3" fill="rgba(220,175,150,.9)"/>
            {/* Torso */}
            <path d={"M-"+chestW/2+",-48 Q-26,-10 -24,18 Q-20,32 0,36 Q20,32 24,18 Q26,-10 "+chestW/2+",-48 Z"} fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
            {/* Diaphragm area highlight */}
            <ellipse cx="0" cy="-12" rx={chestW*0.42} ry="12" fill={"rgba(58,128,112,"+(0.15+breathe*0.25)+")"} />
            {/* Belly */}
            <ellipse cx="0" cy="16" rx={18*belly} ry={14*belly} fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
            {/* Arms - hands on belly */}
            <path d="M-22,-30 Q-36,-10 -30,14 Q-26,22 -18,18" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
            <circle cx="-18" cy="18" r="6" fill="rgba(220,175,150,.9)"/>
            <path d="M22,-30 Q36,-10 30,14 Q26,22 18,18" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="6" fill="rgba(220,175,150,.9)"/>
            {/* Legs */}
            <path d="M-12,36 Q-14,60 -16,85" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
            <path d="M-16,85 Q-20,100 -18,108" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
            <path d="M12,36 Q14,60 16,85" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
            <path d="M16,85 Q20,100 18,108" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
          </g>
          {/* Breath wave */}
          <path d={"M30 220 Q50 "+(212-breathe*12)+" 70 220 Q90 "+(228+breathe*12)+" 110 220 Q130 "+(212-breathe*12)+" 150 220 Q170 "+(228+breathe*12)+" 180 220"} fill="none" stroke="rgba(58,128,112,.45)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Label */}
          <text x="100" y="250" textAnchor="middle" fill="rgba(58,128,112,.75)" fontSize="11" fontWeight="700" fontFamily="sans-serif">{breathe>0?"INHALA · 4 seg":"EXHALA · 6 seg"}</text>
        </svg>
      );
    }
  },
  3: { // Cat-Cow
    bg:"#EDE4F0", accent:"#8B5A9E",
    render: (t) => {
      const arch = Math.sin(t*Math.PI*2)*22;
      const headTilt = arch*0.5;
      return (
        <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
          <rect width="200" height="260" fill="#EDE4F0"/>
          {/* Mat */}
          <rect x="20" y="188" width="160" height="8" rx="4" fill="rgba(139,90,158,.12)"/>
          {/* Highlight: spine */}
          <path d={"M48 "+(140+arch*0.4)+" Q80 "+(138+arch*0.5)+" 100 "+(138+arch)+" Q120 "+(138+arch*0.5)+" 152 "+(140+arch*0.4)} fill="none" stroke={"rgba(139,90,158,"+(0.2+Math.abs(arch/22)*0.45)+")"} strokeWidth="12" strokeLinecap="round"/>
          {/* Wrists */}
          <circle cx="48" cy="185" r="7" fill="rgba(220,175,150,.9)"/>
          <circle cx="60" cy="185" r="7" fill="rgba(220,175,150,.9)"/>
          {/* Knees */}
          <circle cx="140" cy="185" r="7" fill="rgba(220,175,150,.9)"/>
          <circle cx="152" cy="185" r="7" fill="rgba(220,175,150,.9)"/>
          {/* Arms */}
          <line x1="48" y1="185" x2="52" y2={145+arch*0.3} stroke="rgba(220,175,150,.9)" strokeWidth="9" strokeLinecap="round"/>
          <line x1="60" y1="185" x2="62" y2={145+arch*0.3} stroke="rgba(220,175,150,.85)" strokeWidth="8" strokeLinecap="round"/>
          {/* Spine / torso */}
          <path d={"M52 "+(144+arch*0.3)+" Q80 "+(136+arch)+" 100 "+(136+arch)+" Q120 "+(136+arch)+" 148 "+(144+arch*0.3)} fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
          {/* Belly */}
          <ellipse cx="100" cy={148+arch} rx="18" ry="13" fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Legs */}
          <line x1="148" y1={144+arch*0.3} x2="148" y2="185" stroke="rgba(220,175,150,.9)" strokeWidth="10" strokeLinecap="round"/>
          <line x1="140" y1={145+arch*0.3} x2="140" y2="185" stroke="rgba(220,175,150,.85)" strokeWidth="9" strokeLinecap="round"/>
          {/* Head */}
          <circle cx={44} cy={126-headTilt} r="15" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
          <path d={"M33 "+(118-headTilt)+" Q44 "+(105-headTilt-2)+" 55 "+(118-headTilt)+" Q58 "+(110-headTilt)+" 54 "+(108-headTilt)+" Q44 "+(102-headTilt)+" 33 "+(108-headTilt)+"Z"} fill="rgba(80,40,20,.6)"/>
          {/* Phase label */}
          <rect x="55" y="48" width="90" height="26" rx="13" fill={"rgba(139,90,158,"+(0.12+Math.abs(arch/22)*0.18)+")"}/>
          <text x="100" y="65" textAnchor="middle" fill="rgba(139,90,158,.85)" fontSize="11" fontWeight="700" fontFamily="sans-serif">{arch>3?"VACA · inhala":arch<-3?"GATO · exhala":"Transición..."}</text>
          {/* Spine arrow */}
          <text x="100" y="250" textAnchor="middle" fill="rgba(139,90,158,.6)" fontSize="10" fontFamily="sans-serif">Columna movilizada</text>
        </svg>
      );
    }
  },
  5: { // Sentadillas
    bg:"#F5EDE0", accent:"#B8872A",
    render: (t) => {
      const sq = (1-Math.cos(t*Math.PI*2))/2;
      const hipY = 80 + sq*55;
      const kneeOut = sq*16;
      const kneeY = hipY+48;
      return (
        <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
          <rect width="200" height="260" fill="#F5EDE0"/>
          {/* Ground */}
          <ellipse cx="100" cy="230" rx="52" ry="7" fill="rgba(184,135,42,.1)"/>
          {/* Glute/quad highlight */}
          <ellipse cx="100" cy={hipY+20} rx={22+sq*8} ry={14+sq*6} fill={"rgba(184,135,42,"+(0.12+sq*0.28)+")"} />
          <ellipse cx={84-kneeOut*0.5} cy={hipY+35} rx="9" ry={16+sq*8} fill={"rgba(184,135,42,"+(0.1+sq*0.22)+")"}/>
          <ellipse cx={116+kneeOut*0.5} cy={hipY+35} rx="9" ry={16+sq*8} fill={"rgba(184,135,42,"+(0.1+sq*0.22)+")"}/>
          {/* Head */}
          <circle cx="100" cy={30+sq*8} r="15" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
          <path d="M86,22 Q100,10 114,22 Q118,34 114,38 Q100,44 86,38 Q82,34 86,22Z" fill="rgba(80,40,20,.6)"/>
          {/* Torso */}
          <path d={"M-20,0 Q-24,32 -22,52 Q-18,66 0,70 Q18,66 22,52 Q24,32 20,0Z"} transform={"translate(100,"+(48+sq*8)+")"} fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Belly */}
          <ellipse cx="100" cy={hipY-12} rx={18+sq*2} ry={13+sq*2} fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Arms out for balance */}
          <path d={"M88,"+(56+sq*6)+" Q"+(66-sq*8)+","+(72+sq*4)+" "+(60-sq*8)+","+(80+sq*2)} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
          <path d={"M112,"+(56+sq*6)+" Q"+(134+sq*8)+","+(72+sq*4)+" "+(140+sq*8)+","+(80+sq*2)} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
          {/* Legs */}
          <path d={"M90,"+(hipY+5)+" Q"+(84-kneeOut)+","+(kneeY-8)+" "+(80-kneeOut*0.6)+",230"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
          <path d={"M110,"+(hipY+5)+" Q"+(116+kneeOut)+","+(kneeY-8)+" "+(120+kneeOut*0.6)+",230"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
          {/* Phase */}
          <rect x="52" y="240" width="96" height="16" rx="8" fill="rgba(184,135,42,.1)"/>
          <text x="100" y="252" textAnchor="middle" fill="rgba(184,135,42,.85)" fontSize="10" fontWeight="700" fontFamily="sans-serif">{sq<0.25?"DE PIE":sq<0.75?"BAJANDO · lento":"EN CUCLILLAS"}</text>
        </svg>
      );
    }
  },
  7: { // Kegel
    bg:"#F5E8ED", accent:"#C4506A",
    render: (t) => {
      const contract = Math.sin(t*Math.PI*2);
      const isC = contract>0;
      const r = 22+contract*10;
      return (
        <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
          <rect width="200" height="260" fill="#F5E8ED"/>
          {/* Chair */}
          <rect x="60" y="175" width="80" height="9" rx="4" fill="rgba(196,80,106,.12)"/>
          <rect x="64" y="184" width="8" height="38" rx="3" fill="rgba(196,80,106,.1)"/>
          <rect x="128" y="184" width="8" height="38" rx="3" fill="rgba(196,80,106,.1)"/>
          {/* Head */}
          <circle cx="100" cy="42" r="15" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
          <path d="M86,34 Q100,22 114,34 Q118,46 114,50 Q100,56 86,50 Q82,46 86,34Z" fill="rgba(80,40,20,.6)"/>
          {/* Torso */}
          <path d="M78,57 Q74,95 76,125 Q78,139 100,143 Q122,139 124,125 Q126,95 122,57Z" fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Belly */}
          <ellipse cx="100" cy="112" rx={18} ry="14" fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Pelvic floor pulse */}
          <circle cx="100" cy="143" r={r} fill={isC?"rgba(196,80,106,.18)":"rgba(196,80,106,.04)"} stroke={isC?"rgba(196,80,106,.5)":"rgba(196,80,106,.15)"} strokeWidth="1.5" style={{transition:"all .35s"}}/>
          <circle cx="100" cy="143" r={r*0.55} fill={isC?"rgba(196,80,106,.12)":"transparent"} style={{transition:"all .35s"}}/>
          <circle cx="100" cy="143" r="8" fill={isC?"rgba(196,80,106,.7)":"rgba(196,80,106,.2)"} style={{transition:"all .35s"}}/>
          {/* Arms */}
          <path d="M80,72 Q64,100 66,128" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="8" strokeLinecap="round"/>
          <path d="M120,72 Q136,100 134,128" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="8" strokeLinecap="round"/>
          {/* Legs */}
          <path d="M88,143 Q80,162 78,175" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
          <path d="M78,175 Q74,188 76,200" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
          <path d="M112,143 Q120,162 122,175" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
          <path d="M122,175 Q126,188 124,200" stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="9" strokeLinecap="round"/>
          {/* Label */}
          <rect x="40" y="236" width="120" height="18" rx="9" fill={isC?"rgba(196,80,106,.15)":"rgba(196,80,106,.06)"} style={{transition:"all .35s"}}/>
          <text x="100" y="249" textAnchor="middle" fill={isC?"rgba(196,80,106,.9)":"rgba(196,80,106,.5)"} fontSize="11" fontWeight="800" fontFamily="sans-serif">{isC?"CONTRAE · 5 seg":"RELAJA · 5 seg"}</text>
        </svg>
      );
    }
  },
  8: { // Bird-Dog
    bg:"#EAE8E0", accent:"#7A6040",
    render: (t) => {
      const ext = (1-Math.cos(t*Math.PI*2))/2;
      const armX = -28-ext*28;
      const legX = 28+ext*28;
      const armY = -ext*20;
      const legY = -ext*18;
      return (
        <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
          <rect width="200" height="260" fill="#EAE8E0"/>
          {/* Mat */}
          <rect x="18" y="186" width="164" height="7" rx="3.5" fill="rgba(122,96,64,.12)"/>
          {/* Spine highlight */}
          <path d={"M56 "+(148+ext*2)+" Q78 "+(144+ext*4)+" 100 "+(144+ext*4)+" Q122 "+(144+ext*4)+" 144 "+(148+ext*2)} fill="none" stroke={"rgba(122,96,64,"+(0.15+ext*0.3)+")"} strokeWidth="10" strokeLinecap="round"/>
          {/* Arm highlight */}
          <path d={"M56 "+(148+ext*2)+" L"+(56+armX)+" "+(148+armY)} fill="none" stroke={"rgba(122,96,64,"+(0.12+ext*0.35)+")"} strokeWidth="8" strokeLinecap="round"/>
          {/* Leg highlight */}
          <path d={"M144 "+(148+ext*2)+" L"+(144+legX)+" "+(148+legY)} fill="none" stroke={"rgba(122,96,64,"+(0.12+ext*0.35)+")"} strokeWidth="10" strokeLinecap="round"/>
          {/* Support arm */}
          <line x1="75" y1="150" x2="68" y2="186" stroke="rgba(220,175,150,.9)" strokeWidth="9" strokeLinecap="round"/>
          {/* Support leg */}
          <line x1="128" y1="152" x2="132" y2="186" stroke="rgba(220,175,150,.9)" strokeWidth="9" strokeLinecap="round"/>
          {/* Extending arm */}
          <line x1="56" y1={148+ext*2} x2={56+armX} y2={148+armY} stroke="rgba(220,175,150,.9)" strokeWidth="8" strokeLinecap="round"/>
          <circle cx={56+armX} cy={148+armY} r="6" fill="rgba(220,175,150,.9)"/>
          {/* Extending leg */}
          <line x1="144" y1={148+ext*2} x2={144+legX} y2={148+legY} stroke="rgba(220,175,150,.9)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx={144+legX} cy={148+legY} r="7" fill="rgba(220,175,150,.9)"/>
          {/* Torso */}
          <path d={"M60,"+(146+ext*2)+" Q80,"+(136+ext*3)+" 100,"+(136+ext*4)+" Q120,"+(136+ext*3)+" 140,"+(146+ext*2)+" Q138,"+(152+ext*2)+" 100,"+(154+ext*3)+" Q62,"+(152+ext*2)+" 60,"+(146+ext*2)+"Z"} fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Belly */}
          <ellipse cx="100" cy={146+ext*3} rx="16" ry="11" fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
          {/* Head */}
          <circle cx="50" cy={124+ext*2} r="14" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
          <path d={"M38 "+(116+ext*2)+" Q50 "+(104+ext*2)+" 62 "+(116+ext*2)+" Q64 "+(122+ext*2)+" 60 "+(125+ext*2)+" Q50 "+(130+ext*2)+" 39 "+(124+ext*2)+"Z"} fill="rgba(80,40,20,.6)"/>
          {/* Dashed alignment lines */}
          {ext>0.3 && <>
            <line x1={56+armX} y1={148+armY} x2={56+armX} y2="186" stroke="rgba(122,96,64,.2)" strokeWidth="1" strokeDasharray="4 3"/>
            <line x1={144+legX} y1={148+legY} x2={144+legX} y2="186" stroke="rgba(122,96,64,.2)" strokeWidth="1" strokeDasharray="4 3"/>
          </>}
          <text x="100" y="252" textAnchor="middle" fill="rgba(122,96,64,.7)" fontSize="10" fontWeight="700" fontFamily="sans-serif">{ext>0.6?"MANTÉN · espalda recta":ext>0.2?"EXTIENDE...":"Posición inicial"}</text>
        </svg>
      );
    }
  },
};

/* Fallback generic animation for exercises without specific anim */
function genericAnim(t, accent="#B8872A", bg="#F5EDE0") {
  const move = Math.sin(t*Math.PI*2);
  const belly = 1+0.08*Math.abs(move);
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" style={{borderRadius:16}}>
      <rect width="200" height="260" fill={bg}/>
      <ellipse cx="100" cy="230" rx="48" ry="7" fill={accent+"18"}/>
      {/* Figure standing */}
      <circle cx="100" cy="40" r="16" fill="rgba(220,175,150,.9)" stroke="rgba(180,120,90,.4)" strokeWidth="1.5"/>
      <path d="M86,32 Q100,20 114,32 Q118,44 114,48 Q100,54 86,48 Q82,44 86,32Z" fill="rgba(80,40,20,.6)"/>
      <path d="M80,56 Q76,94 78,126 Q80,140 100,144 Q120,140 122,126 Q124,94 120,56Z" fill="rgba(220,175,150,.85)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
      <ellipse cx="100" cy={112+move*4} rx={17*belly} ry={13*belly} fill="rgba(255,230,215,.8)" stroke="rgba(180,120,90,.35)" strokeWidth="1.5"/>
      <path d={"M82,70 Q"+(68+move*8)+",95 "+(66+move*8)+",125"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="8" strokeLinecap="round"/>
      <path d={"M118,70 Q"+(132-move*8)+",95 "+(134-move*8)+",125"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="8" strokeLinecap="round"/>
      <path d={"M90,144 Q86,178 84,230"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
      <path d={"M110,144 Q114,178 116,230"} stroke="rgba(220,175,150,.9)" fill="none" strokeWidth="10" strokeLinecap="round"/>
      <text x="100" y="252" textAnchor="middle" fill={accent+"AA"} fontSize="10" fontWeight="700" fontFamily="sans-serif">Sigue el movimiento</text>
    </svg>
  );
}

function ExercisePlayer({ exercise, col, accent, bg }) {
  const [t, setT] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const rafRef = React.useRef(null);
  const startRef = React.useRef(null);
  const CYCLE = 4500;

  React.useEffect(()=>{
    if(!playing){if(rafRef.current) cancelAnimationFrame(rafRef.current); return;}
    const tick=(now)=>{if(!startRef.current) startRef.current=now; const el=(now-startRef.current)%CYCLE; setT(el/CYCLE); rafRef.current=requestAnimationFrame(tick);};
    rafRef.current=requestAnimationFrame(tick);
    return()=>{if(rafRef.current) cancelAnimationFrame(rafRef.current);};
  },[playing]);

  const animData = EXER_ANIM_DATA[exercise.id];
  const bgColor = animData ? animData.bg : "#F5EDE0";
  const accentColor = animData ? animData.accent : col;

  return (
    <div style={{position:"relative",width:"100%",paddingTop:"78%",borderRadius:"0 0 28px 28px",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",inset:0}}>
        {animData ? animData.render(t) : genericAnim(t, accentColor, bgColor)}
      </div>
      {/* Muscle label */}
      <div style={{position:"absolute",top:12,left:12,background:"rgba(255,255,255,.85)",backdropFilter:"blur(12px)",padding:"5px 12px",borderRadius:99,border:"1px solid "+accentColor+"30"}}>
        <span style={{fontSize:10,fontWeight:800,letterSpacing:".06em",color:accentColor,textTransform:"uppercase"}}>▶ En movimiento</span>
      </div>
      {/* Play/pause */}
      {!playing && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.04)",cursor:"pointer"}} onClick={()=>{setPlaying(true);startRef.current=null;}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,"+accentColor+","+accentColor+"BB)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px "+accentColor+"45",backdropFilter:"blur(8px)"}}>
            <svg viewBox="0 0 24 24" width={26} height={26} fill="#fff" style={{marginLeft:3}}><path d="M8 5l12 7-12 7Z"/></svg>
          </div>
        </div>
      )}
      {playing && (
        <button onClick={()=>setPlaying(false)} style={{position:"absolute",bottom:12,right:12,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
          <svg viewBox="0 0 24 24" width={14} height={14} fill={accentColor}><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
        </button>
      )}
    </div>
  );
}

function VideoPlayer({ exercise, onClose }) {
  const [step, setStep] = React.useState(0);
  const MUSCLE_COLORS = { "Respiratorio":"#3A8070","Cardio":"#3A4E80","Espalda baja":"#8B5A9E","Caderas / Glúteos":"#A8492A","Piernas / Glúteos":"#B8872A","Cuerpo completo":"#1A6A8A","Suelo pélvico":"#C4506A","Core / Espalda":"#7A6040","Pelvis / Mente":"#6A4A9E","Piernas / Pelvis":"#3A8070","Pelvis / Espalda":"#8B5A9E" };
  const col = MUSCLE_COLORS[exercise.muscle]||"#B8872A";

  return (
    <div style={{position:"absolute",inset:0,zIndex:60,background:"#F8F2EC",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      {/* Exercise animation */}
      <div style={{position:"relative",flexShrink:0}}>
        <ExercisePlayer exercise={exercise} col={col}/>
        {/* Back */}
        <button onClick={onClose} style={{position:"absolute",top:50,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.85)",backdropFilter:"blur(12px)",border:"1px solid rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:50,right:16,background:"linear-gradient(135deg,#C8952A,#E4BC7E)",padding:"4px 10px",borderRadius:99,fontSize:10,fontWeight:800,color:"#2A1400"}}>✦ PREMIUM</div>
      </div>

      {/* Info card */}
      <div style={{padding:"20px 18px 100px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:800,padding:"4px 10px",borderRadius:99,background:col+"18",border:"1px solid "+col+"28",color:col}}>{exercise.muscle}</span>
            <span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,background:"rgba(168,73,42,.06)",border:"1px solid rgba(168,73,42,.1)",color:"#8a6a5a"}}>{exercise.dur}</span>
            <span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,background:"rgba(168,73,42,.06)",border:"1px solid rgba(168,73,42,.1)",color:"#8a6a5a"}}>{exercise.level}</span>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#3d1a0e",margin:"0 0 6px",lineHeight:1.2}}>{exercise.title}</h2>
          <p style={{fontSize:13.5,color:"#7a5a45",lineHeight:1.65,margin:0}}>{exercise.desc}</p>
        </div>
        {/* Steps */}
        <div style={{background:"rgba(255,255,255,.75)",backdropFilter:"blur(16px)",borderRadius:18,padding:"16px",border:"1px solid rgba(168,73,42,.1)",boxShadow:"0 4px 18px rgba(168,73,42,.07)"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:".1em",color:col,textTransform:"uppercase",marginBottom:12}}>Cómo hacerlo</div>
          {exercise.steps.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i)}
              style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start",width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:step===i?"linear-gradient(135deg,"+col+","+col+"AA)":"rgba(168,73,42,.07)",border:step===i?"none":"1px solid rgba(168,73,42,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .3s"}}>
                <span style={{fontSize:10,fontWeight:800,color:step===i?"#fff":col}}>{i+1}</span>
              </div>
              <p style={{margin:0,fontSize:13,color:step===i?"#3d1a0e":"#a08070",lineHeight:1.55,transition:"color .3s",fontFamily:"inherit"}}>{s}</p>
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
            style={{flex:1,padding:"13px",borderRadius:99,border:"1px solid rgba(168,73,42,.15)",cursor:step===0?"not-allowed":"pointer",background:"rgba(255,255,255,.6)",color:"#8a6a5a",fontFamily:"inherit",fontSize:13,fontWeight:700,opacity:step===0?0.35:1}}>← Anterior</button>
          <button onClick={()=>setStep(s=>Math.min(exercise.steps.length-1,s+1))} disabled={step===exercise.steps.length-1}
            style={{flex:1,padding:"13px",borderRadius:99,border:"none",cursor:step===exercise.steps.length-1?"not-allowed":"pointer",background:"linear-gradient(135deg,"+col+","+col+"AA)",color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,opacity:step===exercise.steps.length-1?0.4:1,boxShadow:step===exercise.steps.length-1?"none":"0 6px 20px "+col+"40"}}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}

function EjerciciosScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const weeksRaw = parseInt(localStorage.getItem("lume_weeks")||15);
  const defaultTri = weeksRaw<=13?1:weeksRaw<=26?2:3;
  const [tri, setTri] = React.useState(defaultTri);
  const [selEx, setSelEx] = React.useState(null);
  const hexRgb = h => { const x=h.replace('#',''); return `${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)}`; };
  const exLang = getAppLang2();
  const EX_T = exLang==="en" ? {
    eyebrow:"Wellness · Movement", title:"Prenatal", titleBr:"exercises", sub:"12 safe routines · tailored to your stage",
    unlockTitle:"Unlock your routine", unlockDesc:"12 video exercises · step-by-step guide · tailored to each trimester",
    availableIn:"Available in Wellness", availableSub:"12 exercises · step-by-step guide · video",
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card required · cancel anytime",
    tri:["First","Second","Third"], trimester:"Trimester",
    disclaimer:"Check with your doctor before starting any routine. All exercises are safe for uncomplicated pregnancies.",
  } : {
    eyebrow:"Bienestar · Movimiento", title:"Ejercicios", titleBr:"prenatales", sub:"12 rutinas seguras · adaptadas a tu etapa",
    unlockTitle:"Desbloquea tu rutina", unlockDesc:"12 ejercicios con video · guía paso a paso · adaptados a cada trimestre",
    availableIn:"Disponible en Bienestar", availableSub:"12 ejercicios · guía paso a paso · video",
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    tri:["Primer","Segundo","Tercer"], trimester:"Trimestre",
    disclaimer:"Consulta a tu médico antes de comenzar cualquier rutina. Todos los ejercicios son seguros para embarazo sin complicaciones.",
  };

  const exercises = (exLang==="en" ? EJERCICIOS_DATA_EN : EJERCICIOS_DATA)[tri]||[];

  const MUSCLE_COLORS = { "Respiratorio":"#3A8070","Cardio":"#3A4E80","Espalda baja":"#8B5A9E","Caderas / Glúteos":"#A8492A","Piernas / Glúteos":"#B8872A","Cuerpo completo":"#1A6A8A","Suelo pélvico":"#C4506A","Core / Espalda":"#7A6040","Pelvis / Mente":"#6A4A9E","Piernas / Pelvis":"#3A8070","Pelvis / Espalda":"#8B5A9E",
    "Respiratory":"#3A8070","Lower back":"#8B5A9E","Hips / Glutes":"#A8492A","Legs / Glutes":"#B8872A","Full body":"#1A6A8A","Pelvic floor":"#C4506A","Core / Back":"#7A6040","Pelvis / Mind":"#6A4A9E","Legs / Pelvis":"#3A8070","Pelvis / Back":"#8B5A9E" };

  if(selEx!==null) return <AnatomicPlayer exercise={exercises[selEx]} onClose={()=>setSelEx(null)}/>;

  /* ── Shared hero header ── */
  const ExHero = ({locked}) => (
    <div style={{position:"relative",background:"linear-gradient(155deg,#6B2A14 0%,#A8492A 48%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,220,160,.1)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-40,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.05)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:30,right:80,width:80,height:80,borderRadius:"50%",background:"rgba(255,200,120,.07)",pointerEvents:"none"}}/>
      <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
      <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>✦ PREMIUM</div>
      <div>
        <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,170,.8)",textTransform:"uppercase",marginBottom:7}}>{EX_T.eyebrow}</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1,textShadow:"0 2px 18px rgba(0,0,0,.18)"}}>{EX_T.title}<br/>{EX_T.titleBr}</h2>
        <p style={{fontSize:12,color:"rgba(255,224,170,.72)",margin:0,lineHeight:1.5}}>{EX_T.sub}</p>
      </div>
      {locked && (
        <div style={{position:"absolute",inset:0,background:"rgba(60,10,4,.22)",backdropFilter:"blur(1px)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,.22)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
        </div>
      )}
    </div>
  );

  if(!isPremium){
    return (
      <div className="screen s-enter" style={{padding:0}}>
        <ExHero locked={true}/>
        <div style={{padding:"20px 16px 100px"}}>
          <div style={{textAlign:"center",marginBottom:22}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#3d1a0e",margin:"0 0 6px"}}>{EX_T.unlockTitle}</h3>
            <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:0}}>{EX_T.unlockDesc}</p>
          </div>
          <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20}}>
            <div style={{filter:"blur(3px)",pointerEvents:"none",opacity:.55}}>
              {exercises.slice(0,3).map((e,i)=>{
                const col=MUSCLE_COLORS[e.muscle]||"#B8872A";
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:0,marginBottom:10,background:"rgba(255,255,255,.68)",backdropFilter:"blur(20px)",borderRadius:18,border:"1px solid rgba(255,255,255,.85)",overflow:"hidden",boxShadow:`0 6px 20px ${col}20`}}>
                    <div style={{width:4,alignSelf:"stretch",background:`linear-gradient(to bottom,${col},${col}88)`,flexShrink:0}}/>
                    <div style={{width:48,height:48,margin:"13px 12px",borderRadius:13,background:`linear-gradient(135deg,${col},${col}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.7" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#3d1a0e"}}>{e.title}</div><div style={{fontSize:11.5,color:"#8a6a5a"}}>{e.muscle} · {e.dur}</div></div>
                  </div>
                );
              })}
            </div>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(249,241,235,0) 0%,rgba(249,241,235,.95) 55%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,color:"#3d1a0e",marginBottom:4}}>{EX_T.availableIn}</div>
              <div style={{fontSize:12,color:"#8a6a5a"}}>{EX_T.availableSub}</div>
            </div>
          </div>
          <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#A8492A,#C8952A,#E4BC7E)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(168,73,42,.45)"}}>
            {EX_T.activateCta}
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{EX_T.noCard}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen s-enter" style={{padding:0}}>
      <ExHero locked={false}/>

      <div style={{padding:"0 16px 100px"}}>
        {/* ── Trimester selector ── */}
        <div style={{display:"flex",gap:8,padding:"16px 0 20px"}}>
          {[1,2,3].map(t=>(
            <button key={t} onClick={()=>setTri(t)} className="tri-btn-ex" style={{
              flex:1,padding:"12px 4px",borderRadius:18,fontFamily:"inherit",
              fontSize:11.5,fontWeight:700,cursor:"pointer",
              border: tri===t ? "1.5px solid transparent" : "1.5px solid rgba(168,73,42,.13)",
              background: tri===t
                ? "linear-gradient(135deg,#A8492A,#C8952A)"
                : "rgba(255,255,255,.7)",
              backdropFilter:"blur(20px) saturate(160%)",
              WebkitBackdropFilter:"blur(20px) saturate(160%)",
              color: tri===t ? "#fff" : "#8a6a5a",
              boxShadow: tri===t
                ? "0 8px 22px rgba(168,73,42,.42),inset 0 1px 0 rgba(255,255,255,.22)"
                : "0 2px 10px rgba(0,0,0,.05),inset 0 1px 0 rgba(255,255,255,.85)",
              lineHeight:1.4
            }}>
              {t===defaultTri ? <span style={{fontSize:8}}>✦ </span> : null}
              {EX_T.tri[t-1]}<br/>
              <span style={{fontSize:10,fontWeight:600,opacity:.85}}>{EX_T.trimester}</span>
            </button>
          ))}
        </div>

        {/* ── Exercise cards ── */}
        <div key={tri} className="ex-list-enter" style={{display:"flex",flexDirection:"column",gap:11}}>
          {exercises.map((e,i)=>{
            const col=MUSCLE_COLORS[e.muscle]||"#B8872A";
            return (
              <button key={e.id}
                onClick={()=>setSelEx(i)}
                className="ex-card"
                style={{
                  "--ex-col-rgb": hexRgb(col),
                  display:"flex",alignItems:"center",gap:0,textAlign:"left",
                  background:"rgba(255,255,255,.72)",
                  backdropFilter:"blur(28px) saturate(170%)",
                  WebkitBackdropFilter:"blur(28px) saturate(170%)",
                  borderRadius:20,
                  border:"1px solid rgba(255,255,255,.9)",
                  cursor:"pointer",fontFamily:"inherit",width:"100%",
                  overflow:"hidden",padding:0,
                  boxShadow:`0 10px 28px -4px ${col}45, 0 2px 8px rgba(0,0,0,.04), inset 0 1px 0 rgba(255,255,255,.95)`
                }}>
                {/* Accent strip */}
                <div className="ex-strip" style={{width:4,alignSelf:"stretch",background:`linear-gradient(to bottom,${col},${col}66)`,flexShrink:0}}/>
                {/* Icon */}
                <div className="ex-icon" style={{width:48,height:48,margin:"14px 13px 14px 12px",borderRadius:14,flexShrink:0,background:`linear-gradient(135deg,${col},${col}88)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 14px ${col}40`}}>
                  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="1.7" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                {/* Content */}
                <div style={{flex:1,minWidth:0,padding:"14px 0"}}>
                  <div className="ex-title" style={{fontSize:14,fontWeight:700,color:"#3d1a0e",marginBottom:2,lineHeight:1.3}}>{e.title}</div>
                  <div style={{fontSize:11,color:"#a08070",marginBottom:6}}>{e.muscle}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <span className="ex-chip" style={{fontSize:9.5,fontWeight:700,padding:"2px 8px",borderRadius:99,background:`${col}14`,border:`1px solid ${col}22`,color:col}}>{e.level}</span>
                    <span style={{fontSize:9.5,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(168,73,42,.05)",border:"1px solid rgba(168,73,42,.1)",color:"#a08070"}}>{e.dur}</span>
                  </div>
                </div>
                {/* Play */}
                <div className="ex-play" style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${col},${col}BB)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:15,boxShadow:`0 5px 14px ${col}45`}}>
                  <svg viewBox="0 0 24 24" width={13} height={13} fill="#fff" style={{marginLeft:2}}><path d="M8 5l12 7-12 7Z"/></svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div style={{marginTop:20,padding:"12px 14px",borderRadius:16,background:"rgba(255,255,255,.55)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(200,149,42,.13)",display:"flex",gap:10,alignItems:"flex-start",boxShadow:"0 4px 16px rgba(200,149,42,.08)"}}>
          <span style={{fontSize:13,flexShrink:0,color:"#C8952A"}}>✦</span>
          <p style={{margin:0,fontSize:11.5,color:"#7a5a30",lineHeight:1.6}}>{EX_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════
   CONTENIDO SEMANAL PREMIUM
══════════════════════════════════════════════ */
const WEEKLY_CONTENT = {
  4:  { bebe:"Tu bebé mide apenas 2 mm, del tamaño de una semilla de amapola. El embrión está formando las capas celulares que se convertirán en sus órganos.", cuerpo:"Es probable que aún no sepas que estás embarazada. El útero comienza a preparar un ambiente cálido para el embrión.", esperar:"Posible implantación con leve sangrado rosa ('sangrado de implantación'). Empieza a tomar ácido fólico si no lo has hecho.", consejo:"Empieza un diario de embarazo. Escribir cómo te sientes en estas primeras semanas es algo que atesorarás para siempre." },
  5:  { bebe:"El corazón de tu bebé empieza a latir — ¡aunque sea tan pequeño como un grano de arroz! Las células nerviosas se están multiplicando rápidamente.", cuerpo:"Pueden aparecer las primeras náuseas matutinas (aunque pueden ocurrir a cualquier hora). El pecho puede sentirse sensible.", esperar:"Confirma el embarazo con una prueba de orina o sangre. Agenda tu primera cita prenatal.", consejo:"Las galletas saladas antes de levantarte pueden aliviar las náuseas. Mantén tu estómago nunca completamente vacío." },
  8:  { bebe:"Tu bebé mide 1.6 cm y ya tiene todos los órganos principales en formación. Los deditos de manos y pies están apareciendo.", cuerpo:"El útero ya ha duplicado su tamaño. Puedes sentir más cansancio del normal — es tu cuerpo trabajando intensamente.", esperar:"Primera ecografía para confirmar el latido y la fecha de parto. Es un momento muy emocionante.", consejo:"Duerme cuando puedas. El cansancio del primer trimestre es real y tu cuerpo lo necesita." },
  12: { bebe:"Tu bebé mide 5.4 cm, del tamaño de una ciruela. Ya puede mover los dedos, bostezar y tiene reflejo de succión.", cuerpo:"Las náuseas suelen mejorar al final del primer trimestre. Puedes sentir que recuperas energía.", esperar:"Triple marcador o ecografía de la semana 12 para el tamizaje de cromosomopatías.", consejo:"Empieza a planear cómo compartir la noticia. Muchas familias esperan el primer trimestre para anunciar el embarazo." },
  16: { bebe:"Mide unos 11.6 cm y pesa 100g. Sus movimientos son más coordinados aunque aún no los sientes. Ya distingue luz y oscuridad.", cuerpo:"El útero sube por encima del pubis y ya puede ser visible. La barriga empieza a notarse.", esperar:"Prueba de maternidad fetal (Quad Screen) entre semanas 15-20. Ecografía morfológica próximamente.", consejo:"Es un buen momento para empezar con el yoga prenatal o ejercicios suaves de suelo pélvico." },
  20: { bebe:"¡Mitad del camino! Mide 25 cm y pesa 300g. Pronto sentirás sus movimientos como pequeñas burbujas o aleteos.", cuerpo:"La barriga es ya claramente visible. Pueden aparecer las primeras estrías — usa aceite de rosa mosqueta o manteca de karité.", esperar:"Ecografía morfológica de la semana 20 — la más importante para verificar el desarrollo de órganos.", consejo:"Empieza a hablarle a tu bebé. Puede escucharte desde esta semana y reconocerá tu voz al nacer." },
  24: { bebe:"Mide 30 cm y pesa 600g. Sus pulmones están desarrollando el surfactante que necesitará para respirar al nacer.", cuerpo:"Pueden aparecer edemas (hinchazón) en pies y tobillos. Descansa con los pies elevados cuando puedas.", esperar:"Test de O'Sullivan (glucosa) entre semanas 24-28 para descartar diabetes gestacional.", consejo:"Investiga cursos de preparación al parto. El conocimiento reduce el miedo y aumenta la confianza." },
  28: { bebe:"Mide 37 cm y pesa casi 1 kg. Sus ojos ya están abiertos y puede distinguir luz. El cerebro se está desarrollando rápidamente.", cuerpo:"Inicio del tercer trimestre. Puedes sentir más dificultad para respirar a medida que el útero empuja el diafragma.", esperar:"Vacuna de la tos ferina (Tdap) entre semanas 27-36 para proteger al bebé recién nacido.", consejo:"Empieza el plan de parto. Anota tus preferencias sobre el tipo de parto, analgesia y primeros momentos con tu bebé." },
  32: { bebe:"Mide 42 cm y pesa 1.7 kg. Está en posición cefálica (de cabeza) la mayoría del tiempo. Sus huesos están endureciéndose.", cuerpo:"Las contracciones de Braxton Hicks son más frecuentes. Son ensayos del útero — irregulares y no dolorosas.", esperar:"Ecografía de control del crecimiento. El médico verificará la posición y el bienestar del bebé.", consejo:"Prepara la bolsa del hospital. Ten todo listo desde la semana 36 por si el bebé llega antes." },
  36: { bebe:"Mide 47 cm y pesa casi 2.6 kg. Sus pulmones están casi maduros. Llena todo el espacio del útero.", cuerpo:"El bebé puede 'encajarse' en la pelvis, aliviando la presión en el diafragma pero aumentando la presión pélvica.", esperar:"Consultas semanales con tu médico. Monitoreo de la posición y el bienestar fetal.", consejo:"Practica las técnicas de respiración para el parto cada día. Tu cuerpo ya está listo — confía en él." },
  40: { bebe:"¡Término! Tu bebé mide unos 50 cm y pesa entre 3-3.5 kg. Está completamente desarrollado y listo para nacer.", cuerpo:"Puedes sentir más presión pélvica, pérdida del tapón mucoso, o que las contracciones se vuelven más regulares.", esperar:"Si no hay señales de parto, el médico puede hablar de inducción después de semana 41.", consejo:"Descansa todo lo que puedas. Pronto conocerás a esa personita que ha crecido dentro de ti. ¡Ya casi!" },
};

const WEEKLY_CONTENT_EN = {
  4:  { bebe:"Your baby is barely 2 mm, the size of a poppy seed. The embryo is forming the cell layers that will become its organs.", cuerpo:"You probably don't know yet that you're pregnant. The uterus begins preparing a warm environment for the embryo.", esperar:"Possible implantation with light pink spotting ('implantation bleeding'). Start taking folic acid if you haven't already.", consejo:"Start a pregnancy journal. Writing down how you feel in these early weeks is something you'll treasure forever." },
  5:  { bebe:"Your baby's heart starts beating — even though it's as small as a grain of rice! Nerve cells are multiplying rapidly.", cuerpo:"The first morning sickness may appear (though it can happen at any time). Your breasts may feel tender.", esperar:"Confirm the pregnancy with a urine or blood test. Schedule your first prenatal appointment.", consejo:"Saltine crackers before getting up can ease nausea. Never let your stomach go completely empty." },
  8:  { bebe:"Your baby measures 1.6 cm and already has all major organs forming. Fingers and toes are appearing.", cuerpo:"The uterus has already doubled in size. You may feel more tired than usual — it's your body working hard.", esperar:"First ultrasound to confirm the heartbeat and due date. A very exciting moment.", consejo:"Sleep whenever you can. First-trimester fatigue is real and your body needs it." },
  12: { bebe:"Your baby measures 5.4 cm, the size of a plum. They can already move their fingers, yawn, and have a sucking reflex.", cuerpo:"Nausea usually improves by the end of the first trimester. You may start feeling your energy return.", esperar:"Triple screen or week-12 ultrasound for chromosomal screening.", consejo:"Start planning how to share the news. Many families wait until the first trimester ends to announce the pregnancy." },
  16: { bebe:"They measure about 11.6 cm and weigh 100g. Their movements are more coordinated, though you can't feel them yet. They can already tell light from dark.", cuerpo:"The uterus rises above the pubic bone and may become visible. The belly starts to show.", esperar:"Quad screen maternal test between weeks 15-20. Anatomy scan coming up soon.", consejo:"A good time to start prenatal yoga or gentle pelvic-floor exercises." },
  20: { bebe:"Halfway there! They measure 25 cm and weigh 300g. You'll soon feel their movements like little bubbles or flutters.", cuerpo:"The belly is now clearly visible. The first stretch marks may appear — use rosehip oil or shea butter.", esperar:"The week-20 anatomy scan — the most important one to check organ development.", consejo:"Start talking to your baby. They can hear you from this week on and will recognize your voice at birth." },
  24: { bebe:"They measure 30 cm and weigh 600g. Their lungs are developing the surfactant they'll need to breathe at birth.", cuerpo:"Swelling (edema) may appear in feet and ankles. Rest with your feet elevated when you can.", esperar:"O'Sullivan (glucose) test between weeks 24-28 to rule out gestational diabetes.", consejo:"Look into childbirth prep classes. Knowledge reduces fear and builds confidence." },
  28: { bebe:"They measure 37 cm and weigh almost 1 kg. Their eyes are open and can distinguish light. The brain is developing rapidly.", cuerpo:"Third trimester begins. You may find it harder to breathe as the uterus pushes against the diaphragm.", esperar:"Whooping cough (Tdap) vaccine between weeks 27-36 to protect the newborn.", consejo:"Start your birth plan. Write down your preferences on delivery type, pain relief, and the first moments with your baby." },
  32: { bebe:"They measure 42 cm and weigh 1.7 kg. They're head-down most of the time now. Their bones are hardening.", cuerpo:"Braxton Hicks contractions become more frequent. These are uterine rehearsals — irregular and painless.", esperar:"Growth-check ultrasound. Your doctor will check the baby's position and wellbeing.", consejo:"Pack your hospital bag. Have everything ready from week 36 in case the baby arrives early." },
  36: { bebe:"They measure 47 cm and weigh almost 2.6 kg. Their lungs are nearly mature. They now fill the entire uterus.", cuerpo:"The baby may 'engage' in the pelvis, easing pressure on the diaphragm but increasing pelvic pressure.", esperar:"Weekly check-ups with your doctor. Monitoring of fetal position and wellbeing.", consejo:"Practice labor breathing techniques every day. Your body is ready — trust it." },
  40: { bebe:"Full term! Your baby measures about 50 cm and weighs 3-3.5 kg. Fully developed and ready to be born.", cuerpo:"You may feel more pelvic pressure, loss of the mucus plug, or contractions becoming more regular.", esperar:"If there are no signs of labor, your doctor may discuss induction after week 41.", consejo:"Rest as much as you can. Soon you'll meet the little person who's been growing inside you. Almost there!" },
};

function getWeekContent(w, lang) {
  const SRC = lang==="en" ? WEEKLY_CONTENT_EN : WEEKLY_CONTENT;
  const keys=Object.keys(SRC).map(Number).sort((a,b)=>a-b);
  let best=keys[0];
  for(const k of keys){ if(w>=k) best=k; }
  return SRC[best];
}

function ContenidoSemanalScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const baseWeek = parseInt(localStorage.getItem("lume_weeks")||15);
  const [week, setWeek] = React.useState(baseWeek);
  const csLang = getAppLang2();
  const data = getWeekContent(week, csLang);
  const CS_T = csLang==="en" ? {
    title:"Weekly Guide", premiumBadge:"✦ Wellness Premium", heroQ:"What to expect this week?",
    heroDesc:"Week-by-week guides on your baby's development and the changes in your body.",
    weekLabel:"Week", babyLabel:"Your baby", availableIn:"Available in Wellness", availableSub:"Complete guides from week 4 to 40",
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card required · cancel anytime",
    weekToWeek:"Week by week", heroTitle:"Weekly pregnancy", heroTitleBr:"guide", heroSub:"Your baby · Your body · What to expect",
    currentWeek:"Your current week",
    disclaimer:"Remember every pregnancy is unique. These guides are for reference — always check with your doctor.",
    tip:"Tip ✦",
  } : {
    title:"Guía Semanal", premiumBadge:"✦ Bienestar Premium", heroQ:"¿Qué esperar esta semana?",
    heroDesc:"Guías semana a semana sobre el desarrollo de tu bebé y los cambios en tu cuerpo.",
    weekLabel:"Semana", babyLabel:"Tu bebé", availableIn:"Disponible en Bienestar", availableSub:"Guías completas semana 4 a 40",
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    weekToWeek:"Semana a semana", heroTitle:"Guía semanal", heroTitleBr:"del embarazo", heroSub:"Tu bebé · Tu cuerpo · Qué esperar",
    currentWeek:"Tu semana actual",
    disclaimer:"Recuerda que cada embarazo es único. Estas guías son orientativas — siempre consulta con tu médico.",
    tip:"Consejo ✦",
  };

  const SECTIONS = [
    { key:"bebe",    icon:<svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>, label:CS_T.babyLabel,     color:"#8B5A9E" },
    { key:"cuerpo",  icon:<svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label:csLang==="en"?"Your body":"Tu cuerpo",  color:"#A8492A" },
    { key:"esperar", icon:<svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label:csLang==="en"?"What to expect":"Qué esperar", color:"#3A8070" },
    { key:"consejo", icon:<svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label:CS_T.tip,  color:"#C8952A" },
  ];
  const [openSec, setOpenSec] = React.useState("bebe");

  if(!isPremium){
    return (
      <div className="screen s-enter">
        <ScreenHeader title={CS_T.title} goBack={goBack}/>
        <div style={{textAlign:"center",padding:"20px 0 16px"}}>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:".12em",color:"#C8952A",textTransform:"uppercase"}}>{CS_T.premiumBadge}</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:"#3d1a0e",margin:"8px 0 6px",lineHeight:1.2}}>{CS_T.heroQ}</h2>
          <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:0}}>{CS_T.heroDesc}</p>
        </div>
        <div style={{position:"relative",borderRadius:24,overflow:"hidden",marginBottom:20,background:"rgba(255,255,255,.6)",backdropFilter:"blur(20px)",border:"1px solid rgba(200,149,42,.15)",padding:20,filter:"blur(2px)",pointerEvents:"none",opacity:.5}}>
          <div style={{fontSize:11,fontWeight:800,color:"#C8952A",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>{CS_T.weekLabel} {baseWeek}</div>
          <div style={{fontSize:22,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,color:"#3d1a0e",marginBottom:8}}>{CS_T.babyLabel}</div>
          <p style={{fontSize:13,color:"#5a3a2a",lineHeight:1.65,margin:0}}>{data.bebe.slice(0,80)}...</p>
        </div>
        <div style={{position:"absolute",left:"5%",right:"5%",top:"42%",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#C8952A,#E4BC7E)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(200,149,42,.4)",marginBottom:10}}>
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#3d1a0e",marginBottom:3}}>{CS_T.availableIn}</div>
          <div style={{fontSize:12.5,color:"#8a6a5a"}}>{CS_T.availableSub}</div>
        </div>
        <div style={{marginTop:120}}>
          <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#C8952A,#E4BC7E,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#2A1400",boxShadow:"0 10px 32px rgba(200,149,42,.4)"}}>
            {CS_T.activateCta}
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{CS_T.noCard}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen s-enter" style={{padding:0}}>

      {/* ── Hero ── */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#1a0a40 0%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,220,160,.1)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,left:-20,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.05)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{csLang==="en"?"✦ WELLNESS":"✦ BIENESTAR"}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,170,.8)",textTransform:"uppercase",marginBottom:7}}>{CS_T.weekToWeek}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{CS_T.heroTitle}<br/>{CS_T.heroTitleBr}</h2>
          <p style={{fontSize:12,color:"rgba(255,224,170,.72)",margin:0,lineHeight:1.5}}>{CS_T.heroSub}</p>
        </div>
      </div>

      <div style={{padding:"16px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>

        {/* ── Week selector ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px) saturate(170%)",WebkitBackdropFilter:"blur(28px) saturate(170%)",borderRadius:20,padding:"12px 16px",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 24px rgba(200,149,42,.12), inset 0 1px 0 rgba(255,255,255,.95)"}}>
          <button onClick={()=>setWeek(w=>Math.max(4,w-1))} style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(168,73,42,.15)",background:"rgba(168,73,42,.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#A8492A" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".12em",color:"#C8952A",textTransform:"uppercase",marginBottom:2}}>✦ {CS_T.weekLabel}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:600,color:"#3d1a0e",lineHeight:1}}>{week}</div>
            {week===baseWeek && <div style={{fontSize:10,color:"#A8492A",fontWeight:700,marginTop:2}}>{CS_T.currentWeek}</div>}
          </div>
          <button onClick={()=>setWeek(w=>Math.min(40,w+1))} style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(168,73,42,.15)",background:"rgba(168,73,42,.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#A8492A" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* ── Section buttons 2×2 grid ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {SECTIONS.map(s=>{
            const active = openSec===s.key;
            return (
              <button key={s.key} onClick={()=>setOpenSec(s.key)}
                className="tri-btn-ex"
                style={{
                  display:"flex",alignItems:"center",gap:10,padding:"13px 14px",
                  borderRadius:18,border:"none",cursor:"pointer",fontFamily:"inherit",
                  textAlign:"left",
                  background: active
                    ? `linear-gradient(135deg,${s.color},${s.color}CC)`
                    : "rgba(255,255,255,.75)",
                  backdropFilter:"blur(20px) saturate(160%)",
                  WebkitBackdropFilter:"blur(20px) saturate(160%)",
                  boxShadow: active
                    ? `0 8px 22px ${s.color}45, inset 0 1px 0 rgba(255,255,255,.22)`
                    : `0 4px 14px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.9)`,
                  border: active ? "none" : `1px solid ${s.color}18`,
                  transition:"all .25s cubic-bezier(.34,1.56,.64,1)"
                }}>
                <div style={{width:34,height:34,borderRadius:11,flexShrink:0,
                  background: active ? "rgba(255,255,255,.22)" : `linear-gradient(135deg,${s.color},${s.color}88)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color: active ? "#fff" : "rgba(255,255,255,.92)",
                  boxShadow: active ? "none" : `0 4px 10px ${s.color}40`}}>
                  {s.icon}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:active?"#fff":s.color,lineHeight:1.2}}>{s.label.replace(" ✦","")}</div>
                  {active && <div style={{fontSize:9.5,color:"rgba(255,255,255,.75)",fontWeight:600,marginTop:1}}>{CS_T.weekLabel} {week}</div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Content card (exercise-style) ── */}
        {SECTIONS.filter(s=>s.key===openSec).map(s=>(
          <div key={s.key} style={{
            background:`linear-gradient(150deg,rgba(255,255,255,.72),${s.color}0c)`,
            backdropFilter:"blur(28px) saturate(180%)",WebkitBackdropFilter:"blur(28px) saturate(180%)",
            borderRadius:22,
            border:`1.5px solid ${s.color}25`,
            boxShadow:`0 14px 36px -6px ${s.color}30, inset 0 1px 0 rgba(255,255,255,.95)`,
            overflow:"hidden"
          }}>
            {/* Card header */}
            <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${s.color}12`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${s.color},${s.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${s.color}45`,color:"rgba(255,255,255,.92)",flexShrink:0}}>
                  {s.icon}
                </div>
                <div>
                  <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:s.color,textTransform:"uppercase"}}>{s.label.replace(" ✦","")}</div>
                  <div style={{fontSize:11,color:"#a08070",fontWeight:600}}>{CS_T.weekLabel} {week}</div>
                </div>
              </div>
              {s.label.includes("✦") && (
                <span style={{fontSize:9.5,fontWeight:800,padding:"3px 9px",borderRadius:99,background:`${s.color}18`,border:`1px solid ${s.color}28`,color:s.color}}>{CS_T.tip}</span>
              )}
            </div>
            {/* Card body */}
            <div style={{padding:"16px"}}>
              <p style={{margin:0,fontSize:14,color:"#5a3a2a",lineHeight:1.78}}>{data[s.key]}</p>
            </div>
          </div>
        ))}

        {/* Disclaimer */}
        <div style={{padding:"12px 14px",borderRadius:16,background:"rgba(255,255,255,.55)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(200,149,42,.13)",display:"flex",gap:10,alignItems:"flex-start",boxShadow:"0 4px 16px rgba(200,149,42,.08)"}}>
          <span style={{fontSize:13,flexShrink:0,color:"#C8952A"}}>✦</span>
          <p style={{margin:0,fontSize:11.5,color:"#7a5a30",lineHeight:1.6}}>{CS_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CitasScreen, SintomasScreen, RecompensasScreen, UltrasonidosScreen, PesoScreen, AjustesScreen, KickTrackerScreen, FotosScreen, MeditacionesScreen, EjerciciosScreen, ContenidoSemanalScreen });

/* ══════════════════════════════════════════════
   DIARIO DEL EMBARAZO
══════════════════════════════════════════════ */
const MOODS = [
  { id:"feliz",      path:"M12 20s-7-4.3-7-9.4C5 7.5 7 6 9 6c1.6 0 2.6.9 3 1.8C12.4 6.9 13.4 6 15 6c2 0 4 1.5 4 4.6 0 5.1-7 9.4-7 9.4Z", label:"Feliz",      color:"#A8492A" },
  { id:"tranquila",  path:"M3 12c2-3 4-5 5-5s3 4 4 4 3-2 4-2 3 2 4 2 3-3 4-3",                                             label:"Tranquila",  color:"#3A8070" },
  { id:"cansada",    path:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",                                                    label:"Cansada",    color:"#8B5A9E" },
  { id:"ansiosa",    path:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",                                                              label:"Ansiosa",    color:"#4080D0" },
  { id:"emocionada", path:"M12 7c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5z",          label:"Emocionada", color:"#C8952A" },
];
const MOOD_LABEL_EN = { feliz:"Happy", tranquila:"Calm", cansada:"Tired", ansiosa:"Anxious", emocionada:"Excited" };

const MoodIcon = ({m, size=18, active=false}) => (
  <div style={{width:size,height:size,borderRadius:Math.round(size*.32),background:active?`linear-gradient(135deg,${m.color},${m.color}BB)`:`${m.color}16`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:active?`0 4px 10px ${m.color}45`:"none",transition:"all .2s"}}>
    <svg viewBox="0 0 24 24" width={Math.round(size*.62)} height={Math.round(size*.62)} fill="none" stroke={active?"white":m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={m.path}/></svg>
  </div>
);

function DiarioScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const weeks = parseInt(localStorage.getItem("lume_weeks")||15);
  const [entradas, setEntradas] = React.useState(()=>LS.get("lume_diario")||[]);
  const [texto, setTexto]       = React.useState("");
  const [mood, setMood]         = React.useState(null);
  const [expandedId, setExpandedId] = React.useState(null);
  const dLang = getAppLang2();
  const MOODS_L = MOODS.map(m=>({...m, label: dLang==="en" ? MOOD_LABEL_EN[m.id] : m.label}));
  const D_T = dLang==="en" ? {
    title:"Pregnancy", titleBr:"diary", eyebrow:"Wellness · Memories", sub:"Write every moment · keep the memories",
    heroQ:"Your story, in your own words", heroDesc:"Save entries with your mood, thoughts and feelings, week by week.",
    activateCta:"✦ Activate Wellness", noCard:"No card required · cancel anytime",
    week:"Week", entriesSaved:e=>`${e} ${e===1?"entry":"entries"} saved`,
    newEntry:"New entry · Week", placeholder:"How are you feeling today? Write down what you'd like to remember from this week...",
    saveEntry:"Save entry", savedEntries:"Saved entries", emptyTitle:"Your diary is empty",
    emptyDesc:"Write your first entry and keep this moment forever.",
  } : {
    title:"Diario del", titleBr:"embarazo", eyebrow:"Bienestar · Memoria", sub:"Escribe cada momento · guarda recuerdos",
    heroQ:"Tu historia, en tus palabras", heroDesc:"Guarda entradas con tu estado de ánimo, pensamientos y emociones semana a semana.",
    activateCta:"✦ Activar Bienestar", noCard:"Sin tarjeta · cancela cuando quieras",
    week:"Semana", entriesSaved:e=>`${e} ${e===1?"entrada":"entradas"} guardadas`,
    newEntry:"Nueva entrada · Semana", placeholder:"¿Cómo te sientes hoy? Escribe lo que quieras recordar de esta semana...",
    saveEntry:"Guardar entrada", savedEntries:"Entradas guardadas", emptyTitle:"Tu diario está vacío",
    emptyDesc:"Escribe tu primera entrada y guarda este momento para siempre.",
  };

  const guardar = () => {
    if (!texto.trim()) return;
    const e = { id:Date.now(), texto, mood, semana:weeks,
      fecha: new Date().toLocaleDateString(dLang==="en"?"en-US":"es-ES",{day:"numeric",month:"long",year:"numeric"}) };
    const nueva = [e, ...entradas];
    setEntradas(nueva); LS.set("lume_diario", nueva);
    setTexto(""); setMood(null);
  };

  const eliminar = (id) => {
    const nueva = entradas.filter(e=>e.id!==id);
    setEntradas(nueva); LS.set("lume_diario", nueva);
  };

  /* PAYWALL */
  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0}}>
      <div style={{position:"relative",background:"linear-gradient(155deg,#3a1060 0%,#8B5A9E 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{dLang==="en"?"✦ WELLNESS":"✦ BIENESTAR"}</div>
        <div style={{marginTop:6}}>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,200,.8)",textTransform:"uppercase",marginBottom:7}}>{D_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{D_T.title}<br/>{D_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(255,224,200,.72)",margin:0,lineHeight:1.5}}>{D_T.sub}</p>
        </div>
      </div>
      <div style={{padding:"22px 16px 100px"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#3d1a0e",margin:"0 0 6px"}}>{D_T.heroQ}</h3>
          <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:0}}>{D_T.heroDesc}</p>
        </div>
        {[{mood:"feliz",t:dLang==="en"?"Week 8":"Semana 8",d:dLang==="en"?"Today I saw the heartbeat for the first time on the ultrasound. My eyes filled with tears...":"Hoy vi el latido por primera vez en el ultrasonido. Se me llenaron los ojos de lágrimas..."},
          {mood:"tranquila",t:dLang==="en"?"Week 12":"Semana 12",d:dLang==="en"?"The nausea got better. I can finally eat something without my stomach turning.":"Las náuseas mejoraron. Por fin puedo comer algo sin que se me revuelva el estómago."},
          {mood:"emocionada",t:dLang==="en"?"Week 16":"Semana 16",d:dLang==="en"?"I felt the first movements, like tiny bubbles. It's real!":"Sentí los primeros movimientos, como burbujas pequeñitas. ¡Es real!"}].map((e,i)=>{
            const m = MOODS_L.find(x=>x.id===e.mood);
            return (
          <div key={i} style={{marginBottom:10,padding:"14px 16px",borderRadius:18,background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.85)",boxShadow:"0 6px 18px rgba(139,90,158,.1)",filter:i===0?"none":"blur(2px)",opacity:i===0?1:.55}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              {m && <MoodIcon m={m} size={28} active={true}/>}
              <span style={{fontSize:11,fontWeight:700,color:"#8B5A9E"}}>{e.t}</span>
            </div>
            <p style={{margin:0,fontSize:13,color:"#5a3a2a",lineHeight:1.6}}>{e.d}</p>
          </div>
            );
          })}
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#8B5A9E,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(139,90,158,.45)",marginTop:8}}>
          {D_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{D_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0}}>
      {/* Hero */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#3a1060 0%,#8B5A9E 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{dLang==="en"?"✦ WELLNESS":"✦ BIENESTAR"}</div>
        <div style={{marginTop:6}}>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,200,.8)",textTransform:"uppercase",marginBottom:7}}>{D_T.week} {weeks}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{D_T.title}<br/>{D_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(255,224,200,.72)",margin:0,lineHeight:1.5}}>{D_T.entriesSaved(entradas.length)}</p>
        </div>
      </div>

      <div style={{padding:"16px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
        {/* Nueva entrada */}
        <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px) saturate(170%)",WebkitBackdropFilter:"blur(28px) saturate(170%)",borderRadius:22,border:"1.5px solid rgba(139,90,158,.2)",boxShadow:"0 10px 32px rgba(139,90,158,.15), inset 0 1px 0 rgba(255,255,255,.95)",overflow:"hidden"}}>
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid rgba(139,90,158,.1)",display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:28,height:28,borderRadius:9,background:"linear-gradient(135deg,#8B5A9E,#C8952A)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(139,90,158,.45)"}}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <span style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#8B5A9E",textTransform:"uppercase"}}>{D_T.newEntry} {weeks}</span>
          </div>
          {/* Mood selector */}
          <div style={{padding:"12px 16px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
            {MOODS_L.map(m=>(
              <button key={m.id} onClick={()=>setMood(mood===m.id?null:m.id)}
                style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:99,border:mood===m.id?`1.5px solid ${m.color}`:"1.5px solid rgba(139,90,158,.15)",background:mood===m.id?`${m.color}18`:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"inherit",fontSize:11.5,fontWeight:700,color:mood===m.id?m.color:"#8a6a5a",transition:"all .2s"}}>
                <MoodIcon m={m} size={20} active={mood===m.id}/>
                {m.label}
              </button>
            ))}
          </div>
          {/* Text area */}
          <div style={{padding:"10px 16px"}}>
            <textarea value={texto} onChange={e=>setTexto(e.target.value)}
              placeholder={D_T.placeholder}
              style={{width:"100%",minHeight:100,borderRadius:14,border:"1.5px solid rgba(139,90,158,.18)",background:"rgba(255,255,255,.6)",padding:"12px 14px",fontFamily:"inherit",fontSize:13,color:"#3d1a0e",lineHeight:1.65,resize:"none",outline:"none",boxSizing:"border-box"}}/>
            <button onClick={guardar} disabled={!texto.trim()}
              style={{width:"100%",padding:"13px",borderRadius:99,border:"none",cursor:texto.trim()?"pointer":"not-allowed",marginTop:8,background:texto.trim()?"linear-gradient(135deg,#8B5A9E,#C8952A)":"rgba(139,90,158,.2)",color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,boxShadow:texto.trim()?"0 8px 22px rgba(139,90,158,.4)":"none",transition:"all .25s"}}>
              {D_T.saveEntry}
            </button>
          </div>
        </div>

        {/* Entradas guardadas */}
        {entradas.length > 0 && (
          <div>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#8a6a5a",textTransform:"uppercase",marginBottom:10,padding:"0 2px"}}>{D_T.savedEntries}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {entradas.map(e=>{
                const m = MOODS_L.find(x=>x.id===e.mood);
                return (
                  <div key={e.id} style={{background:"rgba(255,255,255,.72)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:20,border:`1px solid ${m?m.color+"22":"rgba(139,90,158,.1)"}`,overflow:"hidden",boxShadow:`0 6px 20px ${m?m.color+"18":"rgba(139,90,158,.08)"}, inset 0 1px 0 rgba(255,255,255,.9)`}}>
                    <div style={{padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}} onClick={()=>setExpandedId(expandedId===e.id?null:e.id)}>
                      {m && <MoodIcon m={m} size={34} active={true}/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontSize:11,fontWeight:800,color:m?m.color:"#8B5A9E"}}>{D_T.week} {e.semana} {m?`· ${m.label}`:""}</span>
                          <span style={{fontSize:10,color:"#a08070",flexShrink:0}}>{e.fecha}</span>
                        </div>
                        <p style={{margin:0,fontSize:13,color:"#5a3a2a",lineHeight:1.6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:expandedId===e.id?100:2,WebkitBoxOrient:"vertical"}}>{e.texto}</p>
                      </div>
                      <button onClick={ev=>{ev.stopPropagation();eliminar(e.id);}} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"#c09080",flexShrink:0}}>
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {entradas.length === 0 && (
          <div style={{textAlign:"center",padding:"30px 0",color:"#b09080"}}>
            <div style={{width:56,height:56,borderRadius:18,background:"linear-gradient(135deg,rgba(139,90,158,.15),rgba(200,149,42,.1))",border:"1.5px solid rgba(139,90,158,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#8B5A9E"}}>
              <AppIcon name="diary" size={26}/>
            </div>
            <div style={{fontSize:14,fontWeight:600,color:"#8a6a5a",marginBottom:4}}>{D_T.emptyTitle}</div>
            <div style={{fontSize:12,lineHeight:1.6}}>{D_T.emptyDesc}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CONSULTAS CON EXPERTOS
══════════════════════════════════════════════ */
const EXPERTOS_DATA = [
  { id:1, nombre:"Dra. Carmen López",  esp:"Matrona · Parto natural",       rating:4.9, reviews:312, avail:"Hoy · 16:00",      color:"#A8492A", badge:"Más solicitada",  bio:"12 años acompañando embarazos en todas sus etapas. Especializada en preparación al parto y lactancia.",     cat:"matrona",    calendly:"https://calendly.com/lume-matrona/consulta-15min" },
  { id:2, nombre:"Dra. María Fuentes", esp:"Nutricionista perinatal",        rating:4.8, reviews:218, avail:"Mañana · 10:30",   color:"#3A8070", badge:null,              bio:"Menús personalizados según tu trimestre, síntomas y preferencias. Plan anti-náuseas incluido.",            cat:"nutricion",  calendly:"https://calendly.com/lume-nutricion/consulta-15min" },
  { id:3, nombre:"Psic. Laura Martín", esp:"Psicología perinatal",           rating:4.9, reviews:196, avail:"Hoy · 18:00",      color:"#8B5A9E", badge:"Alta demanda",    bio:"Ansiedad prenatal, miedo al parto, vínculo y adaptación. Primera sesión gratuita sin compromiso.",         cat:"psicologia", calendly:"https://calendly.com/lume-psicologia/consulta-15min" },
  { id:4, nombre:"Fisio. Ana Ruiz",    esp:"Fisioterapia obstétrica",        rating:4.7, reviews:141, avail:"Jue · 11:00",      color:"#B8872A", badge:null,              bio:"Suelo pélvico, dolor lumbar y posturas seguras durante el embarazo. Online y presencial.",                cat:"fisio",      calendly:"https://calendly.com/lume-fisio/consulta-15min" },
  { id:5, nombre:"Dr. Andrés García",  esp:"Ginecólogo · Alto riesgo",       rating:5.0, reviews:87,  avail:"Vie · 09:00",      color:"#4A6A9E", badge:"✦ Top rated",     bio:"Embarazos de alto riesgo, gemelar y tras pérdida gestacional. Segunda opinión y seguimiento especializado.", cat:"matrona",    calendly:"https://calendly.com/lume-ginecologia/consulta-15min" },
];
const EXPERTOS_DATA_EN = [
  { ...EXPERTOS_DATA[0], esp:"Midwife · Natural birth", avail:"Today · 4:00 PM", badge:"Most requested", bio:"12 years supporting pregnancies at every stage. Specialized in birth prep and breastfeeding." },
  { ...EXPERTOS_DATA[1], esp:"Perinatal nutritionist", avail:"Tomorrow · 10:30 AM", badge:null, bio:"Personalized menus based on your trimester, symptoms and preferences. Anti-nausea plan included." },
  { ...EXPERTOS_DATA[2], esp:"Perinatal psychology", avail:"Today · 6:00 PM", badge:"High demand", bio:"Prenatal anxiety, fear of birth, bonding and adjustment. Free first session, no commitment." },
  { ...EXPERTOS_DATA[3], esp:"Obstetric physiotherapy", avail:"Thu · 11:00 AM", badge:null, bio:"Pelvic floor, lower-back pain and safe postures during pregnancy. Online and in person." },
  { ...EXPERTOS_DATA[4], esp:"OB-GYN · High risk", avail:"Fri · 9:00 AM", badge:"✦ Top rated", bio:"High-risk, twin and post-loss pregnancies. Second opinions and specialized follow-up." },
];
const EXP_CATS = [
  {id:"todas", label:"Todas"},
  {id:"matrona", label:"Matrona"},
  {id:"nutricion", label:"Nutrición"},
  {id:"psicologia", label:"Psicología"},
  {id:"fisio", label:"Fisio"},
];
const EXP_CATS_EN = [
  {id:"todas", label:"All"},
  {id:"matrona", label:"Midwife"},
  {id:"nutricion", label:"Nutrition"},
  {id:"psicologia", label:"Psychology"},
  {id:"fisio", label:"Physio"},
];

function ExpertosScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const [cat, setCat]         = React.useState("todas");
  const [selExp, setSelExp]   = React.useState(null);
  const [booked, setBooked]   = React.useState(()=>LS.get("lume_bookings")||[]);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [bookingModal, setBookingModal] = React.useState(null);
  const [selDay, setSelDay]   = React.useState(0);
  const [selSlot, setSelSlot] = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(null);
  const expLang = getAppLang2();
  const EXPERTOS_L = expLang==="en" ? EXPERTOS_DATA_EN : EXPERTOS_DATA;
  const EXP_CATS_L = expLang==="en" ? EXP_CATS_EN : EXP_CATS;
  const XP_T = expLang==="en" ? {
    badge:"✦ PROFESSIONAL", eyebrow:"Professional · Experts", title:"Consult with", titleBr:"experts",
    subtitle:"Midwives · Nutritionists · Psychologists · Physio",
    availableSub:n=>`First consult free · ${n} specialists available`,
    activateCta:"✦ Activate Professional", noCard:"No card required · cancel anytime",
    reviews:"reviews", bookSession:"Book session", cancel:"Cancel",
    firstFree:"First 15-min consult free", chooseDay:"Choose a day", availableTimes:"Available times",
    confirmSlot:(l,s)=>`Confirm · ${l} ${s}`, chooseTime:"Choose a time",
    emailNote:"You'll get email confirmation · free cancellation up to 24h before",
    poweredBy:"Real-time scheduling · Powered by Calendly",
    bookingConfirmed:"✦ Booking confirmed", disclaimer:"First 15-min consult is free. Full sessions have an additional cost depending on the specialist.",
    today:"Today", tomorrow:"Tomorrow",
  } : {
    badge:"✦ PROFESIONAL", eyebrow:"Profesional · Expertos", title:"Consultas con", titleBr:"expertos",
    subtitle:"Matronas · Nutricionistas · Psicólogas · Fisio",
    availableSub:n=>`Primera consulta gratis · ${n} especialistas disponibles`,
    activateCta:"✦ Activar Profesional", noCard:"Sin tarjeta · cancela cuando quieras",
    reviews:"reseñas", bookSession:"Reservar sesión", cancel:"Cancelar",
    firstFree:"Primera consulta 15 min gratis", chooseDay:"Selecciona día", availableTimes:"Horarios disponibles",
    confirmSlot:(l,s)=>`Confirmar · ${l} ${s}`, chooseTime:"Selecciona un horario",
    emailNote:"Recibirás confirmación por email · cancelación gratis 24h antes",
    poweredBy:"Agenda en tiempo real · Powered by Calendly",
    bookingConfirmed:"✦ Reserva confirmada", disclaimer:"Primera consulta de 15 min gratuita. Las sesiones completas tienen un costo adicional según el especialista.",
    today:"Hoy", tomorrow:"Mañana",
  };

  const getSlots = (expId) => {
    const days = []; const now = new Date();
    const ALL = ["09:00","09:30","10:00","10:30","11:00","11:30","16:00","16:30","17:00","17:30","18:00","18:30"];
    for (let i=0;i<5;i++) {
      const d = new Date(now); d.setDate(d.getDate()+i);
      const seed = (expId*7 + i*3) % 4;
      const slots = ALL.filter((_,idx)=>(idx+seed)%3!==0).slice(0,5);
      const locale = expLang==="en" ? "en-US" : "es-ES";
      days.push({ label:i===0?XP_T.today:i===1?XP_T.tomorrow:d.toLocaleDateString(locale,{weekday:"short",day:"numeric"}), date:d.toLocaleDateString(locale,{weekday:"long",day:"numeric",month:"long"}), slots });
    }
    return days;
  };

  const openBooking = (exp) => { setBookingModal({exp}); setSelDay(0); setSelSlot(null); };
  const confirmBooking = () => {
    const days = getSlots(bookingModal.exp.id);
    const day = days[selDay];
    const entry = {id:bookingModal.exp.id,nombre:bookingModal.exp.nombre,date:day.date,slot:selSlot,fecha:new Date().toLocaleDateString(expLang==="en"?"en-US":"es-ES")};
    const b = [...booked.filter(x=>x.id!==bookingModal.exp.id), entry];
    setBooked(b); LS.set("lume_bookings",b);
    setConfirmed({exp:bookingModal.exp,day,slot:selSlot});
    // Open Calendly with pre-filled date/time
    window.open(bookingModal.exp.calendly, "_blank");
    setBookingModal(null);
    setTimeout(()=>setConfirmed(null),4000);
  };

  const filtered = cat==="todas" ? EXPERTOS_L : EXPERTOS_L.filter(e=>e.cat===cat);

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0}}>
      <div style={{position:"relative",background:"linear-gradient(155deg,#0a3040 0%,#3A8070 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{XP_T.badge}</div>
        <div style={{marginTop:6}}>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,255,230,.8)",textTransform:"uppercase",marginBottom:7}}>{XP_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{XP_T.title}<br/>{XP_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(200,255,230,.72)",margin:0,lineHeight:1.5}}>{XP_T.subtitle}</p>
        </div>
      </div>
      <div style={{padding:"22px 16px 100px"}}>
        {EXPERTOS_L.slice(0,3).map((e,i)=>(
          <div key={i} style={{marginBottom:10,display:"flex",gap:12,alignItems:"center",padding:"14px 16px",borderRadius:18,background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",border:`1px solid ${e.color}18`,boxShadow:`0 6px 18px ${e.color}15`,filter:i>0?"blur(2px)":"none",opacity:i>0?.55:1}}>
            <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${e.color},${e.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13.5,fontWeight:700,color:"#3d1a0e"}}>{e.nombre}</div>
              <div style={{fontSize:11,color:"#8a6a5a"}}>{e.esp}</div>
              <div style={{fontSize:11,fontWeight:700,color:e.color,marginTop:2}}>★ {e.rating} · {e.avail}</div>
            </div>
          </div>
        ))}
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#3A8070,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(58,128,112,.45)",marginTop:8}}>
          {XP_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{XP_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0}}>
      {/* ── Booking confirmation toast ── */}
      {confirmed && (
        <div style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",zIndex:999,background:"linear-gradient(135deg,#0a3040,#3A8070)",padding:"12px 20px",borderRadius:16,boxShadow:"0 12px 32px rgba(58,128,112,.5)",color:"#fff",fontSize:12,fontWeight:700,whiteSpace:"nowrap",textAlign:"center"}}>
          <div style={{fontSize:13,marginBottom:2}}>{XP_T.bookingConfirmed}</div>
          <div style={{opacity:.8,fontWeight:500}}>{confirmed.exp.nombre} · {confirmed.day.label} a las {confirmed.slot}</div>
        </div>
      )}
      {/* ── Booking bottom sheet ── */}
      {bookingModal && (
        <div style={{position:"fixed",inset:0,zIndex:990,background:"rgba(0,0,0,.35)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setBookingModal(null)}>
          <div style={{background:"rgba(249,241,235,.97)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",borderRadius:"28px 28px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,.22)",padding:"0 0 34px",maxHeight:"78vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:"rgba(168,73,42,.2)",margin:"12px auto 16px"}}/>
            <div style={{display:"flex",gap:12,alignItems:"center",padding:"0 18px 16px",borderBottom:"1px solid rgba(168,73,42,.1)"}}>
              <div style={{width:46,height:46,borderRadius:14,background:`linear-gradient(135deg,${bookingModal.exp.color},${bookingModal.exp.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 5px 14px ${bookingModal.exp.color}40`,color:"#fff"}}>
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:800,color:"#3d1a0e"}}>{bookingModal.exp.nombre}</div>
                <div style={{fontSize:11.5,color:"#8a6a5a"}}>{bookingModal.exp.esp}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#3A8070",marginTop:2}}>{XP_T.firstFree}</div>
              </div>
            </div>
            <div style={{padding:"14px 18px 10px"}}>
              <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#8a6a5a",textTransform:"uppercase",marginBottom:10}}>{XP_T.chooseDay}</div>
              <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
                {getSlots(bookingModal.exp.id).map((d,i)=>(
                  <button key={i} onClick={()=>{setSelDay(i);setSelSlot(null);}}
                    style={{flexShrink:0,padding:"10px 14px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11.5,fontWeight:700,transition:"all .22s",
                      background:selDay===i?`linear-gradient(135deg,${bookingModal.exp.color},${bookingModal.exp.color}CC)`:"rgba(255,255,255,.7)",
                      color:selDay===i?"#fff":"#8a6a5a",
                      boxShadow:selDay===i?`0 6px 18px ${bookingModal.exp.color}40`:"0 2px 8px rgba(0,0,0,.06)"}}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{padding:"4px 18px 16px"}}>
              <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#8a6a5a",textTransform:"uppercase",marginBottom:10}}>{XP_T.availableTimes}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {getSlots(bookingModal.exp.id)[selDay].slots.map((s,i)=>(
                  <button key={i} onClick={()=>setSelSlot(s)}
                    style={{padding:"12px 0",borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,transition:"all .22s",
                      background:selSlot===s?`linear-gradient(135deg,${bookingModal.exp.color},${bookingModal.exp.color}CC)`:"rgba(255,255,255,.8)",
                      color:selSlot===s?"#fff":"#5a3a2a",
                      border:selSlot===s?"none":`1px solid ${bookingModal.exp.color}14`,
                      boxShadow:selSlot===s?`0 6px 18px ${bookingModal.exp.color}40`:"0 2px 8px rgba(0,0,0,.05)"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{padding:"0 18px"}}>
              <div style={{display:"flex",gap:10,marginBottom:6}}>
                <button onClick={()=>setBookingModal(null)}
                  style={{flex:1,padding:"14px",borderRadius:99,border:"1px solid rgba(168,73,42,.15)",cursor:"pointer",background:"rgba(255,255,255,.7)",backdropFilter:"blur(16px)",fontFamily:"inherit",fontSize:13,fontWeight:700,color:"#8a6a5a"}}>
                  {XP_T.cancel}
                </button>
                <button onClick={confirmBooking} disabled={!selSlot}
                  style={{flex:2,padding:"14px",borderRadius:99,border:"none",cursor:selSlot?"pointer":"not-allowed",fontFamily:"inherit",fontSize:13,fontWeight:800,transition:"all .25s",
                    background:selSlot?`linear-gradient(135deg,${bookingModal.exp.color},${bookingModal.exp.color}CC)`:"rgba(168,73,42,.15)",
                    color:selSlot?"#fff":"#b09080",
                    boxShadow:selSlot?`0 10px 28px ${bookingModal.exp.color}50`:"none"}}>
                  {selSlot?XP_T.confirmSlot(getSlots(bookingModal.exp.id)[selDay].label,selSlot):XP_T.chooseTime}
                </button>
              </div>
              <p style={{textAlign:"center",fontSize:11,color:"#a08070",marginTop:8}}>{XP_T.emailNote}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:6}}>
                <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="#3A8070" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l3 3"/></svg>
                <span style={{fontSize:10,color:"#3A8070",fontWeight:700}}>{XP_T.poweredBy}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#0a3040 0%,#3A8070 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{XP_T.badge}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,255,230,.8)",textTransform:"uppercase",marginBottom:7}}>{XP_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{XP_T.title}<br/>{XP_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(200,255,230,.72)",margin:0,lineHeight:1.5}}>{XP_T.availableSub(EXPERTOS_L.length)}</p>
        </div>
      </div>

      <div style={{padding:"16px 16px 100px"}}>
        {/* Category filter — 2-row wrap grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"16px 0 18px"}}>
          {EXP_CATS_L.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} className="tri-btn-ex" style={{
              padding:"10px 6px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",
              fontSize:11.5,fontWeight:700,
              background:cat===c.id?"linear-gradient(135deg,#3A8070,#C8952A)":"rgba(255,255,255,.75)",
              backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
              color:cat===c.id?"#fff":"#8a6a5a",
              boxShadow:cat===c.id?"0 6px 18px rgba(58,128,112,.4)":"0 2px 8px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.85)",
              border:cat===c.id?"none":"1px solid rgba(58,128,112,.1)"
            }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Expert cards — exercise style */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(e=>{
            const bk = booked.find(b=>b.id===e.id);
            return (
            <div key={e.id} style={{
              background:"rgba(255,255,255,.72)",backdropFilter:"blur(28px) saturate(170%)",WebkitBackdropFilter:"blur(28px) saturate(170%)",
              borderRadius:20,border:`1px solid ${e.color}18`,overflow:"hidden",
              boxShadow:`0 10px 28px -4px ${e.color}35, inset 0 1px 0 rgba(255,255,255,.95)`
            }}>
              <div style={{display:"flex",alignItems:"stretch"}}>
                <div style={{width:4,background:`linear-gradient(to bottom,${e.color},${e.color}66)`,flexShrink:0}}/>
                <div style={{flex:1,padding:"14px 14px 12px 12px"}}>
                  <div style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:8}}>
                    <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${e.color},${e.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 6px 16px ${e.color}45`}}>
                      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:1,flexWrap:"wrap"}}>
                        <span style={{fontSize:13.5,fontWeight:700,color:"#3d1a0e"}}>{e.nombre}</span>
                        {e.badge && <span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99,background:`${e.color}18`,border:`1px solid ${e.color}28`,color:e.color,flexShrink:0}}>{e.badge}</span>}
                      </div>
                      <div style={{fontSize:11,color:"#8a6a5a",marginBottom:4}}>{e.esp}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:11,fontWeight:700,color:e.color}}>★ {e.rating}</span>
                        <span style={{fontSize:10,color:"#a08070"}}>{e.reviews} {XP_T.reviews}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{margin:"0 0 10px",fontSize:12,color:"#7a5a45",lineHeight:1.55}}>{e.bio}</p>
                  <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:99,background:`${e.color}10`,border:`1px solid ${e.color}20`,flexShrink:0}}>
                      <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke={e.color} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span style={{fontSize:10.5,fontWeight:700,color:e.color}}>{e.avail}</span>
                    </div>
                    <button onClick={()=>openBooking(e)}
                      style={{padding:"9px 16px",borderRadius:99,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${e.color},${e.color}BB)`,color:"#fff",fontFamily:"inherit",fontSize:11.5,fontWeight:800,boxShadow:`0 6px 18px ${e.color}45`,transition:"transform .18s"}}
                      onPointerDown={ev=>ev.currentTarget.style.transform="scale(.95)"}
                      onPointerUp={ev=>ev.currentTarget.style.transform="scale(1)"}
                      onPointerLeave={ev=>ev.currentTarget.style.transform="scale(1)"}>
                      {XP_T.bookSession}
                    </button>
                  </div>
                </div>
              </div>
              {bk && (
                <div style={{background:`${e.color}0e`,borderTop:`1px solid ${e.color}18`,padding:"9px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:e.color}}>
                    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>
                    {bk.date} · {bk.slot}
                  </div>
                  <button onClick={()=>{const nb=booked.filter(b=>b.id!==e.id);setBooked(nb);LS.set("lume_bookings",nb);}}
                    style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:99,border:`1px solid ${e.color}25`,background:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"inherit",fontSize:10.5,fontWeight:700,color:"#a08070"}}>
                    <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                    {XP_T.cancel}
                  </button>
                </div>
              )}
            </div>
          );})}
        </div>

        <div style={{marginTop:18,padding:"12px 14px",borderRadius:16,background:"rgba(255,255,255,.55)",backdropFilter:"blur(20px)",border:"1px solid rgba(58,128,112,.13)",display:"flex",gap:10,alignItems:"flex-start",boxShadow:"0 4px 16px rgba(58,128,112,.08)"}}>
          <span style={{fontSize:13,flexShrink:0,color:"#3A8070"}}>✦</span>
          <p style={{margin:0,fontSize:11.5,color:"#3a5a4a",lineHeight:1.6}}>{XP_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ACCESO PAREJA
══════════════════════════════════════════════ */
function ParejaScreen({ goBack, goToTab }) {
  const hexRgbP = h => { const x=h.replace('#',''); return `${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)}`; };
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const [linked, setLinked] = React.useState(()=>LS.get("lume_pareja_linked")||false);
  const [partnerName, setPartnerName] = React.useState(()=>LS.get("lume_pareja_nombre")||"");
  const [inputName, setInputName] = React.useState("");
  const [showLink, setShowLink] = React.useState(false);
  const pjLang = getAppLang2();
  const code = React.useMemo(()=>{
    let c = LS.get("lume_pareja_code");
    if (!c) { c = Math.random().toString(36).substr(2,6).toUpperCase(); LS.set("lume_pareja_code", c); }
    return c;
  }, []);

  const BENEFITS = pjLang==="en" ? [
    { icon:"chat",     col:"#A8492A", t:"Real-time chat",   d:"Share moments and messages directly in the app." },
    { icon:"calendar", col:"#3A8070", t:"See appointments together", d:"Your partner sees upcoming medical appointments and gets reminders." },
    { icon:"diary",    col:"#8B5A9E", t:"Access to the diary",      d:"Share diary entries with whoever you want, whenever you want." },
    { icon:"photo",    col:"#B8872A", t:"Shared album",      d:"Photos and ultrasounds sync across both devices." },
    { icon:"leaf",     col:"#4A8040", t:"Pregnancy guide",     d:"Your partner also gets the weekly baby guide." },
  ] : [
    { icon:"chat",     col:"#A8492A", t:"Chat en tiempo real",   d:"Comparte momentos y mensajes directamente en la app." },
    { icon:"calendar", col:"#3A8070", t:"Ver citas juntos",      d:"Tu pareja ve las próximas citas médicas y recibe recordatorios." },
    { icon:"diary",    col:"#8B5A9E", t:"Acceso al diario",      d:"Comparte entradas del diario con quien quieras, cuando quieras." },
    { icon:"photo",    col:"#B8872A", t:"Álbum compartido",      d:"Las fotos y ultrasonidos se sincronizan en ambos dispositivos." },
    { icon:"leaf",     col:"#4A8040", t:"Guía del embarazo",     d:"Tu pareja también recibe la guía semanal del bebé." },
  ];
  const PJ_T = pjLang==="en" ? {
    badge:"✦ WELLNESS", eyebrow:"Wellness · Family", title:"Access for", titleBr:"your partner",
    subtitle:"Live it together, from the same place", heroTitle:"Pregnancy is a two-person journey",
    heroDesc:"Invite your partner to share this journey with you: appointments, photos, diary and weekly guide, together.",
    activateCta:"✦ Activate Wellness", noCard:"No card required · cancel anytime",
    linkedWith:(n)=>`Linked with ${n||"your partner"}`, inviteNow:"Invite your partner now",
    linkedTitle:"Linked ✓", hasAccess:(n)=>`${n||"Your partner"} has access to the app`, unlink:"Unlink partner",
    inviteHeader:"Invite your partner", inviteBody:"Share this code with your partner so they can download Lumé and link with you:",
    inviteCode:"Invitation code", validFor:"Valid for 48 hours", orScan:"or scan the QR",
    namePlaceholder:"Your partner's name (optional)", sendInvite:"Send invitation",
    whatTheySee:"What your partner can see",
  } : {
    badge:"✦ BIENESTAR", eyebrow:"Bienestar · Familia", title:"Acceso para", titleBr:"tu pareja",
    subtitle:"Vivirlo juntos, desde el mismo lugar", heroTitle:"El embarazo es de dos",
    heroDesc:"Invita a tu pareja para que viva este viaje contigo: citas, fotos, diario y guía semanal compartidos.",
    activateCta:"✦ Activar Bienestar", noCard:"Sin tarjeta · cancela cuando quieras",
    linkedWith:(n)=>`Vinculado con ${n||"tu pareja"}`, inviteNow:"Invita a tu pareja ahora",
    linkedTitle:"Vinculados ✓", hasAccess:(n)=>`${n||"Tu pareja"} tiene acceso al app`, unlink:"Desvincular pareja",
    inviteHeader:"Invitar a tu pareja", inviteBody:"Comparte este código con tu pareja para que descargue Lumé y se vincule contigo:",
    inviteCode:"Código de invitación", validFor:"Válido 48 horas", orScan:"o escanea el QR",
    namePlaceholder:"Nombre de tu pareja (opcional)", sendInvite:"Enviar invitación",
    whatTheySee:"Qué puede ver tu pareja",
  };

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0}}>
      <div style={{position:"relative",background:"linear-gradient(155deg,#3d1a0e 0%,#A8492A 55%,#E4BC7E 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,160,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{PJ_T.badge}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,170,.8)",textTransform:"uppercase",marginBottom:7}}>{PJ_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{PJ_T.title}<br/>{PJ_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(255,224,170,.72)",margin:0,lineHeight:1.5}}>{PJ_T.subtitle}</p>
        </div>
      </div>
      <div style={{padding:"22px 16px 100px"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#A8492A,#E4BC7E)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 10px 28px rgba(168,73,42,.4)",color:"#fff"}}>
            <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#3d1a0e",margin:"0 0 6px"}}>{PJ_T.heroTitle}</h3>
          <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:0}}>{PJ_T.heroDesc}</p>
        </div>
        {BENEFITS.map((b,i)=>(
          <div key={i} className="benefit-card" style={{"--ben-col-rgb":hexRgbP(b.col),display:"flex",alignItems:"stretch",marginBottom:10,borderRadius:20,overflow:"hidden",background:"rgba(255,255,255,.75)",backdropFilter:"blur(24px) saturate(170%)",WebkitBackdropFilter:"blur(24px) saturate(170%)",border:`1px solid ${b.col}22`,boxShadow:`0 8px 24px -4px ${b.col}30, inset 0 1px 0 rgba(255,255,255,.95)`}}>
            <div className="benefit-strip" style={{width:4,background:`linear-gradient(to bottom,${b.col},${b.col}66)`,flexShrink:0}}/>
            <div style={{display:"flex",gap:13,alignItems:"center",padding:"14px 16px",flex:1}}>
              <div className="benefit-icon" style={{width:44,height:44,borderRadius:13,background:`linear-gradient(135deg,${b.col},${b.col}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 6px 16px ${b.col}45`,color:"#fff"}}><AppIcon name={b.icon} size={20}/></div>
              <div><div className="benefit-title" style={{fontSize:14,fontWeight:700,color:"#3d1a0e",marginBottom:3}}>{b.t}</div><div style={{fontSize:12,color:"#8a6a5a",lineHeight:1.5}}>{b.d}</div></div>
            </div>
          </div>
        ))}
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#A8492A,#E4BC7E)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(168,73,42,.45)",marginTop:8}}>
          {PJ_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"#a08070",marginTop:10}}>{PJ_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0}}>
      {/* Hero */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#3d1a0e 0%,#A8492A 55%,#E4BC7E 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,160,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{PJ_T.badge}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(255,224,170,.8)",textTransform:"uppercase",marginBottom:7}}>{PJ_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{PJ_T.title}<br/>{PJ_T.titleBr}</h2>
          <p style={{fontSize:12,color:"rgba(255,224,170,.72)",margin:0,lineHeight:1.5}}>{linked?PJ_T.linkedWith(partnerName):PJ_T.inviteNow}</p>
        </div>
      </div>

      <div style={{padding:"16px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
        {linked ? (
          /* Linked state */
          <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px) saturate(170%)",WebkitBackdropFilter:"blur(28px) saturate(170%)",borderRadius:22,border:"1.5px solid rgba(168,73,42,.2)",boxShadow:"0 10px 32px rgba(168,73,42,.15), inset 0 1px 0 rgba(255,255,255,.95)",overflow:"hidden",textAlign:"center"}}>
            <div style={{background:"linear-gradient(135deg,rgba(168,73,42,.06),rgba(228,188,126,.1))",padding:"24px 18px 18px",borderBottom:"1px solid rgba(168,73,42,.1)"}}>
              <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#A8492A,#E4BC7E)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 8px 22px rgba(168,73,42,.4)",color:"#fff"}}>
                <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#3d1a0e",marginBottom:4}}>{PJ_T.linkedTitle}</div>
              <div style={{fontSize:13,color:"#8a6a5a"}}>{PJ_T.hasAccess(partnerName)}</div>
            </div>
            <div style={{padding:"16px 18px"}}>
              <button onClick={()=>{setLinked(false);LS.set("lume_pareja_linked",false);}} style={{padding:"10px 22px",borderRadius:99,border:"1px solid rgba(168,73,42,.2)",cursor:"pointer",background:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:12,fontWeight:700,color:"#a08070"}}>
                {PJ_T.unlink}
              </button>
            </div>
          </div>
        ) : (
          /* Invite card */
          <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px)",borderRadius:22,border:"1.5px solid rgba(168,73,42,.2)",boxShadow:"0 10px 32px rgba(168,73,42,.15), inset 0 1px 0 rgba(255,255,255,.95)",overflow:"hidden"}}>
            <div style={{padding:"14px 16px 10px",borderBottom:"1px solid rgba(168,73,42,.1)",display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:28,height:28,borderRadius:9,background:"linear-gradient(135deg,#A8492A,#E4BC7E)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(168,73,42,.45)"}}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <span style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#A8492A",textTransform:"uppercase"}}>{PJ_T.inviteHeader}</span>
            </div>
            <div style={{padding:"16px"}}>
              <p style={{margin:"0 0 14px",fontSize:13,color:"#7a5a45",lineHeight:1.6}}>{PJ_T.inviteBody}</p>
              {/* Code display */}
              <div style={{textAlign:"center",padding:"18px",borderRadius:16,background:"linear-gradient(135deg,rgba(168,73,42,.06),rgba(228,188,126,.12))",border:"1.5px dashed rgba(168,73,42,.3)",marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",color:"#a08070",textTransform:"uppercase",marginBottom:6}}>{PJ_T.inviteCode}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:"#A8492A",letterSpacing:"6px"}}>{code}</div>
                <div style={{fontSize:11,color:"#a08070",marginTop:4}}>{PJ_T.validFor}</div>
              </div>
              {/* Fake QR */}
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{width:100,height:100,margin:"0 auto",borderRadius:12,background:"#fff",border:"1.5px solid rgba(168,73,42,.15)",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:8,boxShadow:"0 4px 14px rgba(168,73,42,.1)"}}>
                  {Array.from({length:49},(_,i)=>{
                    const corners=[0,1,2,3,4,5,6,7,13,14,20,21,27,28,29,30,31,34,35,41,42,43,44,45,46,47,48];
                    return <div key={i} style={{borderRadius:1,background:corners.includes(i)||Math.random()>.5?"#A8492A":"transparent"}}/>;
                  })}
                </div>
                <div style={{fontSize:10.5,color:"#a08070",marginTop:6}}>{PJ_T.orScan}</div>
              </div>
              {/* Partner name input */}
              <input value={inputName} onChange={e=>setInputName(e.target.value)} placeholder={PJ_T.namePlaceholder}
                style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1.5px solid rgba(168,73,42,.18)",background:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:13,color:"#3d1a0e",outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
              <button onClick={()=>{
                  const n = inputName.trim();
                  setLinked(true); setPartnerName(n);
                  LS.set("lume_pareja_linked", true); LS.set("lume_pareja_nombre", n);
                }}
                style={{width:"100%",padding:"14px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#A8492A,#E4BC7E)",color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,boxShadow:"0 10px 28px rgba(168,73,42,.45)"}}>
                {PJ_T.sendInvite}
              </button>
            </div>
          </div>
        )}

        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#8a6a5a",textTransform:"uppercase",marginBottom:10,padding:"0 2px"}}>{PJ_T.whatTheySee}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {BENEFITS.map((b,i)=>(
              <div key={i} className="benefit-card" style={{"--ben-col-rgb":hexRgbP(b.col),display:"flex",alignItems:"stretch",borderRadius:20,overflow:"hidden",background:"rgba(255,255,255,.75)",backdropFilter:"blur(24px) saturate(170%)",WebkitBackdropFilter:"blur(24px) saturate(170%)",border:`1px solid ${b.col}22`,boxShadow:`0 8px 24px -4px ${b.col}30, inset 0 1px 0 rgba(255,255,255,.95)`}}>
                <div className="benefit-strip" style={{width:4,background:`linear-gradient(to bottom,${b.col},${b.col}66)`,flexShrink:0}}/>
                <div style={{display:"flex",gap:13,alignItems:"center",padding:"14px 16px",flex:1}}>
                  <div className="benefit-icon" style={{width:44,height:44,borderRadius:13,background:`linear-gradient(135deg,${b.col},${b.col}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 6px 16px ${b.col}45`,color:"#fff"}}><AppIcon name={b.icon} size={20}/></div>
                  <div><div className="benefit-title" style={{fontSize:13.5,fontWeight:700,color:"#3d1a0e",marginBottom:2}}>{b.t}</div><div style={{fontSize:11.5,color:"#8a6a5a",lineHeight:1.5}}>{b.d}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CitasScreen, SintomasScreen, RecompensasScreen, UltrasonidosScreen, PesoScreen, AjustesScreen, KickTrackerScreen, FotosScreen, MeditacionesScreen, EjerciciosScreen, ContenidoSemanalScreen, DiarioScreen, ExpertosScreen, ParejaScreen });

/* ══════════════════════════════════════════════
   HISTORIAL MÉDICO EXPORTABLE
══════════════════════════════════════════════ */
function HistorialScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const hLang = getAppLang2();
  const HT = hLang==="en" ? {
    healthLog:"Health · Log", medHistory:"Medical", history:"history", allInOne:"Your whole pregnancy in one document",
    apptsLbl:"Citas médicas", apptsEn:"Medical appointments", weightLbl:"Control de peso", weightEn:"Weight tracking",
    sxLbl:"Síntomas registrados", sxEn:"Logged symptoms", ultrasLbl:"Ultrasonidos", ultrasEn:"Ultrasounds",
    kicksLbl:"Registro de patadas", kicksEn:"Kick logs", noDetail:"No detail", week:"Wk.",
    proBadge:"✦ PROFESSIONAL", topEyebrow:"Health · Log", dueEst:(d)=>`Estimated due date: ${d} · `, exportablePdf:"Exportable as PDF",
    unlockTitle:"Appointments · Weight · Symptoms · Ultrasounds", unlockBody:"Your complete pregnancy history, exportable as a PDF to share with your doctor.", activatePro:"✦ Activate Professional",
    stats:["Appointments","Weight logs","Symptoms","Ultrasounds","Kick sessions","Weeks"],
    record:"record", records:"records", noRecords:"No records yet",
    exporting:"Preparing PDF...", exportBtn:"Export history as PDF", printNote:"The system print dialog will open",
  } : {
    healthLog:"Salud · Registro", medHistory:"Historial", history:"médico", allInOne:"Todo tu embarazo en un solo documento",
    apptsLbl:"Citas médicas", apptsEn:"Citas médicas", weightLbl:"Control de peso", weightEn:"Control de peso",
    sxLbl:"Síntomas registrados", sxEn:"Síntomas registrados", ultrasLbl:"Ultrasonidos", ultrasEn:"Ultrasonidos",
    kicksLbl:"Registro de patadas", kicksEn:"Registro de patadas", noDetail:"Sin detalle", week:"Sem.",
    proBadge:"✦ PROFESIONAL", topEyebrow:"Salud · Registro", dueEst:(d)=>`Parto estimado: ${d} · `, exportablePdf:"Exportable como PDF",
    unlockTitle:"Citas · Peso · Síntomas · Ultrasonidos", unlockBody:"Tu historial completo del embarazo, exportable como PDF para compartir con tu médico.", activatePro:"✦ Activar Profesional",
    stats:["Citas","Registros peso","Síntomas","Ultrasonidos","Ses. patadas","Semanas"],
    record:"registro", records:"registros", noRecords:"Sin registros aún",
    exporting:"Preparando PDF...", exportBtn:"Exportar historial como PDF", printNote:"Se abrirá el diálogo de impresión del sistema",
  };
  const weeks   = parseInt(localStorage.getItem("lume_weeks")||15);
  const nombre  = localStorage.getItem("lume_nombre")||"Sofía";
  const due     = localStorage.getItem("lume_due")||"";
  const appts   = React.useMemo(()=>{try{return JSON.parse(localStorage.getItem("lume_appts")||"[]");}catch{return [];}}, []);
  const weights = React.useMemo(()=>{try{return JSON.parse(localStorage.getItem("lume_weight")||"[]");}catch{return [];}}, []);
  const sxHist  = React.useMemo(()=>{try{return JSON.parse(localStorage.getItem("lume_sx_hist")||"[]");}catch{return [];}}, []);
  const ultras  = React.useMemo(()=>{try{return JSON.parse(localStorage.getItem("lume_ultrasounds")||"[]");}catch{return [];}}, []);
  const kicks   = React.useMemo(()=>{try{return JSON.parse(localStorage.getItem("lume_kicks")||"[]");}catch{return [];}}, []);
  const [printed, setPrinted] = React.useState(false);

  const exportar = () => {
    setPrinted(true);
    setTimeout(()=>{ window.print(); setPrinted(false); }, 300);
  };

  const SECTIONS = [
    { key:"appts",   color:"#A8492A", icon:<svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label:hLang==="en"?"Medical appointments":"Citas médicas", count:appts.length,
      rows: appts.slice(0,5).map(a=>({ main:`${a.title}`, sub:`${a.date} ${a.time||""}`, note:a.notes||"" })) },
    { key:"weight",  color:"#3A8070", icon:<svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M9 8a3 3 0 016 0"/></svg>, label:hLang==="en"?"Weight tracking":"Control de peso", count:weights.length,
      rows: weights.slice(-5).reverse().map(w=>({ main:`${w.weight} kg`, sub:`${HT.week} ${w.week}`, note:w.note||"" })) },
    { key:"sx",      color:"#8B5A9E", icon:<svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>, label:hLang==="en"?"Logged symptoms":"Síntomas registrados", count:sxHist.length,
      rows: sxHist.slice(0,5).map(s=>({ main:(s.symptoms||[]).join(", ")||HT.noDetail, sub:`${HT.week} ${s.week||"?"} · ${s.sev||""}`, note:s.notes||"" })) },
    { key:"ultras",  color:"#B8872A", icon:<svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 12s1-3 4-3 4 3 4 3-1 3-4 3-4-3-4-3z"/></svg>, label:hLang==="en"?"Ultrasounds":"Ultrasonidos", count:ultras.length,
      rows: ultras.slice(0,5).map(u=>({ main:`${hLang==="en"?"Ultrasound week":"Ecografía semana"} ${u.semana||"?"}`, sub:u.fecha||"", note:u.notas||"" })) },
    { key:"kicks",   color:"#4A6A9E", icon:<svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, label:hLang==="en"?"Kick logs":"Registro de patadas", count:kicks.length,
      rows: kicks.slice(-5).reverse().map(k=>({ main:`${k.count||0} ${hLang==="en"?"movements":"movimientos"}`, sub:k.duration?`${Math.round(k.duration/60)} min`:"", note:k.date||"" })) },
  ];

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0}}>
      <div style={{position:"relative",background:"linear-gradient(155deg,#1a0a30 0%,#4A6A9E 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{HT.proBadge}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,220,255,.8)",textTransform:"uppercase",marginBottom:7}}>{HT.healthLog}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{HT.medHistory}<br/>{HT.history}</h2>
          <p style={{fontSize:12,color:"rgba(200,220,255,.72)",margin:0,lineHeight:1.5}}>{HT.allInOne}</p>
        </div>
      </div>
      <div style={{padding:"22px 16px 100px",textAlign:"center"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#3d1a0e",marginBottom:8}}>{HT.unlockTitle}</div>
        <p style={{fontSize:13,color:"#8a6a5a",lineHeight:1.6,margin:"0 0 22px"}}>{HT.unlockBody}</p>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#4A6A9E,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(74,106,158,.45)"}}>
          {HT.activatePro}
        </button>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0}}>
      {/* Hero */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#1a0a30 0%,#4A6A9E 55%,#C8952A 100%)",padding:"100px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,220,180,.1)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:54,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:58,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{HT.proBadge}</div>
        <div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,220,255,.8)",textTransform:"uppercase",marginBottom:7}}>{nombre} · {HT.week} {weeks}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{HT.medHistory}<br/>{HT.history}</h2>
          <p style={{fontSize:12,color:"rgba(200,220,255,.72)",margin:0,lineHeight:1.5}}>{due?HT.dueEst(due):""}{HT.exportablePdf}</p>
        </div>
      </div>

      <div style={{padding:"16px 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
        {/* Resumen */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{n:appts.length,l:HT.stats[0],c:"#A8492A"},{n:weights.length,l:HT.stats[1],c:"#3A8070"},{n:sxHist.length,l:HT.stats[2],c:"#8B5A9E"},{n:ultras.length,l:HT.stats[3],c:"#B8872A"},{n:kicks.length,l:HT.stats[4],c:"#4A6A9E"},{n:weeks,l:HT.stats[5],c:"#C8952A"}].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.75)",backdropFilter:"blur(20px)",borderRadius:16,padding:"12px 10px",textAlign:"center",border:`1px solid ${s.c}18`,boxShadow:`0 4px 14px ${s.c}18`}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
              <div style={{fontSize:9.5,fontWeight:700,color:"#a08070",marginTop:3,lineHeight:1.3}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Sections — exercise card style */}
        {SECTIONS.map(s=>{
          const rgb = (h=>{const x=h.replace('#','');return `${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)}`;})(s.color);
          return (
          <div key={s.key} className="hist-card" style={{"--hist-col-rgb":rgb,
            background:"rgba(255,255,255,.75)",backdropFilter:"blur(28px) saturate(170%)",WebkitBackdropFilter:"blur(28px) saturate(170%)",
            borderRadius:20,border:`1px solid ${s.color}22`,overflow:"hidden",
            boxShadow:`0 10px 28px -4px ${s.color}30, inset 0 1px 0 rgba(255,255,255,.95)`}}>
            <div style={{display:"flex",alignItems:"stretch"}}>
              <div className="hist-strip" style={{width:4,background:`linear-gradient(to bottom,${s.color},${s.color}66)`,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",borderBottom:`1px solid ${s.color}12`}}>
                  <div style={{width:34,height:34,borderRadius:11,background:`linear-gradient(135deg,${s.color},${s.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 5px 14px ${s.color}45`}}>{s.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:800,color:"#3d1a0e"}}>{s.label}</div>
                    <div style={{fontSize:10.5,color:"#a08070",marginTop:1}}>{s.count} {s.count===1?HT.record:HT.records}</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:800,padding:"3px 10px",borderRadius:99,background:`${s.color}14`,border:`1px solid ${s.color}22`,color:s.color}}>{s.count}</div>
                </div>
                {s.rows.length===0 ? (
                  <div style={{padding:"12px 14px",fontSize:12,color:"#b09080",fontStyle:"italic"}}>{HT.noRecords}</div>
                ) : (
                  <div style={{padding:"4px 0 2px"}}>
                    {s.rows.map((r,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"9px 14px",borderBottom:i<s.rows.length-1?`1px solid ${s.color}08`:"none",background:i%2===0?"transparent":`${s.color}04`}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:s.color,marginTop:5,flexShrink:0,boxShadow:`0 2px 6px ${s.color}40`}}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#3d1a0e",lineHeight:1.35}}>{r.main}</div>
                          <div style={{fontSize:11,color:"#a08070",marginTop:1}}>{r.sub}{r.note?` · ${r.note}`:""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })}

        {/* Export button */}
        <button onClick={exportar}
          style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:printed?"rgba(74,106,158,.3)":"linear-gradient(135deg,#4A6A9E,#C8952A)",fontFamily:"inherit",fontSize:14,fontWeight:800,color:"#fff",boxShadow:printed?"none":"0 12px 32px rgba(74,106,158,.45)",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          {printed?HT.exporting:HT.exportBtn}
        </button>
        <p style={{textAlign:"center",fontSize:11,color:"#a08070",marginTop:-4}}>{HT.printNote}</p>
      </div>
    </div>
  );
}

Object.assign(window, { CitasScreen, SintomasScreen, RecompensasScreen, UltrasonidosScreen, PesoScreen, AjustesScreen, KickTrackerScreen, FotosScreen, MeditacionesScreen, EjerciciosScreen, ContenidoSemanalScreen, DiarioScreen, ExpertosScreen, ParejaScreen, HistorialScreen });

/* ══════════════════════════════════════════════
   NUTRICIÓN PERSONALIZADA (Plan a medida con IA)
══════════════════════════════════════════════ */
function NutricionPersonalizadaScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const nombre = localStorage.getItem("lume_nombre") || "Sofía";
  const npLang = getAppLang2();
  const NP_T = npLang==="en" ? {
    badge:"✦ WELLNESS", eyebrow:"Nutrition · AI", title:"Tailored nutrition", titleBr:"plan", sub:"AI-generated · adapted to you every day",
    gateDesc:"Your personalized meal plan based on your week, trimester and current symptoms. AI-generated whenever you need it.",
    gateBullets:["Adapted to your trimester and symptoms","Pregnancy-specific recipes","Updatable in real time"],
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card required · cancel anytime",
    week:"Week", adaptedFor:(s)=>`Adapted for: ${s}`, adaptedTo:(t)=>`Adapted to your ${t.toLowerCase()}`,
    aiContext:"AI Context", wk:"Wk.", noSymptoms:"No symptoms · edit", pregnancyWeek:"Pregnancy week",
    activeSymptoms:"Active symptoms", saveContext:"Save context", contextUpdated:"Context updated",
    generatePrompt:(w,s)=>`Generate your meal plan for today, tailored to week ${w}${s?` with ${s}`:""}.`,
    generateBtn:"Generate my plan for today", generating:"Generating your plan...",
    adapting:(w,s)=>`Adapting recipes to week ${w}${s?" and your symptoms":""}`,
    planToday:"Your plan for today", regenerate:"Regenerate plan",
    disclaimer:"This plan is a guide. Always check with your doctor or nutritionist for specific adjustments.",
    triLabels:["First trimester","Second trimester","Third trimester"],
    sxOptions:["Nausea","Heartburn","Fatigue","Bloating","Constipation","Insomnia","Back pain","Dizziness","Cravings"],
    connError:"Couldn't connect", connErrorSub:"Check your connection and try again",
  } : {
    badge:"✦ BIENESTAR", eyebrow:"Nutrición · IA", title:"Plan nutricional", titleBr:"a medida", sub:"Generado por IA · adaptado a ti cada día",
    gateDesc:"Tu plan de comidas personalizado según tu semana, trimestre y síntomas activos. Generado por IA cada vez que lo necesites.",
    gateBullets:["Adaptado a tu trimestre y síntomas","Recetas específicas para embarazo","Actualizable en tiempo real"],
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    week:"Semana", adaptedFor:(s)=>`Adaptado para: ${s}`, adaptedTo:(t)=>`Adaptado a tu ${t.toLowerCase()}`,
    aiContext:"Contexto IA", wk:"Sem.", noSymptoms:"Sin síntomas · editar", pregnancyWeek:"Semana de embarazo",
    activeSymptoms:"Síntomas activos", saveContext:"Guardar contexto", contextUpdated:"Contexto actualizado",
    generatePrompt:(w,s)=>`Genera tu plan de comidas para hoy, pensado para la semana ${w}${s?` con ${s}`:""}.`,
    generateBtn:"Generar mi plan de hoy", generating:"Generando tu plan...",
    adapting:(w,s)=>`Adaptando recetas a la semana ${w}${s?" y tus síntomas":""}`,
    planToday:"Tu plan para hoy", regenerate:"Regenerar plan",
    disclaimer:"El plan es orientativo. Consulta siempre con tu médico o nutricionista para ajustes específicos.",
    triLabels:["Primer trimestre","Segundo trimestre","Tercer trimestre"],
    sxOptions:["Náuseas","Acidez","Cansancio","Hinchazón","Estreñimiento","Insomnio","Dolor de espalda","Mareos","Antojos"],
    connError:"No se pudo conectar", connErrorSub:"Verifica tu conexión e inténtalo de nuevo",
  };

  /* ── Contexto editable ── */
  const [editWeeks, setEditWeeks] = React.useState(() => parseInt(localStorage.getItem("lume_weeks")||"15")||15);
  const [selSx, setSelSx] = React.useState(() => {
    try {
      const h = JSON.parse(localStorage.getItem("lume_sx_hist")||"[]");
      return [...new Set(h.slice(0,5).flatMap(e=>e.symptoms||[]))].slice(0,4);
    } catch { return []; }
  });
  const [ctxOpen, setCtxOpen] = React.useState(false);
  const [ctxSaved, setCtxSaved] = React.useState(false);
  const tri = editWeeks<=13?1:editWeeks<=26?2:3;
  const triLabel = NP_T.triLabels[tri-1];
  const SX_OPTIONS = NP_T.sxOptions;
  const toggleSx = (s) => setSelSx(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s].slice(0,4));
  const pct = Math.round(((editWeeks-4)/38)*100);

  const saveCtx = () => {
    localStorage.setItem("lume_weeks", String(editWeeks));
    setCtxSaved(true);
    setTimeout(()=>{ setCtxSaved(false); setCtxOpen(false); }, 1400);
  };

  /* ── Plan IA ── */
  const [plan, setPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loggedMeals, setLoggedMeals] = React.useState([]);
  const LABEL_COLORS = npLang==="en"
    ? {BREAKFAST:"#C8952A",LUNCH:"#3A8070",DINNER:"#8B5A9E",SNACK:"#A8492A","AFTERNOON SNACK":"#4A6A9E"}
    : {DESAYUNO:"#C8952A",ALMUERZO:"#3A8070",CENA:"#8B5A9E",SNACK:"#A8492A",MERIENDA:"#4A6A9E"};
  const KCAL_MAP = npLang==="en"
    ? {BREAKFAST:320,LUNCH:480,"AFTERNOON SNACK":180,DINNER:400,SNACK:150}
    : {DESAYUNO:320,ALMUERZO:480,MERIENDA:180,CENA:400,SNACK:150};

  const generar = async () => {
    setLoading(true); setPlan(null); setLoggedMeals([]);
    const sxText = npLang==="en"
      ? (selSx.length>0 ? `Current symptoms: ${selSx.join(", ")}.` : "No symptoms logged.")
      : (selSx.length>0 ? `Síntomas actuales: ${selSx.join(", ")}.` : "Sin síntomas registrados.");
    try {
      const prompt = npLang==="en" ? `You are an expert prenatal nutritionist. Generate a meal plan for the day in this EXACT format (no markdown, no asterisks, no dashes):

BREAKFAST: [dish name] | [benefit in 6-8 words]
LUNCH: [dish name] | [benefit in 6-8 words]
AFTERNOON SNACK: [dish name] | [benefit in 6-8 words]
DINNER: [dish name] | [benefit in 6-8 words]
SNACK: [dish name] | [benefit in 6-8 words]

Dish names: max 6 words. Benefits: max 8 words. Only the plan, nothing else.

I'm ${nombre}, week ${editWeeks} of pregnancy, ${triLabel}. ${sxText} Generate my personalized plan for today.` : `Eres nutricionista prenatal experta. Genera un plan de comidas para el día en este formato EXACTO (sin markdown, sin asteriscos, sin guiones):

DESAYUNO: [nombre del plato] | [beneficio en 6-8 palabras]
ALMUERZO: [nombre del plato] | [beneficio en 6-8 palabras]
MERIENDA: [nombre del plato] | [beneficio en 6-8 palabras]
CENA: [nombre del plato] | [beneficio en 6-8 palabras]
SNACK: [nombre del plato] | [beneficio en 6-8 palabras]

Nombres de platos: máximo 6 palabras. Beneficios: máximo 8 palabras. Solo el plan, nada más.

Soy ${nombre}, semana ${editWeeks} de embarazo, ${triLabel}. ${sxText} Genera mi plan personalizado de hoy.`;
      const resp = await lumeAI(prompt);
      const lines = resp.split("\n").filter(l=>l.trim()&&l.includes(":"));
      const parsed = lines.map(l=>{
        const [part,why=""] = l.split("|").map(x=>x.trim());
        const ci = part.indexOf(":");
        const label = part.slice(0,ci).trim().toUpperCase();
        const name  = part.slice(ci+1).trim();
        const col   = LABEL_COLORS[label]||"#A8492A";
        const kcal  = KCAL_MAP[label]||300;
        return {label,name,why,col,kcal};
      }).filter(x=>x.name&&x.label);
      setPlan(parsed);
    } catch(e) {
      setPlan([{label:"ERROR",name:NP_T.connError,why:NP_T.connErrorSub,col:"#a08070",kcal:0}]);
    }
    setLoading(false);
  };

  const logMeal = (p) => {
    setLoggedMeals(l=>[...l,p.label]);
    try {
      const today = new Date().toLocaleDateString(npLang==="en"?"en-US":"es-ES",{day:"numeric",month:"short"});
      const log = JSON.parse(localStorage.getItem("lume_nutri_log")||"[]");
      log.unshift({id:Date.now(),name:p.name,tag:"nutriente",label:p.label,kcal:p.kcal,date:today});
      localStorage.setItem("lume_nutri_log",JSON.stringify(log.slice(0,30)));
      const pts=(parseInt(localStorage.getItem("lume_points")||"126")||126)+3;
      localStorage.setItem("lume_points",pts);
    } catch{}
  };

  const glassCard = {
    background:"linear-gradient(160deg,rgba(255,255,255,.85),rgba(255,255,255,.58) 100%)",
    backdropFilter:"blur(28px) saturate(170%)", WebkitBackdropFilter:"blur(28px) saturate(170%)",
    border:"1px solid rgba(255,255,255,.88)",
    boxShadow:"0 16px 44px -12px rgba(58,128,112,.22), 0 2px 0 rgba(255,255,255,.95) inset",
  };
  const glassGreen = {
    background:"linear-gradient(160deg,rgba(255,255,255,.82),rgba(255,255,255,.55) 100%)",
    backdropFilter:"blur(24px) saturate(165%)", WebkitBackdropFilter:"blur(24px) saturate(165%)",
    border:"1px solid rgba(58,128,112,.22)",
    boxShadow:"0 12px 36px -10px rgba(58,128,112,.28), 0 1px 0 rgba(255,255,255,.92) inset",
  };

  /* ── Gate: no premium ── */
  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#f9f1eb,#f0e2d6 45%,#e8d5c6 100%)",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",background:"linear-gradient(155deg,#1a3a20 0%,#3A8070 55%,#C8952A 100%)",padding:"96px 20px 32px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,220,160,.08)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:56,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{NP_T.badge}</div>
        <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,255,220,.8)",textTransform:"uppercase",marginBottom:7}}>{NP_T.eyebrow}</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 7px",lineHeight:1.1}}>{NP_T.title}<br/>{NP_T.titleBr}</h2>
        <p style={{fontSize:12,color:"rgba(200,255,220,.72)",margin:0,lineHeight:1.5}}>{NP_T.sub}</p>
      </div>
      <div style={{padding:"24px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{...glassCard,borderRadius:22,padding:"20px 18px"}}>
          <div style={{fontSize:13,color:"#5a3a2a",lineHeight:1.7,marginBottom:16}}>{NP_T.gateDesc}</div>
          {NP_T.gateBullets.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<2?10:0}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(58,128,112,.12)",border:"1px solid rgba(58,128,112,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="#3A8070" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>
              </div>
              <span style={{fontSize:13,color:"#5a3a2a",fontWeight:500}}>{b}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#3A8070,#C8952A)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(58,128,112,.45)"}}>
          {NP_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"#a08070",margin:0}}>{NP_T.noCard}</p>
      </div>
    </div>
  );

  /* ── Pantalla principal ── */
  return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#f9f1eb,#f0e2d6 45%,#e8d5c6 100%)",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes spinGreen{to{transform:rotate(360deg)}}
        .ctx-g-row:hover{background:rgba(58,128,112,.05)!important;}
        .wk-g-btn{transition:all .12s ease;}
        .wk-g-btn:hover{background:rgba(58,128,112,.2)!important;transform:scale(1.08);}
        .wk-g-btn:active{transform:scale(.94);}
        .sxg-btn{transition:all .17s cubic-bezier(.23,1,.32,1);}
        .sxg-btn:hover{filter:brightness(1.06);transform:translateY(-1px);}
        .plan-card{transition:all .3s cubic-bezier(.23,1,.32,1);}
        .plan-card:hover{transform:translateY(-2px);}
        .log-btn{transition:all .2s cubic-bezier(.23,1,.32,1);}
        .log-btn:hover{transform:scale(1.1);}
      `}</style>

      {/* ── Hero ── */}
      <div style={{position:"relative",background:"linear-gradient(155deg,#1a3a20 0%,#3A8070 55%,#C8952A 100%)",padding:"96px 20px 28px",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,220,160,.08)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-30,width:160,height:160,borderRadius:"50%",background:"rgba(58,128,112,.15)",pointerEvents:"none"}}/>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:56,right:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.28)",padding:"4px 11px",borderRadius:99,fontSize:10,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{NP_T.badge}</div>
        <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(200,255,220,.8)",textTransform:"uppercase",marginBottom:6}}>{nombre} · {NP_T.week} {editWeeks} · T{tri}</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:"#fff",margin:"0 0 6px",lineHeight:1.1}}>{NP_T.title}<br/>{NP_T.titleBr}</h2>
        <p style={{fontSize:12,color:"rgba(200,255,220,.7)",margin:0,lineHeight:1.5}}>{selSx.length>0?NP_T.adaptedFor(selSx.slice(0,3).join(" · ")):NP_T.adaptedTo(triLabel)}</p>
      </div>

      <div style={{padding:"14px 14px 100px",display:"flex",flexDirection:"column",gap:12}}>

        {/* ── CONTEXTO EDITABLE ── */}
        <div style={{...glassGreen,borderRadius:22,overflow:"hidden"}}>
          <button className="ctx-g-row" onClick={()=>setCtxOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:"rgba(58,128,112,.15)",border:"1px solid rgba(58,128,112,.25)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(58,128,112,.18)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A8070" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/></svg>
            </div>
            <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:800,letterSpacing:".13em",textTransform:"uppercase",color:"#3A8070",opacity:.75,marginRight:2}}>{NP_T.aiContext}</span>
              <span style={{fontSize:11.5,fontWeight:700,color:"#2a5a45",background:"rgba(58,128,112,.12)",border:"1px solid rgba(58,128,112,.22)",borderRadius:20,padding:"2px 10px"}}>{NP_T.wk} {editWeeks}</span>
              <span style={{fontSize:11.5,fontWeight:700,color:"#2a5a45",background:"rgba(58,128,112,.12)",border:"1px solid rgba(58,128,112,.22)",borderRadius:20,padding:"2px 10px"}}>T{tri}</span>
              {selSx.length>0 ? selSx.slice(0,3).map(s=>(
                <span key={s} style={{fontSize:11,fontWeight:600,color:"#4a7060",background:"rgba(58,128,112,.08)",border:"1px solid rgba(58,128,112,.16)",borderRadius:20,padding:"2px 9px"}}>{s}</span>
              )) : <span style={{fontSize:11,color:"#90a898",fontStyle:"italic"}}>{NP_T.noSymptoms}</span>}
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3A8070" strokeWidth="2.2" strokeLinecap="round" style={{flexShrink:0,opacity:.55,transition:"transform .28s cubic-bezier(.23,1,.32,1)",transform:ctxOpen?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {ctxOpen && (
            <div style={{borderTop:"1px solid rgba(58,128,112,.18)",padding:"16px 16px 18px",animation:"ctxReveal .24s cubic-bezier(.23,1,.32,1) forwards"}}>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#3A8070",opacity:.75,marginBottom:10}}>{NP_T.pregnancyWeek}</div>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <button className="wk-g-btn" onClick={()=>setEditWeeks(w=>Math.max(4,w-1))} style={{width:38,height:38,borderRadius:"50%",border:"1.5px solid rgba(58,128,112,.25)",background:"rgba(255,255,255,.78)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:"#3A8070",fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,boxShadow:"0 4px 14px rgba(58,128,112,.12)"}}>−</button>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:34,fontWeight:800,color:"#1a3a20",lineHeight:1,fontFamily:"Cormorant Garamond,serif",letterSpacing:"-.5px"}}>{editWeeks}</div>
                    <div style={{fontSize:11.5,color:"#6a9a80",marginTop:3,fontWeight:500}}>{triLabel}</div>
                  </div>
                  <button className="wk-g-btn" onClick={()=>setEditWeeks(w=>Math.min(42,w+1))} style={{width:38,height:38,borderRadius:"50%",border:"1.5px solid rgba(58,128,112,.25)",background:"rgba(255,255,255,.78)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:"#3A8070",fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,boxShadow:"0 4px 14px rgba(58,128,112,.12)"}}>+</button>
                </div>
                <div style={{marginTop:12,height:5,borderRadius:5,background:"rgba(58,128,112,.1)",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#3A8070,#C8952A)",borderRadius:5,transition:"width .22s ease"}}></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                  <span style={{fontSize:10,color:"#90a898"}}>{NP_T.wk} 4</span>
                  <span style={{fontSize:10,color:"#90a898"}}>{NP_T.wk} 42</span>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#3A8070",opacity:.75}}>{NP_T.activeSymptoms}</div>
                  <div style={{fontSize:10,color:"#90a898"}}>{selSx.length}/4</div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {SX_OPTIONS.map((s,idx)=>{
                    const on = selSx.includes(s);
                    return (
                      <button key={s} className="sxg-btn" onClick={()=>toggleSx(s)} style={{
                        padding:"6px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",
                        border:on?"1.5px solid rgba(58,128,112,.5)":"1.5px solid rgba(58,128,112,.14)",
                        background:on?"linear-gradient(135deg,rgba(58,128,112,.2),rgba(58,128,112,.1))":"rgba(255,255,255,.68)",
                        color:on?"#3A8070":"#6a8a7a",
                        backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",
                        boxShadow:on?"0 4px 14px rgba(58,128,112,.2)":"0 2px 6px rgba(58,128,112,.06)",
                        animation:`chipIn .2s ease ${idx*.03}s both forwards`,
                      }}>{s}</button>
                    );
                  })}
                </div>
              </div>
              <button onClick={saveCtx} style={{
                width:"100%",padding:"12px",borderRadius:16,border:"none",
                background:ctxSaved?"linear-gradient(135deg,rgba(60,160,90,.9),rgba(40,130,70,.85))":"linear-gradient(135deg,#3A8070,#2a6060)",
                color:"white",fontWeight:700,fontSize:14,cursor:"pointer",transition:"background .35s ease",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                boxShadow:ctxSaved?"0 8px 24px rgba(60,160,90,.3)":"0 8px 24px rgba(58,128,112,.35)",
              }}>
                {ctxSaved?(
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>{NP_T.contextUpdated}</>
                ):NP_T.saveContext}
              </button>
            </div>
          )}
        </div>

        {/* ── GENERAR ── */}
        {!plan && !loading && (
          <div style={{...glassCard,borderRadius:22,padding:"20px 18px",textAlign:"center"}}>
            <p style={{fontSize:13,color:"#5a7a60",lineHeight:1.7,margin:"0 0 18px"}}>
              {NP_T.generatePrompt(editWeeks, selSx.length>0?`${selSx[0].toLowerCase()}${selSx.length>1?(npLang==="en"?" and more":" y más"):""}`:"")}
            </p>
            <button onClick={generar} style={{width:"100%",padding:"15px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#1a3a20,#3A8070 50%,#C8952A)",color:"#fff",fontFamily:"inherit",fontSize:15,fontWeight:800,boxShadow:"0 12px 32px rgba(58,128,112,.45)",display:"flex",alignItems:"center",justifyContent:"center",gap:9}}>
              <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 7c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5z"/></svg>
              {NP_T.generateBtn}
            </button>
          </div>
        )}

        {loading && (
          <div style={{...glassCard,borderRadius:22,padding:"36px 20px",textAlign:"center"}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid rgba(58,128,112,.18)",borderTopColor:"#3A8070",animation:"spinGreen 1s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontSize:14.5,fontWeight:700,color:"#3A8070",marginBottom:5}}>{NP_T.generating}</div>
            <div style={{fontSize:12,color:"#6a9a80"}}>{NP_T.adapting(editWeeks, selSx.length>0)}</div>
          </div>
        )}

        {plan && !loading && (
          <>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#6a8a70",textTransform:"uppercase",padding:"0 2px",marginBottom:2}}>{NP_T.planToday}</div>
            {plan.map((p,i)=>{
              const isLogged = loggedMeals.includes(p.label);
              return (
                <div key={i} className="plan-card" style={{
                  display:"flex",alignItems:"stretch",borderRadius:20,overflow:"hidden",
                  background:isLogged?"rgba(255,255,255,.48)":"rgba(255,255,255,.80)",
                  backdropFilter:"blur(26px) saturate(170%)",WebkitBackdropFilter:"blur(26px) saturate(170%)",
                  border:`1px solid ${p.col}${isLogged?"11":"22"}`,
                  boxShadow:`0 10px 30px -6px ${p.col}${isLogged?"18":"36"}, 0 1px 0 rgba(255,255,255,.95) inset`,
                  opacity:isLogged?0.6:1,
                }}>
                  <div style={{width:4,background:`linear-gradient(to bottom,${p.col},${p.col}55)`,flexShrink:0}}/>
                  <div style={{flex:1,padding:"14px 13px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:p.why?5:0}}>
                      <div>
                        <span style={{fontSize:9.5,fontWeight:800,padding:"2px 8px",borderRadius:99,background:`${p.col}18`,border:`1px solid ${p.col}28`,color:p.col,display:"inline-block",marginBottom:4}}>{p.label}</span>
                        <div style={{fontSize:14,fontWeight:700,color:"#1a3a20",lineHeight:1.3}}>{p.name}</div>
                      </div>
                      <button className="log-btn" onClick={()=>!isLogged&&logMeal(p)} disabled={isLogged} style={{
                        width:34,height:34,borderRadius:"50%",border:"none",cursor:isLogged?"default":"pointer",flexShrink:0,
                        background:isLogged?"rgba(46,138,74,.15)":`linear-gradient(135deg,${p.col},${p.col}BB)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        boxShadow:isLogged?"none":`0 5px 14px ${p.col}40`,
                      }}>
                        {isLogged
                          ? <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#2e8a4a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>
                          : <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                        }
                      </button>
                    </div>
                    {p.why && <div style={{fontSize:11.5,color:"#4a7060",lineHeight:1.55}}>{p.why}</div>}
                    <div style={{fontSize:10.5,color:"#90a898",marginTop:4}}>~{p.kcal} kcal</div>
                  </div>
                </div>
              );
            })}
            <button onClick={generar} style={{padding:"13px",borderRadius:99,border:"1px solid rgba(58,128,112,.22)",cursor:"pointer",background:"rgba(255,255,255,.72)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",fontFamily:"inherit",fontSize:13,fontWeight:700,color:"#3A8070",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 6px 20px rgba(58,128,112,.12)"}}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
              {NP_T.regenerate}
            </button>
          </>
        )}

        <div style={{...glassGreen,borderRadius:16,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:13,flexShrink:0,color:"#3A8070"}}>✦</span>
          <p style={{margin:0,fontSize:11.5,color:"#3a5a4a",lineHeight:1.6}}>{NP_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════
   MÚSICA PARA TU BEBÉ  (Bienestar)
══════════════════════════════════════════════ */

/* ── Generadores de audio para bebé ── */

/* ── Wellness SVG icons — sin emojis, look profesional ── */
function WellnessIcon({ type, color, size = 26 }) {
  const p = { fill:"none", stroke:color, strokeWidth:1.6, strokeLinecap:"round", strokeLinejoin:"round" };
  const M = {
    lullaby:    <><path d="M9 18V5l12-2v13" {...p}/><circle cx="6" cy="18" r="2.5" fill={color} fillOpacity=".2" stroke={color} strokeWidth="1.6"/><circle cx="18" cy="16" r="2.5" fill={color} fillOpacity=".2" stroke={color} strokeWidth="1.6"/></>,
    freq432:    <path d="M2 12C5 5 8 5 10 12C12 19 15 19 17 12C19 5 22 5 22 12" {...p}/>,
    freq528:    <><circle cx="12" cy="12" r="8" {...p}/><circle cx="12" cy="12" r="3.5" {...p}/><circle cx="12" cy="12" r="1" fill={color}/></>,
    utero:      <path d="M2 12h3.5l2-5.5 3.5 11 2.5-8.5 2 3H22" {...p}/>,
    ocean:      <><path d="M2 9c3-4.5 6 4.5 9 0s6-4.5 9 0" {...p}/><path d="M2 13c3-4.5 6 4.5 9 0s6-4.5 9 0" {...p}/><path d="M2 17c3-4.5 6 4.5 9 0s6-4.5 9 0" {...p}/></>,
    forest:     <><path d="M12 2L6.5 12h3.5L5 19h14l-5-7h3.5L12 2z" {...p}/><line x1="12" y1="19" x2="12" y2="22" {...p}/></>,
    moon:       <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" {...p}/>,
    freq396:    <><path d="M6 16a6 6 0 0 1 12 0" {...p}/><path d="M9 16a3 3 0 0 1 6 0" {...p}/><line x1="12" y1="8" x2="12" y2="12" {...p}/><line x1="7.5" y1="9.5" x2="9" y2="11" {...p}/><line x1="16.5" y1="9.5" x2="15" y2="11" {...p}/></>,
    heartbeat:  <path d="M2 12h4l1.5-4 3.5 10 3-7.5 1.5 1.5H22" {...p}/>,
    connection: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...p}/>,
    star:       <path d="M12 2l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.2l-5.6 2.8 1.1-6.1L3 8.5l6.2-.9L12 2z" {...p}/>,
    musicbox:   <><rect x="3" y="10" width="18" height="11" rx="3" {...p}/><path d="M7 10V7a5 5 0 0 1 10 0v3" {...p}/><circle cx="12" cy="15.5" r="1.5" fill={color} fillOpacity=".3" stroke={color} strokeWidth="1.4"/><path d="M9 10h6" {...p}/></>,
    note:       <><path d="M9 18V5l12-2v13" {...p}/><circle cx="6" cy="18" r="2.5" fill={color} fillOpacity=".2" stroke={color} strokeWidth="1.6"/><circle cx="18" cy="16" r="2.5" fill={color} fillOpacity=".2" stroke={color} strokeWidth="1.6"/></>
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} style={{display:"block",flexShrink:0}}>{M[type]||null}</svg>;
}

/* ── Global audio manager: ensures only one audio plays at a time ── */
const LUME_AUDIO_MGR = window.LUME_AUDIO_MGR = (function() {
  let _stopFn = null;
  const dispatch = (playing) => window.dispatchEvent(new CustomEvent('lume-audio', { detail: { playing } }));
  return {
    register(fn, label) { _stopFn = fn; dispatch(true); window._LUME_AUDIO_LABEL = label || 'Reproduciendo'; },
    stop() { if (_stopFn) { try { _stopFn(); } catch{} _stopFn = null; } dispatch(false); },
  };
})();
/* ── Notas musicales ── */
const HZ = {
  C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,
  C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880,B5:987.77,
  G3:196,A3:220,B3:246.94,C3:130.81,
  R:0
};

/* Motor de melodía: [[freq, beats], ...] looping */
function makeMelodyEngine(ctx, melody, bpm, wave, vol) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2);
  master.connect(ctx.destination);

  // Reverb suave
  const rvBuf = ctx.createBuffer(2, ctx.sampleRate * 1.5, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = rvBuf.getChannelData(c);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/d.length, 2.5);
  }
  const rv = ctx.createConvolver(); rv.buffer = rvBuf;
  const rvG = ctx.createGain(); rvG.gain.value = 0.18;
  rv.connect(rvG); rvG.connect(master);

  const beatSec = 60 / bpm;
  const totalBeats = melody.reduce((s,[,d]) => s+d, 0);
  let running = true;
  let schedTime = ctx.currentTime + 0.3;

  const playNote = (freq, beats, startT) => {
    if (!running || freq <= 0 || ctx.state === 'closed') return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    const dur = beats * beatSec;
    const att = Math.min(0.04, dur * 0.08);
    const rel = Math.min(0.18, dur * 0.35);
    env.gain.setValueAtTime(0, startT);
    env.gain.linearRampToValueAtTime(0.38, startT + att);
    env.gain.setValueAtTime(0.38, startT + dur - rel);
    env.gain.linearRampToValueAtTime(0, startT + dur);
    osc.connect(env); env.connect(master); osc.connect(rv);
    osc.start(startT); osc.stop(startT + dur + 0.02);
  };

  const scheduleLoop = () => {
    if (!running) return;
    let t = schedTime;
    melody.forEach(([freq, beats]) => { playNote(freq, beats, t); t += beats * beatSec; });
    schedTime = t;
    const loopMs = totalBeats * beatSec * 1000;
    setTimeout(() => { if(running) scheduleLoop(); }, loopMs - 400);
  };
  scheduleLoop();

  return { master, stop: () => { running = false; } };
}

/* Pad armónico de fondo */
function makeHarmPad(ctx, freqs, master) {
  freqs.forEach(([f, v]) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f; g.gain.value = v;
    const lfo = ctx.createOscillator(); const lg = ctx.createGain();
    lfo.frequency.value = 0.08 + Math.random()*0.04; lg.gain.value = 0.015;
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(g); g.connect(master); o.start(); lfo.start();
  });
}

/* 1. NANA DE BRAHMS */
function makeLullaby(ctx) {
  const {C4,D4,E4,G4,A4,B4,C5,D5,E5,G3,C3,R} = HZ;
  const melody = [
    [G4,1],[G4,.5],[E4,.5],[G4,1],[R,.5],
    [C5,1],[C5,.5],[B4,.5],[A4,2],[R,1],
    [A4,1],[A4,.5],[B4,.5],[G4,1.5],[R,.5],
    [C5,.5],[B4,.5],[A4,.5],[G4,.5],[A4,2],[R,1],
    [G4,1],[G4,.5],[E4,.5],[G4,1],[R,.5],
    [C5,1],[C5,.5],[B4,.5],[A4,3],
    [D5,1],[D5,.5],[C5,.5],[B4,1],[R,.5],
    [E5,.5],[D5,.5],[C5,.5],[B4,.5],[C5,3],
  ];
  const eng = makeMelodyEngine(ctx, melody, 72, 'sine', 0.42);
  makeHarmPad(ctx, [[C3,0.06],[G3,0.04],[E4*0.5,0.03]], eng.master);
  return eng;
}

/* 2. ESTRELLITA (Twinkle Twinkle) */
function makeTwinkle(ctx) {
  const {C4,D4,E4,F4,G4,A4,R} = HZ;
  const melody = [
    [C4,1],[C4,1],[G4,1],[G4,1],[A4,1],[A4,1],[G4,2],
    [F4,1],[F4,1],[E4,1],[E4,1],[D4,1],[D4,1],[C4,2],
    [G4,1],[G4,1],[F4,1],[F4,1],[E4,1],[E4,1],[D4,2],
    [G4,1],[G4,1],[F4,1],[F4,1],[E4,1],[E4,1],[D4,2],
    [C4,1],[C4,1],[G4,1],[G4,1],[A4,1],[A4,1],[G4,2],
    [F4,1],[F4,1],[E4,1],[E4,1],[D4,1],[D4,1],[C4,2],
  ];
  const eng = makeMelodyEngine(ctx, melody, 76, 'triangle', 0.38);
  makeHarmPad(ctx, [[HZ.C3,0.05],[HZ.G3,0.04]], eng.master);
  return eng;
}

/* 3. CAJA DE MÚSICA (pentatónica) */
function makeMusicBox(ctx) {
  const {C5,D5,E5,G5,A5,G4,E4,C4,A4,R} = HZ;
  const melody = [
    [C5,.5],[E5,.5],[G5,1],[E5,.5],[C5,.5],[R,1],
    [D5,.5],[G5,.5],[A5,1],[G5,.5],[E5,1],[R,.5],
    [C5,.5],[D5,.5],[E5,.5],[G5,1],[E5,.5],[C5,1.5],[R,.5],
    [A4,1],[C5,1],[E5,.5],[C5,.5],[A4,2],[R,1],
    [G4,.5],[C5,.5],[E5,.5],[G5,1],[E5,.5],[C5,.5],[R,1],
    [E4,.5],[G4,.5],[C5,1],[G4,.5],[E4,1.5],[R,.5],
    [C4,.5],[E4,.5],[G4,.5],[C5,1],[A4,.5],[G4,1.5],[R,.5],
    [C5,2],[R,1],[G4,1],[C5,3],
  ];
  return makeMelodyEngine(ctx, melody, 88, 'triangle', 0.35);
}

/* 4. 432 Hz (armónico + notas en 432) */
function makeFrequency432(ctx) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 4);
  master.connect(ctx.destination);

  // Base 432 Hz con movimiento melódico suave
  const freqs432 = [432, 540, 324, 648, 216];
  freqs432.forEach((f, i) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.value = [0.35, 0.12, 0.10, 0.07, 0.08][i];
    const lfo = ctx.createOscillator(); const lg = ctx.createGain();
    lfo.frequency.value = 0.05 + i*0.02; lg.gain.value = 0.012;
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(g); g.connect(master); o.start(); lfo.start();
  });

  // Melodía suave sobre 432
  const notes432 = [[432,2],[540,2],[486,2],[432,2],[384,2],[432,4]];
  const eng2 = makeMelodyEngine(ctx, notes432, 30, 'sine', 0.12);
  eng2.master.connect(master);

  return { master, stop: () => { eng2.stop(); } };
}

/* 5. 528 Hz */
function makeFrequency528(ctx) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 4);
  master.connect(ctx.destination);

  [528, 396, 660, 264, 792].forEach((f, i) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.value = [0.35, 0.10, 0.08, 0.10, 0.06][i];
    const lfo = ctx.createOscillator(); const lg = ctx.createGain();
    lfo.frequency.value = 0.04 + i*0.015; lg.gain.value = 0.01;
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(g); g.connect(master); o.start(); lfo.start();
  });

  const notes528 = [[528,2],[594,2],[528,1],[462,2],[528,3]];
  const eng2 = makeMelodyEngine(ctx, notes528, 28, 'sine', 0.10);
  eng2.master.connect(master);

  return { master, stop: () => { eng2.stop(); } };
}

/* 6. LATIDO + ÚTERO */
function makeUteroSound(ctx) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 3);
  master.connect(ctx.destination);

  // Ruido suave de útero filtrado
  const bufSize = 4 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass'; filter.frequency.value = 110; filter.Q.value = 0.7;
  const nGain = ctx.createGain(); nGain.gain.value = 0.55;
  src.connect(filter); filter.connect(nGain); nGain.connect(master); src.start();

  // Whoosh de sangre (LFO sobre ruido)
  const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
  lfo.frequency.value = 1.2; lfoG.gain.value = 0.25;
  lfo.connect(lfoG); lfoG.connect(nGain.gain); lfo.start();

  // Latido (~72 bpm fetal, doble golpe)
  const beatInterval = setInterval(() => {
    if (ctx.state === 'closed') { clearInterval(beatInterval); return; }
    const now = ctx.currentTime;
    [[0,.09],[0.18,.07]].forEach(([delay, dur]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 55;
      g.gain.setValueAtTime(0, now+delay);
      g.gain.linearRampToValueAtTime(0.55, now+delay+0.02);
      g.gain.linearRampToValueAtTime(0, now+delay+dur);
      o.connect(g); g.connect(master);
      o.start(now+delay); o.stop(now+delay+dur+0.05);
    });
  }, 833);

  return { master, src, beatInterval };
}

function MusicaBebeScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(() => { try { return !!localStorage.getItem("lume_premium"); } catch { return false; } }, []);

  const mbLang = getAppLang2();
  const CATEGORIES_ES = [
    { id:"lullaby",   label:"Nana de Brahms",    icon:"lullaby",    color:"#C84878", bg:"rgba(200,72,120,.12)",  desc:"Melodía clásica de Brahms. La nana más reconocida del mundo, suave y envolvente." },
    { id:"twinkle",   label:"Estrellita",        icon:"star",       color:"#8B5A9E", bg:"rgba(139,90,158,.12)", desc:"Twinkle Twinkle en tono dulce. Melodía familiar que estimula el oído de tu bebé." },
    { id:"musicbox",  label:"Caja de música",    icon:"musicbox",   color:"#3A8070", bg:"rgba(58,128,112,.12)", desc:"Melodía pentatónica delicada, como una caja de música de cristal. Suave y repetitiva." },
    { id:"freq432",   label:"432 Hz · Armonía",  icon:"freq432",    color:"#6B5A9E", bg:"rgba(107,90,158,.12)", desc:"Frecuencia de armonía natural. Tonos continuos que crean un entorno de paz y calma." },
    { id:"freq528",   label:"528 Hz · Amor",     icon:"freq528",    color:"#C8952A", bg:"rgba(200,149,42,.12)", desc:"La frecuencia del amor y la transformación. Bienestar celular y conexión profunda." },
    { id:"utero",     label:"Latido materno",    icon:"utero",      color:"#A8492A", bg:"rgba(168,73,42,.12)",  desc:"Sonidos del útero y latido cardíaco. El sonido más familiar y reconfortante para tu bebé." },
  ];
  const CATEGORIES_EN = [
    { id:"lullaby",   label:"Brahms' Lullaby",   icon:"lullaby",    color:"#C84878", bg:"rgba(200,72,120,.12)",  desc:"Brahms' classic lullaby. The most recognized lullaby in the world, soft and enveloping." },
    { id:"twinkle",   label:"Twinkle Twinkle",   icon:"star",       color:"#8B5A9E", bg:"rgba(139,90,158,.12)", desc:"Twinkle Twinkle in a sweet tone. A familiar melody that stimulates your baby's hearing." },
    { id:"musicbox",  label:"Music box",         icon:"musicbox",   color:"#3A8070", bg:"rgba(58,128,112,.12)", desc:"A delicate pentatonic melody, like a crystal music box. Soft and repetitive." },
    { id:"freq432",   label:"432 Hz · Harmony",  icon:"freq432",    color:"#6B5A9E", bg:"rgba(107,90,158,.12)", desc:"Natural harmony frequency. Continuous tones that create an environment of peace and calm." },
    { id:"freq528",   label:"528 Hz · Love",      icon:"freq528",    color:"#C8952A", bg:"rgba(200,149,42,.12)", desc:"The frequency of love and transformation. Cellular wellness and deep connection." },
    { id:"utero",     label:"Mother's heartbeat", icon:"utero",      color:"#A8492A", bg:"rgba(168,73,42,.12)",  desc:"Womb sounds and heartbeat. The most familiar and comforting sound for your baby." },
  ];
  const CATEGORIES = mbLang==="en" ? CATEGORIES_EN : CATEGORIES_ES;
  const MB_T = mbLang==="en" ? {
    eyebrow:"Wellness · Music", title:"Music for your baby", headerSub:"Prenatal stimulation and calm",
    lockedDesc:"Lullabies, 432Hz and 528Hz frequencies, and intrauterine sounds to stimulate and calm your baby.",
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card needed · cancel anytime",
    remaining:"remaining", stop:"Stop", recommended:(w)=>`✦ Recommended · Week ${w}`, choose:"Choose",
    sectionChoose:"Choose a frequency", duration:"Duration", pause:"Pause", play:"Play", playChoose:"Choose a frequency",
    disclaimer:"Place the phone near your belly or use headphones. Moderate volume. Not a substitute for medical supervision.",
    musicFallback:"Music",
  } : {
    eyebrow:"Bienestar · Música", title:"Música para tu bebé", headerSub:"Estimulación y calma prenatal",
    lockedDesc:"Lullabies, frecuencias 432Hz y 528Hz, y sonidos intrauterinos para estimular y calmar a tu bebé.",
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    remaining:"restantes", stop:"Detener", recommended:(w)=>`✦ Recomendada · Semana ${w}`, choose:"Elegir",
    sectionChoose:"Elige una frecuencia", duration:"Duración", pause:"Pausar", play:"Reproducir", playChoose:"Elige una frecuencia",
    disclaimer:"Coloca el móvil cerca del vientre o usa auriculares. Volumen moderado. No reemplaza supervisión médica.",
    musicFallback:"Música",
  };

  const weeks = React.useMemo(()=>parseInt(localStorage.getItem("lume_weeks")||"15")||15,[]);
  const recommended = weeks < 16 ? "lullaby" : weeks < 24 ? "freq432" : weeks < 32 ? "freq528" : weeks < 38 ? "utero" : "lullaby";
  const recommendedReason = mbLang==="en" ? (weeks < 16
    ? "Your baby is developing their sense of hearing right now"
    : weeks < 24 ? "Their nervous system is forming this week"
    : weeks < 32 ? "The emotional connection deepens in this trimester"
    : weeks < 38 ? "Your baby now hears with total clarity from the womb"
    : "Familiar melodies to prepare for meeting them") : (weeks < 16
    ? "Tu bebé está desarrollando el sentido del oído ahora"
    : weeks < 24 ? "Su sistema nervioso se está formando esta semana"
    : weeks < 32 ? "La conexión emocional se intensifica en este trimestre"
    : weeks < 38 ? "Tu bebé ya escucha con total claridad desde el vientre"
    : "Melodías familiares para preparar el encuentro");

  const DURATIONS = [10, 20, 30];
  const [selCat, setSelCat] = React.useState(null);
  const [selDur, setSelDur] = React.useState(20);
  const [playing, setPlaying] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [vol, setVol] = React.useState(0.8);
  const ctxRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const volRef = React.useRef(null);

  const stop = React.useCallback(() => {
    LUME_AUDIO_MGR.stop === stop && LUME_AUDIO_MGR.register(null);
    clearInterval(timerRef.current);
    if (audioRef.current?.interval) clearInterval(audioRef.current.interval);
    if (audioRef.current?.beatInterval) clearInterval(audioRef.current.beatInterval);
    if (ctxRef.current) {
      try {
        if (audioRef.current?.master) {
          audioRef.current.master.gain.cancelScheduledValues(ctxRef.current.currentTime);
          audioRef.current.master.gain.setValueAtTime(0, ctxRef.current.currentTime);
        }
        ctxRef.current.close();
      } catch {}
      ctxRef.current = null; audioRef.current = null;
    }
    setPlaying(false); setElapsed(0);
  }, []);

  const play = React.useCallback(() => {
    if (!selCat) return;
    if (playing) { stop(); return; }
    LUME_AUDIO_MGR.stop();
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const volNode = ctx.createGain(); volNode.gain.value = vol; volNode.connect(ctx.destination);
      volRef.current = volNode;

      let audio;
      if (selCat === "lullaby") audio = makeLullaby(ctx);
      else if (selCat === "twinkle") audio = makeTwinkle(ctx);
      else if (selCat === "musicbox") audio = makeMusicBox(ctx);
      else if (selCat === "freq432") audio = makeFrequency432(ctx);
      else if (selCat === "freq528") audio = makeFrequency528(ctx);
      else audio = makeUteroSound(ctx);

      // Redirect master to volNode
      if (audio.master) { audio.master.disconnect(); audio.master.connect(volNode); }
      audioRef.current = audio;
      LUME_AUDIO_MGR.register(stop, cat?.label || MB_T.musicFallback);

      setElapsed(0); setPlaying(true);
      const totalSec = selDur * 60;
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= totalSec) { stop(); return 0; }
          return e + 1;
        });
      }, 1000);
    } catch (e) { console.error(e); }
  }, [selCat, selDur, playing, vol, stop]);

  React.useEffect(() => {
    if (volRef.current) volRef.current.gain.value = vol;
  }, [vol]);

  React.useEffect(() => () => stop(), []);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const totalSec = selDur * 60;
  const progress = totalSec > 0 ? elapsed / totalSec : 0;
  const cat = CATEGORIES.find(c => c.id === selCat);

  const glassCard = { background:"linear-gradient(160deg,rgba(255,255,255,.85),rgba(255,255,255,.58))", backdropFilter:"blur(28px) saturate(165%)", WebkitBackdropFilter:"blur(28px) saturate(165%)", border:"1px solid rgba(255,255,255,.88)", boxShadow:"0 16px 44px -12px rgba(168,73,42,.2), 0 2px 0 rgba(255,255,255,.95) inset", borderRadius:22 };

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#1a0a20 0%,#3a1050 50%,#7a2080 100%)",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",padding:"96px 20px 32px",flexShrink:0}}>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(200,72,120,.18)",border:"1.5px solid rgba(200,72,120,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <WellnessIcon type="lullaby" color="#ffb0d0" size={34}/>
          </div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(220,180,255,.8)",textTransform:"uppercase",marginBottom:8}}>{MB_T.eyebrow}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:"#fff",margin:"0 0 8px",lineHeight:1.2}}>{MB_T.title}</h2>
          <p style={{fontSize:13,color:"rgba(220,180,255,.7)",margin:0,lineHeight:1.6}}>{MB_T.lockedDesc}</p>
        </div>
      </div>
      <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#8B5A9E,#C84878)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(139,90,158,.5)"}}>
          {MB_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"rgba(220,180,255,.5)",margin:0}}>{MB_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#f2eafe 0%,#e8d8f8 100%)",minHeight:"100%",overflowY:"auto",overflowX:"hidden"}}>
      <style>{`
        @keyframes pulseOrb{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.1);opacity:1}}
        @keyframes floatOrb{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-8px)}}
        .cat-row-ms{transition:background .18s,border-color .18s;}
        .cat-row-ms:hover{background:rgba(139,90,158,.09)!important;}
        .cat-row-ms:active{opacity:.75;transform:scale(.99);}
        .dur-ms{transition:all .15s;}
        .dur-ms:active{transform:scale(.94);}
        .play-ms{transition:all .2s cubic-bezier(.34,1.56,.64,1);}
        .play-ms:hover{filter:brightness(1.08);}
        .play-ms:active{transform:scale(.96);}
        .ms-scroll::-webkit-scrollbar{display:none;}
        .ms-scroll{scrollbar-width:none;}
      `}</style>

      {/* Header */}
      <div style={{position:"relative",padding:"92px 20px 24px",background:"rgba(139,90,158,.07)",borderBottom:"1px solid rgba(139,90,158,.14)"}}>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:36,height:36,borderRadius:"50%",background:"rgba(139,90,158,.12)",border:"1px solid rgba(139,90,158,.22)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#6B3A9E"}}>
          <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,72,120,.14),transparent 65%)",pointerEvents:"none",animation:"floatOrb 6s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,90,158,.1),transparent 65%)",pointerEvents:"none",animation:"floatOrb 8s ease-in-out infinite reverse"}}/>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{width:58,height:58,borderRadius:18,background:"linear-gradient(135deg,#C84878,#8B5A9E)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 10px 28px rgba(200,72,120,.45)"}}>
            <WellnessIcon type="lullaby" color="#fff" size={28}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",color:"rgba(139,90,158,.6)",textTransform:"uppercase",marginBottom:4}}>{MB_T.eyebrow}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#2d1040",lineHeight:1.1,marginBottom:3}}>{MB_T.title}</div>
            <div style={{fontSize:12,color:"rgba(100,60,140,.5)"}}>{MB_T.headerSub}</div>
          </div>
        </div>
      </div>

      <div style={{padding:"14px 14px 100px",display:"flex",flexDirection:"column",gap:12}}>

        {/* Player activo */}
        {playing && cat && (
          <div style={{background:`linear-gradient(135deg,${cat.color}14,rgba(255,255,255,.82))`,backdropFilter:"blur(28px) saturate(165%)",WebkitBackdropFilter:"blur(28px) saturate(165%)",border:`1px solid ${cat.color}30`,borderRadius:22,padding:"24px 20px",textAlign:"center",boxShadow:`0 16px 48px ${cat.color}22, 0 2px 0 rgba(255,255,255,.95) inset`}}>
            <div style={{width:88,height:88,borderRadius:"50%",background:`radial-gradient(circle,${cat.color}38,${cat.color}10)`,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",animation:"pulseOrb 2.5s ease-in-out infinite",boxShadow:`0 0 44px ${cat.color}38`,border:`1.5px solid ${cat.color}44`}}>
              <WellnessIcon type={cat.icon} color={cat.color} size={38}/>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#2d1040",marginBottom:4}}>{cat.label}</div>
            <div style={{fontSize:12,color:"#a08070",marginBottom:6}}>{cat.desc}</div>
            <div style={{fontSize:13,color:"#8a6a9a",marginBottom:14}}>{fmt(elapsed)} · {fmt(totalSec-elapsed)} {MB_T.remaining}</div>
            <div style={{display:"flex",gap:2,alignItems:"flex-end",justifyContent:"center",height:40,marginBottom:14}}>
              {[...Array(28)].map((_,i) => {
                const t = elapsed * 0.15 + i * 0.38;
                const h = 4 + 32 * Math.abs(Math.sin(t) * Math.cos(t*0.6+1) * Math.sin(t*0.3+i*0.1));
                return <div key={i} style={{width:2.5,height:Math.max(4,h),borderRadius:2,background:`linear-gradient(to top,${cat.color}99,${cat.color})`,opacity:.55+.4*(i%3===0?1:.6),transition:"height .15s ease"}}/>;
              })}
            </div>
            <div style={{height:4,borderRadius:4,background:"rgba(139,90,158,.1)",overflow:"hidden",marginBottom:16}}>
              <div style={{height:"100%",width:`${progress*100}%`,background:`linear-gradient(90deg,${cat.color},${cat.color}88)`,borderRadius:4,transition:"width 1s linear"}}/>
            </div>
            {/* Volumen inline */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"0 4px"}}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={cat.color} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <input type="range" min={0} max={1} step={0.05} value={vol} onChange={e=>setVol(+e.target.value)} style={{flex:1,accentColor:cat.color,height:4}}/>
              <span style={{fontSize:11,color:"#8a6a9a",minWidth:28,textAlign:"right"}}>{Math.round(vol*100)}%</span>
            </div>
            <button onClick={stop} style={{padding:"11px 32px",borderRadius:99,border:`1.5px solid ${cat.color}50`,background:"rgba(255,255,255,.7)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:cat.color,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px ${cat.color}20`}}>{MB_T.stop}</button>
          </div>
        )}

        {/* Recomendación por semana */}
        {!playing && (() => { const rc = CATEGORIES.find(c=>c.id===recommended); return rc ? (
          <div style={{borderRadius:16,padding:"12px 14px",background:`${rc.color}0f`,border:`1px solid ${rc.color}28`,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:11,background:`${rc.color}20`,border:`1px solid ${rc.color}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <WellnessIcon type={rc.icon} color={rc.color} size={19}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:9.5,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",color:rc.color,marginBottom:2}}>{MB_T.recommended(weeks)}</div>
              <div style={{fontSize:12.5,fontWeight:700,color:"#2d1040",marginBottom:1}}>{rc.label}</div>
              <div style={{fontSize:11,color:"rgba(80,40,120,.5)",lineHeight:1.35}}>{recommendedReason}</div>
            </div>
            <button onClick={()=>setSelCat(recommended)} style={{flexShrink:0,padding:"7px 13px",borderRadius:99,border:"none",background:rc.color,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{MB_T.choose}</button>
          </div>
        ) : null; })()}

        {/* Selector de frecuencia */}
        {!playing && <div style={{borderRadius:20,overflow:"hidden",background:"rgba(255,255,255,.88)",border:"none",boxShadow:"0 4px 20px rgba(139,90,158,.12), 0 1px 0 rgba(255,255,255,.95) inset",flexShrink:0}}>
          <div style={{padding:"11px 16px 9px",borderBottom:"1px solid rgba(139,90,158,.12)",background:"rgba(139,90,158,.08)"}}>
            <span style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#4a2080"}}>{MB_T.sectionChoose}</span>
          </div>
          {CATEGORIES.map((c,idx) => (
            <button key={c.id} className="cat-row-ms" onClick={()=>{if(!playing)setSelCat(c.id)}} style={{
              display:"flex",alignItems:"center",gap:13,padding:"13px 16px",width:"100%",textAlign:"left",
              cursor:playing?"not-allowed":"pointer",
              background:selCat===c.id?`${c.color}18`:"rgba(255,255,255,.4)",
              borderTop:idx>0?"1px solid rgba(139,90,158,.07)":"none",
              borderRight:"none",borderBottom:"none",
              borderLeft:`3px solid ${selCat===c.id?c.color:"transparent"}`,
              position:"relative",
            }}>

              <div style={{width:44,height:44,borderRadius:13,background:selCat===c.id?`${c.color}25`:`rgba(139,90,158,.1)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${selCat===c.id?c.color+"55":"rgba(139,90,158,.2)"}`,transition:"all .18s"}}>
                <WellnessIcon type={c.icon} color={selCat===c.id?c.color:"rgba(100,60,140,.5)"} size={22}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:selCat===c.id?c.color:"#2d1040",marginBottom:2}}>{c.label}</div>
                <div style={{fontSize:11,color:"rgba(80,40,120,.5)",lineHeight:1.45}}>{c.desc}</div>
              </div>
              {selCat===c.id && <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0}}><path d="M5 12l5 5L19 7"/></svg>}
            </button>
          ))}
        </div>}

        {/* Duración */}
        {!playing && <div style={{borderRadius:18,overflow:"hidden",background:"rgba(255,255,255,.88)",border:"none",boxShadow:"0 4px 20px rgba(139,90,158,.11), 0 1px 0 rgba(255,255,255,.95) inset",padding:"13px 16px"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(100,60,140,.5)",marginBottom:10}}>{MB_T.duration}</div>
          <div style={{display:"flex",gap:8}}>
            {DURATIONS.map(d => (
              <button key={d} className="dur-ms" onClick={()=>setSelDur(d)} style={{flex:1,padding:"11px 8px",borderRadius:13,border:`1.5px solid ${selDur===d?"rgba(139,90,158,.5)":"rgba(139,90,158,.15)"}`,background:selDur===d?"rgba(139,90,158,.15)":"rgba(255,255,255,.55)",color:selDur===d?"#8B5A9E":"rgba(80,40,120,.55)",fontWeight:700,fontSize:14,cursor:"pointer",textAlign:"center",transition:"all .15s",boxShadow:selDur===d?"0 4px 16px rgba(139,90,158,.2)":"none"}}>
                {d}<span style={{display:"block",fontSize:10,fontWeight:500,opacity:.7}}>min</span>
              </button>
            ))}
          </div>
        </div>}

        {/* Volumen (solo cuando no está reproduciendo) */}
        {!playing && <div style={{borderRadius:18,overflow:"hidden",background:"rgba(255,255,255,.88)",border:"none",boxShadow:"0 4px 20px rgba(139,90,158,.11), 0 1px 0 rgba(255,255,255,.95) inset",padding:"11px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="rgba(100,60,140,.5)" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <input type="range" min={0} max={1} step={0.05} value={vol} onChange={e=>setVol(+e.target.value)} style={{flex:1,accentColor:"#8B5A9E"}}/>
            <span style={{fontSize:11,color:"rgba(100,60,140,.5)",minWidth:28,textAlign:"right"}}>{Math.round(vol*100)}%</span>
          </div>
        </div>}

        {/* Play */}
        <button className="play-ms" onClick={play} disabled={!selCat} style={{
          width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:selCat?"pointer":"not-allowed",
          background:selCat?"linear-gradient(135deg,#8B5A9E,#C84878)":"rgba(139,90,158,.15)",
          color:selCat?"#fff":"rgba(80,40,120,.8)",fontFamily:"inherit",fontSize:15,fontWeight:800,
          boxShadow:selCat?"0 12px 36px rgba(139,90,158,.45)":"none",
          display:"flex",alignItems:"center",justifyContent:"center",gap:9,
          opacity:1,
        }}>
          {playing
            ? <><svg viewBox="0 0 24 24" width={18} height={18} fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>{MB_T.pause}</>
            : <><svg viewBox="0 0 24 24" width={18} height={18} fill="white"><path d="M8 5l12 7-12 7Z"/></svg>{selCat?MB_T.play:MB_T.playChoose}</>
          }
        </button>

        <div style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 14px"}}>
          <span style={{fontSize:12,flexShrink:0,color:"rgba(139,90,158,.5)"}}>✦</span>
          <p style={{margin:0,fontSize:11,color:"rgba(80,40,120,.45)",lineHeight:1.6}}>{MB_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEDITACIÓN CON MÚSICA PARA MAMÁ (Bienestar)
══════════════════════════════════════════════ */

const MEDIT_MUSIC_SESSIONS_ES = [
  {
    id:"calma",
    title:"Calma profunda",
    icon:"ocean",
    color:"#3A8070",
    bg:"rgba(58,128,112,.15)",
    dur:15,
    audio:"ocean",
    audioLabel:"Océano",
    guide:[
      "Cierra los ojos suavemente. Deja que tu cuerpo encuentre su lugar.",
      "Siente cómo la superficie te sostiene por completo. No tienes que hacer nada.",
      "Lleva una mano a tu vientre. Ahí está tu bebé, contigo en este momento.",
      "Inhala lentamente… y exhala soltando cualquier tensión del día.",
      "Con cada respiración, tu cuerpo se asienta un poco más. Más pesado, más seguro.",
      "Relaja la frente… luego las mejillas… la mandíbula… los labios. Todo se suaviza.",
      "Tu bebé siente tu respiración. Cada vez que exhalas, ambos os relajáis juntos.",
      "Imagina que el sonido del océano llega desde lejos, envolviendo la habitación.",
      "Esas olas llevan consigo cualquier pensamiento que no necesitas ahora. Se van.",
      "Tu mente se vuelve como el agua quieta. Clara, tranquila, sin prisa.",
      "Siente el calor de tu mano sobre el vientre. Ese calor es amor puro.",
      "Tu bebé lo recibe. Y en respuesta, te envía calma desde dentro.",
      "Juntas respiráis. Un ritmo suave que os conecta sin palabras.",
      "No hay nada que resolver ahora. No hay ningún lugar al que ir.",
      "Solo este momento. Solo esta respiración. Solo vosotras dos.",
      "Inhala profundo una última vez… y al exhalar, sonríe suavemente.",
      "Llevas contigo esta calma. Siempre puedes volver aquí cuando lo necesites.",
      "Poco a poco, regresa. Con los ojos cerrados, siente el espacio a tu alrededor.",
      "Cuando estés lista, abre los ojos. Despacio. Con gratitud.",
    ]
  },
  {
    id:"conexion",
    title:"Conexión con tu bebé",
    icon:"connection",
    color:"#C8952A",
    bg:"rgba(200,149,42,.15)",
    dur:20,
    audio:"forest",
    audioLabel:"Bosque",
    guide:[
      "Siéntate o recuéstate con comodidad. Cierra los ojos con suavidad.",
      "Pon ambas manos sobre tu vientre. Siente el calor que emana de tu piel.",
      "Respira hondo. Con esa respiración, le dices a tu bebé: aquí estoy.",
      "Imagina que tu bebé puede sentir el peso de tus manos. Ese contacto, ese amor.",
      "Deja que tu mente viaje hacia adentro. Hacia ese espacio donde vive tu bebé.",
      "Está flotando, a salvo, escuchando el ritmo constante de tu corazón.",
      "Ese latido ha sido su melodía desde el primer día. La conoce mejor que ninguna otra.",
      "Háblale en silencio. Cuéntale quién eres. Cuéntale lo que sientes.",
      "Dile que lo esperáis con el corazón lleno. Que ya lo amáis sin haberlo visto.",
      "Cada movimiento que sientes es su respuesta. Su forma de decirte: te escucho.",
      "Visualiza su carita. Todavía sin definir, pero ya completamente tuya.",
      "Sus manos pequeñas, sus pies que pronto descubrirán el mundo.",
      "Imagina ese primer abrazo. Ese momento en que lo tengas sobre tu pecho.",
      "Todo lo que estás haciendo ahora, lo estás haciendo por él. Por ese amor.",
      "Respira amor hacia adentro. Exhala cualquier miedo o duda. No los necesitas.",
      "Sois un equipo. Habéis recorrido juntos cada semana de este viaje.",
      "Él confía en ti. Y tú puedes confiar en ti misma. Ya lo estás haciendo bien.",
      "Lleva tus manos al corazón un momento. Siente cuánto amor cabe aquí.",
      "Ese amor es inagotable. Siempre tendrás suficiente para los dos.",
      "Este momento es un regalo. Uno que solo vosotras dos podéis compartir.",
      "Despídete por ahora con una respiración profunda y una sonrisa interior.",
      "Abre los ojos cuando estés lista. Llevando este vínculo contigo al mundo.",
    ]
  },
  {
    id:"sueno",
    title:"Sueño reparador",
    icon:"moon",
    color:"#6B5A9E",
    bg:"rgba(107,90,158,.15)",
    dur:30,
    audio:"rain",
    audioLabel:"Lluvia",
    guide:[
      "Estás en tu cama. La lluvia cae suave afuera. Todo está en calma.",
      "Cierra los ojos. No hay nada que necesites ver esta noche.",
      "Lleva tu atención a la almohada. Siente cómo acoge el peso de tu cabeza.",
      "Ahora los hombros. Déjalos caer. Más. Un poco más todavía.",
      "Siente tus brazos. Pesados, cálidos, completamente en reposo.",
      "Tus manos se abren suavemente. Los dedos se relajan uno a uno.",
      "Lleva la atención al vientre. Tu bebé también descansa esta noche.",
      "Los dos respiráis al mismo ritmo. Lento. Tranquilo. Sin esfuerzo.",
      "Siente el peso de tus piernas hundiéndose en el colchón. Más pesadas aún.",
      "Tus pies se relajan. Los dedos se sueltan. El cuerpo entero descansa.",
      "Escucha la lluvia. Cada gota lleva consigo un pensamiento que ya no necesitas.",
      "Si la mente trae preocupaciones, déjalas ir con la siguiente exhalación.",
      "No tienes que resolver nada esta noche. Ya hiciste suficiente hoy.",
      "Inhala cuatro tiempos… sostén dos… exhala seis. Una vez más.",
      "Tu cuerpo sabe cómo descansar. Confía en él. Se lo merece.",
      "Imagina un lugar que te dé paz. Una playa, un bosque, una habitación cálida.",
      "Estás ahí. Segura. Protegida. En completa paz.",
      "Tu bebé también está en ese lugar contigo. Los dos, a salvo, descansando.",
      "La lluvia sigue cayendo afuera. Suave, constante, como una canción de cuna.",
      "Cada gota te recuerda que el mundo sigue girando aunque tú descanses.",
      "No tienes que estar alerta. Esta noche puedes soltar el control.",
      "Inhala profundo una última vez consciente… y exhala todo lo que queda.",
      "Desde ahora, tu respiración continúa sola. Tu cuerpo sabe el camino.",
      "Estás a salvo. Tu bebé está a salvo. Esta noche todo está exactamente bien.",
      "Duerme con la certeza de que mañana amanece. Y estaréis bien.",
      "Duerme. Que el descanso repare lo que el día desgastó.",
      "Buenas noches. Gracias por cuidarte. Tu bebé también te lo agradece.",
    ]
  },
];
const MEDIT_MUSIC_SESSIONS_EN = [
  {
    id:"calma",
    title:"Deep calm",
    icon:"ocean",
    color:"#3A8070",
    bg:"rgba(58,128,112,.15)",
    dur:15,
    audio:"ocean",
    audioLabel:"Ocean",
    guide:[
      "Close your eyes gently. Let your body find its place.",
      "Feel how the surface holds you completely. You don't have to do anything.",
      "Bring one hand to your belly. Your baby is there, with you in this moment.",
      "Inhale slowly… and exhale, releasing any tension from the day.",
      "With each breath, your body settles a little more. Heavier, safer.",
      "Relax your forehead… then your cheeks… your jaw… your lips. Everything softens.",
      "Your baby feels your breathing. Every time you exhale, you both relax together.",
      "Imagine the sound of the ocean arriving from far away, wrapping around the room.",
      "Those waves carry away any thought you don't need right now. They drift off.",
      "Your mind becomes like still water. Clear, calm, unhurried.",
      "Feel the warmth of your hand on your belly. That warmth is pure love.",
      "Your baby receives it. And in return, sends you calm from within.",
      "You breathe together. A gentle rhythm that connects you without words.",
      "There's nothing to solve right now. Nowhere you need to go.",
      "Just this moment. Just this breath. Just the two of you.",
      "Inhale deeply one last time… and as you exhale, smile softly.",
      "You carry this calm with you. You can always return here when you need it.",
      "Slowly, come back. With your eyes closed, feel the space around you.",
      "When you're ready, open your eyes. Slowly. With gratitude.",
    ]
  },
  {
    id:"conexion",
    title:"Connecting with your baby",
    icon:"connection",
    color:"#C8952A",
    bg:"rgba(200,149,42,.15)",
    dur:20,
    audio:"forest",
    audioLabel:"Forest",
    guide:[
      "Sit or lie down comfortably. Close your eyes gently.",
      "Place both hands on your belly. Feel the warmth radiating from your skin.",
      "Breathe deeply. With that breath, you're telling your baby: I'm here.",
      "Imagine your baby can feel the weight of your hands. That touch, that love.",
      "Let your mind travel inward. Toward that space where your baby lives.",
      "They're floating, safe, listening to the steady rhythm of your heart.",
      "That heartbeat has been their melody since day one. They know it better than any other.",
      "Speak to them in silence. Tell them who you are. Tell them what you feel.",
      "Tell them you're waiting with a full heart. That you already love them without having seen them.",
      "Every movement you feel is their response. Their way of telling you: I hear you.",
      "Picture their little face. Still undefined, but already completely yours.",
      "Their tiny hands, their feet that will soon discover the world.",
      "Imagine that first embrace. The moment you hold them against your chest.",
      "Everything you're doing now, you're doing it for them. For that love.",
      "Breathe love inward. Exhale any fear or doubt. You don't need them.",
      "You're a team. You've walked through every week of this journey together.",
      "They trust you. And you can trust yourself. You're already doing it well.",
      "Bring your hands to your heart for a moment. Feel how much love fits here.",
      "That love is inexhaustible. You'll always have enough for both of you.",
      "This moment is a gift. One only the two of you can share.",
      "Say goodbye for now with a deep breath and an inner smile.",
      "Open your eyes when you're ready. Carrying this bond with you into the world.",
    ]
  },
  {
    id:"sueno",
    title:"Restorative sleep",
    icon:"moon",
    color:"#6B5A9E",
    bg:"rgba(107,90,158,.15)",
    dur:30,
    audio:"rain",
    audioLabel:"Rain",
    guide:[
      "You're in your bed. Rain falls softly outside. Everything is calm.",
      "Close your eyes. There's nothing you need to see tonight.",
      "Bring your attention to the pillow. Feel how it cradles the weight of your head.",
      "Now your shoulders. Let them drop. More. A little more still.",
      "Feel your arms. Heavy, warm, completely at rest.",
      "Your hands open gently. Your fingers relax one by one.",
      "Bring your attention to your belly. Your baby is also resting tonight.",
      "You both breathe at the same rhythm. Slow. Calm. Effortless.",
      "Feel the weight of your legs sinking into the mattress. Even heavier.",
      "Your feet relax. Your toes let go. Your whole body rests.",
      "Listen to the rain. Every drop carries away a thought you no longer need.",
      "If your mind brings worries, let them go with the next exhale.",
      "You don't have to solve anything tonight. You already did enough today.",
      "Inhale for four counts… hold for two… exhale for six. Once more.",
      "Your body knows how to rest. Trust it. It deserves it.",
      "Imagine a place that gives you peace. A beach, a forest, a warm room.",
      "You're there. Safe. Protected. In complete peace.",
      "Your baby is also in that place with you. Both of you, safe, resting.",
      "The rain keeps falling outside. Soft, steady, like a lullaby.",
      "Every drop reminds you that the world keeps turning while you rest.",
      "You don't have to stay alert. Tonight you can let go of control.",
      "Inhale deeply one last conscious time… and exhale everything that remains.",
      "From now on, your breathing continues on its own. Your body knows the way.",
      "You're safe. Your baby is safe. Tonight everything is exactly fine.",
      "Sleep with the certainty that morning will come. And you'll both be fine.",
      "Sleep. Let rest repair what the day wore down.",
      "Good night. Thank you for taking care of yourself. Your baby thanks you too.",
    ]
  },
];

function MeditacionMusicaScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(() => { try { return !!localStorage.getItem("lume_premium"); } catch { return false; } }, []);
  const mmLang = getAppLang2();
  const MEDIT_MUSIC_SESSIONS = mmLang==="en" ? MEDIT_MUSIC_SESSIONS_EN : MEDIT_MUSIC_SESSIONS_ES;
  const MM_T = mmLang==="en" ? {
    lockedTitle:"Meditation with music", lockedDesc:"Simultaneous voice guidance + ambient music to reduce prenatal stress.",
    activateCta:"✦ Activate Wellness — 7 days free", noCard:"No card needed · cancel anytime",
    eyebrow:"Wellness · Meditation", headerTitle:"Meditation with music", headerSub:"Guided voice and ambient sound together",
    remaining:(t)=>`${t} left`, endSession:"End session", chooseSession:"Choose your session",
    startSession:"Start session", chooseSessionBtn:"Choose a session",
    disclaimer:"Guided phrases appear during the session. Use headphones for deeper immersion.",
    guidedPhrases:"guided phrases", sessionFallback:"Meditation",
  } : {
    lockedTitle:"Meditación con música", lockedDesc:"Guía de voz + música ambiental simultáneas para reducir el estrés prenatal.",
    activateCta:"✦ Activar Bienestar — 7 días gratis", noCard:"Sin tarjeta · cancela cuando quieras",
    eyebrow:"Bienestar · Meditación", headerTitle:"Meditación con música", headerSub:"Voz guiada y ambiente sonoro simultáneos",
    remaining:(t)=>`quedan ${t}`, endSession:"Terminar sesión", chooseSession:"Elige tu sesión",
    startSession:"Comenzar sesión", chooseSessionBtn:"Elige una sesión",
    disclaimer:"Las frases guiadas aparecen durante la sesión. Usa auriculares para mayor inmersión.",
    guidedPhrases:"frases guiadas", sessionFallback:"Meditación",
  };

  const [selSession, setSelSession] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [guideIdx, setGuideIdx] = React.useState(0);
  const [showGuide, setShowGuide] = React.useState(false);
  const ctxRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const guideRef = React.useRef(null);

  const session = MEDIT_MUSIC_SESSIONS.find(s => s.id === selSession);

  const stop = React.useCallback(() => {
    clearInterval(timerRef.current); clearInterval(guideRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (ctxRef.current) {
      try {
        if (audioRef.current?.master) {
          audioRef.current.master.gain.cancelScheduledValues(ctxRef.current.currentTime);
          audioRef.current.master.gain.setValueAtTime(0, ctxRef.current.currentTime);
        }
        ctxRef.current.close();
      } catch {}
      ctxRef.current = null; audioRef.current = null;
    }
    setPlaying(false); setElapsed(0); setGuideIdx(0); setShowGuide(false);
  }, []);

  const speakGuide = React.useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = mmLang==="en" ? 'en-US' : 'es-ES';
    utt.rate = 0.82;
    utt.pitch = 1.05;
    utt.volume = 0.85;
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const esVoice = mmLang==="en"
                   ? (voices.find(v => v.lang.startsWith('en') && /female|samantha|victoria|karen|zira/i.test(v.name)) || voices.find(v => v.lang.startsWith('en')))
                   : (voices.find(v => v.lang.startsWith('es') && /female|mujer|monica|paulina|lucia|elena/i.test(v.name)) || voices.find(v => v.lang.startsWith('es')));
      if (esVoice) utt.voice = esVoice;
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length) trySpeak();
    else { window.speechSynthesis.onvoiceschanged = () => { trySpeak(); window.speechSynthesis.onvoiceschanged = null; }; }
  }, []);

  React.useEffect(() => {
    if (!playing || !showGuide || !session) return;
    speakGuide(session.guide[guideIdx]);
  }, [guideIdx, showGuide, playing]);

  React.useEffect(() => () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); }, []);

  const play = React.useCallback(() => {
    if (!selSession) return;
    if (playing) { stop(); return; }
    LUME_AUDIO_MGR.stop();
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const s = MEDIT_MUSIC_SESSIONS.find(x => x.id === selSession);
      let audio;
      if (s.audio === "ocean") audio = makeOcean(ctx);
      else if (s.audio === "forest") audio = makeForest(ctx);
      else audio = makeRain(ctx);
      audioRef.current = audio;
      LUME_AUDIO_MGR.register(stop, s?.title || MM_T.sessionFallback);

      setPlaying(true); setElapsed(0); setGuideIdx(0);
      setTimeout(() => setShowGuide(true), 3000);

      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= s.dur * 60) { stop(); return 0; }
          return e + 1;
        });
      }, 1000);

      const guideInterval = 20;
      guideRef.current = setInterval(() => {
        setGuideIdx(i => (i + 1) % s.guide.length);
      }, guideInterval * 1000);
    } catch (e) { console.error(e); }
  }, [selSession, playing, stop]);

  React.useEffect(() => () => stop(), []);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const glassCard = {
    background:"linear-gradient(160deg,rgba(255,255,255,.88),rgba(255,255,255,.62))",
    backdropFilter:"blur(28px) saturate(165%)", WebkitBackdropFilter:"blur(28px) saturate(165%)",
    border:"1px solid rgba(255,255,255,.88)", borderRadius:22,
    boxShadow:"0 16px 44px -12px rgba(80,40,20,.2), 0 2px 0 rgba(255,255,255,.95) inset",
  };

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#1a1030 0%,#3a2860 50%,#6a4890 100%)",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",padding:"96px 20px 32px",flexShrink:0}}>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(107,90,158,.2)",border:"1.5px solid rgba(107,90,158,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <WellnessIcon type="ocean" color="rgba(200,180,255,.9)" size={34}/>
            </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:"#fff",margin:"0 0 8px"}}>{MM_T.lockedTitle}</h2>
          <p style={{fontSize:13,color:"rgba(200,180,255,.7)",margin:0,lineHeight:1.6}}>{MM_T.lockedDesc}</p>
        </div>
      </div>
      <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#6B5A9E,#3A8070)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(107,90,158,.5)"}}>
          {MM_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"rgba(200,180,255,.4)",margin:0}}>{MM_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#f9f1eb,#f0e2d6 45%,#e8d5c6 100%)",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.15);opacity:1}}
        @keyframes guideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes floatOrbW{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,8px)}}
        .sess-card{transition:all .22s cubic-bezier(.23,1,.32,1);}
        .sess-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(168,73,42,.14)!important;}
        .sess-card:active{transform:scale(.97);}
        .mm-scroll::-webkit-scrollbar{display:none;}
        .mm-scroll{scrollbar-width:none;}
      `}</style>

      {/* Header */}
      <div style={{position:"relative",padding:"92px 20px 24px",background:"linear-gradient(160deg,rgba(58,128,112,.1),rgba(107,90,158,.07))",borderBottom:"1px solid rgba(58,128,112,.18)"}}>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:36,height:36,borderRadius:"50%",background:"rgba(168,73,42,.1)",border:"1px solid rgba(168,73,42,.18)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#A8492A"}}>
          <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(58,128,112,.22),transparent 65%)",pointerEvents:"none",animation:"floatOrbW 7s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:130,height:130,borderRadius:"50%",background:"radial-gradient(circle,rgba(107,90,158,.18),transparent 65%)",pointerEvents:"none",animation:"floatOrbW 9s ease-in-out infinite reverse"}}/>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{width:58,height:58,borderRadius:18,background:"linear-gradient(135deg,#3A8070,#6B5A9E)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 10px 28px rgba(58,128,112,.35)"}}>
            <WellnessIcon type="ocean" color="#fff" size={28}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",color:"rgba(58,128,112,.6)",textTransform:"uppercase",marginBottom:4}}>{MM_T.eyebrow}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#3d1a0e",lineHeight:1.1,marginBottom:3}}>{MM_T.headerTitle}</div>
            <div style={{fontSize:12,color:"rgba(58,128,112,.55)"}}>{MM_T.headerSub}</div>
          </div>
        </div>
      </div>

      <div className="mm-scroll" style={{padding:"16px 14px 100px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>

        {/* Player activo */}
        {playing && session && (
          <div style={{...glassCard,padding:"24px 20px",textAlign:"center",background:`linear-gradient(135deg,${session.bg},rgba(255,255,255,.75))`}}>
            {/* Orb respiración */}
            <div style={{width:90,height:90,borderRadius:"50%",background:`radial-gradient(circle,${session.color}38,${session.color}12)`,border:`1.5px solid ${session.color}44`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",animation:"breathe 4s ease-in-out infinite",boxShadow:`0 0 44px ${session.color}35`}}>
              <WellnessIcon type={session.icon} color={session.color} size={38}/>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#3d1a0e",marginBottom:4}}>{session.title}</div>
            <div style={{fontSize:13,color:"#a08070",marginBottom:16}}>{fmt(elapsed)} · {MM_T.remaining(fmt(session.dur*60 - elapsed))}</div>

            {/* Frase guiada */}
            {showGuide && (
              <div style={{background:`${session.color}12`,border:`1px solid ${session.color}28`,borderRadius:16,padding:"14px 16px",marginBottom:16,animation:"guideIn .5s ease forwards"}}>
                <p style={{margin:0,fontSize:13.5,color:"#5a3a2a",lineHeight:1.7,fontStyle:"italic"}}>"{session.guide[guideIdx]}"</p>
              </div>
            )}

            {/* Progreso */}
            <div style={{height:4,borderRadius:4,background:"rgba(168,73,42,.1)",overflow:"hidden",marginBottom:16}}>
              <div style={{height:"100%",width:`${(elapsed/(session.dur*60))*100}%`,background:`linear-gradient(90deg,${session.color},${session.color}88)`,borderRadius:4,transition:"width 1s linear"}}></div>
            </div>

            <button onClick={stop} style={{padding:"10px 28px",borderRadius:99,border:`1px solid ${session.color}40`,background:"rgba(255,255,255,.6)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:session.color,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              {MM_T.endSession}
            </button>
          </div>
        )}

        {/* Selector de sesiones */}
        {!playing && (
          <div style={{...glassCard,padding:"18px 16px"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.75,marginBottom:12}}>{MM_T.chooseSession}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {MEDIT_MUSIC_SESSIONS.map(s => (
                <button key={s.id} className="sess-card" onClick={()=>setSelSession(s.id)} style={{
                  display:"flex",alignItems:"center",gap:13,padding:"14px 14px",borderRadius:18,
                  border:`1.5px solid ${selSession===s.id?s.color+"55":"rgba(168,73,42,.1)"}`,
                  background:selSession===s.id?s.bg:"rgba(255,247,238,.72)",
                  backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
                  textAlign:"left",cursor:"pointer",
                  boxShadow:selSession===s.id?`0 6px 20px ${s.color}20`:"0 2px 8px rgba(168,73,42,.06)",
                }}>
                  <div style={{width:50,height:50,borderRadius:15,background:selSession===s.id?`${s.color}28`:`${s.color}1a`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1.5px solid ${selSession===s.id?s.color+"55":s.color+"30"}`,transition:"all .2s"}}>
                    <WellnessIcon type={s.icon} color={s.color} size={25}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#3d1a0e",marginBottom:2}}>{s.title}</div>
                    <div style={{fontSize:11,color:"#a08070"}}>{s.dur} min · {s.audioLabel} · {s.guide.length} {MM_T.guidedPhrases}</div>
                  </div>
                  {selSession===s.id && <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón play */}
        {!playing && (
          <button className="play-btn-main" onClick={play} disabled={!selSession} style={{
            width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:selSession?"pointer":"not-allowed",
            background:selSession?"linear-gradient(135deg,#3A8070,#6B5A9E)":"rgba(168,73,42,.1)",
            color:"#fff",fontFamily:"inherit",fontSize:15,fontWeight:800,
            boxShadow:selSession?"0 12px 36px rgba(58,128,112,.4)":"none",
            display:"flex",alignItems:"center",justifyContent:"center",gap:9,
            opacity:selSession?1:0.45,
            transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="white"><path d="M8 5l12 7-12 7Z"/></svg>
            {selSession ? MM_T.startSession : MM_T.chooseSessionBtn}
          </button>
        )}

        <div style={{...glassCard,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",background:"rgba(255,255,255,.55)"}}>
          <span style={{fontSize:13,flexShrink:0,color:"#3A8070"}}>✦</span>
          <p style={{margin:0,fontSize:11.5,color:"#5a3a2a",lineHeight:1.6}}>{MM_T.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEDITACIÓN PARA BEBÉS (Profesional)
══════════════════════════════════════════════ */

function makeBabyFreq(ctx, freq, harmonics = []) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 5);
  master.connect(ctx.destination);
  const nodes = [];

  const baseOsc = ctx.createOscillator();
  const baseGain = ctx.createGain();
  baseOsc.type = 'sine'; baseOsc.frequency.value = freq;
  baseGain.gain.value = 0.45;
  baseOsc.connect(baseGain); baseGain.connect(master);
  baseOsc.start();
  nodes.push({ osc: baseOsc, gain: baseGain });

  harmonics.forEach(([mult, vol]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq * mult;
    gain.gain.value = vol;
    osc.connect(gain); gain.connect(master);
    osc.start();
    nodes.push({ osc, gain });
  });

  // Soft LFO tremolo
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08; lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain); lfoGain.connect(master.gain);
  lfo.start();
  nodes.push({ osc: lfo, gain: lfoGain });

  // Warm noise pad
  const bufSize = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 200;
  const nGain = ctx.createGain(); nGain.gain.value = 0.04;
  src.connect(filt); filt.connect(nGain); nGain.connect(master);
  src.start();

  return { master, nodes, src };
}

const BABY_SESSIONS_ES = [
  { id:"432",  freq:432,  harmonics:[[2,.06],[0.5,.08]],
    title:"432 Hz", subtitle:"Armonía Universal",
    icon:"freq432", color:"#A58FE0", glow:"rgba(165,143,224,.45)",
    dark:"#12082e", mid:"#1e1248",
    state:"Ondas Alfa · Relajación Profunda", weeks:"Todo el embarazo",
    desc:"Frecuencia de sintonía natural. Crea un campo armónico que calma el sistema nervioso del bebé y reduce el cortisol materno.",
    benefits:["Reduce estrés prenatal","Estimulación cognitiva suave","Sincronía neuronal madre-bebé"],
    guide:["Cierra los ojos suavemente. Siente el apoyo de la superficie bajo ti.",
           "Inhala durante 4 tiempos… y exhala durante 6. Sin esfuerzo.",
           "Estas frecuencias llegan hasta tu bebé a través del fluido amniótico.",
           "Siente cómo tu cuerpo se relaja con cada exhalación. Más y más.",
           "Lleva una mano al vientre. Visualiza a tu bebé flotando en calma.",
           "El 432 Hz sintoniza tu sistema nervioso con el ritmo natural.",
           "Tu bebé percibe esta armonía. Noto cómo responde a ella.",
           "Respira. Confía. Todo está exactamente como debe estar ahora."] },
  { id:"528",  freq:528,  harmonics:[[2,.05],[0.5,.07]],
    title:"528 Hz", subtitle:"Frecuencia del Amor",
    icon:"freq528", color:"#5EC4A0", glow:"rgba(94,196,160,.45)",
    dark:"#041e18", mid:"#0a3028",
    state:"Ondas Theta · Bienestar Celular", weeks:"Semanas 12+",
    desc:"Conocida como la frecuencia de la reparación del ADN. Promueve el bienestar celular y la conexión emocional profunda madre-bebé.",
    benefits:["Bienestar y vitalidad celular","Conexión emocional profunda","Estimula el desarrollo neuronal"] },
  { id:"396",  freq:396,  harmonics:[[2,.07],[3,.04]],
    title:"396 Hz", subtitle:"Liberación",
    icon:"freq396", color:"#E0B45E", glow:"rgba(224,180,94,.45)",
    dark:"#1e1000", mid:"#2e1a00",
    state:"Ondas Delta · Liberación", weeks:"Semanas 20+",
    desc:"Frecuencia liberadora de tensiones y bloqueos energéticos. Crea un entorno de paz, equilibrio y bienestar en torno al bebé.",
    benefits:["Libera tensiones uterinas","Equilibrio emocional profundo","Entorno de paz y calma"],
    guide:["Suelta los hombros. Suelta la mandíbula. Suelta todo lo que sostienes.",
           "Inhala espacio. Exhala cualquier tensión que llevas en el cuerpo.",
           "El 396 Hz libera bloqueos energéticos del campo que rodea a tu bebé.",
           "Visualiza que la tensión se disuelve como niebla al calor del sol.",
           "Tu vientre se ablanda. Tu respiración se hace más lenta y profunda.",
           "Hay paz aquí. Dentro y fuera. Tu bebé lo siente y se acomoda.",
           "Deja ir cualquier miedo. No tienes que cargarlo ahora mismo.",
           "Exhala el peso de hoy. Solo queda este momento. Tú y tu bebé."] },
  { id:"heart", freq:null, harmonics:[],
    title:"72 BPM", subtitle:"Latido Materno",
    icon:"heartbeat", color:"#E07898", glow:"rgba(224,120,152,.45)",
    dark:"#1e0510", mid:"#2e0a1a",
    state:"Biorritmo Natural · Confort", weeks:"Todo el embarazo",
    desc:"El primer sonido que tu bebé reconoció. El latido materno sincronizado activa la respuesta de seguridad innata del bebé.",
    benefits:["Reduce ansiedad prenatal","Reconocimiento y confort total","Regula ciclos de sueño"],
    guide:["Cierra los ojos. Pon ambas manos sobre tu vientre con suavidad.",
           "Inhala lentamente… siente el calor de tus manos llegando a tu bebé.",
           "Tu bebé escucha este latido desde el primer día. Lo reconoce perfectamente.",
           "Exhala despacio. Soltando cualquier tensión que llevas en el cuerpo.",
           "Habla en silencio con tu bebé. Cuéntale que estás aquí, que todo está bien.",
           "Siente cómo vuestra respiración se sincroniza. Un solo ritmo, juntas.",
           "Este es el sonido más seguro que tu bebé conoce. Relájate en él.",
           "Cada latido le dice a tu bebé: estás protegida, estás amada."] },
];
const BABY_SESSIONS_EN = [
  { id:"432",  freq:432,  harmonics:[[2,.06],[0.5,.08]],
    title:"432 Hz", subtitle:"Universal Harmony",
    icon:"freq432", color:"#A58FE0", glow:"rgba(165,143,224,.45)",
    dark:"#12082e", mid:"#1e1248",
    state:"Alpha Waves · Deep Relaxation", weeks:"Whole pregnancy",
    desc:"Natural tuning frequency. Creates a harmonic field that calms your baby's nervous system and lowers maternal cortisol.",
    benefits:["Reduces prenatal stress","Gentle cognitive stimulation","Mother-baby neural sync"],
    guide:["Close your eyes gently. Feel the support of the surface beneath you.",
           "Inhale for 4 counts… and exhale for 6. Effortlessly.",
           "These frequencies reach your baby through the amniotic fluid.",
           "Feel your body relax with every exhale. More and more.",
           "Bring one hand to your belly. Picture your baby floating calmly.",
           "432 Hz tunes your nervous system to its natural rhythm.",
           "Your baby senses this harmony. Notice how they respond to it.",
           "Breathe. Trust. Everything is exactly as it should be right now."] },
  { id:"528",  freq:528,  harmonics:[[2,.05],[0.5,.07]],
    title:"528 Hz", subtitle:"Frequency of Love",
    icon:"freq528", color:"#5EC4A0", glow:"rgba(94,196,160,.45)",
    dark:"#041e18", mid:"#0a3028",
    state:"Theta Waves · Cellular Wellness", weeks:"Weeks 12+",
    desc:"Known as the DNA repair frequency. Promotes cellular wellness and a deep emotional mother-baby connection.",
    benefits:["Cellular wellness and vitality","Deep emotional connection","Stimulates neural development"] },
  { id:"396",  freq:396,  harmonics:[[2,.07],[3,.04]],
    title:"396 Hz", subtitle:"Release",
    icon:"freq396", color:"#E0B45E", glow:"rgba(224,180,94,.45)",
    dark:"#1e1000", mid:"#2e1a00",
    state:"Delta Waves · Release", weeks:"Weeks 20+",
    desc:"A frequency that releases tension and energetic blocks. Creates an environment of peace, balance, and wellbeing around your baby.",
    benefits:["Releases uterine tension","Deep emotional balance","Environment of peace and calm"],
    guide:["Release your shoulders. Release your jaw. Release everything you're holding.",
           "Inhale space. Exhale any tension you carry in your body.",
           "396 Hz releases energetic blocks in the field around your baby.",
           "Picture tension dissolving like mist in the warmth of the sun.",
           "Your belly softens. Your breathing becomes slower and deeper.",
           "There's peace here. Inside and out. Your baby feels it and settles.",
           "Let go of any fear. You don't have to carry it right now.",
           "Exhale the weight of today. Only this moment remains. You and your baby."] },
  { id:"heart", freq:null, harmonics:[],
    title:"72 BPM", subtitle:"Mother's Heartbeat",
    icon:"heartbeat", color:"#E07898", glow:"rgba(224,120,152,.45)",
    dark:"#1e0510", mid:"#2e0a1a",
    state:"Natural Biorhythm · Comfort", weeks:"Whole pregnancy",
    desc:"The first sound your baby recognized. The synchronized maternal heartbeat activates the baby's innate sense of safety.",
    benefits:["Reduces prenatal anxiety","Total recognition and comfort","Regulates sleep cycles"],
    guide:["Close your eyes. Gently place both hands on your belly.",
           "Inhale slowly… feel the warmth of your hands reaching your baby.",
           "Your baby has heard this heartbeat since day one. They recognize it perfectly.",
           "Exhale slowly. Releasing any tension you carry in your body.",
           "Speak silently with your baby. Tell them you're here, that everything is okay.",
           "Feel how your breathing synchronizes. One single rhythm, together.",
           "This is the safest sound your baby knows. Relax into it.",
           "Every heartbeat tells your baby: you're protected, you're loved."] },
];

function MeditacionBebesScreen({ goBack, goToTab }) {
  const isPremium = React.useMemo(() => { try { return !!localStorage.getItem("lume_premium"); } catch { return false; } }, []);
  const mbbLang = getAppLang2();
  const BABY_SESSIONS = mbbLang==="en" ? BABY_SESSIONS_EN : BABY_SESSIONS_ES;
  const MBB_T = mbbLang==="en" ? {
    lockedBadge:"Professional · Exclusive", lockedTitle:"Meditation for babies",
    lockedDesc:"Special frequencies (432Hz, 528Hz, 396Hz) to create calm and positive stimulation for your baby.",
    activateCta:"✦ Activate Professional", noCard:"No card needed · cancel anytime",
    sessionComplete:"Session complete", diaryPlaceholder:"How did you feel during the session? Did your baby respond?",
    skip:"Skip", saveToDiary:"Save to diary", inhale:"Inhale…", exhale:"Exhale…", endSession:"End session",
    eyebrow:"✦ Professional · Frequency Therapy", titleLine1:"Meditation", titleLine2:"for your baby",
    subLine:"Therapeutic frequencies that stimulate neural", subLine2:"development from the womb",
    weekAbbr:"Wk.", duration:"Session duration", startTherapy:"Start frequency therapy", chooseFreq:"Choose a frequency",
    disclaimer:"Gently place the phone near your belly. For guidance only, not a substitute for medical supervision.",
    freqFallback:"Frequency",
  } : {
    lockedBadge:"Profesional · Exclusivo", lockedTitle:"Meditación para bebés",
    lockedDesc:"Frecuencias especiales (432Hz, 528Hz, 396Hz) para crear calma y estimulación positiva en tu bebé.",
    activateCta:"✦ Activar Profesional", noCard:"Sin tarjeta · cancela cuando quieras",
    sessionComplete:"Sesión completada", diaryPlaceholder:"¿Cómo te sentiste durante la sesión? ¿Tu bebé respondió?",
    skip:"Omitir", saveToDiary:"Guardar en diario", inhale:"Inhala…", exhale:"Exhala…", endSession:"Terminar sesión",
    eyebrow:"✦ Profesional · Terapia de Frecuencias", titleLine1:"Meditación", titleLine2:"para tu bebé",
    subLine:"Frecuencias terapéuticas que estimulan el", subLine2:"desarrollo neuronal desde el vientre",
    weekAbbr:"Sem.", duration:"Duración de la sesión", startTherapy:"Iniciar terapia de frecuencias", chooseFreq:"Elige una frecuencia",
    disclaimer:"Coloca el móvil suavemente cerca del vientre. Uso orientativo, no reemplaza supervisión médica.",
    freqFallback:"Frecuencia",
  };

  const [selId, setSelId] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [selDur, setSelDur] = React.useState(20);
  const [guideIdx, setGuideIdx] = React.useState(0);
  const [showGuide, setShowGuide] = React.useState(false);
  const [breathPhase, setBreathPhase] = React.useState('inhale');
  const [showDiario, setShowDiario] = React.useState(false);
  const [diarioNote, setDiarioNote] = React.useState('');
  const ctxRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const guideRef = React.useRef(null);
  const breathRef = React.useRef(null);
  const dtLocaleMbb = mbbLang==="en" ? "en-US" : "es-ES";
  const weeks = React.useMemo(()=>parseInt(localStorage.getItem("lume_weeks")||"15")||15,[]);

  const sess = BABY_SESSIONS.find(s => s.id === selId);

  const speakGuide = React.useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = mbbLang==="en" ? 'en-US' : 'es-ES'; utt.rate = 0.8; utt.pitch = 1.05; utt.volume = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const v = mbbLang==="en"
      ? (voices.find(v=>v.lang.startsWith('en')&&/female|samantha|victoria|karen|zira/i.test(v.name))||voices.find(v=>v.lang.startsWith('en')))
      : (voices.find(v=>v.lang.startsWith('es')&&/female|mujer|monica|lucia|elena/i.test(v.name))||voices.find(v=>v.lang.startsWith('es')));
    if(v) utt.voice=v;
    window.speechSynthesis.speak(utt);
  }, []);

  React.useEffect(()=>{
    if(!playing||!showGuide||!sess?.guide) return;
    speakGuide(sess.guide[guideIdx % sess.guide.length]);
  },[guideIdx, showGuide, playing]);

  React.useEffect(()=>()=>{if(window.speechSynthesis)window.speechSynthesis.cancel();},[]);

  const stop = React.useCallback((showDiary=false) => {
    clearInterval(timerRef.current); clearInterval(guideRef.current); clearInterval(breathRef.current);
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    if (ctxRef.current) {
      try {
        if (audioRef.current?.master) {
          audioRef.current.master.gain.cancelScheduledValues(ctxRef.current.currentTime);
          audioRef.current.master.gain.setValueAtTime(0, ctxRef.current.currentTime);
        }
        ctxRef.current.close();
      } catch {}
      ctxRef.current = null; audioRef.current = null;
    }
    setPlaying(false); setElapsed(0); setGuideIdx(0); setShowGuide(false);
    if(showDiary) { setShowDiario(true); setDiarioNote(''); }
  }, []);

  const play = React.useCallback(() => {
    if (!selId) return;
    if (playing) { stop(); return; }
    LUME_AUDIO_MGR.stop();
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const s = BABY_SESSIONS.find(x => x.id === selId);
      let audio;
      if (s.id === "heart") {
        audio = makeUteroSound(ctx);
      } else {
        audio = makeBabyFreq(ctx, s.freq, s.harmonics);
      }
      audioRef.current = audio;
      LUME_AUDIO_MGR.register(stop, (BABY_SESSIONS.find(x=>x.id===selId))?.title || MBB_T.freqFallback);
      setPlaying(true); setElapsed(0); setGuideIdx(0); setBreathPhase('inhale');
      setTimeout(()=>setShowGuide(true), 2000);

      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= selDur * 60) { stop(true); return 0; }
          return e + 1;
        });
      }, 1000);

      // Guide phrase every 25 seconds
      guideRef.current = setInterval(()=>{ setGuideIdx(i=>i+1); }, 25000);

      // Breath cycle: 4s inhale, 4s exhale
      breathRef.current = setInterval(()=>{ setBreathPhase(p=>p==='inhale'?'exhale':'inhale'); }, 4000);
    } catch(e) { console.error(e); }
  }, [selId, playing, selDur, stop]);

  React.useEffect(() => () => stop(), []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const progress = selDur > 0 ? elapsed / (selDur * 60) : 0;

  const glassCard = {
    background:"linear-gradient(160deg,rgba(255,255,255,.86),rgba(255,255,255,.6))",
    backdropFilter:"blur(28px) saturate(165%)", WebkitBackdropFilter:"blur(28px) saturate(165%)",
    border:"1px solid rgba(255,255,255,.9)", borderRadius:22,
    boxShadow:"0 16px 44px -12px rgba(139,90,158,.2), 0 2px 0 rgba(255,255,255,.95) inset",
  };

  if (!isPremium) return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#0a0a1a 0%,#1a1040 50%,#2a1860 100%)",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",padding:"96px 20px 32px",flexShrink:0}}>
        <button onClick={goBack} style={{position:"absolute",top:52,left:16,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(139,90,158,.2)",border:"1.5px solid rgba(139,90,158,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <WellnessIcon type="freq528" color="rgba(200,180,255,.9)" size={34}/>
            </div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".14em",color:"rgba(180,150,255,.8)",textTransform:"uppercase",marginBottom:8}}>{MBB_T.lockedBadge}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:"#fff",margin:"0 0 8px"}}>{MBB_T.lockedTitle}</h2>
          <p style={{fontSize:13,color:"rgba(180,150,255,.65)",margin:0,lineHeight:1.6}}>{MBB_T.lockedDesc}</p>
        </div>
      </div>
      <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={()=>goToTab&&goToTab("premium")} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#C8952A,#8B5A9E)",fontFamily:"inherit",fontSize:15,fontWeight:800,color:"#fff",boxShadow:"0 12px 32px rgba(200,149,42,.4)"}}>
          {MBB_T.activateCta}
        </button>
        <p style={{textAlign:"center",fontSize:12,color:"rgba(180,150,255,.4)",margin:0}}>{MBB_T.noCard}</p>
      </div>
    </div>
  );

  return (
    <div className="screen s-enter" style={{padding:0,background:"linear-gradient(160deg,#0a0614 0%,#120a24 50%,#0e0818 100%)",minHeight:"100%",overflowY:"auto",overflowX:"hidden",color:"#fff"}}>
      <style>{`
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.12);opacity:1}}
        @keyframes ringOut{0%{transform:scale(1);opacity:.55}100%{transform:scale(2.6);opacity:0}}
        @keyframes starFloat{0%,100%{opacity:.4;transform:translateY(0)}50%{opacity:.9;transform:translateY(-3px)}}
        @keyframes hzCount{from{opacity:.6;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        .freq-card{transition:all .3s cubic-bezier(.23,1,.32,1);cursor:pointer;}
        .freq-card:active{transform:scale(.96);}
        .mb-scroll::-webkit-scrollbar{display:none;}
        .mb-scroll{scrollbar-width:none;}
      `}</style>

      {/* Back button */}
      <button onClick={goBack} style={{position:"fixed",top:52,left:16,zIndex:50,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.12)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"rgba(255,255,255,.85)"}}>
        <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>

      {/* DIARY MODAL */}
      {showDiario && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(5,3,16,.88)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{width:"100%",maxWidth:320,background:"linear-gradient(160deg,#1a1040,#0e0820)",border:"1px solid rgba(165,143,224,.25)",borderRadius:24,padding:"28px 22px",boxShadow:"0 24px 80px rgba(0,0,0,.6)"}}>
            <div style={{fontSize:28,textAlign:"center",marginBottom:8}}>✨</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#fff",textAlign:"center",marginBottom:6}}>{MBB_T.sessionComplete}</div>
            <div style={{fontSize:12.5,color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.6,marginBottom:20}}>{sess?.title} · {selDur} min · {mbbLang==="en"?"Week":"Semana"} {weeks}</div>
            <textarea value={diarioNote} onChange={e=>setDiarioNote(e.target.value)}
              placeholder={MBB_T.diaryPlaceholder}
              style={{width:"100%",minHeight:90,borderRadius:14,border:"1px solid rgba(165,143,224,.2)",background:"rgba(255,255,255,.06)",padding:"12px 14px",fontFamily:"inherit",fontSize:13,color:"rgba(255,255,255,.85)",resize:"none",boxSizing:"border-box",outline:"none",lineHeight:1.6,marginBottom:14,placeholder:"rgba(255,255,255,.3)"}}
            />
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowDiario(false)} style={{flex:1,padding:"12px",borderRadius:99,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.5)",fontSize:13,fontWeight:600,cursor:"pointer"}}>{MBB_T.skip}</button>
              <button onClick={()=>{
                if(diarioNote.trim()){
                  const entry={id:Date.now(),fecha:new Date().toLocaleDateString(dtLocaleMbb,{day:"numeric",month:"long",year:"numeric"}),semana:weeks,texto:`[Sesión: ${sess?.title}] ${diarioNote}`,mood:"✨"};
                  try{const prev=JSON.parse(localStorage.getItem("lume_diario")||"[]");localStorage.setItem("lume_diario",JSON.stringify([entry,...prev]));}catch{}
                }
                setShowDiario(false);
              }} style={{flex:2,padding:"12px",borderRadius:99,border:"none",background:"linear-gradient(90deg,#A58FE0,#6B5A9E)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                {MBB_T.saveToDiary}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER INMERSIVO */}
      {playing && sess && (
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 100px",background:`radial-gradient(ellipse at center,${sess.dark} 0%,#050310 100%)`,position:"relative",overflow:"hidden"}}>
          {[...Array(14)].map((_,i)=>(
            <div key={i} style={{position:"absolute",width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:"rgba(255,255,255,.6)",top:`${8+i*6}%`,left:`${4+i*6.5}%`,animation:`starFloat ${2+i*0.4}s ease-in-out ${i*0.25}s infinite`}}/>
          ))}

          {/* CÍRCULO DE RESPIRACIÓN */}
          <div style={{position:"relative",width:180,height:180,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* Anillos expansivos */}
            {[0,0.75,1.5].map((delay,i)=>(
              <div key={i} style={{position:"absolute",inset:0,borderRadius:"50%",border:`1.5px solid ${sess.color}${['44','28','18'][i]}`,animation:`ringOut 3s ease-out ${delay}s infinite`}}/>
            ))}
            {/* Orb que respira */}
            <div style={{
              width:breathPhase==='inhale'?156:120,height:breathPhase==='inhale'?156:120,
              borderRadius:"50%",
              background:`radial-gradient(circle,${sess.color}40,${sess.color}10)`,
              border:`2px solid ${sess.color}60`,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 ${breathPhase==='inhale'?70:40}px ${sess.glow}`,
              transition:"all 4s ease-in-out",
            }}>
              <WellnessIcon type={sess.icon} color={sess.color} size={42}/>
            </div>
          </div>

          {/* Instrucción de respiración */}
          <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",color:sess.color,opacity:.8,marginBottom:16,transition:"opacity .5s"}}>
            {breathPhase==='inhale'?MBB_T.inhale:MBB_T.exhale}
          </div>

          {/* Hz display */}
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:sess.color,lineHeight:1,letterSpacing:"-1px"}}>{sess.title}</div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginTop:3}}>{sess.subtitle}</div>
          </div>

          {/* Frase guiada */}
          {showGuide && sess.guide && (
            <div style={{background:`${sess.color}12`,border:`1px solid ${sess.color}25`,borderRadius:16,padding:"12px 18px",marginBottom:16,maxWidth:280,textAlign:"center",animation:"hzCount .5s ease both"}}>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.7,fontStyle:"italic"}}>"{sess.guide[guideIdx%sess.guide.length]}"</p>
            </div>
          )}

          {/* Progreso */}
          <div style={{width:"100%",maxWidth:280,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{fmt(elapsed)}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>-{fmt(selDur*60-elapsed)}</span>
            </div>
            <div style={{height:3,borderRadius:3,background:"rgba(255,255,255,.08)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress*100}%`,background:`linear-gradient(90deg,${sess.color},${sess.color}88)`,borderRadius:3,transition:"width 1s linear"}}/>
            </div>
          </div>

          <button onClick={()=>stop(true)} style={{padding:"13px 36px",borderRadius:99,border:`1.5px solid ${sess.color}45`,background:"rgba(255,255,255,.07)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:sess.color,fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:".04em"}}>
            {MBB_T.endSession}
          </button>
        </div>
      )}

      {/* SELECTOR (cuando no está reproduciendo) */}
      {!playing && (
        <div style={{padding:"80px 16px 100px",display:"flex",flexDirection:"column",gap:16}}>

          {/* Título */}
          <div style={{textAlign:"center",marginBottom:4}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(180,150,255,.5)",marginBottom:8}}>{MBB_T.eyebrow}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:"rgba(255,255,255,.92)",lineHeight:1.15,marginBottom:6}}>{MBB_T.titleLine1}<br/>{MBB_T.titleLine2}</div>
            <div style={{fontSize:12.5,color:"rgba(255,255,255,.35)",lineHeight:1.6}}>{MBB_T.subLine}<br/>{MBB_T.subLine2}</div>
          </div>

          {/* Cards de frecuencia (2x2 grid) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {BABY_SESSIONS.map(s => {
              const on = selId === s.id;
              return (
                <button key={s.id} className="freq-card" onClick={()=>setSelId(s.id)} style={{
                  padding:"16px 12px",borderRadius:20,textAlign:"center",
                  background:on?`linear-gradient(135deg,${s.dark},${s.mid})`:"rgba(255,255,255,.05)",
                  border:`1.5px solid ${on?s.color+"55":"rgba(255,255,255,.1)"}`,
                  boxShadow:on?`0 8px 32px ${s.glow},0 0 0 1px ${s.color}20`:"none",
                  transform:on?"scale(1.02)":"scale(1)",
                  color:"#fff",
                }}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:`${s.color}20`,border:`1.5px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",boxShadow:on?`0 0 20px ${s.glow}`:"none"}}>
                    <WellnessIcon type={s.icon} color={s.color} size={22}/>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:on?s.color:"rgba(255,255,255,.85)",lineHeight:1,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:8,letterSpacing:".04em"}}>{s.subtitle}</div>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)",display:"inline-block",padding:"2px 8px",borderRadius:99,border:"1px solid rgba(255,255,255,.12)"}}>{MBB_T.weekAbbr} {s.weeks}</div>
                </button>
              );
            })}
          </div>

          {/* Duración */}
          <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:10}}>{MBB_T.duration}</div>
            <div style={{display:"flex",gap:8}}>
              {[10,20,30].map(d=>(
                <button key={d} onClick={()=>setSelDur(d)} style={{flex:1,padding:"11px 8px",borderRadius:13,border:`1.5px solid ${selDur===d?"rgba(165,143,224,.5)":"rgba(255,255,255,.1)"}`,background:selDur===d?"rgba(165,143,224,.18)":"transparent",color:selDur===d?"#A58FE0":"rgba(255,255,255,.4)",fontWeight:700,fontSize:14,cursor:"pointer",textAlign:"center"}}>
                  {d}<span style={{display:"block",fontSize:9,fontWeight:500,opacity:.7}}>min</span>
                </button>
              ))}
            </div>
          </div>

          {/* Play */}
          <button onClick={play} disabled={!selId} style={{
            width:"100%",padding:"16px",borderRadius:99,border:"none",
            cursor:selId?"pointer":"not-allowed",
            background:selId?`linear-gradient(135deg,${BABY_SESSIONS.find(s=>s.id===selId)?.color||"#8B5A9E"},${BABY_SESSIONS.find(s=>s.id===selId)?.mid||"#1a1040"})`:"rgba(255,255,255,.06)",
            color:"#fff",fontFamily:"inherit",fontSize:15,fontWeight:800,
            boxShadow:selId?`0 12px 36px ${BABY_SESSIONS.find(s=>s.id===selId)?.glow||"rgba(139,90,158,.4)"}`:"none",
            display:"flex",alignItems:"center",justifyContent:"center",gap:9,
            opacity:selId?1:0.35,transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="white"><path d="M8 5l12 7-12 7Z"/></svg>
            {selId?MBB_T.startTherapy:MBB_T.chooseFreq}
          </button>

          {/* Disclaimer */}
          <div style={{display:"flex",gap:8,alignItems:"flex-start",padding:"0 4px"}}>
            <span style={{fontSize:12,color:"rgba(165,143,224,.4)",flexShrink:0}}>✦</span>
            <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.25)",lineHeight:1.6}}>{MBB_T.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CitasScreen, SintomasScreen, RecompensasScreen, UltrasonidosScreen, PesoScreen, AjustesScreen, KickTrackerScreen, FotosScreen, MeditacionesScreen, EjerciciosScreen, ContenidoSemanalScreen, DiarioScreen, ExpertosScreen, ParejaScreen, HistorialScreen, NutricionPersonalizadaScreen, MusicaBebeScreen, MeditacionMusicaScreen, MeditacionBebesScreen });