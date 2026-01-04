
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key is missing. Check your .env file.');
    // Create a dummy client that alerts the user when used
    supabaseInstance = {
        from: () => ({
            select: () => Promise.reject(new Error('Supabase is not configured. Check .env file.')),
            insert: () => Promise.reject(new Error('Supabase is not configured.')),
            update: () => Promise.reject(new Error('Supabase is not configured.')),
            delete: () => Promise.reject(new Error('Supabase is not configured.')),
        })
    };
    // Try to alert immediately to warn the user why page might be broken or empty
    if (typeof window !== 'undefined') {
        alert('Supabase 설정이 완료되지 않았습니다.\n.env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY가 입력되었는지 확인해주세요.');
    }
} else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
