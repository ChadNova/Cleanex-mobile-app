import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { View, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔐 Initialize auth ONCE on app start
   * Enforces Remember Me BEFORE rendering any UI
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem('rememberMe');

        const {
          data: { session },
        } = await supabase.auth.getSession();

        // 🚨 Session exists but Remember Me is OFF → force logout
        if (session && rememberMe !== 'true') {
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to real Supabase auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /**
   * 🧭 Centralized navigation logic
   */
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/'); // Login / root
      } else {
        router.replace('/(tabs)/home'); // Authenticated area
      }
    }
  }, [loading, user]);

  /**
   * 🚪 Explicit logout
   */
  async function signOut() {
    try {
      await AsyncStorage.removeItem('rememberMe');
      await supabase.auth.signOut();
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      router.replace('/');
    }
  }

  const logout = signOut;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading Session...</Text>
    </View>
  );
}
