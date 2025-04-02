
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { users } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';

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
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, accept any valid email in our mock users
    // and any non-empty password
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && password.trim() !== '') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast.success('Login successful!');
      return true;
    } else {
      toast.error('Invalid credentials. Please try again.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
      toast.error('User with this email already exists');
      return false;
    }
    
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      toast.error('All fields are required');
      return false;
    }
    
    // Create a new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
    };
    
    // In a real app, we would call an API here
    // For this demo, we'll just simulate success
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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
