# Cómo activar cuentas REALES en Lumé (Supabase, gratis)

Ahora mismo el formulario "Crear cuenta" / "Iniciar sesión" es una simulación visual
(no guarda usuarias reales). Con Supabase (gratis hasta 50,000 usuarios activos/mes)
lo conviertes en cuentas reales en ~15 minutos.

## Paso 1 — Crea el proyecto
1. Entra a **supabase.com** → crea cuenta gratis → **New Project**.
2. Dale nombre `lume-app`, elige una contraseña de base de datos (guárdala) y región
   cercana a tus usuarias (ej. São Paulo o US East).
3. Espera ~2 minutos mientras se crea.

## Paso 2 — Activa el login por email
1. Menú izquierdo → **Authentication → Providers**.
2. **Email** ya viene activado por defecto — no toques nada más por ahora.
3. (Opcional) Activa **Google** ahí mismo si más adelante quieres login con Google.
4. En **Authentication → URL Configuration**, pon la URL de tu sitio ya publicado
   (ej. `https://lume-app.com`) en "Site URL" — así los emails de confirmación
   redirigen bien.

## Paso 3 — Copia tus llaves (son seguras de compartir)
1. Menú izquierdo → **Settings (⚙) → API**.
2. Copia:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** key (una cadena larga que empieza distinto a "service_role")
3. ⚠ NUNCA copies la **service_role** key — esa sí es secreta y no se usa en el sitio.

## Paso 4 — Conéctalo al código
Abre `js/supabase-client.js` y pega tus valores:
```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGxxxxxxxxxxxxxxxxx...";
```
Guarda. Listo — el formulario de "Crear cuenta"/"Iniciar sesión" de la landing
ahora crea usuarias reales en tu proyecto de Supabase. Puedes verlas en
**Authentication → Users** dentro del panel de Supabase.

## (Opcional, más adelante) Guardar datos del embarazo por cuenta
Hoy los datos (semana, fecha de parto, síntomas, etc.) se guardan solo en el
teléfono de cada usuaria — si cambia de dispositivo, los pierde. El siguiente
paso — cuando quieras — es crear una tabla `profiles` en Supabase y sincronizar
esos datos por cuenta en vez de por dispositivo. Es un proyecto aparte porque
implica tocar la lógica interna del app (`js/app-core.jsx`); avísame cuando
quieras que lo construya.
