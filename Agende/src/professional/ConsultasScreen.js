// ============================================
// TELA DE CONSULTAS DO PROFISSIONAL
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { consultaAPI } from '../../services/api';

export default function ProfessionalConsultasScreen({ navigation }) {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('proximas');
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConsultas();
  }, [selectedTab]);

  const loadConsultas = async () => {
    setLoading(true);
    try {
      const response = await consultaAPI.listarPorProfissional(user.perfilId);

      let filtered = [];
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (selectedTab === 'proximas') {
        filtered = response.filter(c => 
          new Date(c.dataConsulta) >= hoje && 
          (c.status === 'AGENDADA' || c.status === 'CONFIRMADA')
        );
      } else if (selectedTab === 'hoje') {
        const hojStr = hoje.toISOString().split('T')[0];
        filtered = response.filter(c => 
          c.dataConsulta === hojStr && 
          (c.status === 'AGENDADA' || c.status === 'CONFIRMADA')
        );
      } else {
        filtered = response.filter(c => 
          c.status === 'REALIZADA' || 
          c.status === 'CANCELADA' || 
          new Date(c.dataConsulta) < hoje
        );
      }

      setConsultas(filtered);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar consultas');
    } finally {
      setLoading(false);
    }
  };

  const confirmarConsulta = async (consultaId) => {
    try {
      await consultaAPI.confirmar(consultaId);
      Alert.alert('Sucesso', 'Consulta confirmada!');
      loadConsultas();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao confirmar consulta');
    }
  };

  const marcarRealizada = async (consultaId) => {
    Alert.alert(
      'Marcar como Realizada',
      'Confirma que esta consulta foi realizada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await consultaAPI.marcarRealizada(consultaId);
              Alert.alert('Sucesso', 'Consulta marcada como realizada!');
              loadConsultas();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao atualizar consulta');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'AGENDADA': '#007AFF',
      'CONFIRMADA': '#34C759',
      'REALIZADA': '#5856D6',
      'CANCELADA': '#FF3B30',
      'FALTOU': '#FF9500',
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const texts = {
      'AGENDADA': 'Agendada',
      'CONFIRMADA': 'Confirmada',
      'REALIZADA': 'Realizada',
      'CANCELADA': 'Cancelada',
      'FALTOU': 'Paciente Faltou',
    };
    return texts[status] || status;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Consultas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'hoje' && styles.activeTab]}
          onPress={() => setSelectedTab('hoje')}
        >
          <Text style={[styles.tabText, selectedTab === 'hoje' && styles.activeTabText]}>
            Hoje
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'proximas' && styles.activeTab]}
          onPress={() => setSelectedTab('proximas')}
        >
          <Text style={[styles.tabText, selectedTab === 'proximas' && styles.activeTabText]}>
            Próximas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'historico' && styles.activeTab]}
          onPress={() => setSelectedTab('historico')}
        >
          <Text style={[styles.tabText, selectedTab === 'historico' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadConsultas} />
        }
      >
        <View style={styles.consultasContainer}>
          {consultas.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Nenhuma consulta encontrada</Text>
            </View>
          ) : (
            consultas.map((consulta) => (
              <TouchableOpacity
                key={consulta.id}
                style={styles.consultaCard}
                onPress={() => navigation.navigate('ConsultaDetails', { consultaId: consulta.id })}
              >
                <View style={styles.consultaHeader}>
                  <View style={styles.patientInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {consulta.pacienteNome.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>{consulta.pacienteNome}</Text>
                      <View style={styles.dateTimeRow}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.dateText}>{formatDate(consulta.dataConsulta)}</Text>
                        <Ionicons name="time-outline" size={14} color="#666" style={{ marginLeft: 12 }} />
                        <Text style={styles.timeText}>{consulta.horaConsulta}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consulta.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(consulta.status)}</Text>
                  </View>
                </View>

                {consulta.motivoConsulta && (
                  <View style={styles.motivoContainer}>
                    <Ionicons name="medical-outline" size={16} color="#666" />
                    <Text style={styles.motivoText}>{consulta.motivoConsulta}</Text>
                  </View>
                )}

                {/* Ações */}
                {(consulta.status === 'AGENDADA' || consulta.status === 'CONFIRMADA') && (
                  <View style={styles.actionsContainer}>
                    {consulta.status === 'AGENDADA' && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                        onPress={() => confirmarConsulta(consulta.id)}
                      >
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#5856D6' }]}
                      onPress={() => marcarRealizada(consulta.id)}
                    >
                      <Ionicons name="checkmark-done" size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Marcar Realizada</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  consultasContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  consultaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  motivoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  motivoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});