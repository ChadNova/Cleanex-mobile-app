//lib
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {auth: {
    storage: AsyncStorage,     // ✅ required for React Native
    persistSession: true,      // ✅ keeps user logged in
    autoRefreshToken: true,    // ✅ refreshes tokens
    detectSessionInUrl: false, // ✅ must be false for RN
  },
});
