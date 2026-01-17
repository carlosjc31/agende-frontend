// ============================================
// TELA HOME DO PROFISSIONAL - Dashboard
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

export default function ProfessionalHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    consultasHoje: 0,
    proximasConsultas: 0,
    totalPacientes: 0,
    avaliacaoMedia: 0,
  });
  const [proximasConsultas, setProximasConsultas] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Buscar estatísticas e próximas consultas
      const consultas = await consultaAPI.listarPorProfissional(user.perfilId);

      const hoje = new Date().toISOString().split('T')[0];
      const consultasHoje = consultas.filter(c => 
        c.dataConsulta === hoje && 
        (c.status === 'AGENDADA' || c.status === 'CONFIRMADA')
      );

      const proximas = consultas
        .filter(c => c.status === 'AGENDADA' || c.status === 'CONFIRMADA')
        .sort((a, b) => new Date(a.dataConsulta) - new Date(b.dataConsulta))
        .slice(0, 5);

      setStats({
        consultasHoje: consultasHoje.length,
        proximasConsultas: proximas.length,
        totalPacientes: user.totalPacientes || 0,
        avaliacaoMedia: user.avaliacaoMedia || 0,
      });

      setProximasConsultas(proximas);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Dr(a)!</Text>
          <Text style={styles.subtitle}>Suas consultas de hoje</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
        }
      >
        {/* Cards de Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#007AFF' }]}>
            <Ionicons name="calendar-outline" size={28} color="#fff" />
            <Text style={styles.statNumber}>{stats.consultasHoje}</Text>
            <Text style={styles.statLabel}>Consultas Hoje</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#34C759' }]}>
            <Ionicons name="time-outline" size={28} color="#fff" />
            <Text style={styles.statNumber}>{stats.proximasConsultas}</Text>
            <Text style={styles.statLabel}>Próximas</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="people-outline" size={28} color="#fff" />
            <Text style={styles.statNumber}>{stats.totalPacientes}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFD700' }]}>
            <Ionicons name="star" size={28} color="#fff" />
            <Text style={styles.statNumber}>{stats.avaliacaoMedia.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>

        {/* Próximas Consultas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Consultas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProfessionalConsultas')}>
              <Text style={styles.seeAll}>Ver Todas</Text>
            </TouchableOpacity>
          </View>

          {proximasConsultas.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
            </View>
          ) : (
            proximasConsultas.map((consulta) => (
              <TouchableOpacity
                key={consulta.id}
                style={styles.consultaCard}
                onPress={() => navigation.navigate('ConsultaDetails', { consultaId: consulta.id })}
              >
                <View style={styles.consultaLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateDay}>{formatDate(consulta.dataConsulta).split(' ')[0]}</Text>
                    <Text style={styles.dateMonth}>{formatDate(consulta.dataConsulta).split(' ')[1]}</Text>
                  </View>
                  <View style={styles.consultaInfo}>
                    <Text style={styles.patientName}>{consulta.pacienteNome}</Text>
                    <View style={styles.consultaDetails}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.consultaTime}>{consulta.horaConsulta}</Text>
                    </View>
                    {consulta.motivoConsulta && (
                      <Text style={styles.consultaMotivo} numberOfLines={1}>
                        {consulta.motivoConsulta}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, 
                  { backgroundColor: consulta.status === 'CONFIRMADA' ? '#34C759' : '#007AFF' }
                ]}>
                  <Text style={styles.statusText}>
                    {consulta.status === 'CONFIRMADA' ? 'Confirmada' : 'Agendada'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProfessionalAgenda')}
            >
              <Ionicons name="calendar" size={32} color="#007AFF" />
              <Text style={styles.actionText}>Minha Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProfessionalConsultas')}
            >
              <Ionicons name="list" size={32} color="#34C759" />
              <Text style={styles.actionText}>Consultas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProfessionalProfile')}
            >
              <Ionicons name="person" size={32} color="#FF9500" />
              <Text style={styles.actionText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Avaliacoes')}
            >
              <Ionicons name="star" size={32} color="#FFD700" />
              <Text style={styles.actionText}>Avaliações</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  consultaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  consultaLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  dateBox: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateMonth: {
    fontSize: 10,
    color: '#fff',
    textTransform: 'uppercase',
  },
  consultaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  consultaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  consultaTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  consultaMotivo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});