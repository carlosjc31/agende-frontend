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
      console.log("PASSO 1: Chamando a API do Java...");
      const response = await authAPI.login(email, senha);

      console.log("PASSO 2: O Java respondeu!", response);

      const tokenReal = response.token || response.accessToken || (typeof response === 'string' ? response : null);

      if (!tokenReal) {
         throw new Error("Servidor não enviou um token válido.");
      }

      console.log("PASSO 3: Token real recebido. Guardando dados...");

      // Salva o tokenReal no AsyncStorage
      setUser(response);
      await AsyncStorage.setItem('@agende:user', JSON.stringify(response));
      await AsyncStorage.setItem('@agende:token', tokenReal);

      console.log("PASSO 4: Tudo pronto, redirecionando para a Home!");
      return { success: true };

    } catch (error) {
      console.log("ERRO NO LOGIN DO JAVA:", error.response?.data || error.message);

      await AsyncStorage.multiRemove(['@agende:user', '@agende:token']);
      setUser(null);

      return { success: false, message: 'Usuário ou senha inválidos' };
    }
  }

// Função de Cadastro
  const signUp = async (dadosPaciente) => {
    try {
      // 1. Fazemos a chamada para a API
      const response = await authAPI.registerPaciente(dadosPaciente);

      if (response && response.token) {
        await AsyncStorage.setItem('@agende:token', response.token);

      } else {

        console.log("Cadastro realizado sem auto-login. Token não recebido.");
      }

      return { success: true };
    } catch (error) {
      console.log("Erro no cadastro:", error);

      throw error;
    }
  };

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
