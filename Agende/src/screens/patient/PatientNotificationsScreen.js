import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function PatientNotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [])
  );

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      // Usamos a mesma rota do Java: busca pelo usuarioId (ID de login)
      const response = await api.get(`/notificacoes/usuario/${user.id}`);
      const lista = Array.isArray(response.data) ? response.data : [];

      // Ordena pelas mais recentes (dataEnvio que está no seu DTO)
      lista.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
      setNotifications(lista);
    } catch (error) {
      console.log("Erro ao buscar notificações do paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id, lida) => {
    if (lida) return;
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
      await api.patch(`/notificacoes/${id}/marcar-lida`);
    } catch (error) {
      console.log("Erro ao marcar lida:", error);
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'CONFIRMACAO': return 'checkmark-done-circle-outline';
      case 'CANCELAMENTO': return 'close-circle-outline';
      case 'LEMBRETE': return 'alarm-outline';
      case 'AVALIACAO': return 'star-outline';
      default: return 'notifications-outline';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.lida && styles.cardUnread]}
              onPress={() => marcarComoLida(n.id, n.lida)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={getIcon(n.tipo)} size={24} color={n.lida ? '#999' : '#007AFF'} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, !n.lida && styles.boldText]}>{n.titulo}</Text>
                <Text style={styles.message}>{n.mensagem}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {!loading && notifications.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Você não tem novas notificações.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#fff', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  scroll: { flex: 1 },
  content: { padding: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, alignItems: 'center', elevation: 1 },
  cardUnread: { borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  iconContainer: { marginRight: 15 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 15, color: '#333' },
  boldText: { fontWeight: 'bold' },
  message: { fontSize: 13, color: '#666', marginTop: 3 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#999' }
});
