import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [filter, setFilter] = useState('todas');

  const notifications = useMemo(
    () => [
      { id: 'n1', type: 'consulta', title: 'Nova consulta solicitada', message: 'Maria Oliveira pediu agendamento para hoje 15:00.', time: 'Agora', unread: true },
      { id: 'n2', type: 'avaliacao', title: 'Nova avaliação recebida', message: 'João Silva avaliou sua consulta com 5 estrelas.', time: '2h', unread: true },
      { id: 'n3', type: 'sistema', title: 'Atualização do sistema', message: 'Melhorias de performance aplicadas.', time: 'Ontem', unread: false },
    ],
    []
  );

  const icon = (type) => {
    switch (type) {
      case 'consulta':
        return 'calendar-outline';
      case 'avaliacao':
        return 'star-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const filtered = notifications.filter((n) => (filter === 'naoLidas' ? n.unread : true));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>Atualizações e alertas</Text>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={[styles.filterBtn, filter === 'todas' && styles.filterActive]} onPress={() => setFilter('todas')}>
          <Text style={[styles.filterText, filter === 'todas' && styles.filterTextActive]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'naoLidas' && styles.filterActive]} onPress={() => setFilter('naoLidas')}>
          <Text style={[styles.filterText, filter === 'naoLidas' && styles.filterTextActive]}>Não lidas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={styles.left}>
              <View style={[styles.iconWrap, n.unread && styles.iconWrapUnread]}>
                <Ionicons name={icon(n.type)} size={20} color={n.unread ? '#007AFF' : '#666'} />
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.topRow}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.time}>{n.time}</Text>
              </View>
              <Text style={styles.message}>{n.message}</Text>
              {n.unread && <Text style={styles.unread}>Não lida</Text>}
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={56} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Sem notificações</Text>
            <Text style={styles.emptySub}>Nenhuma notificação para mostrar.</Text>
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
  filters: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  filterActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText: { color: '#666', fontWeight: '700' },
  filterTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  left: { marginRight: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  iconWrapUnread: { backgroundColor: '#F0F8FF' },
  body: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#333', flex: 1, paddingRight: 10 },
  time: { fontSize: 12, color: '#999' },
  message: { marginTop: 6, color: '#666', lineHeight: 18 },
  unread: { marginTop: 8, color: '#007AFF', fontWeight: '800', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { marginTop: 14, fontSize: 16, fontWeight: '800', color: '#333' },
  emptySub: { marginTop: 6, color: '#666' },
});