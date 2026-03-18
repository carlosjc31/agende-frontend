import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AppointmentsScreen({ navigation }) {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controle do modal de avaliação
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Controle das abas: 'proximas' ou 'historico'
  const [activeTab, setActiveTab] = useState('proximas');

  // --- CARREGAMENTO DE DADOS ---
  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultas/paciente/${user.perfilId}`);
      const dados = response.data;
      const listaSegura = Array.isArray(dados) ? dados : (dados?.content || []);

      listaSegura.sort((a, b) => new Date(b.dataConsulta) - new Date(a.dataConsulta));
      setConsultas(listaSegura);
    } catch (error) {
      console.log("Erro ao buscar consultas do paciente:", error);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [])
  );

  // --- FUNÇÕES DE AVALIAÇÃO ---
  const abrirModalAvaliacao = (consulta) => {
    setSelectedConsulta(consulta);
    setNota(5);
    setComentario('');
    setModalVisible(true);
  };

  const enviarAvaliacao = async () => {
    if (enviando) return;

    try {
      setEnviando(true);
      await api.post(`/avaliacoes/paciente/${user.perfilId}`, {
        consultaId: selectedConsulta.id,
        nota: nota,
        comentario: comentario
      });

      Alert.alert("Sucesso", "Avaliação enviada com sucesso!");
      setModalVisible(false);
      carregarConsultas();

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar sua avaliação.");
    } finally {
      setEnviando(false);
    }
  };

  // --- AUXILIARES E FILTROS ---
  const consultasListadas = useMemo(() => {
    if (activeTab === 'proximas') {
      return consultas.filter(c => ['AGENDADA', 'CONFIRMADA', 'PENDENTE'].includes(c.status));
    } else {
      return consultas.filter(c => ['REALIZADA', 'CANCELADA', 'FALTOU'].includes(c.status));
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

  // --- RENDERIZAÇÃO DE ITENS ---
  const renderConsulta = ({ item }) => {
    const nomeMedico = item.profissionalNome || 'Médico não identificado';
    const especialidade = item.profissionalEspecialidade || 'Especialista';
    const inicial = nomeMedico.charAt(0).toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.medicoInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{inicial}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
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

        {item.status === 'REALIZADA' && item.observacoes && (
          <View style={styles.receitaContainer}>
            <View style={styles.receitaHeader}>
              <Ionicons name="document-text" size={16} color="#007AFF" />
              <Text style={styles.receitaTitle}>Prescrição / Observações</Text>
            </View>
            <Text style={styles.receitaText}>{item.observacoes}</Text>
          </View>
        )}

        {item.status === 'REALIZADA' && (
          <TouchableOpacity
            style={styles.btnAvaliarAcao}
            onPress={() => abrirModalAvaliacao(item)}
          >
            <Text style={styles.btnAvaliarText}>Avaliar Atendimento</Text>
          </TouchableOpacity>
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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregar a sua agenda...</Text>
        </View>
      ) : (
        <FlatList
          data={consultasListadas}
          keyExtractor={(item) => item.id.toString()}
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
                  onPress={() => navigation.navigate('Search')}
                >
                  <Text style={styles.bookButtonText}>Agendar Nova Consulta</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* MODAL DE AVALIAÇÃO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Como foi seu atendimento?</Text>
            <Text style={styles.modalSubtitle}>Sua opinião ajuda outros pacientes.</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity key={num} onPress={() => setNota(num)}>
                  <Ionicons
                    name={num <= nota ? "star" : "star-outline"}
                    size={42}
                    color={num <= nota ? "#FFD700" : "#CCC"}
                    style={{ marginHorizontal: 5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.inputComentario}
              placeholder="Escreva um breve comentário sobre o atendimento..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
              value={comentario}
              onChangeText={setComentario}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnTextCancelar}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnConfirmar, enviando && { opacity: 0.7 }]}
                onPress={enviarAvaliacao}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnTextConfirmar}>Avaliar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
  listContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  medicoInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F4FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  medicoNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  medicoEspecialidade: { fontSize: 14, color: '#666', marginTop: 2 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', minWidth: 80, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  cardBody: { flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  infoText: { marginLeft: 6, fontSize: 14, color: '#444', fontWeight: '500' },
  receitaContainer: { marginTop: 16, backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E9ECEF' },
  receitaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  receitaTitle: { marginLeft: 6, fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  receitaText: { fontSize: 14, color: '#444', lineHeight: 20, fontStyle: 'italic' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 24 },
  bookButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  starsContainer: { flexDirection: 'row', marginBottom: 25 },
  inputComentario: { width: '100%', height: 120, backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E0E0E0', color: '#333', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btnCancelar: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  btnConfirmar: { flex: 2, backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginLeft: 10 },
  btnTextCancelar: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 },
  btnTextConfirmar: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnAvaliarAcao: { marginTop: 15, backgroundColor: '#E8F4FF', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#007AFF' },
  btnAvaliarText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14 },
});
