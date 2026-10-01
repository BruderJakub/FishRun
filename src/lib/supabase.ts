import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'; // must come first

const extra = Constants.expoConfig?.extra as {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
};

if (!extra?.supabaseUrl || !extra?.supabasePublishableKey) {
  throw new Error("Missing Supabase credentials in app.json extra config!");
}

export const supabase = createClient(extra.supabaseUrl, extra.supabasePublishableKey);