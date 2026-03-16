// ============================================
// TELA DE CONSULTAS DO PROFISSIONAL
// ============================================

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { consultaAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ConsultaScreen({ navigation }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('hoje');
  const [consultasReais, setConsultasReais] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
    carregarConsultas();
  }, [])
  );

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const dados = await consultaAPI.listarPorProfissional(user.perfilId);
      setConsultasReais(Array.isArray(dados) ? dados : (dados?.content || []));
    } catch (error) {
      console.log('Erro ao carregar consultas da médica:', error);
      setConsultasReais([]);
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(() => {
    const hojeLocal = new Date();
    const hojeFormatado = hojeLocal.toISOString().split('T')[0];

    const hoje = [];
    const proximas = [];
    const historico = [];

    consultasReais.forEach(c => {
      const statusNormal = c.status?.toUpperCase();

      if (statusNormal === 'CANCELADA' || statusNormal === 'CONCLUIDA' || statusNormal === 'REALIZADA' || c.dataConsulta < hojeFormatado) {
        historico.push(c);
      } else if (c.dataConsulta === hojeFormatado) {
        hoje.push(c);
      } else if (c.dataConsulta > hojeFormatado) {
        proximas.push(c);
      }
    });

    return { hoje, proximas, historico };
  }, [consultasReais]);

  const statusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'AGENDADA': return '#34C759'; // Verde
      case 'PENDENTE': return '#FF9500'; // Laranja
      case 'CONCLUIDA': case 'REALIZADA': return '#007AFF'; // Azul
      case 'CANCELADA': return '#FF3B30'; // Vermelho
      default: return '#8E8E93';
    }
  };

  const emptyText = {
    hoje: 'Nenhuma consulta hoje.',
    proximas: 'Nenhuma consulta futura.',
    historico: 'Nenhum histórico.',
  }[tab];

  const handleQuickAction = (item) => {
    // Truque Ninja: Passamos o objeto inteiro "item" para a tela de detalhes!
    navigation.navigate('ConsultaDetails', { consulta: item });
  };

  const renderCard = (c) => (
    <TouchableOpacity key={c.id} style={styles.card} onPress={() => handleQuickAction(c)}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>

        <View style={styles.info}>
          {/* Usando os nomes reais que o Java envia! */}
          <Text style={styles.name}>{c.pacienteNome}</Text>
          <Text style={styles.meta}>{c.dataConsulta} • {c.horaConsulta} • {c.motivoConsulta || 'Presencial'}</Text>
        </View>

        <View style={[styles.status, { backgroundColor: statusColor(c.status) }]}>
          {/* Mostramos o status real, mas limitamos para ficar bonito no cartão pequeno */}
          <Text style={styles.statusText}>{c.status === 'AGENDADA' ? 'Confirmada' : c.status}</Text>
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
            <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
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
