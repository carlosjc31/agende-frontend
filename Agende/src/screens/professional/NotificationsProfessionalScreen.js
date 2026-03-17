import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationsProfessionalScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('todas');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega as notificações sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [])
  );

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      console.log("Buscando notificações para o Usuário ID:", user.id);
      // Usamos o user.id (que é o ID da tabela Usuario) para bater com a rota do seu Java
      const response = await api.get(`/notificacoes/usuario/${user.id}`);

      console.log("Dados que o Java enviou:", response.data);

      const listaSegura = Array.isArray(response.data) ? response.data : [];

      // Ordena para que as mais recentes apareçam primeiro
      listaSegura.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));

      setNotifications(listaSegura);
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id, jaLida) => {
    if (jaLida) return; // Se já foi lida, não faz nada

    try {
      // Atualiza localmente na hora para dar feedback rápido (Optimistic UI)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));

      // Envia para o servidor usando o verbo PATCH e a rota correta do Controller!
      await api.patch(`/notificacoes/${id}/marcar-lida`);
    } catch (error) {
      console.log("Erro ao marcar como lida:", error);
      // Se der erro no servidor, volta a recarregar a lista real
      carregarNotificacoes();
    }
  };

  const formatarTempo = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    // Formata para 14:30 ou 17/03 se não for hoje
    return data.toLocaleDateString() === new Date().toLocaleDateString()
      ? `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`
      : `${data.getDate()}/${data.getMonth() + 1}`;
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'LEMBRETE':
      case 'CONFIRMACAO': return 'calendar-outline';
      case 'CANCELAMENTO': return 'close-circle-outline';
      case 'AVALIACAO': return 'star-outline';
      case 'APROVACAO': return 'checkmark-circle-outline';
      case 'REJEICAO': return 'alert-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  // O filtro agora usa o campo 'lida' que vem do Java (false = unread)
  const filtered = notifications.filter((n) => (filter === 'naoLidas' ? !n.lida : true));

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
    {loading ? (
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
    ) : (
      filtered.map((n) => (
        <TouchableOpacity
          key={n.id}
          style={styles.card}
          onPress={() => marcarComoLida(n.id, n.lida)}
          activeOpacity={n.lida ? 1 : 0.7}
        >
          <View style={styles.left}>
            <View style={[styles.iconWrap, !n.lida && styles.iconWrapUnread]}>
              {/* Usamos getIcon(n.tipo) para bater com o Enum do Java */}
              <Ionicons name={getIcon(n.tipo)} size={20} color={!n.lida ? '#007AFF' : '#666'} />
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.topRow}>
              {/* Batendo com o DTO: titulo, dataEnvio, mensagem */}
              <Text style={styles.cardTitle}>{n.titulo}</Text>
              <Text style={styles.time}>{formatarTempo(n.dataEnvio)}</Text>
            </View>
            <Text style={styles.message}>{n.mensagem}</Text>
            {!n.lida && <Text style={styles.unread}>Nova</Text>}
          </View>
        </TouchableOpacity>
      ))
    )}

    {!loading && filtered.length === 0 && (
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

// Os estilos mantêm-se exatamente iguais aos seus!
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#fff', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { marginTop: 4, color: '#666' },
  filters: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  filterActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText: { color: '#666', fontWeight: '700' },
  filterTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
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
