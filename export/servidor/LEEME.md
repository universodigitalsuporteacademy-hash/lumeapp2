# Cómo activar la IA REAL de Lumé (paso a paso, gratis)

Tu clave de Groq **no puede ir dentro del sitio web** — cualquiera podría verla
y gastar tu crédito. La solución es un mini-servidor gratuito (Cloudflare Worker)
que guarda la clave en secreto. Tarda ~10 minutos:

## Paso 0 — Revoca la clave expuesta
1. Entra a **console.groq.com → API Keys**.
2. Borra la clave que empezaba por `gsk_xco...` (quedó expuesta en un chat).
3. Crea una clave nueva y tenla a mano. **No la pegues en ningún chat ni archivo.**

## Paso 1 — Crea el Worker
1. Crea cuenta gratis en **dash.cloudflare.com**.
2. Menú izquierdo → **Workers & Pages → Create → Create Worker**.
3. Ponle de nombre `lume-ai` y pulsa **Deploy**.
4. Pulsa **Edit code**, borra todo y pega el contenido de `cloudflare-worker.js`
   (el archivo que está en esta carpeta). Pulsa **Deploy**.

## Paso 2 — Guarda tu clave en secreto
1. En la página del Worker → pestaña **Settings → Variables and Secrets**.
2. **Add** → tipo **Secret** → nombre: `GROQ_API_KEY` → valor: tu clave nueva de Groq.
3. Guarda (Deploy).

## Paso 3 — Conecta la app
1. Copia la URL de tu Worker (algo como `https://lume-ai.tuusuario.workers.dev`).
2. Abre `js/app-core.jsx` y pega la URL en la línea:
   `const LUME_AI_ENDPOINT = "";`  →  `const LUME_AI_ENDPOINT = "https://lume-ai.tuusuario.workers.dev";`
3. Vuelve a subir el sitio. Listo: el asistente Glow y el plan nutricional
   usarán tu IA real.

## Seguridad extra (recomendado al publicar)
- En `cloudflare-worker.js`, cambia `"Access-Control-Allow-Origin": "*"`
  por tu dominio real, p.ej. `"https://lume-app.com"`. Así solo TU web puede usarlo.
- Cloudflare te deja ponerle límites de uso al Worker si algún día lo abusan.
