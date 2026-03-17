// ============================================
// TELA DE VALIDAÇÃO DE PROFISSIONAIS (ADMIN)
// ============================================

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { adminAPI } from '../../services/api';

export default function ValidarProfissionalScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //const pendingCount = items.filter((p) => p.status === 'pendente').length;
  useFocusEffect(
    useCallback(() => {
      carregarPendentes();
    }, [])
  );

  const carregarPendentes = async () => {
    try {
      setLoading(true);
      const dados = await adminAPI.listarPendentes();
      setItems(Array.isArray(dados) ? dados : (dados?.content || []));
    } catch (error) {
      console.log('Erro ao buscar pendentes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cadastros.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id, nome) => {
    Alert.alert('Aprovar', `Deseja aprovar o cadastro de ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprovar',
        onPress: async () => {
          try {
            await adminAPI.aprovar(id);
            Alert.alert('Sucesso', 'Profissional aprovado e liberado para agendamentos!');
            carregarPendentes(); // Recarrega a lista para remover o médico da tela
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível aprovar o profissional.');
          }
        },
      },
    ]);
  };

  const handleReject = (id, nome) => {
    Alert.alert('Rejeitar', `Deseja realmente rejeitar e excluir o cadastro de ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rejeitar',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminAPI.rejeitar(id);
            Alert.alert('Concluído', 'Cadastro rejeitado e removido do sistema.');
            carregarPendentes(); // Recarrega a lista
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível rejeitar o profissional.');
          }
        },
      },
    ]);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pendente':
        return '#FF9500';
      case 'aprovado':
        return '#34C759';
      case 'rejeitado':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>Validar profissionais</Text>
        <Text style={styles.subtitle}>Cadastros aguardando aprovação</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Ionicons name="alert-circle-outline" size={22} color="#FF9500" />
          <Text style={styles.summaryNumber}>{items.length}</Text>
          <Text style={styles.summaryLabel}>Pendentes</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-outline" size={56} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Sem cadastros pendentes</Text>
            <Text style={styles.emptySub}>A sua plataforma está em dia!</Text>
          </View>
        ) : (
          items.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Ionicons name="medkit" size={18} color="#fff" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{p.nomeCompleto || p.nome}</Text>
                  <Text style={styles.meta}>{p.especialidade} • {p.crm || 'CRM não informado'}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: '#FF9500' }]}>
                  <Text style={styles.statusText}>Aguardando</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                {/* Enviamos o ID e o NOME para o Alerta ficar mais amigável */}
                <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(p.id, p.nomeCompleto)}>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={styles.actionText}>Aprovar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(p.id, p.nomeCompleto)}>
                  <Ionicons name="close" size={18} color="#fff" />
                  <Text style={styles.actionText}>Rejeitar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: { marginTop: 8, fontSize: 20, fontWeight: '800', color: '#333' },
  summaryLabel: { marginTop: 4, fontSize: 12, color: '#666', fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },

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

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '800', color: '#333' },
  meta: { marginTop: 3, fontSize: 12, color: '#666' },

  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 6,
  },
  approveBtn: { backgroundColor: '#34C759' },
  rejectBtn: { backgroundColor: '#FF3B30' },
  actionText: { color: '#fff', fontWeight: '800', marginLeft: 8 },

  doneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  doneText: { marginLeft: 8, color: '#666', fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { marginTop: 14, fontSize: 16, fontWeight: '800', color: '#333' },
  emptySub: { marginTop: 6, color: '#666' },
});
