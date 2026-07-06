/**
 * Lumé — Cliente de Supabase (cuentas reales)
 * ================================================
 * SUPABASE_URL y SUPABASE_ANON_KEY son SEGUROS de tener aquí en el código:
 * a diferencia de una clave secreta, la "anon key" de Supabase está diseñada
 * para vivir en el navegador — la protección real la da Row Level Security (RLS)
 * configurada en tu proyecto. Aun así, nunca pegues aquí la "service_role key".
 *
 * Instrucciones paso a paso: servidor/SUPABASE-LEEME.md
 */
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

window.lumeAuth = {
  isConfigured: () => !!supabaseClient,

  signUp: async (email, password, name) => {
    if (!supabaseClient) throw new Error("not_configured");
    const { data, error } = await supabaseClient.auth.signUp({
      email, password, options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    if (!supabaseClient) throw new Error("not_configured");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    if (supabaseClient) await supabaseClient.auth.signOut();
  },

  getSession: async () => {
    if (!supabaseClient) return null;
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  },
};
