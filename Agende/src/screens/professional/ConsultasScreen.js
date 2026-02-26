// ============================================
// TELA DE CONSULTAS DO PROFISSIONAL
// ============================================

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultasScreen({ navigation }) {
  const [tab, setTab] = useState('hoje');

  const data = useMemo(
    () => ({
      hoje: [
        { id: 'c1', paciente: 'João Silva', data: 'Hoje', hora: '14:30', tipo: 'Presencial', status: 'confirmada' },
        { id: 'c2', paciente: 'Maria Oliveira', data: 'Hoje', hora: '15:00', tipo: 'Online', status: 'pendente' },
      ],
      proximas: [
        { id: 'c3', paciente: 'Carlos Pereira', data: 'Amanhã', hora: '09:00', tipo: 'Presencial', status: 'confirmada' },
        { id: 'c4', paciente: 'Ana Souza', data: '18 Jan', hora: '11:00', tipo: 'Online', status: 'confirmada' },
      ],
      historico: [
        { id: 'c5', paciente: 'Pedro Lima', data: '10 Jan', hora: '10:30', tipo: 'Presencial', status: 'concluida' },
        { id: 'c6', paciente: 'Marina Costa', data: '08 Jan', hora: '16:00', tipo: 'Online', status: 'cancelada' },
      ],
    }),
    []
  );

  const statusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return '#34C759';
      case 'pendente':
        return '#FF9500';
      case 'concluida':
        return '#007AFF';
      case 'cancelada':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const emptyText = {
    hoje: 'Nenhuma consulta hoje.',
    proximas: 'Nenhuma consulta futura.',
    historico: 'Nenhum histórico.',
  }[tab];

  const handleQuickAction = (item) => {
    if (item.status === 'pendente') {
      Alert.alert('Pendente', 'Em breve: aprovar/rejeitar consulta.');
      return;
    }
    navigation.navigate('ConsultaDetails', { consultaId: item.id });
  };

  const renderCard = (c) => (
    <TouchableOpacity key={c.id} style={styles.card} onPress={() => handleQuickAction(c)}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{c.paciente}</Text>
          <Text style={styles.meta}>{c.data} • {c.hora} • {c.tipo}</Text>
        </View>

        <View style={[styles.status, { backgroundColor: statusColor(c.status) }]}>
          <Text style={styles.statusText}>{c.status}</Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>Consultas</Text>
        <Text style={styles.subtitle}>Gerencie atendimentos</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'hoje' && styles.tabActive]} onPress={() => setTab('hoje')}>
          <Text style={[styles.tabText, tab === 'hoje' && styles.tabTextActive]}>Hoje ({data.hoje.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'proximas' && styles.tabActive]} onPress={() => setTab('proximas')}>
          <Text style={[styles.tabText, tab === 'proximas' && styles.tabTextActive]}>Próximas ({data.proximas.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'historico' && styles.tabActive]} onPress={() => setTab('historico')}>
          <Text style={[styles.tabText, tab === 'historico' && styles.tabTextActive]}>Histórico ({data.historico.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {data[tab].length > 0 ? data[tab].map(renderCard) : (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={60} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>{emptyText}</Text>
            <Text style={styles.emptySub}>As consultas aparecerão aqui quando existirem.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { marginTop: 4, color: '#666' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#007AFF' },
  tabText: { color: '#666', fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: '#007AFF' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  card: {
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
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '700', color: '#333' },
  meta: { marginTop: 3, fontSize: 12, color: '#666' },
  status: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  cardBottom: { marginTop: 10, alignItems: 'flex-end' },
  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyTitle: { marginTop: 14, fontSize: 16, fontWeight: '700', color: '#333' },
  emptySub: { marginTop: 6, color: '#666' },
});