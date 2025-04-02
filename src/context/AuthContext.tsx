
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if session exists
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user: supabaseUser } = session;
        if (supabaseUser) {
          // Get user profile data using a more generic approach
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          }
          
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profileData?.name || '',
          });
          setIsAuthenticated(true);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { user: supabaseUser } = session;
        
        // Get user profile data using a more generic approach
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: profileData?.name || '',
        });
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      // User data will be set by the onAuthStateChange listener
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
        toast.error('All fields are required');
        return false;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // This will be stored in raw_user_meta_data
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      // User data will be set by the onAuthStateChange listener
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    // User data will be cleared by the onAuthStateChange listener
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
