// ============================================
// TELA DE AGENDA DO PROFISSIONAL
// ============================================

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AgendaScreen() {
  const [selectedDay, setSelectedDay] = useState('Hoje');

  const days = useMemo(() => ['Hoje', 'Amanhã', 'Esta semana'], []);
  const slots = useMemo(
    () => ({
      Hoje: [
        { id: 's1', time: '08:00', status: 'disponível' },
        { id: 's2', time: '08:30', status: 'bloqueado' },
        { id: 's3', time: '09:00', status: 'reservado' },
        { id: 's4', time: '09:30', status: 'disponível' },
      ],
      Amanhã: [
        { id: 's5', time: '10:00', status: 'disponível' },
        { id: 's6', time: '10:30', status: 'disponível' },
        { id: 's7', time: '11:00', status: 'reservado' },
      ],
      'Esta semana': [
        { id: 's8', time: '14:00', status: 'disponível' },
        { id: 's9', time: '14:30', status: 'disponível' },
        { id: 's10', time: '15:00', status: 'bloqueado' },
      ],
    }),
    []
  );

  const color = (status) => {
    switch (status) {
      case 'disponível':
        return '#34C759';
      case 'reservado':
        return '#FF9500';
      case 'bloqueado':
        return '#8E8E93';
      default:
        return '#007AFF';
    }
  };

  const toggleSlot = (slot) => {
    Alert.alert('Ação', `Em breve: alterar status do horário ${slot.time} (${slot.status}).`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <Text style={styles.subtitle}>Gerencie seus horários</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll} contentContainerStyle={styles.daysContent}>
        {days.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
            onPress={() => setSelectedDay(d)}
          >
            <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {slots[selectedDay].map((slot) => (
          <TouchableOpacity key={slot.id} style={styles.slotCard} onPress={() => toggleSlot(slot)}>
            <View style={styles.slotLeft}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.slotTime}>{slot.time}</Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: color(slot.status) }]}>
              <Text style={styles.statusText}>{slot.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.hintCard}>
          <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
          <Text style={styles.hintText}>Dica: toque em um horário para bloquear/liberar (placeholder).</Text>
        </View>
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
  daysScroll: { backgroundColor: '#fff' },
  daysContent: { paddingHorizontal: 20, paddingVertical: 12 },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  dayChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dayChipText: { color: '#666', fontWeight: '600' },
  dayChipTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  slotCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  slotLeft: { flexDirection: 'row', alignItems: 'center' },
  slotTime: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: '#333' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
  },
  hintText: { marginLeft: 10, color: '#007AFF', fontWeight: '600' },
});
