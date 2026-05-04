import { createClient } from '@supabase/supabase-js';

// Usamos as variáveis de ambiente do Vite. 
// Você precisará criar um arquivo .env na raiz do projeto com estas duas chaves.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-supabase.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
