// screens/AppointmentsScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AppointmentsScreen({ navigation }) {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controle das abas: 'proximas' ou 'historico'
  const [activeTab, setActiveTab] = useState('proximas');

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [])
  );

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      // Puxa TODAS as consultas do paciente de uma vez só
      const response = await api.get(`/consultas/paciente/${user.perfilId}`);
      const dados = response.data;
      const listaSegura = Array.isArray(dados) ? dados : (dados?.content || []);

      // Ordena para que as mais recentes apareçam primeiro
      listaSegura.sort((a, b) => new Date(b.dataConsulta) - new Date(a.dataConsulta));

      setConsultas(listaSegura);
    } catch (error) {
      console.log("Erro ao buscar consultas do paciente:", error);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtra as consultas dependendo da aba selecionada
  const consultasListadas = useMemo(() => {
    if (activeTab === 'proximas') {
      return consultas.filter(c => c.status === 'AGENDADA' || c.status === 'CONFIRMADA' || c.status === 'PENDENTE');
    } else {
      return consultas.filter(c => c.status === 'REALIZADA' || c.status === 'CANCELADA' || c.status === 'FALTOU');
    }
  }, [consultas, activeTab]);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatarHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return '#34C759';
      case 'AGENDADA': return '#FF9500';
      case 'CANCELADA':
      case 'FALTOU': return '#FF3B30';
      case 'REALIZADA': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const renderConsulta = ({ item }) => {
    const nomeMedico = item.profissional?.nomeCompleto || 'Médico não identificado';
    const especialidade = item.profissional?.especialidade || 'Especialista';
    const inicial = nomeMedico.charAt(0).toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.medicoInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{inicial}</Text>
            </View>
            <View>
              <Text style={styles.medicoNome}>Dr(a). {nomeMedico}</Text>
              <Text style={styles.medicoEspecialidade}>{especialidade}</Text>
            </View>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{formatarData(item.dataConsulta)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{formatarHora(item.horaConsulta)}</Text>
          </View>
        </View>

        {/* A MÁGICA DA RECEITA: Só aparece se estiver REALIZADA e tiver anotações! */}
        {item.status === 'REALIZADA' && item.observacoes && (
          <View style={styles.receitaContainer}>
            <View style={styles.receitaHeader}>
              <Ionicons name="document-text" size={16} color="#007AFF" />
              <Text style={styles.receitaTitle}>Prescrição / Observações</Text>
            </View>
            <Text style={styles.receitaText}>{item.observacoes}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Consultas</Text>
      </View>

      {/* ABAS VIRTUAIS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'proximas' && styles.activeTab]}
          onPress={() => setActiveTab('proximas')}
        >
          <Text style={[styles.tabText, activeTab === 'proximas' && styles.activeTabText]}>Próximas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'historico' && styles.activeTab]}
          onPress={() => setActiveTab('historico')}
        >
          <Text style={[styles.tabText, activeTab === 'historico' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE CONSULTAS */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>A carregar a sua agenda...</Text>
        </View>
      ) : (
        <FlatList
          data={consultasListadas}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderConsulta}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-clear-outline" size={60} color="#CCC" />
              <Text style={styles.emptyTitle}>Nenhuma consulta encontrada</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'proximas'
                  ? 'Você não tem consultas marcadas para os próximos dias.'
                  : 'O seu histórico de consultas está vazio.'}
              </Text>

              {activeTab === 'proximas' && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => navigation.navigate('SearchDoctorsScreen')}
                >
                  <Text style={styles.bookButtonText}>Agendar Nova Consulta</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },

  // Estilos das Abas
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },

  // Estilos da Lista
  listContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  medicoInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F4FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  medicoNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  medicoEspecialidade: { fontSize: 14, color: '#666', marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardBody: { flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  infoText: { marginLeft: 6, fontSize: 14, color: '#444', fontWeight: '500' },

  // Estilos da Receita / Observações
  receitaContainer: { marginTop: 16, backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E9ECEF' },
  receitaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  receitaTitle: { marginLeft: 6, fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  receitaText: { fontSize: 14, color: '#444', lineHeight: 20, fontStyle: 'italic' },

  // Estilos de Carregamento e Vazio
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  bookButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
