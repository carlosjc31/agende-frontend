// ============================================
// TELA DASHBOARD DO ADMINISTRADOR
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
import { adminAPI } from '../../services/api';

export default function AdminDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalPacientes: 0,
    totalProfissionais: 0,
    profissionaisPendentes: 0,
    consultasHoje: 0,
    consultasTotal: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const MenuCard = ({ title, icon, color, count, onPress, badge }) => (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#fff" />
        {badge > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuCount}>{count}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Painel Administrativo</Text>
          <Text style={styles.subtitle}>Gestão do Sistema Agende</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
        }
      >
        {/* Cards de Estatísticas */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#007AFF' }]}>
            <Ionicons name="people" size={32} color="#fff" />
            <Text style={styles.statNumber}>{stats.totalUsuarios}</Text>
            <Text style={styles.statLabel}>Usuários</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#34C759' }]}>
            <Ionicons name="person" size={32} color="#fff" />
            <Text style={styles.statNumber}>{stats.totalPacientes}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="medical" size={32} color="#fff" />
            <Text style={styles.statNumber}>{stats.totalProfissionais}</Text>
            <Text style={styles.statLabel}>Profissionais</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#5856D6' }]}>
            <Ionicons name="calendar" size={32} color="#fff" />
            <Text style={styles.statNumber}>{stats.consultasTotal}</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>
        </View>

        {/* Alertas */}
        {stats.profissionaisPendentes > 0 && (
          <View style={styles.alertCard}>
            <Ionicons name="warning" size={24} color="#FF9500" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Ação Necessária</Text>
              <Text style={styles.alertText}>
                {stats.profissionaisPendentes} profissional(is) aguardando validação
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate('ValidarProfissionais')}
            >
              <Text style={styles.alertButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu de Gestão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestão de Usuários</Text>

          <MenuCard
            title="Validar Profissionais"
            icon="shield-checkmark"
            color="#FF9500"
            count={`${stats.profissionaisPendentes} pendentes`}
            badge={stats.profissionaisPendentes}
            onPress={() => navigation.navigate('ValidarProfissionais')}
          />

          <MenuCard
            title="Gerenciar Pacientes"
            icon="people-outline"
            color="#34C759"
            count={`${stats.totalPacientes} cadastrados`}
            onPress={() => navigation.navigate('GerenciarPacientes')}
          />

          <MenuCard
            title="Gerenciar Profissionais"
            icon="medkit-outline"
            color="#007AFF"
            count={`${stats.totalProfissionais} cadastrados`}
            onPress={() => navigation.navigate('GerenciarProfissionais')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistema</Text>

          <MenuCard
            title="Consultas do Dia"
            icon="calendar-outline"
            color="#5856D6"
            count={`${stats.consultasHoje} agendadas`}
            onPress={() => navigation.navigate('ConsultasDia')}
          />

          <MenuCard
            title="Relatórios"
            icon="stats-chart-outline"
            color="#00C7BE"
            count="Ver análises"
            onPress={() => navigation.navigate('Relatorios')}
          />

          <MenuCard
            title="Configurações"
            icon="settings-outline"
            color="#8E8E93"
            count="Sistema"
            onPress={() => navigation.navigate('Configuracoes')}
          />
        </View>

        <View style={styles.bottomPadding} />
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
  profileButton: {
    padding: 4,
  },
  statsGrid: {
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  alertText: {
    fontSize: 12,
    color: '#856404',
    marginTop: 4,
  },
  alertButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  menuCard: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
});