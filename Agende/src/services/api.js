// ============================================
// API SERVICE - Integração com Backend
// ============================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API
const API_BASE_URL = 'http://192.168.0.3:8081/api'; // Alterar para IP do servidor em produção

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@agende:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
export const setupInterceptors = (signOutCallback) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Se o Java disser que o token expirou, desloga na mesma hora!
        await AsyncStorage.multiRemove(['@agende:token', '@agende:user']);
        if (signOutCallback) signOutCallback();
      }
      return Promise.reject(error);
    }
  );
};

// ============================================
// AUTENTICAÇÃO
// ============================================

export const authAPI = {
  // Login
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  // Cadastro de Paciente
  registerPaciente: async (data) => {
    const response = await api.post('/auth/register/paciente', data);
    return response.data;
  },
};

// ============================================
// PROFISSIONAIS
// ============================================

export const profissionalAPI = {
  // Listar todos os profissionais
  listarTodos: async () => {
    const response = await api.get('/profissionais');
    return response.data;
  },

  // Buscar profissional por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  },

  // Buscar por especialidade
  buscarPorEspecialidade: async (especialidade) => {
    const response = await api.get(`/profissionais/especialidade/${especialidade}`);
    return response.data;
  },

  // Buscar profissionais (nome ou especialidade)
  buscar: async (query) => {
    const response = await api.get('/profissionais/buscar', {
      params: { q: query },
    });
    return response.data;
  },

  // Listar top avaliados
  listarTopAvaliados: async () => {
    const response = await api.get('/profissionais/top-avaliados');
    return response.data;
  },
};

// ============================================
// CONSULTAS
// ============================================

export const consultaAPI = {
  // Agendar consulta
  agendar: async (pacienteId, dadosConsulta) => {
    const response = await api.post(`/consultas/agendar/${pacienteId}`, dadosConsulta);
    return response.data;
  },

  // Listar consultas do paciente
  listarPorPaciente: async (pacienteId) => {
    const response = await api.get(`/consultas/paciente/${pacienteId}`);
    return response.data;
  },

  // Listar consultas do profissional
  listarPorProfissional: async (profissionalId) => {
    const response = await api.get(`/consultas/profissional/${profissionalId}`);
    return response.data;
  },
  // Concluir consulta
  concluirConsulta: async (consultaId) => {
    const response = await api.patch(`/consultas/${consultaId}/marcar-realizada`);
    return response.data;
  },

  // Cancelar consulta
  cancelarConsulta: async (consultaId, motivo = "Cancelado pelo profissional") => {
    const response = await api.patch(`/consultas/${consultaId}/cancelar?motivo=${encodeURIComponent(motivo)}`);
    return response.data;
  },

  // Listar próximas consultas
  listarProximas: async (pacienteId) => {
    const response = await api.get(`/consultas/paciente/${pacienteId}/proximas`);
    return response.data;
  },

  // Cancelar consulta
  cancelar: async (consultaId, motivo) => {
    const response = await api.patch(`/consultas/${consultaId}/cancelar`, null, {
      params: { motivo },
    });
    return response.data;
  },
};

// ============================================
// AVALIAÇÕES
// ============================================

export const avaliacaoAPI = {
  // Avaliar consulta
  avaliar: async (pacienteId, data) => {
    const response = await api.post(`/avaliacoes/paciente/${pacienteId}`, data);
    return response.data;
  },

  // Listar avaliações do profissional
  listarPorProfissional: async (profissionalId) => {
    const response = await api.get(`/avaliacoes/profissional/${profissionalId}`);
    return response.data;
  },
};

// ============================================
// NOTIFICAÇÕES
// ============================================

export const notificacaoAPI = {
  // Listar todas as notificações
  listar: async (usuarioId) => {
    const response = await api.get(`/notificacoes/usuario/${usuarioId}`);
    return response.data;
  },

  // Listar não lidas
  listarNaoLidas: async (usuarioId) => {
    const response = await api.get(`/notificacoes/usuario/${usuarioId}/nao-lidas`);
    return response.data;
  },

  // Marcar como lida
  marcarLida: async (notificacaoId) => {
    const response = await api.patch(`/notificacoes/${notificacaoId}/marcar-lida`);
    return response.data;
  },
};


// ============================================
// Adminastrador de Usuários
// ============================================

export const adminAPI = {
  // Busca a lista de médicos esperando aprovação
  listarPendentes: async () => {
    const response = await api.get('/profissionais/pendentes');
    return response.data;
  },
  // Manda o Java aprovar
  aprovar: async (id) => {
    const response = await api.patch(`/profissionais/${id}/aprovar`);
    return response.data;
  },
  // Manda o Java rejeitar/excluir
  rejeitar: async (id) => {
    const response = await api.patch(`/profissionais/${id}/rejeitar`);
    return response.data;
  }
};

export default api;
