/**
 * Lumé — Proxy seguro de IA (Cloudflare Worker)
 * ================================================
 * Este pequeño servidor guarda tu clave de Groq EN SECRETO
 * y responde a las peticiones del asistente de la app.
 * Instrucciones paso a paso: LEEME.md (en esta carpeta).
 */

const SYSTEM_GUARD = `Eres un asistente de una app de embarazo. Responde siempre en español, con calidez y precisión. Nunca des diagnósticos; ante síntomas de alarma (sangrado, dolor intenso, fiebre alta, ausencia de movimientos fetales) indica SIEMPRE acudir a urgencias o contactar a su profesional de salud. No sustituyes al médico.`;

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*", // Al publicar, cambia * por tu dominio: "https://lume-app.com"
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Solo POST", { status: 405, headers: cors });

    let prompt = "";
    try {
      const body = await request.json();
      prompt = String(body.prompt || "").slice(0, 6000);
    } catch (e) {
      return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (!prompt) return new Response(JSON.stringify({ error: "Falta prompt" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`, // secreto configurado en Cloudflare, NUNCA en el código
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_GUARD },
          { role: "user", content: prompt },
        ],
        max_tokens: 700,
        temperature: 0.6,
      }),
    });

    if (!r.ok) {
      return new Response(JSON.stringify({ error: "Error del proveedor de IA" }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const j = await r.json();
    const text = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "Lo siento, no pude responder en este momento.";
    return new Response(JSON.stringify({ text }), { headers: { ...cors, "Content-Type": "application/json" } });
  },
};
