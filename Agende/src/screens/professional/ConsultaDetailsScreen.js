import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultaDetailsScreen({ route, navigation }) {
  const { consultaId } = route.params || {};

  const consulta = useMemo(
    () => ({
      id: consultaId || 'c1',
      paciente: 'João Silva',
      data: 'Hoje',
      hora: '14:30',
      tipo: 'Presencial',
      status: 'confirmada',
      motivo: 'Dor no peito',
      observacoes: 'Paciente relata episódios recentes durante esforço.',
      local: 'Clínica Centro - Sala 305',
    }),
    [consultaId]
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

  const handleConcluir = () => Alert.alert('Em breve', 'Marcar consulta como concluída (placeholder).');
  const handleCancelar = () => Alert.alert('Em breve', 'Cancelar consulta (placeholder).');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.rowTop}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{consulta.paciente}</Text>
              <Text style={styles.meta}>{consulta.data} • {consulta.hora} • {consulta.tipo}</Text>
            </View>
            <View style={[styles.status, { backgroundColor: statusColor(consulta.status) }]}>
              <Text style={styles.statusText}>{consulta.status}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{consulta.local}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="chatbubbles-outline" size={18} color="#666" />
            <Text style={styles.detailText}>Motivo: {consulta.motivo}</Text>
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Observações</Text>
            <Text style={styles.notesText}>{consulta.observacoes}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={handleConcluir}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionTextPrimary}>Concluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.danger]} onPress={handleCancelar}>
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionTextPrimary}>Cancelar</Text>
          </TouchableOpacity>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '800', color: '#333' },
  meta: { marginTop: 4, color: '#666', fontSize: 12 },
  status: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  detailText: { marginLeft: 10, color: '#666', flex: 1 },
  notesBox: { marginTop: 16, backgroundColor: '#F9F9F9', padding: 14, borderRadius: 12 },
  notesTitle: { fontWeight: '800', color: '#333', marginBottom: 6 },
  notesText: { color: '#666', lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 6,
  },
  primary: { backgroundColor: '#34C759' },
  danger: { backgroundColor: '#FF3B30' },
  actionTextPrimary: { color: '#fff', fontWeight: '800', marginLeft: 8 },
});
