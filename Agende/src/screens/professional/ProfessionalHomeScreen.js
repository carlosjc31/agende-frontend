// ============================================
// TELA HOME DO PROFISSIONAL
// ============================================

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfessionalHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [consultasReais, setConsultasReais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Atendimento
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [consultaAtual, setConsultaAtual] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [processando, setProcessando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [])
  );

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultas/profissional/${user.perfilId}`);
      const dados = response.data;
      const listaSegura = Array.isArray(dados) ? dados : (dados?.content || []);
      setConsultasReais(listaSegura);
    } catch (error) {
      console.log("Erro ao buscar consultas da médica:", error);
      setConsultasReais([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAtendimento = (consulta) => {
    setConsultaAtual(consulta);
    setObservacao('');
    setIsModalVisible(true);
  };

  const finalizarAtendimento = async () => {
    if (!consultaAtual) return;

    try {
      setProcessando(true);
      // Chama a rota PATCH enviando as observações via Query Params (igual definimos no Java)
      await api.patch(`/consultas/${consultaAtual.id}/marcar-realizada`, null, {
        params: { observacoes: observacao }
      });

      Alert.alert("Sucesso", "Atendimento finalizado com sucesso!");
      setIsModalVisible(false);
      carregarConsultas(); // Recarrega a tela para atualizar as estatísticas
    } catch (error) {
      console.log("Erro ao finalizar:", error);
      Alert.alert("Erro", "Não foi possível finalizar o atendimento.");
    } finally {
      setProcessando(false);
    }
  };

  // 1. Dados Reais da Médica
  const professional = useMemo(() => {
    return {
      name: user?.nome || 'Doutor(a)',
      specialty: consultasReais?.length > 0 && consultasReais[0].profissional?.especialidade
                  ? consultasReais[0].profissional.especialidade
                  : 'Especialista',
      rating: 4.9,
    };
  }, [user, consultasReais]);

  // 2. Matemática Real das Estatísticas
  const stats = useMemo(() => {
    if (!consultasReais || consultasReais.length === 0) {
      return { today: 0, week: 0, pending: 0, cancelled: 0, realized: 0 };
    }

    const hojeLocal = new Date();
    const hojeFormatado = hojeLocal.toISOString().split('T')[0];

    let todayCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;
    let realizedCount = 0;

    consultasReais.forEach(consulta => {
      if (consulta.dataConsulta === hojeFormatado) todayCount++;
      if (consulta.status === 'AGENDADA' || consulta.status === 'CONFIRMADA') pendingCount++;
      if (consulta.status === 'CANCELADA' || consulta.status === 'FALTOU') cancelledCount++;
      if (consulta.status === 'REALIZADA') realizedCount++;
    });

    return {
      today: todayCount,
      week: consultasReais.length,
      pending: pendingCount,
      cancelled: cancelledCount,
      realized: realizedCount
    };
  }, [consultasReais]);

  // Próximas Consultas (Filtra agendadas para o futuro próximo)
  const nextConsultas = useMemo(() => {
    if (!consultasReais) return [];
    return consultasReais
      .filter(c => c.status === 'AGENDADA' || c.status === 'CONFIRMADA')
      .slice(0, 3);
  }, [consultasReais]);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Olá, {professional.name}</Text>
          <Text style={styles.subtitle}>{professional.specialty} • {professional.rating} ★</Text>
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notificações')}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={22} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.today}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-circle-outline" size={22} color="#34C759" />
            <Text style={styles.statNumber}>{stats.realized}</Text>
            <Text style={styles.statLabel}>Realizadas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={22} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="close-circle-outline" size={22} color="#FF3B30" />
            <Text style={styles.statNumber}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Canceladas</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalConsultas')}>
            <Ionicons name="document-text-outline" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Consultas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalProfile')}>
            <Ionicons name="person-outline" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas consultas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProfessionalConsultas')}>
              <Text style={styles.link}>Ver todas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
           <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : nextConsultas?.length === 0 ? (
           <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Nenhuma consulta agendada para os próximos dias.</Text>
        ) : (
           nextConsultas?.map((consulta, index) => {
             const nomePaciente = consulta.paciente?.nomeCompleto || 'Paciente não identificado';
             const inicial = nomePaciente.charAt(0).toUpperCase();

             return (
              <View key={consulta.id || index} style={styles.consultaCard}>
                <View style={styles.consultaTop}>
                  <View style={styles.avatar}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{inicial}</Text>
                  </View>

                  <View style={styles.consultaInfo}>
                    <Text style={styles.consultaName}>{nomePaciente}</Text>
                    <Text style={styles.consultaMeta}>
                      📅 {formatarData(consulta.dataConsulta)} às {formatarHora(consulta.horaConsulta)}
                    </Text>
                  </View>

                  <View style={[styles.statusPill, { backgroundColor: statusColor(consulta.status) }]}>
                    <Text style={styles.statusText}>{consulta.status}</Text>
                  </View>
                </View>

                {/* BOTÃO DE ATENDER */}
                <TouchableOpacity
                  style={styles.atenderButton}
                  onPress={() => abrirModalAtendimento(consulta)}
                >
                  <Ionicons name="medkit" size={16} color="#007AFF" />
                  <Text style={styles.atenderButtonText}>Finalizar Atendimento</Text>
                </TouchableOpacity>
              </View>
             );
           })
        )}
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL DE ATENDIMENTO MÉDICO                */}
      {/* ========================================== */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Finalizar Consulta</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalPacienteText}>
              Paciente: <Text style={{fontWeight: 'bold'}}>{consultaAtual?.paciente?.nomeCompleto}</Text>
            </Text>

            <Text style={styles.label}>Receita ou Observações (Opcional):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Digite os sintomas, diagnóstico ou prescrição..."
              multiline
              textAlignVertical="top"
              value={observacao}
              onChangeText={setObservacao}
            />

            <TouchableOpacity
              style={[styles.saveButton, processando && { opacity: 0.7 }]}
              onPress={finalizarAtendimento}
              disabled={processando}
            >
              {processando ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Concluir Atendimento</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flex: 1, paddingRight: 12 },
  greeting: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#E8F4FF', marginTop: 4, fontSize: 13 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  badgeDot: { position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -28 },
  statCard: { width: '23.5%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  actionButton: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginHorizontal: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  actionText: { marginTop: 8, fontSize: 12, color: '#333', fontWeight: '600' },
  section: { marginTop: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  link: { color: '#007AFF', fontWeight: '600' },
  consultaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  consultaTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  consultaInfo: { flex: 1, marginLeft: 12 },
  consultaName: { fontSize: 15, fontWeight: '600', color: '#333' },
  consultaMeta: { marginTop: 3, fontSize: 12, color: '#666' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },

  // ESTILOS NOVOS DO BOTÃO DE ATENDER E DO MODAL
  atenderButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  atenderButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalPacienteText: { fontSize: 16, color: '#444', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  textArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 16, fontSize: 16, height: 120, marginBottom: 24 },
  saveButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
