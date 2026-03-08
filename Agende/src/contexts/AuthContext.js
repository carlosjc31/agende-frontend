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

      // Verificação de segurança para o AsyncStorage não crashar
      const tokenRecebido = response.token || response.accessToken || 'sem-token-encontrado';

      setUser(response);

      console.log("PASSO 3: Guardando dados no celular...");
      await AsyncStorage.setItem('@agende:user', JSON.stringify(response));
      await AsyncStorage.setItem('@agende:token', tokenRecebido);

      console.log("PASSO 4: Tudo pronto, redirecionando para a Home!");
      return { success: true };

    } catch (error) {
      console.log("ERRO NO LOGIN DO JAVA:", error.response?.data || error.message);
      return { success: false, message: 'Erro ao fazer login' };
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
      // ESTA É A LINHA MÁGICA QUE VAMOS ADICIONAR:
      //console.log("A FOFOCA DO JAVA:", error.response?.data || error.message);

      // (Mantenha o resto do seu catch como estava, provavelmente tem um return ou throw)
      //return { success: false, message: 'Erro no cadastro'

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
