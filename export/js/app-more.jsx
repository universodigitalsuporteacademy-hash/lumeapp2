/* Lumé app — Asistente, Nombres, Nutricion, Premium */

const MEAL_CAT_META = {
  "Desayuno": { icon: "spark", img: "uploads/icon-app-02.png", color: "#C8952A", bg: "rgba(200,149,42,.11)", shadow: "rgba(200,149,42,.24)" },
  "Almuerzo": { icon: "leaf",  img: "uploads/icon-app-03.png", color: "#3A8A4A", bg: "rgba(58,138,74,.11)",  shadow: "rgba(58,138,74,.24)"  },
  "Cena":     { icon: "star",  img: "uploads/icon-app-04.png", color: "#7040B0", bg: "rgba(112,64,176,.11)", shadow: "rgba(112,64,176,.24)" },
  "Snacks":   { icon: "heart", img: "uploads/icon-app-05.png", color: "#C84878", bg: "rgba(200,72,120,.11)", shadow: "rgba(200,72,120,.24)" },
};

const SUGGESTIONS_ES = ["¿Es normal sentir contracciones?", "¿Qué puedo comer hoy?", "Tengo dolor de espalda", "Ideas para dormir mejor"];
const SUGGESTIONS_EN = ["Is it normal to feel contractions?", "What can I eat today?", "I have back pain", "Ideas to sleep better"];
function getAppLang2() { try { return localStorage.getItem("lume_lang") || "es"; } catch { return "es"; } }
const SUGGESTIONS = getAppLang2()==="en" ? SUGGESTIONS_EN : SUGGESTIONS_ES;

const AI_T = {
  es: { greeting:"Hola, soy Glow — tu asistente personal de Lumé. Puedes preguntarme cualquier duda sobre tu embarazo, síntomas, nutrición o bienestar. Estoy aquí a cualquier hora. ¿En qué te ayudo hoy?",
    limit:" preguntas gratis de hoy. Activa Bienestar para consultas ilimitadas con Glow, a cualquier hora. \uD83D\uDC9B", usedPrefix:"Ya usaste tus ",
    clearChat:"Limpiar chat", header:"Asistente Lumé", week:"Sem.", aiContext:"Contexto IA", noSx:"Sin síntomas · editar",
    weekOf:"Semana de embarazo", wk4:"Sem. 4", wk42:"Sem. 42", activeSx:"Síntomas activos", of5:"/5 seleccionados",
    saveCtx:"Guardar contexto", ctxUpdated:"Contexto actualizado", inputPh:"Escribe tu pregunta\u2026",
    freeMid:" de ", freeSuffix:" preguntas gratis hoy · Activa Bienestar para ilimitadas",
    tri:["Primer trimestre","Segundo trimestre","Tercer trimestre"],
    sxList:["Náuseas", "Cansancio", "Dolor lumbar", "Acidez", "Insomnio", "Mareos", "Calambres", "Antojos", "Hinchazón", "Buen ánimo"],
    aiLang:"Responde en español con calidez y precisión médica.",
    fallbackDefault:"Ante cualquier síntoma nuevo o preocupación, tu ginecóloga o matrona son siempre tu mejor apoyo. Lumé está aquí para acompañarte. ¿Hay algo más en lo que pueda orientarte? \uD83D\uDC9B",
    fallbackNausea:"Las náuseas son muy frecuentes en el embarazo. Come porciones pequeñas y frecuentes, prueba el jengibre y mantén galletas a mano al despertar. Si no puedes retener líquidos, avisa a tu médica.",
    fallbackBack:"El dolor de espalda es muy común conforme el bebé crece. Calor suave en la zona lumbar, almohada entre las rodillas al dormir y estiramientos suaves ayudan mucho.",
    fallbackFood:"La nutrición prenatal es clave. Prioriza proteínas, hierro, calcio, ácido fólico y omega-3. Evita crudos y embutidos sin cocinar.",
    fallbackSleep:"El insomnio prenatal es normal. Prueba la posición de lado izquierdo con almohada de embarazo, la respiración 4-7-8 y evita pantallas 1 hora antes de dormir.",
  },
  en: { greeting:"Hi, I'm Glow — your personal Lumé assistant. Ask me anything about your pregnancy, symptoms, nutrition, or wellness. I'm here any time. How can I help today?",
    limit:" free questions for today. Activate Wellness for unlimited chats with Glow, any time. \uD83D\uDC9B", usedPrefix:"You've used your ",
    clearChat:"Clear chat", header:"Lumé Assistant", week:"Wk.", aiContext:"AI Context", noSx:"No symptoms · edit",
    weekOf:"Pregnancy week", wk4:"Wk. 4", wk42:"Wk. 42", activeSx:"Active symptoms", of5:"/5 selected",
    saveCtx:"Save context", ctxUpdated:"Context updated", inputPh:"Type your question\u2026",
    freeMid:" of ", freeSuffix:" free questions today · Activate Wellness for unlimited",
    tri:["First trimester","Second trimester","Third trimester"],
    sxList:["Nausea", "Fatigue", "Lower back pain", "Heartburn", "Insomnia", "Dizziness", "Cramps", "Cravings", "Bloating", "Feeling good"],
    aiLang:"Respond in English with warmth and medical accuracy.",
    fallbackDefault:"For any new symptom or concern, your OB-GYN or midwife is always your best support. Lumé is here to walk with you. Is there anything else I can help with? \uD83D\uDC9B",
    fallbackNausea:"Nausea is very common in pregnancy. Eat small, frequent portions, try ginger, and keep crackers close at hand for when you wake up. If you can't keep liquids down, tell your doctor.",
    fallbackBack:"Back pain is very common as your baby grows. Gentle heat on the lower back, a pillow between your knees while sleeping, and gentle stretches help a lot.",
    fallbackFood:"Prenatal nutrition is key. Prioritize protein, iron, calcium, folic acid, and omega-3. Avoid raw or uncooked deli meats.",
    fallbackSleep:"Prenatal insomnia is normal. Try sleeping on your left side with a pregnancy pillow, 4-7-8 breathing, and avoid screens 1 hour before bed.",
  },
};

function Asistente({ goToTab } = {}) {
  const isPremium = React.useMemo(()=>{try{return !!localStorage.getItem("lume_premium");}catch{return false;}}, []);
  const aiLang = getAppLang2();
  const at = AI_T[aiLang];
  const FREE_CHATS = 3;
  const chatKey = "lume_chats_" + new Date().toISOString().slice(0,10);
  const INITIAL_MSG = at.greeting;

  /* ── Estado del chat ── */
  const [msgs, setMsgs] = React.useState([{ who: "bot", text: INITIAL_MSG }]);
  const [val, setVal] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [chatsToday, setChatsToday] = React.useState(() => { try { return parseInt(localStorage.getItem(chatKey) || "0") || 0; } catch { return 0; } });
  const logRef = React.useRef(null);

  /* ── Estado del contexto editable ── */
  const [ctxOpen, setCtxOpen] = React.useState(false);
  const [editWeeks, setEditWeeks] = React.useState(() => parseInt(localStorage.getItem("lume_weeks") || "15") || 15);
  const [editSx, setEditSx] = React.useState(() => {
    try {
      const h = JSON.parse(localStorage.getItem("lume_sx_hist") || "[]");
      return [...new Set(h.slice(0, 4).flatMap(e => e.symptoms || []))].slice(0, 5);
    } catch { return []; }
  });
  const [ctxSaved, setCtxSaved] = React.useState(false);

  const tri = editWeeks <= 13 ? 1 : editWeeks <= 26 ? 2 : 3;
  const triLabel = at.tri[tri - 1];
  const SX_LIST = at.sxList;

  React.useEffect(() => {
    const l = logRef.current;
    if (l) l.scrollTop = l.scrollHeight;
  }, [msgs, loading]);

  const clearChat = () => setMsgs([{ who: "bot", text: INITIAL_MSG }]);

  const saveCtx = () => {
    localStorage.setItem("lume_weeks", String(editWeeks));
    setCtxSaved(true);
    setTimeout(() => { setCtxSaved(false); setCtxOpen(false); }, 1400);
  };

  const toggleSx = (s) =>
    setEditSx(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s].slice(0, 5));

  const renderText = (text) => text.split("\n").filter(l => l.trim()).map((line, i) => (
    <p key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", lineHeight: 1.65 }}>{line}</p>
  ));

  const send = async (text) => {
    const t = (text ?? val).trim();
    if (!t || loading) return;
    if (!isPremium && chatsToday >= FREE_CHATS) {
      setVal("");
      setMsgs(m => [...m, { who: "me", text: t }, { who: "bot", text: at.usedPrefix + FREE_CHATS + at.limit }]);
      return;
    }
    setVal("");
    setMsgs(m => [...m, { who: "me", text: t }]);
    setLoading(true);
    if (!isPremium) {
      const n = chatsToday + 1;
      setChatsToday(n);
      try { localStorage.setItem(chatKey, String(n)); } catch {}
    }
    try {
      const nombre = localStorage.getItem("lume_nombre") || "Sofía";
      const due = localStorage.getItem("lume_due") || "";
      const sxStr = editSx.length ? editSx.join(", ") : (aiLang==="en"?"none reported":"ninguno reportado");
      // Build context prompt — simple string form, most compatible
      const ctx = `Eres Glow, el asistente de IA de Lumé. Hablas con ${nombre}, semana ${editWeeks} (${triLabel}).${due ? " Parto esperado: " + due + "." : ""} Síntomas activos: ${sxStr}. ${at.aiLang} Máximo 3 párrafos cortos. Sin markdown. Nunca reemplaces al médico.`;
      // Include last 4 exchanges as context in the prompt
      const recent = msgs.slice(-8).filter(m => m.who !== "bot" || m.text !== INITIAL_MSG);
      const history = recent.map(m => (m.who === "me" ? "Usuaria: " : "Glow: ") + m.text).join("\n");
      const prompt = ctx + (history ? "\n\nConversación previa:\n" + history : "") + "\n\nUsuaria: " + t + "\nGlow:";
      const reply = await lumeAI(prompt);
      setMsgs(m => [...m, { who: "bot", text: reply.trim() }]);
    } catch (e) {
      console.error('[Glow]', e);
      const lower = t.toLowerCase();
      let fallback = at.fallbackDefault;
      if (lower.match(/nause|vomit|mareo|sick/)) fallback = at.fallbackNausea;
      else if (lower.match(/dolor|espalda|calambr|back pain/)) fallback = at.fallbackBack;
      else if (lower.match(/com|aliment|nutri|comer|receta|food|eat/)) fallback = at.fallbackFood;
      else if (lower.match(/dormir|insomnio|sue|sleep/)) fallback = at.fallbackSleep;
      setMsgs(m => [...m, { who: "bot", text: fallback }]);
    }
    setLoading(false);
  };

  /* ── Estilos vidrio reutilizables ── */
  const glassCard = {
    background: "linear-gradient(160deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.58) 100%)",
    backdropFilter: "blur(28px) saturate(170%)",
    WebkitBackdropFilter: "blur(28px) saturate(170%)",
    border: "1px solid rgba(255,255,255,.88)",
    boxShadow: "0 18px 48px -12px rgba(168,73,42,.26), 0 2px 0 rgba(255,255,255,.95) inset",
  };

  const pct = Math.round(((editWeeks - 4) / 38) * 100);

  return (
    <div className="screen chat" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* ── Video fondo ── */}
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(249,241,235,.74) 0%, rgba(244,232,224,.80) 45%, rgba(236,220,200,.92) 100%)" }}></div>

      <style>{`
        .sx-btn { transition: all .17s cubic-bezier(.23,1,.32,1); }
        .sx-btn:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .ctx-row:hover { background: rgba(168,73,42,.06) !important; }
        .wk-btn { transition: all .12s ease; }
        .wk-btn:hover { background: rgba(168,73,42,.18) !important; transform: scale(1.08); }
        .wk-btn:active { transform: scale(.94); }
      `}</style>

      {/* ── Header glass ── */}
      <div className="chat-head" style={{ position: "relative", zIndex: 10, background: "rgba(246,237,228,.75)", backdropFilter: "blur(28px) saturate(160%)", WebkitBackdropFilter: "blur(28px) saturate(160%)", borderBottom: "1px solid rgba(255,255,255,.65)" }}>
        <div className="av" style={{ background: "linear-gradient(135deg,rgba(168,73,42,.22),rgba(168,73,42,.10))", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,.7)", boxShadow: "0 6px 18px rgba(168,73,42,.22)" }}>
          <AppIcon name="spark" size={30}/>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{at.header}</h3>
          <div className="st" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Glow · {at.week} {editWeeks} · T{tri}{editSx.length ? ` · ${editSx[0]}` : ""}</div>
        </div>
        <button onClick={clearChat} title={at.clearChat} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(168,73,42,.18)", background: "rgba(255,255,255,.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 12px rgba(168,73,42,.15)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>

      {/* ══════════════════════════════════════════
          PANEL CONTEXTO EDITABLE — vidrio completo
          ══════════════════════════════════════════ */}
      <div style={{ position: "relative", zIndex: 9, padding: "10px 14px 0" }}>
        <div style={{ ...glassCard, borderRadius: 22, overflow: "hidden" }}>

          {/* Fila resumen — siempre visible, toca para abrir/cerrar */}
          <button className="ctx-row" onClick={() => setCtxOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRadius: ctxOpen ? "22px 22px 0 0" : 22 }}>

            {/* Ícono info */}
            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, rgba(168,73,42,.2), rgba(168,73,42,.08))", border: "1px solid rgba(168,73,42,.22)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(168,73,42,.18)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/></svg>
            </div>

            {/* Chips de contexto */}
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".13em", textTransform: "uppercase", color: "#A8492A", opacity: .72, marginRight: 2 }}>{at.aiContext}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#5a3a2a", background: "rgba(168,73,42,.11)", border: "1px solid rgba(168,73,42,.2)", borderRadius: 20, padding: "2px 10px" }}>{at.week} {editWeeks}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#5a3a2a", background: "rgba(168,73,42,.11)", border: "1px solid rgba(168,73,42,.2)", borderRadius: 20, padding: "2px 10px" }}>T{tri}</span>
              {editSx.length > 0 ? editSx.slice(0, 3).map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 600, color: "#7a4535", background: "rgba(168,73,42,.07)", border: "1px solid rgba(168,73,42,.15)", borderRadius: 20, padding: "2px 9px" }}>{s}</span>
              )) : (
                <span style={{ fontSize: 11, color: "#b09080", fontStyle: "italic" }}>{at.noSx}</span>
              )}
            </div>

            {/* Chevron animado */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, opacity: .55, transition: "transform .28s cubic-bezier(.23,1,.32,1)", transform: ctxOpen ? "rotate(180deg)" : "none" }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {/* ── Panel desplegable de edición ── */}
          {ctxOpen && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,.65)", padding: "16px 16px 18px", animation: "ctxReveal .24s cubic-bezier(.23,1,.32,1) forwards" }}>

              {/* — Semana — */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#A8492A", opacity: .7, marginBottom: 10 }}>{at.weekOf}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button className="wk-btn" onClick={() => setEditWeeks(w => Math.max(4, w - 1))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(168,73,42,.22)", background: "rgba(255,255,255,.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#A8492A", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 14px rgba(168,73,42,.12)" }}>−</button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 34, fontWeight: 800, color: "#3d1a0e", lineHeight: 1, fontFamily: "Cormorant Garamond, serif", letterSpacing: "-.5px" }}>{editWeeks}</div>
                    <div style={{ fontSize: 11.5, color: "#a08070", marginTop: 3, fontWeight: 500 }}>{triLabel}</div>
                  </div>
                  <button className="wk-btn" onClick={() => setEditWeeks(w => Math.min(42, w + 1))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(168,73,42,.22)", background: "rgba(255,255,255,.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#A8492A", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 14px rgba(168,73,42,.12)" }}>+</button>
                </div>
                {/* Barra de progreso */}
                <div style={{ marginTop: 12, height: 5, borderRadius: 5, background: "rgba(168,73,42,.1)", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(168,73,42,.08)" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #A8492A, #D4AF80)", borderRadius: 5, transition: "width .22s ease" }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "#c0a090" }}>{at.wk4}</span>
                  <span style={{ fontSize: 10, color: "#c0a090" }}>{at.wk42}</span>
                </div>
              </div>

              {/* — Síntomas activos — */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#A8492A", opacity: .7 }}>{at.activeSx}</div>
                  <div style={{ fontSize: 10, color: "#b09080" }}>{editSx.length}{at.of5}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {SX_LIST.map((s, idx) => {
                    const on = editSx.includes(s);
                    return (
                      <button key={s} className="sx-btn" onClick={() => toggleSx(s)} style={{
                        padding: "6px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        border: on ? "1.5px solid rgba(168,73,42,.5)" : "1.5px solid rgba(168,73,42,.14)",
                        background: on
                          ? "linear-gradient(135deg, rgba(168,73,42,.2), rgba(168,73,42,.12))"
                          : "rgba(255,255,255,.68)",
                        color: on ? "#A8492A" : "#8a6a5a",
                        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                        boxShadow: on ? "0 4px 14px rgba(168,73,42,.2)" : "0 2px 6px rgba(168,73,42,.06)",
                        animation: `chipIn .2s ease ${idx * 0.03}s both forwards`,
                      }}>{s}</button>
                    );
                  })}
                </div>
              </div>

              {/* — Botón guardar — */}
              <button onClick={saveCtx} style={{
                width: "100%", padding: "12px", borderRadius: 16, border: "none",
                background: ctxSaved
                  ? "linear-gradient(135deg, rgba(60,160,90,.9), rgba(40,130,70,.85))"
                  : "linear-gradient(135deg, #A8492A 0%, #8B3520 100%)",
                color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "background .35s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: ctxSaved ? "0 8px 24px rgba(60,160,90,.3)" : "0 8px 24px rgba(168,73,42,.35)",
              }}>
                {ctxSaved ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l4.5 4.5L19 7"/></svg>
                    {at.ctxUpdated}
                  </>
                ) : at.saveCtx}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Chat log ── */}
      <div className="chat-log" ref={logRef} style={{ position: "relative", zIndex: 2, flex: 1, overflowY: "auto", padding: "10px 0 4px" }}>
        {msgs.map((m, i) => {
          const isBot = m.who === "bot";
          return (
            <div key={i} className={"msg " + (isBot ? "bot" : "me")} style={isBot ? {
              background: "linear-gradient(160deg, rgba(255,255,255,.90) 0%, rgba(255,255,255,.60) 100%)",
              backdropFilter: "blur(26px) saturate(165%)",
              WebkitBackdropFilter: "blur(26px) saturate(165%)",
              border: "1px solid rgba(255,255,255,.92)",
              boxShadow: "0 14px 40px rgba(168,73,42,.22), 0 1px 0 rgba(255,255,255,.95) inset",
              animation: "slideInLeft .32s ease-out forwards",
            } : {
              background: "linear-gradient(135deg, rgba(168,73,42,.96) 0%, rgba(139,53,32,.93) 100%)",
              boxShadow: "0 14px 40px -4px rgba(168,73,42,.42)",
              animation: "slideInRight .32s ease-out forwards",
            }}>
              {renderText(m.text)}
            </div>
          );
        })}
        {loading && (
          <div className="msg bot" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.90) 0%, rgba(255,255,255,.60) 100%)", backdropFilter: "blur(26px) saturate(165%)", WebkitBackdropFilter: "blur(26px) saturate(165%)", border: "1px solid rgba(255,255,255,.92)", boxShadow: "0 14px 40px rgba(168,73,42,.22)", animation: "slideInLeft .32s ease-out forwards", display: "flex", gap: 5, alignItems: "center", padding: "14px 18px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#A8492A", animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite` }}></div>
            ))}
          </div>
        )}
      </div>

      {/* ── Chips de sugerencia ── */}
      <div className="chips" style={{ position: "relative", zIndex: 2 }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="chip" onClick={() => send(s)} disabled={loading}>{s}</button>
        ))}
      </div>

      {!isPremium && (
        <div onClick={() => goToTab && goToTab("premium")} style={{ position: "relative", zIndex: 2, margin: "0 14px 8px", padding: "8px 14px", borderRadius: 12, background: "rgba(168,73,42,.08)", border: "1px solid rgba(168,73,42,.18)", fontSize: 11.5, fontWeight: 600, color: "#A8492A", textAlign: "center", cursor: "pointer" }}>
          {Math.max(0, FREE_CHATS - chatsToday)}{at.freeMid}{FREE_CHATS}{at.freeSuffix}
        </div>
      )}

      {/* ── Input ── */}
      <div className="chat-input" style={{ position: "relative", zIndex: 2, background: "rgba(236,220,200,.82)", backdropFilter: "blur(22px) saturate(145%)", WebkitBackdropFilter: "blur(22px) saturate(145%)" }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} placeholder={at.inputPh} disabled={loading} style={{ opacity: loading ? .6 : 1 }} />
        <button className="send" onClick={() => send()} aria-label="Enviar" disabled={loading} style={{ opacity: loading ? .5 : 1 }}>
          <AppIcon name="send" size={26}/>
        </button>
      </div>
    </div>
  );
}

const NAMES = [
  { nm:"Valentina", g:"Niña", ipa:"va·len·TEE·na", origin:"Latín", originEn:"Latin", mean:"Fuerte, valiente y llena de vitalidad.", meanEn:"Strong, brave, and full of vitality." },
  { nm:"Mateo", g:"Niño", ipa:"ma·TEH·o", origin:"Hebreo", originEn:"Hebrew", mean:"Regalo de Dios; un don esperado.", meanEn:"Gift of God; a long-awaited blessing." },
  { nm:"Aurora", g:"Niña", ipa:"au·RO·ra", origin:"Latín", originEn:"Latin", mean:"El amanecer, la primera luz del día.", meanEn:"The dawn, the first light of day." },
  { nm:"Thiago", g:"Niño", ipa:"ti·A·go", origin:"Griego", originEn:"Greek", mean:"El que sostiene firme; sereno y noble.", meanEn:"He who holds firm; calm and noble." },
  { nm:"Olivia", g:"Niña", ipa:"o·LI·via", origin:"Latín", originEn:"Latin", mean:"Símbolo de paz, como la rama de olivo.", meanEn:"Symbol of peace, like the olive branch." },
  { nm:"Bruno", g:"Niño", ipa:"BRU·no", origin:"Germánico", originEn:"Germanic", mean:"De cálido color tierra; protector.", meanEn:"Of warm earthy color; a protector." },
  { nm:"Lucía", g:"Niña", ipa:"lu·SEE·a", origin:"Latín", originEn:"Latin", mean:"Luz; la que trae claridad al mundo.", meanEn:"Light; she who brings clarity to the world." },
  { nm:"Santiago", g:"Niño", ipa:"san·TIA·go", origin:"Hebreo", originEn:"Hebrew", mean:"El que sigue a Dios; fiel y constante.", meanEn:"He who follows God; faithful and steadfast." },
  { nm:"Sofía", g:"Niña", ipa:"so·FEE·a", origin:"Griego", originEn:"Greek", mean:"Sabiduría serena y profunda.", meanEn:"Calm and profound wisdom." },
  { nm:"Benjamín", g:"Niño", ipa:"ben·ja·MIN", origin:"Hebreo", originEn:"Hebrew", mean:"Hijo predilecto, el más querido.", meanEn:"Favorite son, the most beloved." },
  { nm:"Emma", g:"Niña", ipa:"E·ma", origin:"Germánico", originEn:"Germanic", mean:"Universal, fuerte y completa.", meanEn:"Universal, strong, and whole." },
  { nm:"Lucas", g:"Niño", ipa:"LU·cas", origin:"Latín", originEn:"Latin", mean:"Nacido con la luz del amanecer.", meanEn:"Born with the light of dawn." },
  { nm:"Isabella", g:"Niña", ipa:"i·sa·BE·la", origin:"Hebreo", originEn:"Hebrew", mean:"Promesa de Dios; gracia y devoción.", meanEn:"Promise of God; grace and devotion." },
  { nm:"Emiliano", g:"Niño", ipa:"e·mi·LIA·no", origin:"Latín", originEn:"Latin", mean:"Esforzado, amable y trabajador.", meanEn:"Diligent, kind, and hardworking." },
  { nm:"Camila", g:"Niña", ipa:"ca·MI·la", origin:"Latín", originEn:"Latin", mean:"La que está cerca, noble y atenta.", meanEn:"She who is near, noble and attentive." },
  { nm:"Joaquín", g:"Niño", ipa:"jo·a·KIN", origin:"Hebreo", originEn:"Hebrew", mean:"Dios construye y sostiene.", meanEn:"God builds and sustains." },
  { nm:"Martina", g:"Niña", ipa:"mar·TI·na", origin:"Latín", originEn:"Latin", mean:"Consagrada a la fuerza y la valentía.", meanEn:"Devoted to strength and courage." },
  { nm:"Maximiliano", g:"Niño", ipa:"max·i·mi·LIA·no", origin:"Latín", originEn:"Latin", mean:"El más grande, de gran nobleza.", meanEn:"The greatest, of great nobility." },
  { nm:"Julieta", g:"Niña", ipa:"ju·LIE·ta", origin:"Latín", originEn:"Latin", mean:"Joven y luminosa, de raíz noble.", meanEn:"Young and radiant, of noble root." },
  { nm:"Dante", g:"Niño", ipa:"DAN·te", origin:"Latín", originEn:"Latin", mean:"Firme y duradero en su voluntad.", meanEn:"Firm and enduring in his will." },
  { nm:"Renata", g:"Niña", ipa:"re·NA·ta", origin:"Latín", originEn:"Latin", mean:"La que vuelve a nacer; renovada.", meanEn:"She who is reborn; renewed." },
  { nm:"Gael", g:"Niño", ipa:"ga·EL", origin:"Bretón", originEn:"Breton", mean:"Generoso, de espíritu libre.", meanEn:"Generous, of a free spirit." },
  { nm:"Catalina", g:"Niña", ipa:"ca·ta·LI·na", origin:"Griego", originEn:"Greek", mean:"Pura y limpia de corazón.", meanEn:"Pure and clean of heart." },
  { nm:"Sebastián", g:"Niño", ipa:"se·bas·TIAN", origin:"Griego", originEn:"Greek", mean:"Venerable y digno de respeto.", meanEn:"Venerable and worthy of respect." },
  { nm:"Elena", g:"Niña", ipa:"e·LE·na", origin:"Griego", originEn:"Greek", mean:"Antorcha brillante, la que ilumina.", meanEn:"Bright torch, she who illuminates." },
  { nm:"Nicolás", g:"Niño", ipa:"ni·co·LAS", origin:"Griego", originEn:"Greek", mean:"La victoria del pueblo.", meanEn:"Victory of the people." },
  { nm:"Antonella", g:"Niña", ipa:"an·to·NE·la", origin:"Latín", originEn:"Latin", mean:"Inestimable, de valor incalculable.", meanEn:"Priceless, of inestimable worth." },
  { nm:"Lorenzo", g:"Niño", ipa:"lo·REN·zo", origin:"Latín", originEn:"Latin", mean:"Coronado de laurel, victorioso.", meanEn:"Crowned with laurel, victorious." },
  { nm:"Victoria", g:"Niña", ipa:"vic·TO·ria", origin:"Latín", originEn:"Latin", mean:"La que triunfa con gracia.", meanEn:"She who triumphs with grace." },
  { nm:"Tomás", g:"Niño", ipa:"to·MAS", origin:"Arameo", originEn:"Aramaic", mean:"Hermano cercano; leal y constante.", meanEn:"Close brother; loyal and steadfast." },
  { nm:"Mía", g:"Niña", ipa:"MI·a", origin:"Italiano", originEn:"Italian", mean:"Mía; querida y muy amada.", meanEn:"Mine; dear and deeply loved." },
  { nm:"Ian", g:"Niño", ipa:"I·an", origin:"Hebreo", originEn:"Hebrew", mean:"Dios es misericordioso.", meanEn:"God is gracious." },
  { nm:"Regina", g:"Niña", ipa:"re·JI·na", origin:"Latín", originEn:"Latin", mean:"Reina, de espíritu digno.", meanEn:"Queen, of dignified spirit." },
  { nm:"Alejandro", g:"Niño", ipa:"a·le·JAN·dro", origin:"Griego", originEn:"Greek", mean:"Protector y defensor de todos.", meanEn:"Protector and defender of all." },
  { nm:"Daniela", g:"Niña", ipa:"da·NIE·la", origin:"Hebreo", originEn:"Hebrew", mean:"Dios es mi juez y mi guía.", meanEn:"God is my judge and my guide." },
  { nm:"Liam", g:"Niño", ipa:"LI·am", origin:"Irlandés", originEn:"Irish", mean:"Protector decidido y voluntarioso.", meanEn:"Determined and resolute protector." },
];

function Nombres({ goBack }) {
  const nlang = getAppLang2();
  const NM_T = nlang==="en" ? {
    forBaby:"For your baby", title:"Names", sub:"Swipe to discover · Save the ones you love",
    backAria:"Back", noBg:{ Niña:"Girl", Niño:"Boy" }, origin:"Origin",
    nope:"Discard", like:"Like", left:"Left · discard", right:"Right · save",
    favBtn:"favorites", favTitle:"Your picks", favHeading:"Favorite names", favEmpty:"No favorites yet. Swipe ❤\uFE0F the names you love.",
  } : {
    forBaby:"Para tu bebé", title:"Nombres", sub:"Desliza para descubrir · Guarda los que enamoran",
    backAria:"Regresar", noBg:{ Niña:"Niña", Niño:"Niño" }, origin:"Origen",
    nope:"Descartar", like:"Me gusta", left:"Izquierda · descartar", right:"Derecha · guardar",
    favBtn:"favoritos", favTitle:"Tus elegidos", favHeading:"Nombres favoritos", favEmpty:"Aún no tienes favoritos. Desliza ❤\uFE0F los nombres que más te gusten.",
  };
  const [idx, setIdx] = React.useState(0);
  const [favNames, setFavNames] = React.useState(() => { try { return JSON.parse(localStorage.getItem("lume_fav_names")) || ["Lucía", "Mateo"]; } catch { return ["Lucía", "Mateo"]; } });
  const [swipe, setSwipe] = React.useState("");
  const [showFavs, setShowFavs] = React.useState(false);
  // Imágenes con fondo removido (versión limpia sin sombra gris)
  const charImg = {
    "Niña": "uploads/nena_clean.png",
    "Niño": "uploads/neno_clean.png",
  };
  const [drag, setDrag] = React.useState({ x: 0, active: false });
  const dragRef = React.useRef({ startX: 0, dragging: false });
  const cur = NAMES[idx % NAMES.length];
  const next = NAMES[(idx + 1) % NAMES.length];

  const GENDER = {
    "Niña": { color: "#D26A92", soft: "rgba(210,106,146,.14)", halo: "rgba(210,106,146,.34)", grad: "rgba(210,106,146,.16)" },
    "Niño": { color: "#4E86C6", soft: "rgba(78,134,198,.14)", halo: "rgba(78,134,198,.34)", grad: "rgba(78,134,198,.16)" }
  };
  const g = GENDER[cur.g];

  const act = (dir) => {
    if (swipe) return;
    setSwipe(dir);
    if (dir === "like" && !favNames.includes(cur.nm)) {
      const nf = [...favNames, cur.nm];
      setFavNames(nf);
      try { localStorage.setItem("lume_fav_names", JSON.stringify(nf)); localStorage.setItem("lume_points", (parseInt(localStorage.getItem("lume_points")||"126")||126)+5); } catch {}
    }
    setTimeout(() => { setIdx(i => i + 1); setSwipe(""); setDrag({ x: 0, active: false }); }, 360);
  };

  const onPointerDown = (e) => {
    if (swipe) return;
    dragRef.current = { startX: e.clientX, dragging: true };
    setDrag({ x: 0, active: true });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    setDrag({ x: e.clientX - dragRef.current.startX, active: true });
  };
  const onPointerUp = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const dx = drag.x;
    if (dx > 90) act("like");
    else if (dx < -90) act("nope");
    else setDrag({ x: 0, active: false });
  };

  const removeFav = (nm) => {
    const nf = favNames.filter(n => n !== nm);
    setFavNames(nf);
    try { localStorage.setItem("lume_fav_names", JSON.stringify(nf)); } catch {}
  };

  const glassCard = {
    background: "rgba(255,255,255,.52)",
    backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)",
    border: "1px solid rgba(255,255,255,.78)",
    boxShadow: "0 20px 50px -14px rgba(80,30,16,.44), 0 2px 0 rgba(255,255,255,.9) inset"
  };

  return (
    <div style={{ background: "linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)", minHeight: "100%", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
      {/* animation/class rules moved to styles/app.css to avoid React re-render resets */}

      {/* ── Fondo ambiental según género ── */}
      <div className="nm-ambient" style={{ opacity: cur.g === "Niña" ? 1 : 0, background: "radial-gradient(115% 58% at 50% 14%, rgba(214,108,148,.5), transparent 60%), radial-gradient(90% 52% at 84% 70%, rgba(236,158,186,.42), transparent 64%), radial-gradient(80% 50% at 12% 86%, rgba(224,176,150,.32), transparent 66%)" }}></div>
      <div className="nm-ambient" style={{ opacity: cur.g === "Niño" ? 1 : 0, background: "radial-gradient(115% 58% at 50% 14%, rgba(78,134,198,.5), transparent 60%), radial-gradient(90% 52% at 84% 70%, rgba(126,176,222,.42), transparent 64%), radial-gradient(80% 50% at 12% 86%, rgba(150,196,214,.32), transparent 66%)" }}></div>

      {/* ── Header sticky glass ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", background: "rgba(246,237,228,.82)", borderBottom: "1px solid rgba(168,73,42,.08)", padding: "52px 20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        {goBack && (
          <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 5 }}>{NM_T.forBaby}</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "#3d1a0e", letterSpacing: "-.3px", lineHeight: 1, marginBottom: 4 }}>{NM_T.title}</h2>
          <p style={{ margin: 0, fontSize: 11.5, color: "#a08070" }}>{NM_T.sub}</p>
        </div>
        <button
          onClick={() => setShowFavs(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 99, border: "none", background: "linear-gradient(135deg,#c4693a,#A8492A)", color: "#fff", cursor: "pointer", boxShadow: "0 8px 22px rgba(168,73,42,.36)", flexShrink: 0 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span style={{ fontSize: 13, fontWeight: 800 }}>{favNames.length}</span>
        </button>
      </div>

      <div style={{ padding: "24px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* ── Stack de cartas ── */}
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          {/* Carta de atrás */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, padding: 28, ...glassCard, transform: "scale(.92) translateY(22px)", filter: "saturate(.8)", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ alignSelf: "flex-start", fontSize: 10.5, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 99, background: GENDER[next.g].soft, color: GENDER[next.g].color }}>{NM_T.noBg[next.g]}</span>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, lineHeight: 1, color: "#3d1a0e", opacity: .5 }}>{next.nm}</div>
            <div></div>
          </div>

          {/* Carta de frente */}
          <div
            className={"nm-front " + (swipe ? "sw-" + swipe : "")}
            key={idx}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ position: "absolute", inset: 0, borderRadius: 28, padding: 28, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", cursor: drag.active ? "grabbing" : "grab", touchAction: "pan-y",
              background: `linear-gradient(165deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.36) 50%, rgba(255,255,255,.2) 100%)`,
              backdropFilter: "blur(26px) saturate(150%)", WebkitBackdropFilter: "blur(26px) saturate(150%)",
              border: `1.5px solid ${g.color}aa`,
              boxShadow: `0 0 20px ${g.color}66, 0 0 52px ${g.color}3a, inset 0 0 42px ${g.color}1f, inset 0 1px 0 rgba(255,255,255,.75), 0 24px 52px -14px rgba(80,30,16,.4)`,
              transform: drag.active ? `translateX(${drag.x}px) rotate(${drag.x * 0.04}deg)` : undefined,
              transition: drag.active ? "none" : undefined }}
          >
            {/* Personaje (nene / nena) — interactivo, fondo removido con multiply */}
            {charImg[cur.g] && (
              <img
                key={cur.g + idx}
                src={charImg[cur.g]}
                alt={cur.g}
                className={"char-img" + (drag.active ? " dragging" : "")}
                style={drag.active ? {
                  transform: `rotate(${drag.x * 0.022}deg) translateX(${drag.x * 0.06}px) scale(${1 + Math.abs(drag.x) * 0.0006})`,
                  right: `${-6 + drag.x * 0.04}px`,
                } : {}}
              />
            )}

            {/* Halo decorativo por género */}
            <div style={{ position: "absolute", top: -50, right: -40, width: 210, height: 210, borderRadius: "50%", background: `radial-gradient(circle, ${g.halo}, transparent 65%)`, pointerEvents: "none" }}></div>

            <span className="nm-stamp like" style={{ right: 24, color: "#3e8836", borderColor: "#3e8836", opacity: drag.x > 40 ? Math.min(1, (drag.x - 40) / 60) : undefined }}>{NM_T.like}</span>
            <span className="nm-stamp nope" style={{ left: 24, color: "#c04040", borderColor: "#c04040", opacity: drag.x < -40 ? Math.min(1, (-drag.x - 40) / 60) : undefined }}>{nlang==="en"?"Maybe not":"Quizás no"}</span>

            <span style={{ alignSelf: "flex-start", fontSize: 10.5, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 99, background: g.soft, color: g.color, border: `1px solid ${g.color}33`, position: "relative", zIndex: 1 }}>{NM_T.noBg[cur.g]}</span>

            <div style={{ position: "relative", zIndex: 1, pointerEvents: "none", maxWidth: "72%" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 60, fontWeight: 700, lineHeight: 1, letterSpacing: "-.02em", color: "#3d1a0e" }}>{cur.nm}</div>
              <div style={{ fontSize: 14, color: "#a08070", marginTop: 7, letterSpacing: ".02em" }}>{cur.ipa}</div>
            </div>

            <div style={{ position: "relative", zIndex: 1, pointerEvents: "none", maxWidth: "76%" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: g.color, padding: "4px 11px", borderRadius: 99, background: g.soft, marginBottom: 10 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>
                {NM_T.origin} {nlang==="en"?cur.originEn:cur.origin}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontWeight: 600, color: "#5a3a2a", lineHeight: 1.4, fontStyle: "italic", marginBottom: 18 }}>{nlang==="en"?cur.meanEn:cur.mean}</div>

              {/* Pills deslizá ambos lados */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 99, background: "rgba(255,255,255,.5)", border: "1.5px solid #c0707088", color: "#c04040", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 15, fontWeight: 600, boxShadow: "0 0 10px rgba(192,64,64,.4), inset 0 0 10px rgba(192,64,64,.12)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
                  no
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 99, background: "rgba(255,255,255,.5)", border: `1.5px solid ${g.color}`, color: g.color, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 15, fontWeight: 600, boxShadow: `0 0 12px ${g.color}66, inset 0 0 12px ${g.color}1a` }}>
                  {NM_T.like.toLowerCase()}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Botones de acción ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, marginTop: 28 }}>
          <button onClick={() => act("nope")} aria-label={NM_T.nope} style={{ width: 60, height: 60, borderRadius: "50%", border: "1px solid rgba(168,73,42,.14)", background: "rgba(255,255,255,.6)", backdropFilter: "blur(12px)", color: "#c04040", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 28px -8px rgba(100,40,20,.3)", transition: "transform .18s" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button onClick={() => act("like")} aria-label={NM_T.like} style={{ width: 74, height: 74, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#c4693a,#A8492A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 14px 34px -8px rgba(168,73,42,.6)", transition: "transform .18s" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        {/* ── Instrucción ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#c04040" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {NM_T.left}
          </div>
          <div style={{ width: 1, height: 12, background: "rgba(168,73,42,.2)" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#3e8836" }}>
            {NM_T.right}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>

        <button onClick={() => setShowFavs(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 22, padding: "8px 16px", borderRadius: 99, background: "rgba(168,73,42,.07)", border: "1px solid rgba(168,73,42,.13)", color: "#A8492A", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#A8492A"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {favNames.length} {NM_T.favBtn} {favNames.length > 0 ? "· " + favNames.slice(-2).join(", ") : ""}
        </button>
      </div>

      {/* ── Panel de favoritos ── */}
      {showFavs && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(20,8,4,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end" }} onClick={() => setShowFavs(false)}>
          <div style={{ width: "100%", boxSizing: "border-box", maxHeight: "80%", overflowY: "auto", background: "rgba(246,237,228,.97)", borderRadius: "28px 28px 0 0", padding: "10px 22px 32px", boxShadow: "0 -12px 48px rgba(0,0,0,.22)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 38, height: 4, borderRadius: 99, background: "rgba(168,73,42,.2)", margin: "0 auto 20px" }}></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#A8492A", opacity: .65, marginBottom: 4 }}>{NM_T.favTitle}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#3d1a0e" }}>{NM_T.favHeading}</div>
              </div>
              <button onClick={() => setShowFavs(false)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(168,73,42,.1)", color: "#A8492A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {favNames.length === 0 ? (
              <p style={{ textAlign: "center", padding: "30px 20px", fontSize: 13.5, color: "#a08070", lineHeight: 1.6 }}>{NM_T.favEmpty}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {favNames.map((nm) => {
                  const info = NAMES.find(n => n.nm === nm) || { g: "", origin: "", mean: "" };
                  const gg = GENDER[info.g] || { color: "#A8492A", soft: "rgba(168,73,42,.08)" };
                  return (
                    <div key={nm} style={{ ...glassCard, borderRadius: 18, padding: "13px 15px", display: "flex", alignItems: "center", gap: 13 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: gg.soft, border: `1px solid ${gg.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={gg.color}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#3d1a0e", lineHeight: 1.1 }}>{nm}</div>
                        {info.mean && <div style={{ fontSize: 11.5, color: "#a08070", marginTop: 2, lineHeight: 1.4 }}>{NM_T.noBg[info.g]||info.g}{info.origin ? " · " + (nlang==="en"?(info.originEn||info.origin):info.origin) : ""}</div>}
                      </div>
                      <button onClick={() => removeFav(nm)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(200,60,60,.16)", background: "rgba(220,60,60,.06)", color: "#c04040", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Nutrición v3 — rediseño completo ─── */

const NUTRI_TIPS = [
  { t:"Hierro + vitamina C", tEn:"Iron + vitamin C", d:"Come una naranja junto a tus lentejas o espinacas. La vitamina C triplica la absorción del hierro vegetal.", dEn:"Eat an orange alongside your lentils or spinach. Vitamin C triples the absorption of plant-based iron.", tag:"hierro" },
  { t:"Calcio sin lácteos", tEn:"Calcium without dairy", d:"El brócoli, las almendras y el tofu son excelentes fuentes de calcio si no toleras bien la leche.", dEn:"Broccoli, almonds, and tofu are excellent calcium sources if you don't tolerate milk well.", tag:"calcio" },
  { t:"Folato cada día", tEn:"Folate every day", d:"Espinacas, aguacate y lentejas junto a tu suplemento de ácido fólico cubren las necesidades de desarrollo.", dEn:"Spinach, avocado, and lentils alongside your folic acid supplement cover developmental needs.", tag:"folato" },
  { t:"Proteína en cada comida", tEn:"Protein at every meal", d:"Apunta a una fuente de proteína en cada comida: huevo, legumbre, pollo, salmón o tofu.", dEn:"Aim for a protein source at every meal: egg, legumes, chicken, salmon, or tofu.", tag:"proteina" },
  { t:"Hidratación constante", tEn:"Stay hydrated", d:"Tu volumen de sangre aumenta un 50%. Los calambres y el mareo suelen ser señal de deshidratación.", dEn:"Your blood volume increases by 50%. Cramps and dizziness are often a sign of dehydration.", tag:"hidrat" },
  { t:"Omega-3 para el cerebro", tEn:"Omega-3 for the brain", d:"El salmón, sardinas y nueces aportan DHA, esencial para el desarrollo cerebral de tu bebé.", dEn:"Salmon, sardines, and walnuts provide DHA, essential for your baby's brain development.", tag:"proteina" },
];
const TODAY_TIP = NUTRI_TIPS[new Date().getDay() % NUTRI_TIPS.length];

const MEAL_PLAN = [
  { cat:"Desayuno", ico:"☀️", meals:[
    { name:"Avena con frutas rojas y semillas de chía", nameEn:"Oatmeal with berries and chia seeds",       tag:"calcio",   label:"Calcio",   kcal:320 },
    { name:"Huevo revuelto con espinacas y tostada integral", nameEn:"Scrambled eggs with spinach and whole-grain toast", tag:"proteina", label:"Proteína", kcal:280 },
    { name:"Smoothie verde de plátano, espinaca y avena", nameEn:"Green smoothie with banana, spinach, and oats",     tag:"folato",   label:"Folato",   kcal:260 },
    { name:"Tostadas de aguacate con huevo poché", nameEn:"Avocado toast with poached egg",            tag:"proteina", label:"Proteína", kcal:310 },
    { name:"Yogur griego con granola y frutos rojos", nameEn:"Greek yogurt with granola and berries",          tag:"calcio",   label:"Calcio",   kcal:290 },
    { name:"Panqueques de avena con miel y nueces", nameEn:"Oat pancakes with honey and walnuts",            tag:"proteina", label:"Proteína", kcal:350 },
    { name:"Bowl de frutas con yogur y semillas", nameEn:"Fruit bowl with yogurt and seeds",              tag:"calcio",   label:"Calcio",   kcal:240 },
    { name:"Tostada integral con ricotta y fresas", nameEn:"Whole-grain toast with ricotta and strawberries",            tag:"calcio",   label:"Calcio",   kcal:270 },
    { name:"Omelet de champiñones y queso", nameEn:"Mushroom and cheese omelet",                   tag:"proteina", label:"Proteína", kcal:300 },
    { name:"Batido de mango, zanahoria y jengibre", nameEn:"Mango, carrot, and ginger smoothie",            tag:"folato",   label:"Folato",   kcal:220 },
  ]},
  { cat:"Almuerzo", ico:"🥗", meals:[
    { name:"Lentejas con verduras y arroz integral", nameEn:"Lentils with vegetables and brown rice",           tag:"folato",   label:"Folato",   kcal:420 },
    { name:"Ensalada de espinacas, nueces y queso feta", nameEn:"Spinach salad with walnuts and feta cheese",       tag:"hierro",   label:"Hierro",   kcal:280 },
    { name:"Crema de brócoli con pan integral", nameEn:"Broccoli cream soup with whole-grain bread",                tag:"folato",   label:"Folato",   kcal:240 },
    { name:"Bowl de quinoa con pollo y verduras asadas", nameEn:"Quinoa bowl with chicken and roasted vegetables",       tag:"proteina", label:"Proteína", kcal:450 },
    { name:"Pasta integral con tomate, albahaca y mozzarella", nameEn:"Whole-grain pasta with tomato, basil, and mozzarella", tag:"calcio",   label:"Calcio",   kcal:380 },
    { name:"Wrap de pollo con aguacate y lechuga", nameEn:"Chicken wrap with avocado and lettuce",             tag:"proteina", label:"Proteína", kcal:400 },
    { name:"Sopa de garbanzos con espinacas", nameEn:"Chickpea soup with spinach",                  tag:"folato",   label:"Folato",   kcal:310 },
    { name:"Arroz con salmón teriyaki y edamame", nameEn:"Rice with teriyaki salmon and edamame",              tag:"proteina", label:"Proteína", kcal:460 },
    { name:"Ensalada mediterránea de garbanzos y pepino", nameEn:"Mediterranean chickpea and cucumber salad",      tag:"hierro",   label:"Hierro",   kcal:290 },
    { name:"Tacos de atún con aguacate y pico de gallo", nameEn:"Tuna tacos with avocado and pico de gallo",       tag:"proteina", label:"Proteína", kcal:370 },
  ]},
  { cat:"Cena", ico:"🌙", meals:[
    { name:"Salmón al horno con quinoa y espárragos", nameEn:"Baked salmon with quinoa and asparagus",          tag:"proteina", label:"Proteína", kcal:380 },
    { name:"Pollo con batata asada y ensalada verde", nameEn:"Chicken with roasted sweet potato and green salad",           tag:"proteina", label:"Proteína", kcal:360 },
    { name:"Tortilla de verduras con ensalada mixta", nameEn:"Vegetable omelet with mixed salad",           tag:"proteina", label:"Proteína", kcal:290 },
    { name:"Sopa de zanahoria con jengibre y tofu", nameEn:"Carrot and ginger soup with tofu",            tag:"folato",   label:"Folato",   kcal:220 },
    { name:"Merluza al vapor con puré de calabaza", nameEn:"Steamed hake with pumpkin puree",            tag:"proteina", label:"Proteína", kcal:310 },
    { name:"Crema de lentejas rojas con cúrcuma", nameEn:"Red lentil cream soup with turmeric",              tag:"hierro",   label:"Hierro",   kcal:280 },
    { name:"Pavo al horno con arroz y brócoli", nameEn:"Roast turkey with rice and broccoli",                tag:"proteina", label:"Proteína", kcal:340 },
    { name:"Risotto de champiñones con espinacas", nameEn:"Mushroom risotto with spinach",             tag:"hierro",   label:"Hierro",   kcal:350 },
    { name:"Tofu salteado con verduras y sésamo", nameEn:"Stir-fried tofu with vegetables and sesame",              tag:"calcio",   label:"Calcio",   kcal:260 },
    { name:"Pechuga de pollo con ensalada de rúcula", nameEn:"Chicken breast with arugula salad",          tag:"proteina", label:"Proteína", kcal:290 },
  ]},
  { cat:"Snacks", ico:"🍎", meals:[
    { name:"Yogur griego con semillas de chía", nameEn:"Greek yogurt with chia seeds",                tag:"calcio",   label:"Calcio",   kcal:150 },
    { name:"Aguacate sobre tostada con huevo", nameEn:"Avocado toast with egg",                 tag:"proteina", label:"Proteína", kcal:180 },
    { name:"Smoothie de plátano, avena y leche", nameEn:"Banana, oat, and milk smoothie",              tag:"calcio",   label:"Calcio",   kcal:200 },
    { name:"Almendras y frutos secos mixtos", nameEn:"Almonds and mixed nuts",                  tag:"proteina", label:"Proteína", kcal:160 },
    { name:"Manzana con mantequilla de almendras", nameEn:"Apple with almond butter",             tag:"hierro",   label:"Hierro",   kcal:180 },
    { name:"Dátiles con queso ricotta", nameEn:"Dates with ricotta cheese",                       tag:"calcio",   label:"Calcio",   kcal:140 },
    { name:"Hummus con palitos de zanahoria y pepino", nameEn:"Hummus with carrot and cucumber sticks",         tag:"proteina", label:"Proteína", kcal:130 },
    { name:"Galletas de avena con arándanos", nameEn:"Oat cookies with blueberries",                  tag:"hierro",   label:"Hierro",   kcal:155 },
    { name:"Queso cottage con piña y semillas", nameEn:"Cottage cheese with pineapple and seeds",                tag:"calcio",   label:"Calcio",   kcal:145 },
    { name:"Edamame con sal marina", nameEn:"Edamame with sea salt",                           tag:"proteina", label:"Proteína", kcal:120 },
    { name:"Batido de fresas y leche de avena", nameEn:"Strawberry and oat milk smoothie",                tag:"calcio",   label:"Calcio",   kcal:175 },
    { name:"Nueces con chocolate negro 70%", nameEn:"Walnuts with 70% dark chocolate",                   tag:"hierro",   label:"Hierro",   kcal:170 },
  ]},
];

const MEAL_WHY = {
  "Avena con frutas rojas y semillas de chía":       "Avena: hierro y magnesio. Chía: omega-3 y calcio. Ideal para empezar el día.",
  "Huevo revuelto con espinacas y tostada integral": "Proteína completa + folato de la espinaca. Perfecto en el 1.er trimestre.",
  "Smoothie verde de plátano, espinaca y avena":     "Folato de la espinaca + potasio del plátano. Fácil y nutritivo con náuseas.",
  "Tostadas de aguacate con huevo poché":            "Grasas sanas + proteína completa + colina esencial para el cerebro del bebé.",
  "Yogur griego con granola y frutos rojos":          "Calcio + probióticos digestivos + antioxidantes. Desayuno equilibrado.",
  "Lentejas con verduras y arroz integral":            "Legumbre + cereal = proteína completa con folato. Uno de los mejores platos del embarazo.",
  "Ensalada de espinacas, nueces y queso feta":        "Hierro vegetal + grasas sanas de nueces + calcio del queso.",
  "Crema de brócoli con pan integral":                "El brócoli es líder en folato y calcio vegetal.",
  "Bowl de quinoa con pollo y verduras asadas":       "Proteína completa de quinoa + pollo magro. Combinación perfecta del 2.º trimestre.",
  "Pasta integral con tomate, albahaca y mozzarella": "Carbohidratos complejos + licopeno + calcio. Energía sostenida.",
  "Salmón al horno con quinoa y espárragos":          "Omega-3 DHA para el cerebro del bebé. Quinoa: única proteína vegetal completa.",
  "Pollo con batata asada y ensalada verde":           "Proteína magra + betacaroteno de la batata. Ligero y saciante.",
  "Tortilla de verduras con ensalada mixta":           "Proteína del huevo + folato de las verduras. Ligero y nutritivo para cenar.",
  "Sopa de zanahoria con jengibre y tofu":            "Betacaroteno + jengibre antiinflamatorio + proteína vegetal.",
  "Panqueques de avena con miel y nueces":          "Avena + proteína de huevo + grasas sanas de nueces. Dulce y nutritivo.",
  "Bowl de frutas con yogur y semillas":              "Antioxidantes + calcio + omega-3. Ligero y saciante para el primer trimestre.",
  "Tostada integral con ricotta y fresas":            "Calcio del ricotta + vitamina C de las fresas. Refrescante y rápido.",
  "Omelet de champiñones y queso":                   "Proteína completa + vitamina D de los champiñones. Perfecto en invierno.",
  "Batido de mango, zanahoria y jengibre":            "Betacaroteno + jengibre antiinflamatorio. Ayuda con las náuseas del primer trimestre.",
  "Wrap de pollo con aguacate y lechuga":             "Proteína magra + grasas sanas. Fácil de preparar y llevar.",
  "Sopa de garbanzos con espinacas":                  "Hierro vegetal + folato. Combo perfecto para el desarrollo neural.",
  "Arroz con salmón teriyaki y edamame":              "Omega-3 + proteína completa de edamame. Rico en DHA para el cerebro del bebé.",
  "Ensalada mediterránea de garbanzos y pepino":      "Hierro vegetal + hidratante. Ligero para el calor del segundo trimestre.",
  "Tacos de atún con aguacate y pico de gallo":       "Omega-3 + grasas sanas + vitamina C. Sabroso y equilibrado.",
  "Merluza al vapor con puré de calabaza":            "Proteína suave + betacaroteno. Ideal para una cena ligera y digestiva.",
  "Crema de lentejas rojas con cúrcuma":              "Hierro + antiinflamatorio natural. Cena caliente y reconfortante.",
  "Pavo al horno con arroz y brócoli":                "Proteína magra + folato del brócoli. Clásico nutritivo del embarazo.",
  "Risotto de champiñones con espinacas":             "Hierro + vitamina D. Cremoso y satisfactorio sin ser pesado.",
  "Tofu salteado con verduras y sésamo":              "Calcio del tofu y sésamo. Excelente opción vegana para el embarazo.",
  "Pechuga de pollo con ensalada de rúcula":          "Proteína magra + folato de la rúcula. Cena ligera y refrescante.",
  "Galletas de avena con arándanos":                  "Hierro de la avena + antioxidantes. Snack dulce y nutritivo.",
  "Queso cottage con piña y semillas":                "Calcio + vitamina C + omega-3. Refrescante y saciante.",
  "Edamame con sal marina":                           "Proteína vegetal completa + calcio. Snack rápido y nutritivo.",
  "Batido de fresas y leche de avena":                "Calcio + vitamina C + fibra. Dulce y ligero entre comidas.",
  "Nueces con chocolate negro 70%":                   "Hierro + magnesio + antioxidantes. El snack antojadizo más nutritivo.",
};
const MEAL_WHY_EN = {
  "Avena con frutas rojas y semillas de chía": "Oats: iron and magnesium. Chia: omega-3 and calcium. Ideal to start the day.",
  "Huevo revuelto con espinacas y tostada integral": "Complete protein + folate from spinach. Perfect in the 1st trimester.",
  "Smoothie verde de plátano, espinaca y avena": "Folate from spinach + potassium from banana. Easy and nutritious with nausea.",
  "Tostadas de aguacate con huevo poché": "Healthy fats + complete protein + choline essential for baby's brain.",
  "Yogur griego con granola y frutos rojos": "Calcium + digestive probiotics + antioxidants. A balanced breakfast.",
  "Lentejas con verduras y arroz integral": "Legume + grain = complete protein with folate. One of the best pregnancy dishes.",
  "Ensalada de espinacas, nueces y queso feta": "Plant iron + healthy fats from walnuts + calcium from cheese.",
  "Crema de brócoli con pan integral": "Broccoli is a leader in folate and plant calcium.",
  "Bowl de quinoa con pollo y verduras asadas": "Complete protein from quinoa + lean chicken. Perfect combo for the 2nd trimester.",
  "Pasta integral con tomate, albahaca y mozzarella": "Complex carbs + lycopene + calcium. Sustained energy.",
  "Salmón al horno con quinoa y espárragos": "Omega-3 DHA for baby's brain. Quinoa: the only complete plant protein.",
  "Pollo con batata asada y ensalada verde": "Lean protein + beta-carotene from sweet potato. Light and filling.",
  "Tortilla de verduras con ensalada mixta": "Protein from egg + folate from vegetables. Light and nutritious for dinner.",
  "Sopa de zanahoria con jengibre y tofu": "Beta-carotene + anti-inflammatory ginger + plant protein.",
  "Panqueques de avena con miel y nueces": "Oats + egg protein + healthy fats from walnuts. Sweet and nutritious.",
  "Bowl de frutas con yogur y semillas": "Antioxidants + calcium + omega-3. Light and filling for the first trimester.",
  "Tostada integral con ricotta y fresas": "Calcium from ricotta + vitamin C from strawberries. Refreshing and quick.",
  "Omelet de champiñones y queso": "Complete protein + vitamin D from mushrooms. Perfect in winter.",
  "Batido de mango, zanahoria y jengibre": "Beta-carotene + anti-inflammatory ginger. Helps with first-trimester nausea.",
  "Wrap de pollo con aguacate y lechuga": "Lean protein + healthy fats. Easy to prepare and take with you.",
  "Sopa de garbanzos con espinacas": "Plant iron + folate. Perfect combo for neural development.",
  "Arroz con salmón teriyaki y edamame": "Omega-3 + complete protein from edamame. Rich in DHA for baby's brain.",
  "Ensalada mediterránea de garbanzos y pepino": "Plant iron + hydrating. Light for second-trimester heat.",
  "Tacos de atún con aguacate y pico de gallo": "Omega-3 + healthy fats + vitamin C. Tasty and balanced.",
  "Merluza al vapor con puré de calabaza": "Gentle protein + beta-carotene. Ideal for a light, digestible dinner.",
  "Crema de lentejas rojas con cúrcuma": "Iron + natural anti-inflammatory. A warm, comforting dinner.",
  "Pavo al horno con arroz y brócoli": "Lean protein + folate from broccoli. A nutritious pregnancy classic.",
  "Risotto de champiñones con espinacas": "Iron + vitamin D. Creamy and satisfying without being heavy.",
  "Tofu salteado con verduras y sésamo": "Calcium from tofu and sesame. Great vegan option for pregnancy.",
  "Pechuga de pollo con ensalada de rúcula": "Lean protein + folate from arugula. Light, refreshing dinner.",
  "Galletas de avena con arándanos": "Iron from oats + antioxidants. A sweet, nutritious snack.",
  "Queso cottage con piña y semillas": "Calcium + vitamin C + omega-3. Refreshing and filling.",
  "Edamame con sal marina": "Complete plant protein + calcium. A quick, nutritious snack.",
  "Batido de fresas y leche de avena": "Calcium + vitamin C + fiber. Sweet and light between meals.",
  "Nueces con chocolate negro 70%": "Iron + magnesium + antioxidants. The most nutritious craving-buster.",
};

const TRI_MEAL_REC = {
  "Smoothie verde de plátano, espinaca y avena":     [1],
  "Avena con frutas rojas y semillas de chía":       [1,2],
  "Batido de mango, zanahoria y jengibre":            [1],
  "Huevo revuelto con espinacas y tostada integral":  [1,2,3],
  "Tostadas de aguacate con huevo poché":            [2,3],
  "Yogur griego con granola y frutos rojos":          [1,2,3],
  "Panqueques de avena con miel y nueces":            [2],
  "Lentejas con verduras y arroz integral":           [1,2,3],
  "Bowl de quinoa con pollo y verduras asadas":       [2,3],
  "Ensalada de espinacas, nueces y queso feta":       [1,2],
  "Arroz con salmón teriyaki y edamame":              [2,3],
  "Sopa de garbanzos con espinacas":                  [1,3],
  "Salmón al horno con quinoa y espárragos":          [2,3],
  "Sopa de zanahoria con jengibre y tofu":            [1,3],
  "Tortilla de verduras con ensalada mixta":          [1,2,3],
  "Crema de lentejas rojas con cúrcuma":              [3],
  "Merluza al vapor con puré de calabaza":            [2,3],
  "Tofu salteado con verduras y sésamo":              [1,2,3],
  "Yogur griego con semillas de chía":                [1,2,3],
  "Hummus con palitos de zanahoria y pepino":         [1,2,3],
  "Almendras y frutos secos mixtos":                  [1,2,3],
  "Nueces con chocolate negro 70%":                   [2,3],
  "Edamame con sal marina":                           [2,3],
};

const NUTRIENT_GOALS = [
  { k:"hierro",   l:"Hierro",   unit:"mg", goal:27,   contrib:8,   color:"#c44230" },
  { k:"calcio",   l:"Calcio",   unit:"mg", goal:1000, contrib:180, color:"#2470b8" },
  { k:"folato",   l:"Folato",   unit:"μg", goal:600,  contrib:80,  color:"#2e8a4a" },
  { k:"proteina", l:"Proteína", unit:"g",  goal:71,   contrib:14,  color:"#a05e1a" },
];

/* ── Datos nuevos ─── */
const CAT_BENEFIT = {
  "Desayuno": "Combate náuseas · Energía sostenida para el día",
  "Almuerzo": "Nutrición óptima para el desarrollo celular del bebé",
  "Cena":     "Digestión ligera · Favorece el sueño reparador",
  "Snacks":   "Mantiene el azúcar estable · Calma antojos sanos",
};
const CAT_BENEFIT_EN = {
  "Desayuno": "Fights nausea · Sustained energy for the day",
  "Almuerzo": "Optimal nutrition for your baby's cell development",
  "Cena":     "Light digestion · Promotes restful sleep",
  "Snacks":   "Keeps blood sugar stable · Calms healthy cravings",
};
const CAT_LABEL_EN = { "Desayuno":"Breakfast", "Almuerzo":"Lunch", "Cena":"Dinner", "Snacks":"Snacks" };
const CAT_TIME = {
  "Desayuno": "7 – 9 AM",
  "Almuerzo": "12 – 2 PM",
  "Cena":     "7 – 9 PM",
  "Snacks":   "Entre comidas",
};
const MEAL_PREP = {
  "Avena con frutas rojas y semillas de chía": "5 min",
  "Huevo revuelto con espinacas y tostada integral": "12 min",
  "Smoothie verde de plátano, espinaca y avena": "5 min",
  "Tostadas de aguacate con huevo poché": "10 min",
  "Yogur griego con granola y frutos rojos": "3 min",
  "Lentejas con verduras y arroz integral": "35 min",
  "Ensalada de espinacas, nueces y queso feta": "10 min",
  "Crema de brócoli con pan integral": "25 min",
  "Bowl de quinoa con pollo y verduras asadas": "30 min",
  "Pasta integral con tomate, albahaca y mozzarella": "20 min",
  "Salmón al horno con quinoa y espárragos": "25 min",
  "Pollo con batata asada y ensalada verde": "35 min",
  "Tortilla de verduras con ensalada mixta": "15 min",
  "Sopa de zanahoria con jengibre y tofu": "30 min",
  "Panqueques de avena con miel y nueces":          "15 min",
  "Bowl de frutas con yogur y semillas":              "5 min",
  "Tostada integral con ricotta y fresas":            "5 min",
  "Omelet de champiñones y queso":                   "12 min",
  "Batido de mango, zanahoria y jengibre":            "5 min",
  "Wrap de pollo con aguacate y lechuga":             "10 min",
  "Sopa de garbanzos con espinacas":                  "30 min",
  "Arroz con salmón teriyaki y edamame":              "25 min",
  "Ensalada mediterránea de garbanzos y pepino":      "10 min",
  "Tacos de atún con aguacate y pico de gallo":       "15 min",
  "Merluza al vapor con puré de calabaza":            "20 min",
  "Crema de lentejas rojas con cúrcuma":              "25 min",
  "Pavo al horno con arroz y brócoli":                "40 min",
  "Risotto de champiñones con espinacas":             "30 min",
  "Tofu salteado con verduras y sésamo":              "15 min",
  "Pechuga de pollo con ensalada de rúcula":          "20 min",
  "Galletas de avena con arándanos":                  "20 min",
  "Queso cottage con piña y semillas":                "3 min",
  "Edamame con sal marina":                           "5 min",
  "Batido de fresas y leche de avena":                "5 min",
  "Nueces con chocolate negro 70%":                   "0 min",
};
const NUTRIENT_DETAIL = {
  hierro: {
    icon: "drop",
    why: "Transporta oxígeno al bebé y previene anemia gestacional",
    warning: "La fatiga intensa puede indicar déficit de hierro",
    sources: ["Espinacas y acelgas", "Lentejas y garbanzos", "Carne roja magra"],
    tip: "Combina con vitamina C (naranja, kiwi) para triplicar la absorción",
  },
  calcio: {
    icon: "star",
    why: "Construye huesos y dientes del bebé; protege tu densidad ósea",
    warning: "Los calambres nocturnos pueden señalar déficit de calcio",
    sources: ["Yogur y leche", "Brócoli y col rizada", "Almendras y semillas de sésamo"],
    tip: "Evita tomarlo junto al hierro: compiten por la absorción intestinal",
  },
  folato: {
    icon: "leaf",
    why: "Esencial para el tubo neural y la división celular correcta",
    warning: "Crítico en las primeras 12 semanas; continúa con tu suplemento",
    sources: ["Aguacate", "Espinacas frescas", "Garbanzos y lentejas"],
    tip: "El suplemento de ácido fólico es más estable que el folato alimentario",
  },
  proteina: {
    icon: "flame",
    why: "Construye tejidos, músculos y órganos del bebé en desarrollo",
    warning: "Náuseas persistentes sin causa clara pueden indicar déficit",
    sources: ["Huevos (todos los aminoácidos)", "Salmón y sardinas", "Quinoa (proteína completa)"],
    tip: "Distribuye la proteína en cada comida; el cuerpo no la almacena",
  },
};
const NUTRIENT_DETAIL_EN = {
  hierro: {
    icon: "drop",
    why: "Carries oxygen to your baby and prevents gestational anemia",
    warning: "Intense fatigue can signal an iron deficiency",
    sources: ["Spinach and chard", "Lentils and chickpeas", "Lean red meat"],
    tip: "Combine with vitamin C (orange, kiwi) to triple absorption",
  },
  calcio: {
    icon: "star",
    why: "Builds your baby's bones and teeth; protects your bone density",
    warning: "Nighttime cramps can signal a calcium deficiency",
    sources: ["Yogurt and milk", "Broccoli and kale", "Almonds and sesame seeds"],
    tip: "Avoid taking it together with iron: they compete for intestinal absorption",
  },
  folato: {
    icon: "leaf",
    why: "Essential for neural tube formation and proper cell division",
    warning: "Critical in the first 12 weeks; keep taking your supplement",
    sources: ["Avocado", "Fresh spinach", "Chickpeas and lentils"],
    tip: "Folic acid supplements are more stable than dietary folate",
  },
  proteina: {
    icon: "flame",
    why: "Builds your developing baby's tissues, muscles, and organs",
    warning: "Persistent unexplained nausea can signal a deficiency",
    sources: ["Eggs (all amino acids)", "Salmon and sardines", "Quinoa (complete protein)"],
    tip: "Spread protein across every meal; the body doesn't store it",
  },
};

/* ── WaterTracker ─── */
function WaterTracker() {
  const wLang = getAppLang2();
  const WT = wLang==="en" ? { title:"Hydration", goal:"Goal: 2.5 L · 10 glasses · pregnancy", mlToday:"ml today", mlLeft:"ml left", done:"done", addGlass:"+ glass" }
    : { title:"Hidratación", goal:"Meta: 2.5 L · 10 vasos · embarazo", mlToday:"ml hoy", mlLeft:"ml restantes", done:"completado", addGlass:"+ vaso" };
  const todayKey = new Date().toISOString().slice(0,10);
  const [glasses, setGlasses] = React.useState(() => {
    try { if (localStorage.getItem("lume_water_date")===todayKey) return parseInt(localStorage.getItem("lume_water_g")||"0")||0; } catch {} return 0;
  });
  const save = (g) => { setGlasses(g); try { localStorage.setItem("lume_water_g",g); localStorage.setItem("lume_water_date",todayKey); } catch {} };
  const add = () => save(Math.min(10, glasses+1));
  const rem = () => save(Math.max(0, glasses-1));
  const pct = glasses / 10;
  const fillY = 110 - pct * 90;

  return (
    <div className="nv3-water-card">
      <div className="nv3-water-head">
        <div>
          <div className="nv3-water-title">
            <div className="nv3-water-icon">
              <svg width="12" height="15" viewBox="0 0 24 28" fill="#3478b0"><path d="M12 2C12 2 3 13 3 18.5a9 9 0 0018 0C21 13 12 2 12 2z"/></svg>
            </div>
            {WT.title}
          </div>
          <div className="nv3-water-sub">{WT.goal}</div>
        </div>
        <div className="nv3-water-total">
          <div className="nv3-water-total-num">{glasses * 250}</div>
          <div className="nv3-water-total-label">{WT.mlToday}</div>
        </div>
      </div>

      <div className="nv3-water-body">
        <svg viewBox="0 0 100 130" width="80" height="104" style={{flexShrink:0}}>
          <defs>
            <clipPath id="wt3-clip">
              <path d="M50 6 C50 6 8 58 8 84 Q8 122 50 122 Q92 122 92 84 Q92 58 50 6 Z"/>
            </clipPath>
          </defs>
          <path d="M50 6 C50 6 8 58 8 84 Q8 122 50 122 Q92 122 92 84 Q92 58 50 6 Z"
            fill="rgba(52,120,176,.06)" stroke="rgba(52,120,176,.2)" strokeWidth="1.5"/>
          <g clipPath="url(#wt3-clip)">
            {pct > 0 && <rect x="0" y={fillY} width="100" height="130" fill="#3478b0" opacity=".82"/>}
            {pct > 0 && <path d={"M0,"+fillY+" C18,"+(fillY-9)+" 38,"+(fillY+9)+" 58,"+(fillY-7)+" S85,"+(fillY+5)+" 100,"+fillY+" V130 H0 Z"} fill="rgba(52,120,176,.36)"/>}
            {pct > 0.1 && <rect x="22" y={fillY+8} width="5" height={130-fillY-14} rx="2.5" fill="rgba(255,255,255,.2)"/>}
          </g>
          {pct > 0.42
            ? <text x="50" y={Math.max(fillY+34,90)} textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Cormorant Garamond,serif">{glasses}</text>
            : <text x="50" y="78" textAnchor="middle" fill="#3478b0" fontSize="26" fontWeight="800" fontFamily="Cormorant Garamond,serif">{glasses}</text>
          }
          <text x="50" y={pct>0.42?Math.max(fillY+50,106):95} textAnchor="middle" fill={pct>0.42?"rgba(255,255,255,.55)":"rgba(52,120,176,.5)"} fontSize="11">/10</text>
        </svg>

        <div className="nv3-water-info">
          <div>
            <div className="nv3-water-remain">{(10-glasses)*250}</div>
            <div className="nv3-water-remain-label">{WT.mlLeft}</div>
          </div>
          <div>
            <div className="nv3-water-pct">{Math.round(pct*100)}%</div>
            <div className="nv3-water-remain-label">{WT.done}</div>
          </div>
          <div className="nv3-water-btns">
            <button onClick={rem} disabled={glasses<=0} className="nv3-water-btn minus">−</button>
            <button onClick={add} disabled={glasses>=10} className="nv3-water-btn plus">{WT.addGlass}</button>
          </div>
        </div>
      </div>

      <div className="nv3-water-dots">
        {Array.from({length:10}).map((_,i) => (
          <div key={i} className={"nv3-water-dot"+(i<glasses?" on":"")} onClick={()=>i<glasses?rem():add()}></div>
        ))}
      </div>
      <div className="nv3-water-bar-track">
        <div className="nv3-water-bar-fill" style={{width:(pct*100)+"%"}}></div>
      </div>
    </div>
  );
}

const NTAGS = [{k:"hierro",l:"Hierro"},{k:"calcio",l:"Calcio"},{k:"folato",l:"Folato"},{k:"proteina",l:"Proteína"},{k:"hidrat",l:"Hidratación"}];
const NTAGS_L_EN = {hierro:"Iron",calcio:"Calcium",folato:"Folate",proteina:"Protein",hidrat:"Hydration"};
const NUTRIENT_GOALS_L_EN = {hierro:"Iron",calcio:"Calcium",folato:"Folate",proteina:"Protein"};
const NG_META = {
  hierro:   { bg:"rgba(196,66,48,.07)",   shadow:"rgba(196,66,48,.18)"   },
  calcio:   { bg:"rgba(36,112,184,.07)",  shadow:"rgba(36,112,184,.18)"  },
  folato:   { bg:"rgba(46,138,74,.07)",   shadow:"rgba(46,138,74,.18)"   },
  proteina: { bg:"rgba(160,94,26,.07)",   shadow:"rgba(160,94,26,.18)"   },
};

/* ── Síntomas → alimentos recomendados ── */
const SX_FOODS = {
  "Náuseas":       { title:"Anti-náuseas · suave",        color:"#3A8070", foods:["Jengibre con limón","Galletas de arroz","Caldo de pollo","Manzana","Menta fresca"] },
  "Acidez":        { title:"Suave para el estómago",     color:"#C8952A", foods:["Avena con leche","Yogur natural","Pechuga a la plancha","Puré de calabaza","Manzanilla"] },
  "Fatiga":        { title:"Energía sostenida",          color:"#8B5A9E", foods:["Plátano con nueces","Huevo cocido","Dátiles","Almendras","Avena integral"] },
  "Hinchazón":    { title:"Drenante y ligero",          color:"#4080D0", foods:["Espárrago hervido","Pepino","Sandía","Piña fresca","Cola de caballo"] },
  "Dolor de espalda":{ title:"Antiinflamatorio",         color:"#A8492A", foods:["Cúrcuma con leche","Nueces","Salmon al horno","Jengibre","Aguacate"] },
  "Insomnio":      { title:"Relajante nocturno",         color:"#6A4A9E", foods:["Manzanilla","Leche tibia con miel","Plátano","Nueces","Cerezas"] },
  "Estreñimiento": { title:"Alto en fibra",              color:"#3A8040", foods:["Ciruelas pasas","Kiwi","Semillas de lino","Brócoli","Agua con limón"] },
  "Anemia":        { title:"Rico en hierro",              color:"#B84040", foods:["Espinacas con limón","Lentejas","Carne magra","Brócoli","Zumo de naranja"] },
  "Mareo":         { title:"Estabilizador",               color:"#4A6A9E", foods:["Galletas saladas","Agua con electrolitos","Plátano","Jengibre","Fruta seca"] },
};

/* ── Nutricion ─── */
function Nutricion({ onPlanPress }) {
  const nutriLang = getAppLang2();
  const NT = nutriLang === "en" ? {
    eyebrow:"Meal plan", week:"Week", title:"Nutrition", kcalToday:"kcal today", foodsLogged:"foods logged today",
    bienestarAi:"✦ Wellness · AI", customPlan:"Custom nutrition plan", aiGenerated:"AI-generated · adapted to your symptoms",
    tabPlan:"Today's plan", tabNutri:"Nutrients", tabReg:"Log",
    customMenu:"personalized menu", today:"Today", yesterday:"Yesterday", tomorrow:"Tomorrow",
    days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    tipOfDay:"Tip of the day", options:"options", add:"Add", hide:"Hide", whyFood:"Why this food?",
    addOwnMeal:"Add your own meal", mealNamePh:"Meal name...", addToLog:"Add to log",
    dailyTracking:"Daily tracking", keyNutrients:"Key nutrients", weekGoals:"Week 15 · Pregnancy-specific goals",
    foodSources:"Food sources", absorptionTip:"Absorption tip",
    noLogsYet:"No logs yet", noLogsSub:"Add meals from Today's plan and they'll appear here.", myFoods:"My foods",
    missing:"Missing ", goalReached:"Goal reached ✓", goal:"goal", remove:"Remove",
    catLabel: (c)=>CAT_LABEL_EN[c]||c,
  } : {
    eyebrow:"Plan alimentario", week:"Semana", title:"Nutrición", kcalToday:"kcal hoy", foodsLogged:"alimentos registrados hoy",
    bienestarAi:"✦ Bienestar · IA", customPlan:"Plan nutricional a medida", aiGenerated:"Generado por IA · adaptado a tus síntomas",
    tabPlan:"Plan del día", tabNutri:"Nutrientes", tabReg:"Registro",
    customMenu:"menú personalizado", today:"Hoy", yesterday:"Ayer", tomorrow:"Mañana",
    days:["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
    tipOfDay:"Consejo del día", options:"opciones", add:"Añadir", hide:"Ocultar", whyFood:"¿Por qué este alimento?",
    addOwnMeal:"Añadir tu propia comida", mealNamePh:"Nombre de la comida...", addToLog:"Añadir al registro",
    dailyTracking:"Seguimiento diario", keyNutrients:"Nutrientes clave", weekGoals:"Semana 15 · Metas específicas del embarazo",
    foodSources:"Fuentes alimentarias", absorptionTip:"Consejo de absorción",
    noLogsYet:"Sin registros todavía", noLogsSub:"Añade comidas desde el Plan del día y aparecerán aquí.", myFoods:"Mis alimentos",
    missing:"Faltan ", goalReached:"Meta alcanzada ✓", goal:"meta", remove:"Eliminar",
    catLabel: (c)=>c,
  };
  const mealName = (m) => nutriLang==="en" ? (m.nameEn||m.name) : m.name;
  const mealWhy = (m) => nutriLang==="en" ? MEAL_WHY_EN[m.name] : MEAL_WHY[m.name];
  const displayMealName = (nm) => {
    if (nutriLang!=="en") return nm;
    for (const cat of MEAL_PLAN) { const found = cat.meals.find(x=>x.name===nm); if (found) return found.nameEn||nm; }
    return nm;
  };
  const nutrientLabel = (k) => nutriLang==="en" ? (NUTRIENT_GOALS_L_EN[k]||k) : k;
  const catBenefit = (c) => nutriLang==="en" ? (CAT_BENEFIT_EN[c]||"") : CAT_BENEFIT[c];
  const nutrientDetail = (k) => nutriLang==="en" ? NUTRIENT_DETAIL_EN[k] : NUTRIENT_DETAIL[k];
  const tagLabel = (k) => nutriLang==="en" ? (NTAGS_L_EN[k]||k) : k;
  const [tab, setTab] = React.useState("plan");
  const [dayOffset, setDayOffset] = React.useState(0);
  const [logged, setLogged] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("lume_nutri_log") || JSON.stringify([
      { id:1, name:"Ensalada de espinacas y nueces", tag:"hierro", label:"Hierro", kcal:280, date:"13 jun" },
      { id:2, name:"Yogur griego con semillas de chía", tag:"calcio", label:"Calcio", kcal:150, date:"13 jun" },
    ])); } catch { return []; }
  });
  const [custom, setCustom] = React.useState("");
  const [customTag, setCustomTag] = React.useState("proteina");
  const [addedId, setAddedId] = React.useState(null);
  const [expandedMeal, setExpandedMeal] = React.useState(null);
  const [selectedCat, setSelectedCat] = React.useState("Desayuno");
  const [expandedNutrient, setExpandedNutrient] = React.useState(null);
  const [calActive, setCalActive] = React.useState(false);
  const [pressedCard, setPressedCard] = React.useState(null);
  const [pressedChip, setPressedChip] = React.useState(null);
  const [pressedNav, setPressedNav] = React.useState(false);
  const [pressedTip, setPressedTip] = React.useState(false);
  const [pressedCustom, setPressedCustom] = React.useState(false);

  const todayDate = new Date().toLocaleDateString("es-ES",{day:"numeric",month:"short"});
  const todayKcal = logged.filter(r => r.date===todayDate).reduce((s,r) => s+(r.kcal||0), 0);
  const KCAL_GOAL = 2200;
  const planMeta = MEAL_CAT_META[selectedCat] || {color:"#A8492A",shadow:"rgba(168,73,42,.24)",bg:"rgba(168,73,42,.1)"};
  const kcalPct = Math.min(100,(todayKcal/KCAL_GOAL)*100);
  const RR=42, RC=2*Math.PI*RR, RD=(kcalPct/100)*RC;

  const getDayLabel = (off) => {
    if(off===0) return NT.today; if(off===-1) return NT.yesterday; if(off===1) return NT.tomorrow;
    const days=NT.days;
    const d=new Date(); d.setDate(d.getDate()+off); return days[d.getDay()]+" "+d.getDate();
  };

  const getMealsForDay = (cat) => {
    const d=new Date(); d.setDate(d.getDate()+dayOffset);
    const dayIdx=d.getDay(); const n=cat.meals.length;
    const step=Math.max(3,Math.ceil(n/4));
    const start=(dayIdx*step)%n;
    const out=[];
    for(let i=0;i<step;i++) out.push(cat.meals[(start+i)%n]);
    // Tag trimestre recomendado en cada meal
    const weeks = parseInt(localStorage.getItem("lume_weeks")||"15")||15;
    const tri = weeks<=13?1:weeks<=26?2:3;
    return out.map(m => ({...m, triRec: m.triRec||[1,2,3], currentTri:tri}));
  };

  const logMeal = (m) => {
    const entry = { id:Date.now(), name:m.name, tag:m.tag, label:m.label, kcal:m.kcal||0, date:todayDate };
    const l = [entry, ...logged].slice(0, 30); setLogged(l);
    try { localStorage.setItem("lume_nutri_log", JSON.stringify(l)); const p=(parseInt(localStorage.getItem("lume_points")||"126")||126)+3; localStorage.setItem("lume_points",p); } catch {}
    setAddedId(m.name); setTimeout(() => setAddedId(null), 1800);
  };

  const logCustom = () => {
    if (!custom.trim()) return;
    const t = NTAGS.find(x=>x.k===customTag);
    logMeal({name:custom.trim(),tag:customTag,label:t?.l||"Proteína",kcal:0});
    setCustom("");
  };

  const deleteLog = (id) => {
    const l = logged.filter(r => r.id!==id); setLogged(l);
    try { localStorage.setItem("lume_nutri_log", JSON.stringify(l)); } catch {}
  };

  const byDate = {};
  logged.forEach(r => { if (!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });

  return (
    <div className="screen nv3-screen">

      {/* ══ HERO ══ */}
      <div className="nv3-hero">
        <div className="nv3-hero-orb1"></div>
        <div className="nv3-hero-orb2"></div>

        <div className="nv3-hero-top">
          <div>
            <div className="nv3-eyebrow">{NT.eyebrow} · {NT.week} 15</div>
            <h1 className="nv3-title">{NT.title}</h1>
          </div>
        </div>

        <div className="nv3-hero-body">
          {/* Anillo calorías 3D */}
          <div className="nv3-cal-wrap nv3-cal-3d"
            onPointerDown={()=>setCalActive(true)}
            onPointerUp={()=>setCalActive(false)}
            onPointerLeave={()=>setCalActive(false)}
            style={{transform:calActive?"scale(.86)":"scale(1)",transition:"transform .22s cubic-bezier(.34,1.56,.64,1)",cursor:"pointer"}}
          >
            <svg width="102" height="102" viewBox="0 0 102 102" style={{transform:"rotate(-90deg)",position:"absolute",inset:0}}>
              <defs>
                <linearGradient id="kcalGrad3D" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF80"/>
                  <stop offset="60%" stopColor="#F0D8A4"/>
                  <stop offset="100%" stopColor="#C8952A"/>
                </linearGradient>
              </defs>
              {kcalPct>0 && <circle cx="51" cy="51" r={RR} fill="none" stroke="rgba(230,207,161,.38)" strokeWidth="16" strokeDasharray={RD+" "+(RC-RD)} strokeLinecap="round" style={{filter:"blur(7px)"}}/>}
              <circle cx="51" cy="51" r={RR} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9"/>
              <circle cx="51" cy="51" r={RR} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="7"/>
              {kcalPct>0 && (
                <circle cx="51" cy="51" r={RR} fill="none" stroke="url(#kcalGrad3D)" strokeWidth="9"
                  strokeDasharray={RD+" "+(RC-RD)} strokeLinecap="round"
                  style={{filter:"drop-shadow(0 0 9px rgba(230,207,161,.75))",transition:"stroke-dasharray 1.2s ease"}}/>
              )}
            </svg>
            <div className="nv3-cal-center">
              <div className="nv3-cal-num">{todayKcal||0}</div>
              <div className="nv3-cal-unit">{NT.kcalToday}</div>
              <div className="nv3-cal-goal">/ {KCAL_GOAL}</div>
            </div>
          </div>

          {/* Barras de nutrientes */}
          <div className="nv3-hero-bars">
            {NUTRIENT_GOALS.map(ng => {
              const n = logged.filter(m=>m.tag===ng.k).length;
              const pct = Math.min(100,((n*ng.contrib)/ng.goal)*100);
              const done = pct >= 80;
              return (
                <div key={ng.k} className="nv3-hero-bar-row">
                  <div className="nv3-hero-bar-head">
                    <span className="nv3-hero-bar-label">{nutrientLabel(ng.k)}</span>
                    <span className="nv3-hero-bar-pct" style={{color:done?"#E6CFA1":"rgba(255,255,255,.5)"}}>{Math.round(pct)}%</span>
                  </div>
                  <div className="nv3-hero-bar-track">
                    <div className="nv3-hero-bar-fill" style={{width:pct+"%",background:done?"#E6CFA1":"rgba(255,255,255,.45)"}}></div>
                  </div>
                </div>
              );
            })}
            <div className="nv3-hero-meta">{logged.filter(r=>r.date===todayDate).length} {NT.foodsLogged}</div>
          </div>
        </div>
      </div>

      {/* ══ BANNER PLAN PREMIUM ══ */}
      {onPlanPress && (
        <button onClick={onPlanPress} style={{ display:"flex", alignItems:"center", gap:14, width:"100%", margin:"0", padding:"14px 18px", border:"none", cursor:"pointer", background:"linear-gradient(135deg,#1a3a20 0%,#3A8070 60%,#C8952A 100%)", textAlign:"left", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent 60%,rgba(255,220,160,.12))", pointerEvents:"none" }}/>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.18)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 14px rgba(0,0,0,.15)" }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 7c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5z"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(200,255,220,.75)", marginBottom:3 }}>{NT.bienestarAi}</div>
            <div style={{ fontSize:14.5, fontWeight:700, color:"#fff", lineHeight:1.2, marginBottom:2 }}>{NT.customPlan}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.6)" }}>{NT.aiGenerated}</div>
          </div>
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* ══ TABS ══ */}
      <div className="nv3-tabs-wrap">
        <div className="nv3-tabs">
          <button className={tab==="plan"?"on":""} onClick={()=>setTab("plan")}>{NT.tabPlan}</button>
          <button className={tab==="nutri"?"on":""} onClick={()=>setTab("nutri")}>{NT.tabNutri}</button>
          <button className={tab==="reg"?"on":""} onClick={()=>setTab("reg")}>{NT.tabReg}</button>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="nv3-body">

        {/* ── PLAN DEL DÍA ── */}
        {tab==="plan" && (
          <div>
            {/* Día */}
            <div className="nv3-day-nav"
              onPointerDown={()=>setPressedNav(true)}
              onPointerUp={()=>setPressedNav(false)}
              onPointerLeave={()=>setPressedNav(false)}
              style={{boxShadow:`0 14px 40px ${planMeta.shadow}`,border:`1.5px solid ${planMeta.color}40`,borderTop:`2.5px solid ${planMeta.color}65`,transform:pressedNav?"scale(.972)":"scale(1)",transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .35s"}}>
              <button className="nv3-day-btn" onClick={()=>setDayOffset(d=>d-1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div style={{textAlign:"center"}}>
                <div className="nv3-day-label">{getDayLabel(dayOffset)}</div>
                <div className="nv3-day-sub">{NT.customMenu}</div>
              </div>
              <button className="nv3-day-btn" onClick={()=>setDayOffset(d=>d+1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* Consejo */}
            <div className="nv3-tip-card"
              onPointerDown={()=>setPressedTip(true)}
              onPointerUp={()=>setPressedTip(false)}
              onPointerLeave={()=>setPressedTip(false)}
              style={{boxShadow:`0 14px 40px ${planMeta.shadow}`,borderColor:planMeta.color+"44",borderTop:`2px solid ${planMeta.color}55`,background:`linear-gradient(135deg,${planMeta.color}10,${planMeta.bg} 80%)`,transform:pressedTip?"scale(.972)":"scale(1)",transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, background .4s"}}>
              <div className="nv3-tip-body">
                <div className="nv3-tip-badge">{NT.tipOfDay}</div>
                <div className="nv3-tip-title">{nutriLang==="en"?TODAY_TIP.tEn:TODAY_TIP.t}</div>
                <div className="nv3-tip-text">{nutriLang==="en"?TODAY_TIP.dEn:TODAY_TIP.d}</div>
              </div>
              <div className="nv3-tip-ico"><AppIcon name="spark" size={20}/></div>
            </div>

            {/* Chips de categoría */}
            <div className="nv3-cat-strip">
              {MEAL_PLAN.map(cat => {
                const cm = MEAL_CAT_META[cat.cat] || {};
                const isOn = selectedCat===cat.cat;
                return (
                  <button key={cat.cat}
                    className={"nv3-cat-chip"+(isOn?" on":"")}
                    onClick={()=>setSelectedCat(cat.cat)}
                    onPointerDown={()=>setPressedChip(cat.cat)}
                    onPointerUp={()=>setPressedChip(null)}
                    onPointerLeave={()=>setPressedChip(null)}
                    style={isOn ? {
                      background:`linear-gradient(135deg,${cm.color}ee,${cm.color}bb)`,
                      boxShadow:`0 10px 30px ${cm.shadow}, 0 1px 0 rgba(255,255,255,.25) inset`,
                      borderColor:"transparent", color:"#fff5ee",
                      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
                      transform:pressedChip===cat.cat?"scale(.87)":"scale(1)",
                      transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .22s"
                    } : {
                      background:`rgba(255,255,255,.38)`,
                      backdropFilter:"blur(20px) saturate(160%)",
                      WebkitBackdropFilter:"blur(20px) saturate(160%)",
                      boxShadow:`0 6px 20px ${cm.shadow}, 0 1px 0 rgba(255,255,255,.8) inset`,
                      borderColor: cm.color+"28",
                      transform:pressedChip===cat.cat?"scale(.87)":"scale(1)",
                      transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .22s"
                    }}>
                    {cm.img
                      ? <img src={cm.img} alt={cat.cat} style={{width:58,height:58,objectFit:"cover",borderRadius:12,flexShrink:0}}/>
                      : <span className="nv3-chip-ico">{cat.ico}</span>}
                    <span className="nv3-chip-lbl">{NT.catLabel(cat.cat)}</span>
                  </button>
                );
              })}
            </div>

            {/* Comidas de la categoría */}
            {MEAL_PLAN.filter(c=>c.cat===selectedCat).map(cat => {
              const dayMeals = getMealsForDay(cat);
              const avgKcal = (dayMeals.reduce((s,m)=>s+m.kcal,0)/dayMeals.length)|0;
              const catMeta = MEAL_CAT_META[cat.cat] || {color:"#A8492A",shadow:"rgba(168,73,42,.22)",bg:"rgba(168,73,42,.1)"};
              return (
                <div key={cat.cat}>
                  <div className="nv3-cat-hdr">
                    <div>
                      <div className="nv3-cat-title">{cat.ico} {NT.catLabel(cat.cat)}</div>
                      <div className="nv3-cat-time">{CAT_TIME[cat.cat]} · {dayMeals.length} {NT.options} · ~{avgKcal} kcal</div>
                    </div>
                  </div>
                  <div className="nv3-cat-benefit-bar" style={{borderLeftColor:catMeta.color+"88",background:catMeta.bg,boxShadow:`inset 3px 0 0 ${catMeta.color}55`,color:"#5a3a2a"}}>{catBenefit(cat.cat)}</div>

                  <div className="nv3-meals-list">
                    {dayMeals.map((m,i) => {
                      const isExp = expandedMeal===m.name;
                      const ng = NUTRIENT_GOALS.find(x=>x.k===m.tag);
                      const prep = MEAL_PREP[m.name] || "10 min";
                      const isAdded = addedId===m.name;
                      return (
                        <div key={i} className="nv3-meal-card"
                          onPointerDown={()=>setPressedCard(cat.cat+i)}
                          onPointerUp={()=>setPressedCard(null)}
                          onPointerLeave={()=>setPressedCard(null)}
                          style={{
                            boxShadow:`0 18px 48px ${catMeta.shadow}, 0 1px 0 rgba(255,255,255,.85) inset`,
                            border:`1px solid ${catMeta.color}35`,
                            borderTop:`2.5px solid ${catMeta.color}65`,
                            transform:pressedCard===cat.cat+i?"scale(.963)":"scale(1)",
                            transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .25s",
                          }}>
                          <div className="nv3-meal-top">
                            <div className="nv3-meal-name">{mealName(m)}</div>
                            <button
                              className={"nv3-meal-add-btn"+(isAdded?" done":"")}
                              onClick={()=>logMeal(m)} aria-label={NT.add}>
                              {isAdded
                                ? <AppIcon name="check" size={14}/>
                                : <AppIcon name="plus" size={14}/>}
                            </button>
                          </div>
                          <div className="nv3-meal-meta">
                            <span className={"meal-tag "+m.tag}>{tagLabel(m.tag)}</span>
                            <span className="nv3-meal-kcal">{m.kcal} kcal</span>
                            {prep !== "0 min" && <span className="nv3-meal-prep">⏱ {prep}</span>}
                            {(()=>{
                              const recs = TRI_MEAL_REC[m.name];
                              const curTri = parseInt(localStorage.getItem("lume_weeks")||"15")<=13?1:parseInt(localStorage.getItem("lume_weeks")||"15")<=26?2:3;
                              if(recs && recs.includes(curTri)) return (
                                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,
                                  background:"rgba(46,138,74,.1)",color:"#2e8a4a",border:"1px solid rgba(46,138,74,.22)"}}>
                                  ✓ T{curTri}
                                </span>
                              );
                              return null;
                            })()}
                          </div>
                          {MEAL_WHY[m.name] && (
                            <button className="nv3-why-toggle" onClick={()=>setExpandedMeal(isExp?null:m.name)}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/></svg>
                              {isExp ? NT.hide : NT.whyFood}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                style={{transform:isExp?"rotate(180deg)":"",transition:"transform .3s",marginLeft:"auto"}}>
                                <path d="M6 9l6 6 6-6"/>
                              </svg>
                            </button>
                          )}
                          {isExp && MEAL_WHY[m.name] && (
                            <div className="nv3-why-box" style={{borderColor:(ng?.color||"#A8492A")+"44",background:(ng?.color||"#A8492A")+"08"}}>
                              <div className="nv3-why-dot" style={{background:ng?.color||"#A8492A"}}></div>
                              <div>{mealWhy(m)}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Añadir propia */}
            <div className="nv3-custom-card"
              onPointerDown={()=>setPressedCustom(true)}
              onPointerUp={()=>setPressedCustom(false)}
              onPointerLeave={()=>setPressedCustom(false)}
              style={{boxShadow:`0 18px 48px ${planMeta.shadow}`,border:`1.5px solid ${planMeta.color}40`,borderTop:`2.5px solid ${planMeta.color}70`,transform:pressedCustom?"scale(.978)":"scale(1)",transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .3s"}}>
              <div className="nv3-custom-title">
                <AppIcon name="plus" size={15}/>
                {NT.addOwnMeal}
              </div>
              <input className="app-field" style={{marginBottom:10}}
                placeholder={NT.mealNamePh}
                value={custom} onChange={e=>setCustom(e.target.value)}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {NTAGS.map(t => (
                  <button key={t.k}
                    className={"meal-tag "+t.k}
                    style={{cursor:"pointer",border:customTag===t.k?"2px solid currentColor":"1px solid transparent",
                      padding:"5px 12px",fontWeight:customTag===t.k?700:600,
                      opacity:customTag===t.k?1:.7,transition:"all .15s"}}
                    onClick={()=>setCustomTag(t.k)}>{tagLabel(t.k)}</button>
                ))}
              </div>
              <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",opacity:!custom.trim()?.5:1}}
                onClick={logCustom}>{NT.addToLog}</button>
            </div>
          </div>
        )}

        {/* ── NUTRIENTES ── */}
        {tab==="nutri" && (
          <div>
            <WaterTracker/>

            <div className="nv3-section-hdr">
              <div className="nv3-section-eyebrow">{NT.dailyTracking}</div>
              <div className="nv3-section-title">{NT.keyNutrients}</div>
              <div className="nv3-section-sub">{NT.weekGoals}</div>
            </div>

            {NUTRIENT_GOALS.map(ng => {
              const det = nutrientDetail(ng.k);
              const n = logged.filter(m=>m.tag===ng.k).length;
              const val = Math.min(ng.goal, n*ng.contrib);
              const pct = Math.min(100,(val/ng.goal)*100);
              const sz=64, r=24, circ=2*Math.PI*r, dash=(pct/100)*circ;
              const isOpen = expandedNutrient===ng.k;
              return (
                <div key={ng.k} className="nv3-nutrient-card" style={{boxShadow:`0 8px 34px ${ng.color}2e, 0 1px 0 rgba(255,255,255,.95) inset`,borderTop:`2.5px solid ${ng.color}30`}}>
                  <div className="nv3-nc-top" onClick={()=>setExpandedNutrient(isOpen?null:ng.k)}>
                    {/* Mini ring */}
                    <div style={{position:"relative",width:sz,height:sz,flexShrink:0}}>
                      <svg width={sz} height={sz} viewBox={"0 0 "+sz+" "+sz} style={{transform:"rotate(-90deg)"}}>
                        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={ng.color+"2a"} strokeWidth="7"/>
                        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={ng.color+"0e"} strokeWidth="11"/>
                        {pct>0 && (
                          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={ng.color} strokeWidth="7"
                            strokeDasharray={dash+" "+(circ-dash)} strokeLinecap="round"
                            style={{filter:"drop-shadow(0 0 4px "+ng.color+"55)",transition:"stroke-dasharray .8s ease"}}/>
                        )}
                      </svg>
                      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:800,color:ng.color,lineHeight:1}}>{Math.round(pct)}%</span>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <div className="nv3-nc-name" style={{color:ng.color}}><AppIcon name={det?.icon||"spark"} size={22}/> {nutrientLabel(ng.k)}</div>
                      <div className="nv3-nc-why">{det?.why}</div>
                      <div className="nv3-nc-amount">{val} / {ng.goal} {ng.unit}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a08070" strokeWidth="2.5"
                      style={{transform:isOpen?"rotate(180deg)":"",transition:"transform .3s",flexShrink:0}}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  {/* Expandido */}
                  {isOpen && det && (
                    <div className="nv3-nc-body">
                      <div className="nv3-nc-section-lbl">{NT.foodSources}</div>
                      <div className="nv3-nc-sources">
                        {det.sources.map((s,i) => (
                          <div key={i} className="nv3-nc-source">{s}</div>
                        ))}
                      </div>
                      <div className="nv3-nc-tip-box" style={{borderColor:ng.color+"44",background:ng.color+"09"}}>
                        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:ng.color,marginBottom:5}}>{NT.absorptionTip}</div>
                        <div style={{fontSize:12.5,color:"var(--ink-soft)",lineHeight:1.55}}>{det.tip}</div>
                      </div>
                      {det.warning && (
                        <div className="nv3-nc-warning">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8952a" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M12 9v4M12 17h.01"/>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          </svg>
                          {det.warning}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Barra de progreso inferior */}
                  <div className="nv3-nc-prog-track">
                    <div className="nv3-nc-prog-fill" style={{width:pct+"%",background:ng.color}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REGISTRO ── */}
        {tab==="reg" && (
          <div>

            {/* ─── Resumen del día — glass crema (contrasta con header oscuro) ─── */}
            <div style={{
              background:"rgba(255,248,240,.78)",
              backdropFilter:"blur(24px) saturate(180%)",
              WebkitBackdropFilter:"blur(24px) saturate(180%)",
              border:"1px solid rgba(255,255,255,.9)",
              borderTop:"2.5px solid rgba(168,73,42,.28)",
              borderRadius:24,
              padding:"18px 18px 16px",
              boxShadow:"0 18px 52px rgba(168,73,42,.13), 0 1px 0 rgba(255,255,255,.95) inset",
              marginBottom:14
            }}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>

                {/* Kcal + texto */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#a08070",marginBottom:6}}>{NT.today} · {todayDate}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:700,color:"#3d1a0e",lineHeight:1,letterSpacing:"-.02em"}}>{todayKcal||0}</div>
                    <div style={{fontSize:13,color:"#a08070",fontWeight:500,marginBottom:4}}>kcal</div>
                  </div>
                  <div style={{fontSize:11.5,color:"#c0a090",marginTop:2}}>meta {KCAL_GOAL} kcal</div>
                  {/* Pill estado */}
                  <div style={{
                    display:"inline-flex",alignItems:"center",gap:6,marginTop:10,
                    padding:"6px 12px",borderRadius:99,
                    background:todayKcal>=KCAL_GOAL?"rgba(46,138,74,.1)":"rgba(168,73,42,.08)",
                    border:todayKcal>=KCAL_GOAL?"1px solid rgba(46,138,74,.28)":"1px solid rgba(168,73,42,.2)"
                  }}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:todayKcal>=KCAL_GOAL?"#2e8a4a":"#A8492A",flexShrink:0}}></div>
                    <span style={{fontSize:11,fontWeight:600,color:todayKcal>=KCAL_GOAL?"#2e8a4a":"#A8492A"}}>
                      {todayKcal<KCAL_GOAL?NT.missing+(KCAL_GOAL-todayKcal)+" kcal":NT.goalReached}
                    </span>
                  </div>
                </div>

                {/* Ring terracota */}
                <div style={{
                  position:"relative",width:88,height:88,flexShrink:0,
                  borderRadius:"50%",
                  background:"rgba(255,255,255,.6)",
                  backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
                  border:"1px solid rgba(168,73,42,.12)",
                  boxShadow:"0 6px 24px rgba(168,73,42,.14), inset 0 1px 0 rgba(255,255,255,.8), inset 0 -2px 6px rgba(168,73,42,.06)"
                }}>
                  <svg width="88" height="88" viewBox="0 0 88 88" style={{transform:"rotate(-90deg)",position:"absolute",inset:0}}>
                    <defs>
                      <linearGradient id="regRingTerra" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C8952A"/>
                        <stop offset="50%" stopColor="#A8492A"/>
                        <stop offset="100%" stopColor="#8B3520"/>
                      </linearGradient>
                    </defs>
                    <circle cx="44" cy="44" r="32" fill="none" stroke="rgba(168,73,42,.08)" strokeWidth="9"/>
                    {kcalPct>0 && <circle cx="44" cy="44" r="32" fill="none" stroke="rgba(168,73,42,.18)" strokeWidth="13"
                      strokeDasharray={(kcalPct/100)*2*Math.PI*32+" "+(2*Math.PI*32)} strokeLinecap="round"
                      style={{filter:"blur(5px)"}}/>}
                    {kcalPct>0 && <circle cx="44" cy="44" r="32" fill="none" stroke="url(#regRingTerra)" strokeWidth="9"
                      strokeDasharray={(kcalPct/100)*2*Math.PI*32+" "+(2*Math.PI*32)} strokeLinecap="round"
                      style={{filter:"drop-shadow(0 0 5px rgba(168,73,42,.4))",transition:"stroke-dasharray .8s ease"}}/>}
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:800,color:"#3d1a0e",lineHeight:1}}>{Math.round(kcalPct)}%</div>
                    <div style={{fontSize:9,color:"#a08070",marginTop:1,fontWeight:600}}>meta</div>
                  </div>
                </div>
              </div>

              {/* Barras nutrientes — grid 2×2 con colores */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 16px"}}>
                {NUTRIENT_GOALS.map(ng => {
                  const n=logged.filter(m=>m.tag===ng.k&&m.date===todayDate).length;
                  const pct=Math.min(100,((n*ng.contrib)/ng.goal)*100);
                  return (
                    <div key={ng.k}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:10.5,fontWeight:700,color:ng.color}}>{nutrientLabel(ng.k)}</span>
                        <span style={{fontSize:10,fontWeight:700,color:pct>=80?ng.color:"#c0a090"}}>{Math.round(pct)}%</span>
                      </div>
                      <div style={{height:5,background:"rgba(0,0,0,.06)",borderRadius:99,overflow:"hidden"}}>
                        <div style={{width:pct+"%",height:"100%",background:ng.color,borderRadius:99,
                          boxShadow:`0 0 6px ${ng.color}60`,
                          transition:"width .8s cubic-bezier(.34,1.56,.64,1)"}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Lista de alimentos ─── */}
            {Object.keys(byDate).length===0 ? (
              <div className="nv3-empty">
                <div className="nv3-empty-ico"><AppIcon name="leaf" size={26}/></div>
                <div className="nv3-empty-title">{NT.noLogsYet}</div>
                <div className="nv3-empty-sub">{NT.noLogsSub}</div>
              </div>
            ) : (
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#3d1a0e",marginBottom:12,padding:"0 2px"}}>{NT.myFoods}</div>
                {Object.entries(byDate).map(([date, items]) => {
                  const dayKcal=items.reduce((s,r)=>s+(r.kcal||0),0);
                  const isToday=date===todayDate;
                  const groups={};
                  items.forEach(r => {
                    const mc=MEAL_PLAN.find(c=>c.meals.some(m=>m.name===r.name));
                    const key=mc?.cat||"Otros"; const ico=mc?.ico||"🍴";
                    const meta=MEAL_CAT_META[mc?.cat]||{color:"#A8492A",shadow:"rgba(168,73,42,.2)",bg:"rgba(168,73,42,.1)"};
                    if(!groups[key]) groups[key]={ico,items:[],meta};
                    groups[key].items.push(r);
                  });
                  return (
                    <div key={date} style={{marginBottom:20}}>
                      {/* Fecha header */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"0 2px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:7,height:7,borderRadius:"50%",background:isToday?"#A8492A":"#c0a090",flexShrink:0,boxShadow:isToday?"0 0 8px rgba(168,73,42,.5)":"none"}}></div>
                          <span style={{fontSize:isToday?14:11,fontWeight:700,color:isToday?"#3d1a0e":"#a08070",textTransform:isToday?"none":"uppercase",letterSpacing:isToday?"0":".08em"}}>{isToday?"Hoy":date}</span>
                        </div>
                        {dayKcal>0 && (
                          <span style={{fontSize:11.5,fontWeight:700,color:"#A8492A",background:"rgba(168,73,42,.08)",padding:"3px 10px",borderRadius:99,border:"1px solid rgba(168,73,42,.14)"}}>{dayKcal} kcal</span>
                        )}
                      </div>

                      {/* Grupos por categoría */}
                      {Object.entries(groups).map(([cat,{ico,items:cItems,meta}]) => (
                        <div key={cat} style={{marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,padding:"0 2px"}}>
                            <div style={{
                              width:30,height:30,borderRadius:9,
                              background:meta.bg,border:`1px solid ${meta.color}25`,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:15,flexShrink:0,boxShadow:`0 3px 10px ${meta.shadow}`
                            }}>{ico}</div>
                            <span style={{fontSize:13,fontWeight:700,color:"#3d1a0e"}}>{cat}</span>
                            <span style={{fontSize:10.5,color:"#a08070",background:"rgba(0,0,0,.04)",padding:"2px 8px",borderRadius:99}}>{cItems.length} alimento{cItems.length!==1?"s":""}</span>
                          </div>
                          <div style={{
                            background:"rgba(255,248,240,.72)",
                            backdropFilter:"blur(22px) saturate(165%)",
                            WebkitBackdropFilter:"blur(22px) saturate(165%)",
                            border:`1px solid ${meta.color}20`,
                            borderTop:`2px solid ${meta.color}45`,
                            borderRadius:18,overflow:"hidden",
                            boxShadow:`0 10px 32px ${meta.shadow}, 0 1px 0 rgba(255,255,255,.95) inset`
                          }}>
                            {cItems.map((r,i) => {
                              const ng=NUTRIENT_GOALS.find(x=>x.k===r.tag);
                              return (
                                <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<cItems.length-1?`1px solid ${meta.color}12`:"none"}}>
                                  <div style={{width:4,height:38,borderRadius:99,background:ng?.color||"#A8492A",flexShrink:0,boxShadow:`0 0 8px ${ng?.color||"#A8492A"}55`}}></div>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontSize:13,fontWeight:600,color:"#3d1a0e",lineHeight:1.35}}>{displayMealName(r.name)}</div>
                                    <div style={{display:"flex",gap:6,alignItems:"center",marginTop:5,flexWrap:"wrap"}}>
                                      <span className={"meal-tag "+r.tag}>{tagLabel(r.tag)}</span>
                                      {r.kcal>0 && <span style={{fontSize:10.5,color:"#a08070",fontWeight:600}}>{r.kcal} kcal</span>}
                                      {!isToday && <span style={{fontSize:10,color:"#c0a090"}}>{r.date}</span>}
                                    </div>
                                  </div>
                                  {isToday && (
                                    <button className="nv3-reg-del" onClick={()=>deleteLog(r.id)} aria-label={NT.remove}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


const BENEFITS = [
  { ic:"spark",     plan:"bien", t:"Asistente IA ilimitado",         d:"Pregunta sin límites, a cualquier hora." },
  { ic:"leaf",      plan:"bien", t:"Plan nutricional personalizado",  d:"Recetas adaptadas a tu trimestre y síntomas." },
  { ic:"meditation",plan:"bien", t:"Meditaciones prenatales",        d:"Calma el cuerpo y la mente cada día." },
  { ic:"music",     plan:"bien", t:"Música para tu bebé",            d:"Melodías y frecuencias desde el vientre." },
  { ic:"book",      plan:"bien", t:"Guía semanal premium",           d:"Contenido nuevo adaptado a cada etapa." },
  { ic:"star",      plan:"bien", t:"Ejercicios y posturas",          d:"Rutinas seguras para cada trimestre." },
  { ic:"diary",     plan:"bien", t:"Diario del embarazo",            d:"Guarda cada momento especial." },
  { ic:"heart",     plan:"bien", t:"Modo pareja",                    d:"Tu pareja vive el embarazo contigo." },
  { ic:"expert",    plan:"pro",  t:"Consultas con expertos",         d:"Acceso a profesionales de la salud." },
  { ic:"chart",     plan:"pro",  t:"Historial exportable",           d:"Tu historial médico en PDF cuando lo necesites." },
  { ic:"baby",      plan:"pro",  t:"Meditación para bebés",          d:"Frecuencias terapéuticas desde el vientre." },
];

const PLANS = [
  { id:"esencial",   name:"Esencial",    price:"Gratis", sub:"",     color:"#a08070",
    features:[
      "Tracker bebé semanal (semanas 4–40)",
      "Registro de citas médicas",
      "Síntomas y bitácora de bienestar",
      "Control de peso con gráfica",
      "Galería de fotos (hasta 6)",
      "Tracker de patadas",
      "Ultrasonidos (hasta 2)",
      "Nombres de bebé (hasta 10 favoritos)",
      "Recompensas y puntos",
      "Asistente IA Glow (3 preguntas/día)",
    ] },
  { id:"bienestar",  name:"Bienestar",   price:"$9",     sub:"/mes", color:"#A8492A", badge:"Más popular",
    features:[
      "Todo lo de Esencial",
      "Asistente IA Glow ilimitado",
      "Plan nutricional personalizado por IA",
      "Meditaciones prenatales guiadas",
      "Música para tu bebé",
      "Meditación + música combinada",
      "Ejercicios seguros por trimestre",
      "Guía de contenido semanal premium",
      "Diario del embarazo",
      "Ultrasonidos ilimitados",
      "Modo pareja",
      "── Próximamente ──",
      "Clases de preparación al parto",
    ] },
  { id:"profesional",name:"Profesional", price:"$19",    sub:"/mes", color:"#C8952A", badge:"✦ Premium",
    features:[
      "Todo lo de Bienestar",
      "Meditación de frecuencias para bebés",
      "Historial médico exportable en PDF",
      "Acceso anticipado a nuevas funciones",
      "Soporte prioritario 24/7",
      "── Próximamente ──",
      "Consultas con expertos del comité",
      "Seguimiento post-parto y recién nacido",
      "Dashboard médico compartido con tu médico",
      "Modo bebé: primeros meses",
      "Red de clínicas aliadas",
    ] },
];

const PLANS_EN = [
  { id:"esencial",   name:"Essential",    price:"Free", sub:"",     color:"#a08070",
    features:[
      "Weekly baby tracker (weeks 4–40)",
      "Medical appointment log",
      "Symptoms & wellness journal",
      "Weight tracking with chart",
      "Photo gallery (up to 6)",
      "Kick tracker",
      "Ultrasounds (up to 2)",
      "Baby names (up to 10 favorites)",
      "Rewards & points",
      "Glow AI assistant (3 questions/day)",
    ] },
  { id:"bienestar",  name:"Wellness",   price:"$9",     sub:"/mo", color:"#A8492A", badge:"Most popular",
    features:[
      "Everything in Essential",
      "Unlimited Glow AI assistant",
      "AI-personalized nutrition plan",
      "Guided prenatal meditations",
      "Music for your baby",
      "Combined meditation + music",
      "Trimester-safe exercises",
      "Weekly premium content guide",
      "Pregnancy diary",
      "Unlimited ultrasounds",
      "Partner mode",
      "── Coming soon ──",
      "Childbirth prep classes",
    ] },
  { id:"profesional",name:"Professional", price:"$19",    sub:"/mo", color:"#C8952A", badge:"✦ Premium",
    features:[
      "Everything in Wellness",
      "Frequency meditation for babies",
      "Exportable medical history PDF",
      "Early access to new features",
      "24/7 priority support",
      "── Coming soon ──",
      "Consultations with committee experts",
      "Postpartum & newborn tracking",
      "Medical dashboard shared with your doctor",
      "Baby mode: first months",
      "Partner clinic network",
    ] },
];

function plansFor(lang) { return lang==="en" ? PLANS_EN : PLANS; }

function Premium({ onActivate }) {
  const lang = getAppLang2();
  const PLANS_L = plansFor(lang);
  const [selPlan, setSelPlan] = React.useState("bienestar");
  const [annual, setAnnual] = React.useState(false);
  const [pressedCta, setPressedCta] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [activated, setActivated] = React.useState(() => { try { return !!localStorage.getItem("lume_premium"); } catch { return false; } });
  const plan = PLANS_L.find(p=>p.id===selPlan);

  const ANNUAL_DISCOUNT = lang==="en"
    ? { bienestar: { price:"$6.25", moPer:"/mo · $75/yr", saving:"31%" }, profesional:{ price:"$12", moPer:"/mo · $144/yr", saving:"37%" } }
    : { bienestar: { price:"$6.25", moPer:"/mes · $75/año", saving:"31%" }, profesional:{ price:"$12", moPer:"/mes · $144/año", saving:"37%" } };
  const annualInfo = annual && ANNUAL_DISCOUNT[selPlan];
  const displayPrice = annualInfo ? annualInfo.price : plan.price;
  const displaySub   = annualInfo ? annualInfo.moPer : plan.sub;

  const activate = () => {
    try { localStorage.setItem("lume_premium", "true"); } catch {}
    if (onActivate) onActivate();
    setActivated(true);
  };

  const TRUST = lang==="en" ? [
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>, label:"7-day free trial" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label:"Clinical guides" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label:"GDPR" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>, label:"Cancel anytime" },
  ] : [
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>, label:"7 días gratis" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label:"Guías clínicas" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label:"RGPD" },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>, label:"Cancela fácil" },
  ];

  const FAQ = lang==="en" ? [
    { q:"When is the first charge?", a:"Only after the 7-day free trial. If you cancel before then, nothing is charged." },
    { q:"Can I change plans later?", a:"Yes, you can upgrade or downgrade anytime from Settings. Changes apply on the next billing cycle." },
    { q:"Is my data safe?", a:"All health data is encrypted in transit and at rest. We never sell or share it. We comply with GDPR." },
  ] : [
    { q:"¿Cuándo se hace el primer cobro?", a:"Solo después de los 7 días de prueba gratuita. Si cancelas antes, no se carga nada." },
    { q:"¿Puedo cambiar de plan más adelante?", a:"Sí, puedes subir o bajar de plan en cualquier momento desde Ajustes. Los cambios se aplican en el siguiente ciclo." },
    { q:"¿Mis datos están seguros?", a:"Todos los datos de salud se cifran en tránsito y en reposo. Nunca los vendemos ni compartimos. Cumplimos RGPD." },
  ];

  const COMPARE = lang==="en" ? [
    { f:"Weekly baby tracker",                esen:true,    bien:true,   pro:true   },
    { f:"Medical appointment log",            esen:true,    bien:true,   pro:true   },
    { f:"Symptoms & journal",                 esen:true,    bien:true,   pro:true   },
    { f:"Weight tracking",                    esen:true,    bien:true,   pro:true   },
    { f:"Photo gallery",                     esen:"6 max", bien:"∞",   pro:"∞"    },
    { f:"Kick tracker",                       esen:true,    bien:true,   pro:true   },
    { f:"Ultrasounds",                        esen:"2 max", bien:"∞",   pro:"∞"    },
    { f:"Baby names",                        esen:true,    bien:true,   pro:true   },
    { f:"Rewards & points",                   esen:true,    bien:true,   pro:true   },
    { f:"Glow AI assistant",                  esen:"3/day", bien:"∞",   pro:"∞"    },
    { f:"Basic nutrition",                   esen:true,    bien:true,   pro:true   },
    { f:"AI nutrition plan",                  esen:false,   bien:true,   pro:true   },
    { f:"Prenatal meditations",               esen:false,   bien:true,   pro:true   },
    { f:"Music for your baby",               esen:false,   bien:true,   pro:true   },
    { f:"Meditation + music",                esen:false,   bien:true,   pro:true   },
    { f:"Trimester exercises",                esen:false,   bien:true,   pro:true   },
    { f:"Weekly premium content",             esen:false,   bien:true,   pro:true   },
    { f:"Pregnancy diary",                   esen:false,   bien:true,   pro:true   },
    { f:"Partner mode",                       esen:false,   bien:true,   pro:true   },
    { f:"Expert consultations",               esen:false,   bien:false,  pro:"Soon" },
    { f:"Frequencies for babies",             esen:false,   bien:false,  pro:true   },
    { f:"Medical history PDF",                esen:false,   bien:false,  pro:true   },
    { f:"24/7 priority support",              esen:false,   bien:false,  pro:true   },
  ] : [
    { f:"Tracker bebé semanal",              esen:true,    bien:true,   pro:true   },
    { f:"Registro de citas médicas",          esen:true,    bien:true,   pro:true   },
    { f:"Síntomas y bitácora",                esen:true,    bien:true,   pro:true   },
    { f:"Control de peso",                    esen:true,    bien:true,   pro:true   },
    { f:"Galería de fotos",                  esen:"6 máx", bien:"∞",   pro:"∞"    },
    { f:"Tracker de patadas",                 esen:true,    bien:true,   pro:true   },
    { f:"Ultrasonidos",                       esen:"2 máx", bien:"∞",   pro:"∞"    },
    { f:"Nombres de bebé",                   esen:true,    bien:true,   pro:true   },
    { f:"Recompensas y puntos",               esen:true,    bien:true,   pro:true   },
    { f:"Asistente IA Glow",                  esen:"3/día", bien:"∞",   pro:"∞"    },
    { f:"Nutrición básica",                  esen:true,    bien:true,   pro:true   },
    { f:"Plan nutricional por IA",            esen:false,   bien:true,   pro:true   },
    { f:"Meditaciones prenatales",            esen:false,   bien:true,   pro:true   },
    { f:"Música para tu bebé",              esen:false,   bien:true,   pro:true   },
    { f:"Meditación + música",              esen:false,   bien:true,   pro:true   },
    { f:"Ejercicios por trimestre",           esen:false,   bien:true,   pro:true   },
    { f:"Contenido semanal premium",          esen:false,   bien:true,   pro:true   },
    { f:"Diario del embarazo",               esen:false,   bien:true,   pro:true   },
    { f:"Modo pareja",                        esen:false,   bien:true,   pro:true   },
    { f:"Consultas con expertos",             esen:false,   bien:false,  pro:"Próx." },
    { f:"Frecuencias para bebés",            esen:false,   bien:false,  pro:true   },
    { f:"Historial médico PDF",              esen:false,   bien:false,  pro:true   },
    { f:"Soporte prioritario 24/7",           esen:false,   bien:false,  pro:true   },
  ];

  const CellIcon = ({v}) => {
    if (v === true) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e8a4a" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>;
    if (v === false) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(168,73,42,.2)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
    return <span style={{fontSize:11,fontWeight:700,color:plan.color}}>{v}</span>;
  };

  return (
    <div style={{background:"linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)",minHeight:"100%",overflowY:"auto",overflowX:"hidden",paddingBottom:100}}>

      {/* Banner plan activo */}
      {activated && (
        <div style={{background:"linear-gradient(90deg,rgba(46,138,74,.12),rgba(46,138,74,.06))",borderBottom:"1px solid rgba(46,138,74,.22)",padding:"52px 20px 12px",display:"flex",alignItems:"center",gap:10}}>
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#2e8a4a" strokeWidth="2.2" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
          <span style={{fontSize:13,fontWeight:700,color:"#2e6a3a"}}>{lang==="en"?`${plan.name} plan active`:`Plan ${plan.name} activo`}</span>
          <button onClick={()=>setActivated(false)} style={{marginLeft:"auto",fontSize:11,color:"#A8492A",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{lang==="en"?"See all plans →":"Ver todos los planes →"}</button>
        </div>
      )}

      {/* HERO */}
      <div style={{position:"relative",overflow:"hidden",padding:"52px 24px 36px",
        background:"linear-gradient(160deg,#1e0a04 0%,#3d1a0e 50%,#5a2810 100%)"}}>
        <div style={{position:"absolute",top:-80,right:-80,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,149,42,.22),transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-40,left:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,73,42,.18),transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:99,
            background:"rgba(212,175,80,.12)",border:"1px solid rgba(212,175,80,.28)",marginBottom:18}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,80,.9)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 3c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4C10.4 7.8 11.4 6.8 12 3Z"/></svg>
            <span style={{fontSize:11,fontWeight:700,color:"rgba(212,175,80,.9)",letterSpacing:".05em"}}>{lang==="en"?"Early access · Beta 2026":"Acceso anticipado · Beta 2026"}</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:"#fff5ee",lineHeight:1.15,letterSpacing:"-.02em",marginBottom:10}}>
            {lang==="en" ? <>Your pregnancy deserves<br/><em style={{color:"rgba(212,175,80,.9)"}}>the best.</em></> : <>Tu embarazo merece<br/><em style={{color:"rgba(212,175,80,.9)"}}>lo mejor.</em></>}
          </div>
          <p style={{fontSize:13.5,color:"rgba(255,245,238,.6)",lineHeight:1.65,maxWidth:260,margin:"0 auto 24px"}}>
            {lang==="en" ? "Premium week-by-week companionship, with rigor and warmth." : "Acompañamiento premium semana a semana, con rigor y calidez."}
          </p>
          {/* Toggle anual/mensual */}
          <div style={{display:"inline-flex",alignItems:"center",gap:12,padding:"6px 8px",borderRadius:99,
            background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)"}}>
            <span onClick={()=>setAnnual(false)} style={{fontSize:12,fontWeight:600,color:annual?"rgba(255,255,255,.4)":"rgba(255,255,255,.9)",padding:"4px 10px",cursor:"pointer"}}>{lang==="en"?"Monthly":"Mensual"}</span>
            <button onClick={()=>setAnnual(a=>!a)} style={{
              width:44,height:24,borderRadius:99,border:"none",cursor:"pointer",
              background:annual?"linear-gradient(90deg,#A8492A,#C8952A)":"rgba(255,255,255,.18)",
              position:"relative",transition:"background .25s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:annual?22:3,width:18,height:18,borderRadius:"50%",
                background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,.25)",transition:"left .22s cubic-bezier(.34,1.56,.64,1)"}}/>
            </button>
            <span onClick={()=>setAnnual(true)} style={{fontSize:12,fontWeight:600,color:annual?"rgba(255,255,255,.9)":"rgba(255,255,255,.4)",padding:"4px 4px 4px 0",cursor:"pointer"}}>{lang==="en"?"Annual":"Anual"}</span>
            {annual&&<span style={{fontSize:10,fontWeight:800,color:"#C8952A",background:"rgba(200,149,42,.2)",
              padding:"2px 8px",borderRadius:99,border:"1px solid rgba(200,149,42,.3)"}}>{lang==="en"?"Save up to 37%":"Ahorra hasta 37%"}</span>}
          </div>
        </div>
      </div>

      <div style={{padding:"20px 16px 0",display:"flex",flexDirection:"column",gap:14}}>

        {/* PLAN CARDS */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {PLANS_L.map(p => {
            const on = selPlan===p.id;
            const aInfo = annual && ANNUAL_DISCOUNT[p.id];
            return (
              <button key={p.id} onClick={()=>setSelPlan(p.id)} style={{
                display:"flex",alignItems:"center",gap:14,
                padding:"16px 18px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",
                background: on?"rgba(255,255,255,.78)":"rgba(255,255,255,.4)",
                backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
                border: on ? `2px solid ${p.color}55` : "1.5px solid rgba(255,255,255,.75)",
                boxShadow: on ? `0 14px 36px ${p.color}25, 0 1px 0 rgba(255,255,255,.9) inset` : "0 3px 10px rgba(168,73,42,.06)",
                transform: on ? "translateY(-2px)" : "none",
                transition:"all .22s cubic-bezier(.23,1,.32,1)",textAlign:"left"
              }}>
                {/* Radio */}
                <div style={{width:20,height:20,borderRadius:"50%",border: on ? `6px solid ${p.color}` : "2px solid rgba(168,73,42,.25)",
                  flexShrink:0,background: on ? "#fff" : "transparent",transition:"all .18s"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <span style={{fontSize:15,fontWeight:700,color: on?"#3d1a0e":"#7a5a4a"}}>{p.name}</span>
                    {p.badge&&<span style={{fontSize:9,fontWeight:800,color:p.color,background:`${p.color}15`,
                      padding:"2px 8px",borderRadius:99,border:`1px solid ${p.color}30`}}>{p.badge}</span>}
                  </div>
                  <span style={{fontSize:12,color:"#a08070"}}>{p.id==="esencial"?(lang==="en"?"Essential tracking tools":"Herramientas esenciales de seguimiento"):p.id==="bienestar"?(lang==="en"?"AI, nutrition, meditation & more":"IA, nutrición, meditación y más"):(lang==="en"?"Everything + experts & pro features":"Todo + expertos y funciones pro")}</span>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color: on ? p.color : "#a08070",lineHeight:1}}>
                    {aInfo?aInfo.price:p.price}
                  </div>
                  <div style={{fontSize:10,color:"#b09080"}}>{aInfo?aInfo.moPer:p.sub||(lang==="en"?"free":"gratis")}</div>
                  {aInfo&&<div style={{fontSize:9,fontWeight:800,color:"#2e8a4a",marginTop:2}}>{lang==="en"?"Save":"Ahorra"} {aInfo.saving}</div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* TRUST STRIP */}
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",
          borderRadius:16,background:"rgba(255,255,255,.5)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
          border:"1px solid rgba(255,255,255,.82)",boxShadow:"0 4px 14px rgba(168,73,42,.06)"}}>
          {TRUST.map((t,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}>
              <div style={{color:"#A8492A",opacity:.75}}>{t.icon}</div>
              <span style={{fontSize:9.5,fontWeight:700,color:"#7a5a4a",textAlign:"center",letterSpacing:".02em"}}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* FEATURES DEL PLAN */}
        {selPlan!=="esencial"&&(
          <div style={{background:"rgba(255,255,255,.62)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",
            border:`1.5px solid ${plan.color}25`,borderRadius:22,overflow:"hidden",
            boxShadow:`0 10px 32px ${plan.color}12, 0 1px 0 rgba(255,255,255,.9) inset`}}>
            <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${plan.color}15`,
              background:`linear-gradient(135deg,${plan.color}08,transparent)`}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:plan.color}}>
                {lang==="en"?`Included in ${plan.name}`:`Incluido en ${plan.name}`}
              </div>
            </div>
            <div style={{padding:"12px 18px 16px",display:"flex",flexDirection:"column",gap:9}}>
              {plan.features.filter(f=>!f.startsWith("──")).map((f,i)=>{
                const isSoon = plan.features.indexOf("──") > -1 && i > plan.features.indexOf("──")-1 && plan.features.slice(0,i).some(x=>x.startsWith("──"));
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,opacity:isSoon?.5:1}}>
                    <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,
                      background:`${plan.color}${isSoon?"0a":"15"}`,
                      border:`1.5px solid ${plan.color}${isSoon?"20":"35"}`,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {isSoon
                        ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" opacity=".5"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>
                        : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span style={{fontSize:12.5,color:"#3d1a0e",fontStyle:isSoon?"italic":"normal",lineHeight:1.35,fontWeight:(f.startsWith("Todo")||f.startsWith("Everything"))?600:400}}>{f}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMPARATIVA */}
        <div style={{background:"rgba(255,255,255,.58)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,.85)",borderRadius:22,overflow:"hidden",
          boxShadow:"0 8px 28px rgba(168,73,42,.07)"}}>
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid rgba(168,73,42,.07)"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.7}}>{lang==="en"?"Compare plans":"Comparar planes"}</div>
          </div>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 60px",padding:"8px 16px",
            borderBottom:"1px solid rgba(168,73,42,.06)",background:"rgba(168,73,42,.02)"}}>
            <div/>
            {PLANS_L.map(p=>(
              <div key={p.id} style={{textAlign:"center",fontSize:10,fontWeight:800,color:selPlan===p.id?p.color:"#a08070",letterSpacing:".04em"}}>{p.name.slice(0,4)}</div>
            ))}
          </div>
          {COMPARE.map((row,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 60px",
              padding:"10px 16px",borderBottom:i<COMPARE.length-1?"1px solid rgba(168,73,42,.05)":"none",
              background:i%2===0?"transparent":"rgba(168,73,42,.015)"}}>
              <span style={{fontSize:12,color:"#5a3a2a",lineHeight:1.3}}>{row.f}</span>
              {["esen","bien","pro"].map(k=>(
                <div key={k} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <CellIcon v={row[k]}/>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* TESTIMONIAL */}
        <div style={{background:"rgba(255,255,255,.6)",backdropFilter:"blur(20px) saturate(160%)",WebkitBackdropFilter:"blur(20px) saturate(160%)",
          border:"1px solid rgba(255,255,255,.88)",borderRadius:22,padding:"20px",
          boxShadow:"0 10px 32px rgba(168,73,42,.09),0 1px 0 rgba(255,255,255,.9) inset"}}>
          <div style={{display:"flex",gap:3,marginBottom:12}}>
            {[1,2,3,4,5].map(i=>(
              <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C8952A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <p style={{fontSize:14,color:"#5a3a2a",lineHeight:1.7,fontStyle:"italic",marginBottom:16}}>
            {lang==="en" ? "\u201cLum\u00e9's assistant answered me at 3am when I was scared. I never felt alone during my pregnancy.\u201d" : "\u201cEl asistente de Lum\u00e9 me respondi\u00f3 a las 3am cuando ten\u00eda miedo. No me sent\u00ed sola en ning\u00fan momento del embarazo.\u201d"}
          </p>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#C8952A,#A8492A)",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:"#fff5ee"}}>M</span>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#3d1a0e"}}>María G.</div>
              <div style={{fontSize:11,color:"#a08070"}}>{lang==="en"?"Wellness plan · Week 34":"Plan Bienestar · Semana 34"}</div>
            </div>
            <div style={{marginLeft:"auto",padding:"3px 10px",borderRadius:99,background:"rgba(168,73,42,.08)",
              border:"1px solid rgba(168,73,42,.14)",fontSize:10,fontWeight:700,color:"#A8492A"}}>Beta</div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{background:"rgba(255,255,255,.55)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",
          border:"1px solid rgba(255,255,255,.82)",borderRadius:22,overflow:"hidden",
          boxShadow:"0 6px 20px rgba(168,73,42,.06)"}}>
          <div style={{padding:"14px 18px 10px",borderBottom:"1px solid rgba(168,73,42,.06)"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.7}}>{lang==="en"?"Frequently asked questions":"Preguntas frecuentes"}</div>
          </div>
          {FAQ.map((item,i)=>(
            <div key={i} style={{borderBottom:i<FAQ.length-1?"1px solid rgba(168,73,42,.06)":"none"}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{
                width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"14px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                <span style={{fontSize:13,fontWeight:600,color:"#3d1a0e",lineHeight:1.4,flex:1,paddingRight:12}}>{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8492A" strokeWidth="2.5" strokeLinecap="round"
                  style={{flexShrink:0,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform .2s"}}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {openFaq===i&&(
                <div style={{padding:"0 18px 14px",fontSize:12.5,color:"#7a5a4a",lineHeight:1.65}}>{item.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* GARANTIA */}
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:18,
          background:"linear-gradient(135deg,rgba(46,138,74,.08),rgba(46,138,74,.04))",
          border:"1px solid rgba(46,138,74,.2)"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(46,138,74,.12)",border:"1.5px solid rgba(46,138,74,.28)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#2e8a4a" strokeWidth="2.2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#2e6a3a",marginBottom:2}}>{lang==="en"?"7 days completely free":"7 días completamente gratis"}</div>
            <div style={{fontSize:11.5,color:"#4a8a5a",lineHeight:1.5}}>{lang==="en"?"No card required on Essential. For paid plans, cancel before day 8 at no charge.":"Sin tarjeta requerida en Esencial. Para planes de pago, cancela antes del día 8 sin ningún cargo."}</div>
          </div>
        </div>

      </div>

      {/* STICKY CTA */}
      <div style={{position:"sticky",bottom:0,left:0,right:0,padding:"12px 16px 24px",
        background:"linear-gradient(to top,rgba(242,227,216,1) 60%,rgba(242,227,216,0))",
        backdropFilter:"blur(2px)"}}>
        {selPlan==="esencial" ? (
          <button onClick={activate} style={{width:"100%",padding:"16px",borderRadius:99,border:"none",cursor:"pointer",
            background:"rgba(160,128,112,.25)",color:"#7a5a4a",fontWeight:700,fontSize:15,fontFamily:"inherit"}}>
            {lang==="en"?"Continue with Essential free":"Continuar con Esencial gratis"}
          </button>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button
              onPointerDown={()=>setPressedCta(true)} onPointerUp={()=>setPressedCta(false)} onPointerLeave={()=>setPressedCta(false)}
              onClick={()=>{ try{localStorage.setItem("lume_checkout_plan",selPlan);localStorage.setItem("lume_checkout_billing",annual?"annual":"monthly");}catch{} if(window.__lumeGoCheckout)window.__lumeGoCheckout(selPlan,annual); }}
              style={{width:"100%",padding:"17px",borderRadius:99,border:"none",cursor:"pointer",
                background:`linear-gradient(90deg,${plan.color}ee,${plan.color}aa)`,
                boxShadow:`0 14px 40px ${plan.color}44`,fontFamily:"inherit",
                fontSize:16,fontWeight:800,color:"#fff5ee",
                transform:pressedCta?"scale(.96)":"scale(1)",
                transition:"transform .18s cubic-bezier(.34,1.56,.64,1)"}}>
              {plan.id==="bienestar" && !annual ? (lang==="en" ? <>Try {plan.name} 7 days free →</> : <>Probar {plan.name} 7 días gratis →</>) : (lang==="en" ? <>Choose {plan.name} →</> : <>Elegir {plan.name} →</>)}
            </button>
            <div style={{textAlign:"center",fontSize:12,color:"#a08070"}}>
              {lang==="en" ? <>Then <strong style={{color:"#3d1a0e"}}>{displayPrice}{displaySub}</strong> · Cancel anytime</> : <>Luego <strong style={{color:"#3d1a0e"}}>{displayPrice}{displaySub}</strong> · Cancela cuando quieras</>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ── CHECKOUT SCREEN ── */
function CheckoutScreen({ goBack, planId, onSuccess }) {
  const lang = getAppLang2();
  const PLANS_L = plansFor(lang);
  const plan = PLANS_L.find(p=>p.id===planId) || PLANS_L[1];
  const isAnnual = (() => { try { return localStorage.getItem("lume_checkout_billing") === "annual"; } catch { return false; } })();
  const [step, setStep] = React.useState("form"); // form | processing | done
  const [card, setCard] = React.useState("");
  const [name, setName] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [press, setPress] = React.useState(false);
  const trialDays = (plan.id==="bienestar" && !isAnnual) ? 7 : 0;
  const ANNUAL_TOTAL = { bienestar: "$75", profesional: "$144" };
  const displayPrice = isAnnual ? (ANNUAL_TOTAL[plan.id] || plan.price) : plan.price;
  const displaySub = isAnnual ? (lang==="en"?"/yr":"/año") : plan.sub;

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
  const fmtExpiry = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const validate = () => {
    const e={};
    if(!name.trim()) e.name = lang==="en" ? "Name required" : "Nombre requerido";
    if(card.replace(/\s/g,"").length<16) e.card = lang==="en" ? "Incomplete card number" : "Número de tarjeta incompleto";
    if(expiry.length<5) e.expiry = lang==="en" ? "Invalid date" : "Fecha incorrecta";
    if(cvv.length<3) e.cvv = lang==="en" ? "Invalid CVV" : "CVV incorrecto";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const submit = () => {
    if(!validate()) return;
    setStep("processing");
    setTimeout(()=>{
      try{ localStorage.setItem("lume_premium","true"); localStorage.setItem("lume_plan",plan.id); }catch{}
      setStep("done");
    }, 2200);
  };

  const fieldStyle = (err) => ({width:"100%",padding:"14px 16px",borderRadius:13,
    border:`1.5px solid ${err?"#e05a3a":"rgba(168,73,42,.18)"}`,
    background:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:14,color:"#3d1a0e",
    outline:"none",transition:"border-color .15s",boxSizing:"border-box"});
  const labelStyle = {fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#8a6a5a",display:"block",marginBottom:6};

  if(step==="done") return (
    <div style={{background:"linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)",minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",overflowY:"auto"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,rgba(46,138,74,.15),rgba(46,138,74,.08))",border:"2px solid rgba(46,138,74,.35)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,animation:"bounceIn .5s cubic-bezier(.34,1.56,.64,1)"}}>
        <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="#2e8a4a" strokeWidth="2.2" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
      </div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:"#3d1a0e",marginBottom:10,textAlign:"center"}}>{lang==="en"?`Welcome to Lumé ${plan.name}`:`Bienvenida a Lumé ${plan.name}`}</div>
      <p style={{fontSize:14,color:"#8a6a5a",textAlign:"center",lineHeight:1.65,marginBottom:28,maxWidth:280}}>{trialDays>0 ? (lang==="en" ? <>Your subscription is active. The first charge will be in {trialDays} days. You can cancel before then at no cost.</> : <>Tu suscripción está activa. El primer cobro será en {trialDays} días. Puedes cancelar antes sin coste.</>) : (lang==="en" ? <>Your subscription is active. Thanks for joining Lumé {plan.name}.</> : <>Tu suscripción está activa. Gracias por unirte a Lumé {plan.name}.</>)}</p>
      <div style={{width:"100%",maxWidth:320,background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.88)",borderRadius:20,padding:"18px 20px",marginBottom:24,boxShadow:"0 8px 28px rgba(168,73,42,.1)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:13,color:"#8a6a5a"}}>{lang==="en"?"Plan":"Plan"}</span>
          <span style={{fontSize:13,fontWeight:700,color:"#3d1a0e"}}>Lumé {plan.name}</span>
        </div>
        {trialDays>0 && (
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:13,color:"#8a6a5a"}}>{lang==="en"?"Free trial":"Prueba gratuita"}</span>
          <span style={{fontSize:13,fontWeight:700,color:"#2e8a4a"}}>{trialDays} {lang==="en"?"days":"días"}</span>
        </div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(168,73,42,.1)"}}>
          <span style={{fontSize:13,color:"#8a6a5a"}}>{trialDays>0 ? (lang==="en"?"First charge":"Primer cobro") : (lang==="en"?"Charged today":"Cobro hoy")}</span>
          <span style={{fontSize:13,fontWeight:700,color:"#3d1a0e"}}>{displayPrice}{displaySub}</span>
        </div>
      </div>
      <button onClick={()=>{ if(onSuccess)onSuccess(); goBack(); }} style={{width:"100%",maxWidth:320,padding:"16px",borderRadius:99,border:"none",background:"linear-gradient(90deg,#A8492A,#8B3520)",color:"#fff5ee",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 12px 32px rgba(168,73,42,.38)"}}>
        {lang==="en"?"Go to my pregnancy →":"Ir a mi embarazo →"}
      </button>
    </div>
  );

  return (
    <div style={{background:"linear-gradient(160deg,#f9f1eb 0%,#f0e2d6 45%,#e8d5c6 100%)",minHeight:"100%",overflowY:"auto"}}>
      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:20,backdropFilter:"blur(22px) saturate(160%)",WebkitBackdropFilter:"blur(22px) saturate(160%)",background:"rgba(250,242,236,.91)",borderBottom:"1px solid rgba(168,73,42,.07)",padding:"52px 20px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={goBack} style={{width:38,height:38,borderRadius:"50%",border:"none",background:"rgba(168,73,42,.1)",color:"#A8492A",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",color:"#A8492A",opacity:.65,marginBottom:2}}>{lang==="en"?"Secure payment · Stripe":"Pago seguro · Stripe"}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#3d1a0e"}}>{lang==="en"?"Complete subscription":"Finalizar suscripción"}</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(168,73,42,.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>
        </div>
      </div>

      <div style={{padding:"20px 16px 60px",display:"flex",flexDirection:"column",gap:14}}>

        {/* RESUMEN PLAN */}
        <div style={{borderRadius:20,overflow:"hidden",border:`1.5px solid ${plan.color}30`,boxShadow:`0 8px 28px ${plan.color}12`}}>
          <div style={{padding:"16px 18px",background:`linear-gradient(135deg,${plan.color}cc,${plan.color}99)`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:2}}>{lang==="en"?"Selected plan":"Plan seleccionado"}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff5ee"}}>Lumé {plan.name}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:"#fff5ee",lineHeight:1}}>{displayPrice}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>{displaySub}</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.7)",backdropFilter:"blur(16px)",padding:"12px 18px",display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e8a4a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
              <span style={{fontSize:12,fontWeight:600,color:"#3d1a0e"}}>{trialDays>0 ? (lang==="en"?`${trialDays} days free`:`${trialDays} días gratis`) : (lang==="en"?"Immediate payment":"Pago inmediato")}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e8a4a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
              <span style={{fontSize:12,fontWeight:600,color:"#3d1a0e"}}>{lang==="en"?"Cancel anytime":"Cancela cuando quieras"}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e8a4a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
              <span style={{fontSize:12,fontWeight:600,color:"#3d1a0e"}}>{lang==="en"?"No commitment":"Sin compromiso"}</span>
            </div>
          </div>
        </div>

        {step==="processing" ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 0",gap:20}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${plan.color}22,${plan.color}0a)`,border:`2px solid ${plan.color}30`,display:"flex",alignItems:"center",justifyContent:"center",animation:"spin 1s linear infinite"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#3d1a0e"}}>{lang==="en"?"Processing payment…":"Procesando pago…"}</div>
            <div style={{fontSize:13,color:"#a08070",textAlign:"center"}}>{lang==="en"?"Securely connecting with Stripe":"Conectando con Stripe de forma segura"}</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* DATOS TARJETA */}
            <div style={{background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.88)",borderRadius:22,padding:"20px",boxShadow:"0 8px 28px rgba(168,73,42,.08)"}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:".15em",textTransform:"uppercase",color:"#A8492A",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                {lang==="en"?"Payment details":"Datos de pago"}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                {/* Nombre */}
                <div>
                  <label style={labelStyle}>{lang==="en"?"Name on card":"Nombre en la tarjeta"}</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder={lang==="en"?"Jane Doe":"María García"} style={fieldStyle(errors.name)}
                    onFocus={e=>e.target.style.borderColor="#A8492A"} onBlur={e=>e.target.style.borderColor=errors.name?"#e05a3a":"rgba(168,73,42,.18)"}/>
                  {errors.name&&<div style={{fontSize:11,color:"#e05a3a",marginTop:4}}>{errors.name}</div>}
                </div>
                {/* Número tarjeta */}
                <div>
                  <label style={labelStyle}>{lang==="en"?"Card number":"Número de tarjeta"}</label>
                  <div style={{position:"relative"}}>
                    <input value={card} onChange={e=>setCard(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" style={{...fieldStyle(errors.card),paddingRight:52}}
                      onFocus={e=>e.target.style.borderColor="#A8492A"} onBlur={e=>e.target.style.borderColor=errors.card?"#e05a3a":"rgba(168,73,42,.18)"}/>
                    <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",display:"flex",gap:4,opacity:.4}}>
                      <svg width="28" height="18" viewBox="0 0 48 30" rx="4" fill="none"><rect width="48" height="30" rx="4" fill="#1434CB"/><circle cx="19" cy="15" r="9" fill="#EB001B" opacity=".9"/><circle cx="29" cy="15" r="9" fill="#F79E1B" opacity=".9"/><path d="M24 8.3a9 9 0 0 1 0 13.4A9 9 0 0 1 24 8.3Z" fill="#FF5F00"/></svg>
                    </div>
                  </div>
                  {errors.card&&<div style={{fontSize:11,color:"#e05a3a",marginTop:4}}>{errors.card}</div>}
                </div>
                {/* Expiry + CVV */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>
                    <label style={labelStyle}>{lang==="en"?"Expiry":"Caducidad"}</label>
                    <input value={expiry} onChange={e=>setExpiry(fmtExpiry(e.target.value))} placeholder={lang==="en"?"MM/YY":"MM/AA"} style={fieldStyle(errors.expiry)}
                      onFocus={e=>e.target.style.borderColor="#A8492A"} onBlur={e=>e.target.style.borderColor=errors.expiry?"#e05a3a":"rgba(168,73,42,.18)"}/>
                    {errors.expiry&&<div style={{fontSize:11,color:"#e05a3a",marginTop:4}}>{errors.expiry}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" type="password" style={fieldStyle(errors.cvv)}
                      onFocus={e=>e.target.style.borderColor="#A8492A"} onBlur={e=>e.target.style.borderColor=errors.cvv?"#e05a3a":"rgba(168,73,42,.18)"}/>
                    {errors.cvv&&<div style={{fontSize:11,color:"#e05a3a",marginTop:4}}>{errors.cvv}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* RESUMEN COBRO */}
            <div style={{background:"rgba(255,255,255,.5)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(168,73,42,.1)",borderRadius:18,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
              {trialDays>0 && (
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12.5,color:"#8a6a5a"}}>{lang==="en"?`Free trial (${trialDays} days)`:`Prueba gratuita (${trialDays} días)`}</span>
                <span style={{fontSize:12.5,fontWeight:700,color:"#2e8a4a"}}>$0.00</span>
              </div>)}
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12.5,color:"#8a6a5a"}}>{trialDays>0 ? (lang==="en"?`First charge (day ${trialDays+1})`:`Primer cobro (día ${trialDays+1})`) : (lang==="en"?"Charged today":"Cobro hoy")}</span>
                <span style={{fontSize:12.5,fontWeight:700,color:"#3d1a0e"}}>{displayPrice}{displaySub}</span>
              </div>
            </div>

            {/* SEGURIDAD */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:.55}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a6a5a" strokeWidth="2" strokeLinecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>
              <span style={{fontSize:11,color:"#8a6a5a"}}>{lang==="en"?"SSL-encrypted payment · Handled by Stripe":"Pago cifrado con SSL · Gestionado por Stripe"}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a6a5a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>

            {/* BOTON PAGO */}
            <button
              onPointerDown={()=>setPress(true)} onPointerUp={()=>setPress(false)} onPointerLeave={()=>setPress(false)}
              onClick={submit}
              style={{width:"100%",padding:"17px",borderRadius:99,border:"none",cursor:"pointer",
                background:`linear-gradient(90deg,${plan.color}ee,${plan.color}aa)`,
                boxShadow:`0 14px 40px ${plan.color}44`,
                fontFamily:"inherit",fontSize:16,fontWeight:800,color:"#fff5ee",
                transform:press?"scale(.96)":"scale(1)",
                transition:"transform .18s cubic-bezier(.34,1.56,.64,1)"}}>
              {trialDays>0 ? (lang==="en"?`Activate ${trialDays} days free →`:`Activar ${trialDays} días gratis →`) : (lang==="en"?"Confirm payment →":"Confirmar pago →")}
            </button>
            <p style={{textAlign:"center",fontSize:11,color:"#a08070",margin:0,lineHeight:1.5}}>
              {trialDays>0 ? (lang==="en" ? <>You won't be charged today. Cancel before day {trialDays+1} at no cost. </> : <>No se hará ningún cobro hoy. Cancela antes del día {trialDays+1} sin coste. </>) : (lang==="en" ? <>The full amount will be charged today. Cancel anytime. </> : <>Se cobrará el importe total hoy. Cancela cuando quieras. </>)}<a href="legal.html" target="_blank" style={{color:"#A8492A",textDecoration:"none",fontWeight:600}}>{lang==="en"?"Terms":"Condiciones"}</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Asistente, Nombres, Nutricion, Premium, CheckoutScreen });
