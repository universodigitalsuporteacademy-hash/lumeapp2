# Lumé — App + Landing Page

## Qué es este proyecto
**Lumé** = app de acompañamiento de embarazo premium. Incluye:
1. **`app.html`** — prototipo interactivo clickeable (iOS frame simulado)
2. **`index.html`** — landing de ventas DEFINITIVA (liquid glass + SEO + GA + cookies + Stripe). Usar SIEMPRE esta.
3. `archivo/` — landings viejas (Premium, v3, original). NO usar; sus rutas relativas están rotas a propósito.

## Stripe (pagos reales)
- Integrado en `js/premium.jsx`: `STRIPE_PK` (clave publicable, pública y segura) + `STRIPE_TABLES` (pricing tables por plan) + `StripeCheckoutModal`.
- Los CTA de planes de pago abren el modal de Stripe; el plan gratis abre el formulario de registro (LoginModal).
- Precios anuales reales: Bienestar $75/año, Profesional $144/año (coinciden en landing y app).
- Prueba gratis de 7 días: solo existe en Stripe para Bienestar mensual (price_1TplajBhWru5s2tMLGvAB8qK). Profesional NO tiene prueba — el copy en landing y app ya no la menciona para ese plan.
- ⚠ NUNCA escribir la clave secreta (sk_live) ni claves de APIs de IA en ningún archivo del proyecto — son privadas del servidor.

## Cuentas reales (Supabase)
- `js/supabase-client.js` define `window.lumeAuth` (signUp/signIn/signOut/getSession). Vacío por defecto = modo demo (no persiste).
- Instrucciones para conectar: `servidor/SUPABASE-LEEME.md`.
- Pendiente (fase 2): sincronizar datos del embarazo (semana, fecha de parto, etc.) por cuenta en vez de por dispositivo.

## IA real (Cloudflare Worker)
- `js/app-core.jsx` define `LUME_AI_ENDPOINT` (vacío = usa la IA del entorno de diseño, solo funciona aquí dentro).
- Instrucciones para publicar tu propio proxy seguro: `servidor/LEEME.md`.

---

## Paleta de colores principal
```
Terracota primario:  #A8492A  (botones CTA, acentos)
Terracota oscuro:    #8B3520  (hover, degradados)
Crema fondo:         #f9f1eb / #EFE7DB
Crema papel:         #FBF3EB
Dorado acento:       #E6CFA1 / #D4AF80
Texto oscuro:        #3d1a0e / #5a3a2a
Texto suave:         #8a6a5a / #a08070
```

## Fuentes
- Display: `Cormorant Garamond` (serif elegante, títulos grandes)
- Body: `DM Sans` (sans-serif limpio)
- Cargadas vía Google Fonts

---

## Estructura de archivos

```
app.html              ← app principal (React+Babel inline)
index.html    ← landing principal (React+Babel inline)
js/
  app-core.jsx     ← íconos SVG, datos, componente Inicio (home), TabBar, FruitIcon
  app-screens.jsx  ← todas las pantallas secundarias: Citas, Síntomas, Recompensas, Ultrasonidos, Peso, Ajustes, Patadas
  app-more.jsx     ← Nutrición, Nombres, Fotos, Asistente IA, pantallas extra
  premium.jsx      ← landing: Hero, Trust, ValueProps, Showcase, Experts, Testimonials, Pricing, FAQ, FinalCTA, Footer
  landing.jsx      ← landing antigua (ignorar)
styles/
  app.css              ← estilos del app (variables CSS del app)
  premium-theme.css    ← tema visual landing (tokens CSS: --bg, --ink, --primary, --gold, etc.)
  premium-sections.css ← estilos sección por sección de la landing
  tokens.css           ← tokens globales compartidos
  landing.css          ← landing antigua (ignorar)
uploads/
  logo-lume.png    ← LOGO Lumé (con sombra, versión circular dorada)
  pasted-*.png     ← imagen bebé 3D (usado como fondo en Patadas)
  [1-12].png       ← frutas/verduras para el tracker de tamaño del bebé
image-slot.js      ← web component drag & drop de imágenes
ios-frame.jsx      ← bezel iPhone simulado
tweaks-panel.jsx   ← panel de tweaks (paletas de colores, fuentes)
```

---

## App — Pantallas implementadas

### Tab Bar (4 tabs):
| Tab | Componente | Estado |
|-----|-----------|--------|
| Inicio | `Inicio` en `app-core.jsx` | ✅ Funcional |
| Nutrición | `NutricionScreen` en `app-more.jsx` | ✅ |
| Asistente | `AsistenteScreen` en `app-more.jsx` | ✅ Chat interactivo |
| Más | `MasScreen` en `app-more.jsx` | ✅ Grid de accesos rápidos |

### Accesos rápidos (desde "Más"):
- **Citas** (`CitasScreen`) — agendar citas con calendario, próximas citas
- **Síntomas** (`SintomasScreen`) — bitácora glassmorphism con orientación por síntoma
- **Recompensas** (`RecompensasScreen`) — puntos, niveles Bronce/Plata/Oro
- **Ultrasonidos** (`UltrasonidosScreen`) — historial de ecografías
- **Control de Peso** (`PesoScreen`) — registro de peso con gráfica
- **Patadas** (`KickTrackerScreen`) — tracker con imagen de fondo
- **Nombres** (`NombresScreen`) — favoritos con corazón
- **Fotos** (`FotosScreen`) — álbum de fotos con image-slots
- **Ajustes** (`AjustesScreen`) — perfil y configuración

### Home (Inicio):
- Hero con semanas/trimestre, días recorridos/por delante
- Tamaño del bebé = fruta con halo creciente (semanas 4-40 mapeadas)
- Cards: bebé esta semana, consejo del día, próxima cita, nombres, puntos
- Botón "Pregunta a Glow" → abre asistente

---

## Landing — Secciones (en orden)

1. **Nav** — logo + botones Iniciar sesión / Comenzar gratis
2. **Hero** — headline grande + subtítulo + 2 CTAs + imagen fondo
3. **Trust** — franja de categorías (marquee animado)
4. **ValueProps** — 3 cards de valor con íconos
5. **Showcase** — imagen app + mockup chat interactivo con animación
6. **Experts** — estadísticas / expertos
7. **Testimonials** — testimonios de mamás
8. **Pricing** — 3 planes: Esencial / Bienestar / Profesional
9. **FAQ** — preguntas frecuentes acordeón
10. **FinalCTA** — CTA final
11. **Footer** — links y copyright

### Modal de Auth:
- Componente `AuthModal` en `premium.jsx`
- Login / Registro con tabs
- Se abre al hacer clic en "Iniciar sesión" o "Comenzar gratis"

---

## Sincronización de datos (arreglado jul 2026)
- `lume_weeks` en localStorage es LA fuente de verdad de la semana. El estado `week` del App root la lee al iniciar y la escribe en cada cambio (slider de Tweaks, Ajustes, onboarding).
- `lume_due` SIEMPRE en formato ISO `yyyy-mm-dd`; se formatea a español solo al mostrar.
- `window.claude.complete()` se llama SIEMPRE con string (no objeto).

## Problemas conocidos / pendientes

- [ ] Pantalla de Síntomas necesita pulido visual (el usuario no quedó satisfecho con ninguna versión)
- [ ] La landing tiene secciones "Expertos" y "CTA final" que el usuario considera muy básicas
- [ ] El logo (`uploads/logo-lume.png`) es una imagen con sombra dorada circular — usar siempre con `object-fit: contain`, NO con `border-radius` que lo corte, y sin fondo blanco visible
- [ ] Las frutas del tracker de tamaño deben crecer progresivamente (el halo crece + la imagen crece con las semanas)
- [ ] La imagen del bebé 3D en "Patadas" tiene sombra negra en el original — se colocó como fondo de pantalla completa

---

## Diseño visual — reglas clave

- **NO** usar Inter, Roboto, Arial como fuentes
- **NO** bordes con `border-left` de color acento tipo dashboard barato
- **NO** gradientes agresivos púrpura/azul random
- **SÍ** glassmorphism: `backdrop-filter: blur(16-20px)` + `rgba(255,255,255,.7-.85)` + `border: 1px solid rgba(255,255,255,.6)`
- **SÍ** sombras cálidas: `box-shadow: 0 8px 32px rgba(168,73,42,.1)`
- **SÍ** cards elevadas con sombra terracota suave
- **SÍ** tipografía Cormorant Garamond para display/títulos grandes
- El usuario quiere look **premium/profesional** — referencias: Calm, Oura, Whoop, Glow

---

## Tweaks disponibles (landing)
Panel de Tweaks con:
- **Paleta** (arena / noche / jardín)
- **Tipografía** (clásica / moderna)
- **Radio de esquinas**

---

## Datos del app (localStorage keys)
```
lume_weeks        ← semanas de embarazo (default 15)
lume_due          ← fecha probable de parto
lume_appts        ← citas médicas []
lume_sx_hist      ← historial síntomas []
lume_nutrition    ← registro nutricional []
lume_custom_meals ← comidas personalizadas []
lume_kicks        ← sesiones de patadas []
lume_ultrasounds  ← ecografías []
lume_weight       ← registros de peso []
lume_names        ← nombres favoritos []
lume_points       ← puntos acumulados (default 126)
```

---

## Cómo continuar

Para mejorar una pantalla específica, leer primero el componente en el archivo correcto antes de editar.  
El usuario prefiere rediseños completos cuando algo no le gusta — **no parchearlo, reescribirlo desde cero**.

El usuario habla español. Todo el copy de la app está en español.
