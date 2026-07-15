/* js/exercise-anim.jsx v5 — Image-based exercise player
   Uses 3D illustration images with CSS animations.
   Exports: AnatomicPlayer → window
*/

// ── Inject CSS keyframes once ──────────────────────────────────
(function(){
  if(document.getElementById('lume-ex-styles')) return;
  const s = document.createElement('style');
  s.id = 'lume-ex-styles';
  s.textContent = `
    @keyframes lume-breathe {
      0%,100% { transform: scale(1);   }
      45%      { transform: scale(1.03); }
      55%      { transform: scale(1.03); }
    }
    @keyframes lume-sway {
      0%,100% { transform: translateX(0)   rotate(0deg); }
      25%     { transform: translateX(-4px) rotate(-0.4deg); }
      75%     { transform: translateX(4px)  rotate(0.4deg); }
    }
    @keyframes lume-pulse-in {
      0%,100% { opacity:.55; transform:scale(.96); }
      50%     { opacity:1;   transform:scale(1.02); }
    }
    @keyframes lume-pulse-out {
      0%,100% { opacity:.45; transform:scale(.98); }
      50%     { opacity:.8;  transform:scale(1.01); }
    }
    @keyframes lume-wave {
      0%   { d: path("M0,8 Q25,0 50,8 Q75,16 100,8"); }
      50%  { d: path("M0,8 Q25,16 50,8 Q75,0 100,8"); }
      100% { d: path("M0,8 Q25,0 50,8 Q75,16 100,8"); }
    }
    .lume-playing-breathe { animation: lume-breathe 8s ease-in-out infinite; transform-origin: center bottom; }
    .lume-playing-sway    { animation: lume-sway 3s ease-in-out infinite; transform-origin: center bottom; }
  `;
  document.head.appendChild(s);
})();

// ── Exercise asset map ─────────────────────────────────────────
const EXERCISE_ASSETS = {
  1: {
    video: 'uploads/exercise-01.mp4',
    muscles: ["Diafragma","Core"],
    color: "#3A8070",
    bgGradient: "#FFFFFF",
  },
  2: {
    video: 'uploads/exercise-video-2.mp4',
    muscles: ["Piernas","Cardio","Postura"],
    color: "#3A4E80",
    bgGradient: "#FFFFFF",
  },
  3: {
    video: 'uploads/exercise-03.mp4',
    muscles: ["Espalda","Core","Columna"],
    color: "#8B5A9E",
    bgGradient: "#FFFFFF",
  },
  4: {
    video: 'uploads/exercise-04.mp4',
    muscles: ["Caderas","Glúteos","Piriforme"],
    color: "#A8492A",
    bgGradient: "#FFFFFF",
  },
  5: {
    video: 'uploads/exercise-05.mp4',
    muscles: ["Cuádriceps","Glúteos","Isquiotibiales"],
    color: "#B8872A",
    bgGradient: "#FFFFFF",
  },
  6: {
    video: 'uploads/exercise-06.mp4',
    muscles: ["Cuerpo completo","Hombros","Espalda"],
    color: "#1A6A8A",
    bgGradient: "#FFFFFF",
  },
  7: {
    video: 'uploads/exercise-07.mp4',
    muscles: ["Suelo pélvico","Periné"],
    color: "#C4506A",
    bgGradient: "#FFFFFF",
  },
  8: {
    video: 'uploads/exercise-08.mp4',
    muscles: ["Core","Espalda","Glúteos"],
    color: "#7A6040",
    bgGradient: "#FFFFFF",
  },
  9: {
    video: 'uploads/exercise-09.mp4',
    muscles: ["Pelvis","Cadera","Relajación"],
    color: "#6A4A9E",
    bgGradient: "#FFFFFF",
  },
  10: {
    video: 'uploads/exercise-10.mp4',
    muscles: ["Cuádriceps","Pelvis","Aductores"],
    color: "#3A8070",
    bgGradient: "#FFFFFF",
  },
  11: {
    video: 'uploads/exercise-11.mp4',
    muscles: ["Pelvis","Espalda","Equilibrio"],
    color: "#8B5A9E",
    bgGradient: "#FFFFFF",
  },
  12: {
    video: 'uploads/exercise-12.mp4',
    muscles: ["Respiratorio","Relajación","Mente"],
    color: "#3A8070",
    bgGradient: "#FFFFFF",
  },
};

const EXERCISE_ASSETS_EN = {
  1:  { ...EXERCISE_ASSETS[1],  muscles: ["Diaphragm","Core"] },
  2:  { ...EXERCISE_ASSETS[2],  muscles: ["Legs","Cardio","Posture"] },
  3:  { ...EXERCISE_ASSETS[3],  muscles: ["Back","Core","Spine"] },
  4:  { ...EXERCISE_ASSETS[4],  muscles: ["Hips","Glutes","Piriformis"] },
  5:  { ...EXERCISE_ASSETS[5],  muscles: ["Quads","Glutes","Hamstrings"] },
  6:  { ...EXERCISE_ASSETS[6],  muscles: ["Full body","Shoulders","Back"] },
  7:  { ...EXERCISE_ASSETS[7],  muscles: ["Pelvic floor","Perineum"] },
  8:  { ...EXERCISE_ASSETS[8],  muscles: ["Core","Back","Glutes"] },
  9:  { ...EXERCISE_ASSETS[9],  muscles: ["Pelvis","Hip","Relaxation"] },
  10: { ...EXERCISE_ASSETS[10], muscles: ["Quads","Pelvis","Adductors"] },
  11: { ...EXERCISE_ASSETS[11], muscles: ["Pelvis","Back","Balance"] },
  12: { ...EXERCISE_ASSETS[12], muscles: ["Respiratory","Relaxation","Mind"] },
};

// ── Breathing wave SVG (animated via React state for breathe exercises) ──
function BreathWave({t, color}) {
  const br = Math.sin(t * Math.PI * 2);
  return (
    <svg width="160" height="24" viewBox="0 0 160 24">
      <path
        d={`M0,12 Q20,${12-br*10} 40,12 Q60,${12+br*10} 80,12 Q100,${12-br*10} 120,12 Q140,${12+br*10} 160,12`}
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

// ── Placeholder for exercises without images yet ───────────────
function ComingSoonFrame({exercise, accent}) {
  return (
    <div style={{
      width:"100%", paddingTop:"80%", position:"relative",
      background:"linear-gradient(160deg,#FAF7F2 0%,#F2ECE4 100%)"
    }}>
      <div style={{
        position:"absolute", inset:0, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:16, padding:"0 24px"
      }}>
        {/* Exercise type icon */}
        <div style={{
          width:72, height:72, borderRadius:"50%",
          background:`${accent}14`, border:`2px solid ${accent}20`,
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2C8.5 2 5 5.5 5 10c0 6 7 12 7 12s7-6 7-12c0-4.5-3.5-8-7-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#3d1a0e", marginBottom:6}}>
            {exercise.title}
          </div>
          <div style={{fontSize:12, color:"#a08070", lineHeight:1.5}}>
            {getAppLang2()==="en" ? "Visual content coming soon" : "Contenido visual en preparación"}
          </div>
        </div>
        <div style={{
          fontSize:11, fontWeight:700, padding:"6px 16px", borderRadius:99,
          background:`${accent}10`, border:`1px solid ${accent}20`, color:accent
        }}>
          {getAppLang2()==="en" ? "Coming soon" : "Próximamente"}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  ANATOMIC PLAYER
// ════════════════════════════════════════════════════════════════
function AnatomicPlayer({exercise, onClose}) {
  const hexToRgb = h => { const x=h.replace('#',''); return `${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)}`; };
  const [playing, setPlaying] = React.useState(false);
  const [step, setStep]       = React.useState(0);
  const videoRef = React.useRef(null);
  const apLang = getAppLang2();
  const AP_T = apLang==="en" ? { musclesWorked:"Muscles worked", howTo:"How to do it", prev:"Previous", next:"Next", done:"Done" }
                              : { musclesWorked:"Músculos trabajados", howTo:"Cómo hacerlo", prev:"Anterior", next:"Siguiente", done:"Completado" };

  const asset  = (apLang==="en" ? EXERCISE_ASSETS_EN : EXERCISE_ASSETS)[exercise.id];
  const accent = asset ? asset.color : "#A8492A";

  // Control video playback
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) { vid.play().catch(()=>{}); }
    else         { vid.pause(); }
  }, [playing]);

  const muscleList = asset ? asset.muscles : [];
  const MUSCLE_COLORS = {
    "Respiratorio":"#3A8070","Cardio":"#4A7A60","Espalda baja":"#8B5A9E",
    "Caderas / Glúteos":"#A8492A","Piernas / Glúteos":"#B8872A","Cuerpo completo":"#1A6A8A",
    "Suelo pélvico":"#C4506A","Core / Espalda":"#7A6040","Pelvis / Mente":"#6A4A9E",
    "Piernas / Pelvis":"#3A8070","Pelvis / Espalda":"#8B5A9E",
    "Respiratory":"#3A8070","Lower back":"#8B5A9E","Hips / Glutes":"#A8492A","Legs / Glutes":"#B8872A",
    "Full body":"#1A6A8A","Pelvic floor":"#C4506A","Core / Back":"#7A6040","Pelvis / Mind":"#6A4A9E",
    "Legs / Pelvis":"#3A8070","Pelvis / Back":"#8B5A9E"
  };
  const col = MUSCLE_COLORS[exercise.muscle] || "#B8872A";

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:60,
      background:"#FAFAF8", display:"flex", flexDirection:"column", overflowY:"auto"
    }}>

      {/* ── VISUAL ZONE ── */}
      <div style={{position:"relative", flexShrink:0}}>

        {asset && asset.video ? (
          /* Video display */
          <div style={{
            width:"100%", paddingTop:"115%", position:"relative", overflow:"hidden",
            background:"#FFFFFF"
          }}>
            <video
              ref={videoRef}
              src={asset.video}
              loop muted playsInline
              style={{
                position:"absolute", inset:0,
                width:"100%", height:"100%",
                objectFit:"contain",
                objectPosition:"center top",
              }}
            />
            {/* Glow overlay — visible on top of the white video background */}
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              background:`radial-gradient(ellipse 110% 55% at 50% 108%, ${accent}30 0%, transparent 65%)`,
            }}/>
            <div style={{
              position:"absolute", left:0, right:0, bottom:0, height:"28%",
              pointerEvents:"none",
              background:`linear-gradient(to top, ${accent}22 0%, transparent 100%)`,
            }}/>
          </div>
        ) : asset && asset.img ? (
          /* Image display with optional CSS animation */
          <div style={{
            width:"100%", paddingTop:"88%", position:"relative", overflow:"hidden",
            background:"#FFFFFF",
          }}>
            <img
              src={asset.img}
              alt={exercise.title}
              className={playing && asset.animClass ? asset.animClass : ""}
              style={{
                position:"absolute", inset:0,
                width:"100%", height:"100%",
                objectFit:"contain",
                objectPosition:"center bottom",
              }}
            />
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              background:`radial-gradient(ellipse 110% 55% at 50% 108%, ${accent}30 0%, transparent 65%)`,
            }}/>
            <div style={{
              position:"absolute", left:0, right:0, bottom:0, height:"28%",
              pointerEvents:"none",
              background:`linear-gradient(to top, ${accent}22 0%, transparent 100%)`,
            }}/>
          </div>
        ) : (
          /* Coming-soon placeholder */
          <ComingSoonFrame exercise={exercise} accent={accent}/>
        )}

        {/* Back button */}
        <button onClick={onClose} style={{
          position:"absolute", top:50, left:16, width:38, height:38,
          borderRadius:"50%", background:"rgba(255,255,255,.92)",
          backdropFilter:"blur(12px)", border:"1px solid rgba(0,0,0,.07)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", boxShadow:"0 4px 14px rgba(0,0,0,.1)"
        }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        {/* Premium badge */}
        <div style={{
          position:"absolute", top:50, right:16,
          background:"linear-gradient(135deg,#C8952A,#E4BC7E)",
          padding:"4px 10px", borderRadius:99, fontSize:10, fontWeight:800, color:"#2A1400"
        }}>✦ PREMIUM</div>

        {/* Play / Pause overlay */}
        {!playing && (
          <div
            style={{
              position:"absolute", inset:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(0,0,0,.04)", cursor:"pointer"
            }}
            onClick={() => setPlaying(true)}
          >
            <div style={{
              width:66, height:66, borderRadius:"50%",
              background:`linear-gradient(135deg,${accent},${accent}CC)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 10px 32px ${accent}55`
            }}>
              <svg viewBox="0 0 24 24" width={26} height={26} fill="#fff" style={{marginLeft:3}}>
                <path d="M8 5l12 7-12 7Z"/>
              </svg>
            </div>
          </div>
        )}

        {playing && (
          <button
            onClick={() => setPlaying(false)}
            style={{
              position:"absolute", bottom:58, right:16, width:36, height:36,
              borderRadius:"50%", background:"rgba(255,255,255,.82)",
              backdropFilter:"blur(12px)", border:"1px solid rgba(0,0,0,.07)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,.1)"
            }}
          >
            <svg viewBox="0 0 24 24" width={13} height={13} fill={accent}>
              <rect x="5" y="4" width="4" height="16" rx="1"/>
              <rect x="15" y="4" width="4" height="16" rx="1"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── INFO ZONE ── */}
      <div style={{padding:"20px 16px 100px", display:"flex", flexDirection:"column", gap:13}}>

        {/* Muscles card */}
        {muscleList.length > 0 && (
          <div style={{
            padding:"14px 16px",
            background:"rgba(255,255,255,.78)",
            backdropFilter:"blur(24px) saturate(160%)",
            WebkitBackdropFilter:"blur(24px) saturate(160%)",
            borderRadius:20,
            border:`1.5px solid ${accent}18`,
            boxShadow:`0 8px 24px -4px ${accent}28, inset 0 1px 0 rgba(255,255,255,.92)`
          }}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}>
              <div style={{width:28,height:28,borderRadius:9,background:`linear-gradient(135deg,${accent},${accent}99)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 10px ${accent}45`,flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
              </div>
              <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:"#5a3a2a",textTransform:"uppercase"}}>{AP_T.musclesWorked}</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {muscleList.map((m,i) => (
                <span key={i} style={{
                  fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:99,
                  background:`linear-gradient(135deg,${accent}18,${accent}0c)`,
                  border:`1.5px solid ${accent}30`,color:accent,
                  boxShadow:`0 3px 10px ${accent}20`
                }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{padding:"15px 16px",background:"rgba(255,255,255,.75)",backdropFilter:"blur(24px) saturate(160%)",WebkitBackdropFilter:"blur(24px) saturate(160%)",borderRadius:20,border:"1px solid rgba(255,255,255,.92)",boxShadow:"0 6px 20px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.95)"}}>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:10.5,fontWeight:800,padding:"4px 12px",borderRadius:99,background:`linear-gradient(135deg,${col},${col}BB)`,color:"#fff",boxShadow:`0 4px 12px ${col}45`}}>{exercise.muscle}</span>
            <span style={{fontSize:10.5,fontWeight:700,padding:"4px 12px",borderRadius:99,background:"rgba(168,73,42,.07)",border:"1px solid rgba(168,73,42,.14)",color:"#8a6a5a"}}>{exercise.dur}</span>
            <span style={{fontSize:10.5,fontWeight:700,padding:"4px 12px",borderRadius:99,background:"rgba(168,73,42,.07)",border:"1px solid rgba(168,73,42,.14)",color:"#8a6a5a"}}>{exercise.level}</span>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#3d1a0e",margin:"0 0 7px",lineHeight:1.2}}>{exercise.title}</h2>
          <p style={{fontSize:13,color:"#7a5a45",lineHeight:1.65,margin:0}}>{exercise.desc}</p>
        </div>

        {/* Steps */}
        <div style={{"--ex-col-rgb":hexToRgb(accent),background:`linear-gradient(150deg,rgba(255,255,255,.68),${accent}0c)`,backdropFilter:"blur(28px) saturate(180%)",WebkitBackdropFilter:"blur(28px) saturate(180%)",borderRadius:22,border:`1.5px solid ${accent}25`,boxShadow:`0 14px 36px -6px ${accent}30, inset 0 1px 0 rgba(255,255,255,.95)`,overflow:"hidden"}}>

          {/* Header row */}
          <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${accent}12`}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:28,height:28,borderRadius:9,background:`linear-gradient(135deg,${accent},${accent}99)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 10px ${accent}45`,flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",color:accent,textTransform:"uppercase"}}>{AP_T.howTo}</div>
            </div>
            <div style={{fontSize:11,fontWeight:800,color:accent,background:`${accent}12`,border:`1px solid ${accent}22`,padding:"3px 10px",borderRadius:99}}>{step+1} / {exercise.steps.length}</div>
          </div>

          {/* Progress bar */}
          <div style={{display:"flex",gap:3,padding:"10px 16px 0",alignItems:"center"}}>
            {exercise.steps.map((_,i)=>(
              <div key={i} onClick={()=>setStep(i)} style={{
                height:4,borderRadius:2,cursor:"pointer",transition:"all .35s",
                flex: i===step ? 3 : 1,
                background: i<step ? accent : i===step ? accent : `${accent}20`,
                opacity: i<=step ? 1 : 0.4
              }}/>
            ))}
          </div>

          {/* Steps list */}
          <div style={{padding:"10px 12px 14px",display:"flex",flexDirection:"column",gap:6}}>
            {exercise.steps.map((s,i)=>(
              <button key={i} onClick={()=>setStep(i)} className="ex-step" style={{
                display:"flex",gap:12,alignItems:"flex-start",width:"100%",
                textAlign:"left",cursor:"pointer",fontFamily:"inherit",
                padding:"11px 12px",borderRadius:15,transition:"all .25s",
                background: i===step
                  ? `linear-gradient(135deg,${accent}20,${accent}0e)`
                  : i<step
                  ? `${accent}08`
                  : "rgba(255,255,255,.45)",
                border: i===step
                  ? `1.5px solid ${accent}35`
                  : i<step
                  ? `1.5px solid ${accent}18`
                  : "1.5px solid rgba(255,255,255,.7)",
                boxShadow: i===step ? `0 6px 18px ${accent}28` : "0 2px 6px rgba(0,0,0,.03)",
                backdropFilter: i===step ? "none" : "blur(8px)"
              }}
              onPointerDown={ev=>ev.currentTarget.style.transform="scale(.97) translateX(3px)"}
              onPointerUp={ev=>ev.currentTarget.style.transform=""}
              onPointerLeave={ev=>ev.currentTarget.style.transform=""}>

                {/* Number / check bubble */}
                <div className="ex-step-num" style={{
                  background: i<step
                    ? `linear-gradient(135deg,${accent},${accent}BB)`
                    : i===step
                    ? `linear-gradient(135deg,${accent},${accent}BB)`
                    : "rgba(255,255,255,.6)",
                  border: i<=step ? "none" : `1.5px solid ${accent}28`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow: i<=step ? `0 4px 12px ${accent}45` : "none",
                  transition:"all .25s"
                }}>
                  {i<step
                    ? <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg>
                    : <span style={{fontSize:10,fontWeight:800,color:i===step?"#fff":accent}}>{i+1}</span>
                  }
                </div>

                <p style={{
                  margin:0,fontSize:13,lineHeight:1.55,fontFamily:"inherit",
                  color: i===step ? "#3d1a0e" : i<step ? `${accent}99` : "#b09080",
                  fontWeight: i===step ? 600 : 400,
                  transition:"all .25s",
                  textDecoration: i<step ? "line-through" : "none",
                  textDecorationColor:`${accent}50`
                }}>{s}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step nav */}
        <div style={{display:"flex",gap:10,"--ex-col-rgb":hexToRgb(accent)}}>
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} className="ex-nav-btn"
            style={{flex:1,padding:"14px",borderRadius:99,border:`1px solid ${accent}15`,cursor:step===0?"not-allowed":"pointer",background:"rgba(255,255,255,.75)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",color:"#8a6a5a",fontFamily:"inherit",fontSize:13,fontWeight:700,opacity:step===0?0.3:1,boxShadow:"0 4px 14px rgba(0,0,0,.06)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            {AP_T.prev}
          </button>
          <button onClick={()=>setStep(s=>Math.min(exercise.steps.length-1,s+1))} disabled={step===exercise.steps.length-1} className="ex-nav-btn"
            style={{flex:1,padding:"14px",borderRadius:99,border:"none",cursor:step===exercise.steps.length-1?"default":"pointer",background:step===exercise.steps.length-1?`linear-gradient(135deg,${accent}60,${accent}40)`:`linear-gradient(135deg,${accent},${accent}CC)`,color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,boxShadow:step===exercise.steps.length-1?"none":`0 8px 24px ${accent}55`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            {step===exercise.steps.length-1
              ? <><svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7"/></svg> {AP_T.done}</>
              : <>{AP_T.next} <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AnatomicPlayer });
