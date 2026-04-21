// ============================================
// AUTH CONTEXT - Gerenciamento de Autenticação
// ============================================

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // Força a limpeza total do celular!
      //await AsyncStorage.clear(); deslogar o celular
      // ----------------------------------------------------

      const storageUser = await AsyncStorage.getItem('@agende:user');
      const storageToken = await AsyncStorage.getItem('@agende:token');

      if (storageUser && storageToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);
  // carrega os dados salvos no AsyncStorage quando o componente for montado
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
  // Função de Login e Autenticação
  async function signIn(email, senha) {
    try {
      console.log("👉 1. Tentando logar com:", email);
      const response = await authAPI.login(email, senha);
      console.log("✅ 2. O Java autorizou! Pacote recebido:", response);
      const tokenReal = response.token || response.accessToken || (typeof response === 'string' ? response : null);

      if (!tokenReal) throw new Error("Servidor não enviou um token válido.");

      api.defaults.headers.common['Authorization'] = `Bearer ${tokenReal}`;

      const usuarioFormatado = {
        response,
        nomeCompleto: response.nomeCompleto || response.nome || null,
        perfil: response.perfil || response.role || null,

        perfilId: response.perfilId || response.profissionalId || response.idPerfil || response.id
      };
      console.log("🔄 3. Usuário formatado para o Routes:", usuarioFormatado);
      // Salva o tokenReal no AsyncStorage
      setUser(usuarioFormatado);
      await AsyncStorage.setItem('@agende:user', JSON.stringify(usuarioFormatado));
      await AsyncStorage.setItem('@agende:token', tokenReal);

      return { success: true };

    } catch (error) {
      await AsyncStorage.multiRemove(['@agende:user', '@agende:token']);
      setUser(null);

      return { success: false, message: 'Usuário ou senha inválidos' };
    }
  }

// Função de Cadastro
  const signUp = async (email, senha, perfil) => {
    try {
      // 1. Fazemos a chamada para a API
      const payload = { email, senha, perfil };
      const response = await authAPI.registerPaciente(payload);

      if (response && response.token) {
        await AsyncStorage.setItem('@agende:token', response.token);
        const newUser = { email: email, perfil: perfil, nomeCompleto: null};
        setUser(newUser);
        await AsyncStorage.setItem('@agende:user', JSON.stringify(newUser));

      }

      return { success: true };
    } catch (error) {
      console.log("Erro no cadastro:", error.response?.data || error.message);

      return { success: false, message: 'Não foi possível realizar o cadastro.'};
    }
  };

  const completeProfile = async (dadosCompletos) => {
    try {
      await authAPI.completarPerfilPaciente(dadosCompletos);
      const updatedUser = {user, nomeCompleto: dadosCompletos.nomeCompleto};
      setUser(updatedUser);
      await AsyncStorage.setItem('@agende:user', JSON.stringify(updatedUser));
      return { success: true };

    } catch (error) {
      console.log("Erro ao completar perfil:", error);
      return { success: false, message: 'Não foi possível salvar os dados.' };
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
        completeProfile,
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
