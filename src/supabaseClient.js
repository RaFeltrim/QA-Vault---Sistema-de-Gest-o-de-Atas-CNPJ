
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njbtlnhhsspxjscyzoxp.supabase.co';
const supabaseKey = 'sb_publishable_CLmMh3eb3XfADPku94kcSQ_flQJrRnI';

export const supabase = createClient(supabaseUrl, supabaseKey);
