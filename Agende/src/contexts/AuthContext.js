// ============================================
// AUTH CONTEXT - Gerenciamento de Autenticação
// ============================================

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await AsyncStorage.getItem('@agende:user');
      const storedToken = await AsyncStorage.getItem('@agende:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, senha) {
    try {
      const response = await authAPI.login(email, senha);

      setUser(response);

      await AsyncStorage.setItem('@agende:user', JSON.stringify(response));
      await AsyncStorage.setItem('@agende:token', response.token);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.' 
      };
    }
  }

  async function signUp(data) {
    try {
      const response = await authAPI.registerPaciente(data);

      setUser(response);

      await AsyncStorage.setItem('@agende:user', JSON.stringify(response));
      await AsyncStorage.setItem('@agende:token', response.token);

      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao criar conta. Tente novamente.' 
      };
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.multiRemove(['@agende:user', '@agende:token']);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export default AuthContext;