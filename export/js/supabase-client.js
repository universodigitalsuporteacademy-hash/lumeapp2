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
const SUPABASE_URL = "https://rbuunvnlerkrbfoqgkzx.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJidXVudm5sZXJrcmJmb3Fna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTY0ODYsImV4cCI6MjA5OTczMjQ4Nn0.ztH2O1Ly-DU2RhSIxobKciXxOlvemQaMNck8W0pYP18";

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
