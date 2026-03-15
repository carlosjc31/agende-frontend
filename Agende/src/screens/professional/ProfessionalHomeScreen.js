// ============================================
// TELA HOME DO PROFISSIONAL - Dashboard
// ============================================

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function ProfessionalHomeScreen({ navigation }) {


  const professional = useMemo(
    () => ({
      name: 'Dra. Maria Santos',
      specialty: 'Cardiologia',
      rating: 4.9,
    }),
    []
  );

  const stats = useMemo(
    () => ({
      today: 6,
      week: 28,
      pending: 3,
      cancelled: 1,
    }),
    []
  );

  const nextConsultas = useMemo(
    () => [
      { id: 'c1', paciente: 'João Silva', data: 'Hoje', hora: '14:30', tipo: 'Presencial', status: 'confirmada' },
      { id: 'c2', paciente: 'Maria Oliveira', data: 'Hoje', hora: '15:00', tipo: 'Online', status: 'pendente' },
      { id: 'c3', paciente: 'Carlos Pereira', data: 'Amanhã', hora: '09:00', tipo: 'Presencial', status: 'confirmada' },
    ],
    []
  );

  const statusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return '#34C759';
      case 'pendente':
        return '#FF9500';
      case 'cancelada':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Olá, {professional.name}</Text>
          <Text style={styles.subtitle}>{professional.specialty} • {professional.rating} ★</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ProfessionalNotifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={22} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.today}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="stats-chart-outline" size={22} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.week}</Text>
            <Text style={styles.statLabel}>Semana</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={22} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="close-circle-outline" size={22} color="#FF3B30" />
            <Text style={styles.statNumber}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Canceladas</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalAgenda')}>
            <Ionicons name="calendar" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalConsultas')}>
            <Ionicons name="document-text-outline" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Consultas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalProfile')}>
            <Ionicons name="person-outline" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas consultas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProfessionalConsultas')}>
              <Text style={styles.link}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {nextConsultas.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.consultaCard}
              onPress={() => navigation.navigate('ConsultaDetails', { consultaId: c.id })}
            >
              <View style={styles.consultaTop}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color="#fff" />
                </View>
                <View style={styles.consultaInfo}>
                  <Text style={styles.consultaName}>{c.paciente}</Text>
                  <Text style={styles.consultaMeta}>{c.data} • {c.hora} • {c.tipo}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusColor(c.status) }]}>
                  <Text style={styles.statusText}>{c.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  greeting: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#E8F4FF', marginTop: 4, fontSize: 13 },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute', top: 9, right: 10,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -28 },
  statCard: {
    width: '23.5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: { marginTop: 8, fontSize: 12, color: '#333', fontWeight: '600' },
  section: { marginTop: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  link: { color: '#007AFF', fontWeight: '600' },
  consultaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  consultaTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#007AFF',
    alignItems: 'center', justifyContent: 'center',
  },
  consultaInfo: { flex: 1, marginLeft: 12 },
  consultaName: { fontSize: 15, fontWeight: '600', color: '#333' },
  consultaMeta: { marginTop: 3, fontSize: 12, color: '#666' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
