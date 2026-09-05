import { createClient } from '@supabase/supabase-js';

// PASTE YOUR OWN VALUES HERE (same ones from your .env in the backend)
export const SUPABASE_URL = 'https://jpkaviumvudcsrhktfzk.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_mNLuzZi2el2I0NpoXMsE4g_jv6eAd1W';

// Your deployed Render backend URL (from Phase 3, Step 6)
export const API_BASE = 'https://agrispike-backend.onrender.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
