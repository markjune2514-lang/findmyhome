import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    const { data, error } = await supabase
        .from('properties')
        .select('id, unit_types, facilities, categorized_landmarks, health_facilities, services, security, transport')
        .eq('status', 'ฉบับร่าง')
        .limit(3);
        
    console.log(JSON.stringify(data, null, 2));
}

inspect();
