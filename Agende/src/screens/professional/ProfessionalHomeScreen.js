// ============================================
// TELA HOME DO PROFISSIONAL
// ============================================

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { consultaAPI } from '../../services/api';

export default function ProfessionalHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [ consultasReais, setConsultasReais] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    carregarConsultas();
  }, []);

  const carregarConsultas = async () => {
    try {
      console.log("DADOS DA MÉDICA LOGADA:", JSON.stringify(user, null, 2));

      console.log("Buscando consultas para a médica ID:", user.perfilId);

      const dados = await consultaAPI.listarPorProfissional(user.perfilId);

      // 1. O Raio-X definitivo: Vamos ver o que o Java realmente mandou!
      console.log("Resposta REAL do Java:", JSON.stringify(dados, null, 2));

      // 2. O Escudo Sênior: Se for um array direto, usamos. Se o Java mandou dentro de "content" (paginação), puxamos de lá. Se der erro, assumimos [] (vazio).
      const listaSegura = Array.isArray(dados) ? dados : (dados?.content || []);

      setConsultasReais(listaSegura);

    } catch (error) {
      console.log("Erro ao buscar consultas da médica:", error);
      // Se a API falhar, não quebra a tela, apenas mostra lista vazia
      setConsultasReais([]);
    } finally {
      setLoading(false);
    }
  };

  // 1. Dados Reais da Médica
  const professional = useMemo(() => {
    return {
      name: user?.nome || 'Profissional', // Puxa o nome real do Java!
      // Truque Ninja: Se ela tem consultas, puxamos a especialidade da primeira consulta. Se não, mostramos genérico.
      specialty: consultasReais?.length > 0 ? consultasReais[0].profissionalEspecialidade : 'Especialista',
      rating: 4.9, // Deixamos fixo até você criar a tabela de avaliações no futuro
    };
  }, [user, consultasReais]); // O React atualiza sozinho se o user ou as consultas mudarem!


  // 2. Matemática Real das Estatísticas
  const stats = useMemo(() => {
    // Se a lista estiver vazia ou a carregar, zera tudo
    if (!consultasReais || consultasReais.length === 0) {
      return { today: 0, week: 0, pending: 0, cancelled: 0 };
    }

    // Pega a data de hoje no formato YYYY-MM-DD (igual ao que o banco de dados usa)
    const hojeLocal = new Date();
    const hojeFormatado = hojeLocal.toISOString().split('T')[0];

    let todayCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    consultasReais.forEach(consulta => {
      // 1. Quantas são hoje?
      if (consulta.dataConsulta === hojeFormatado) todayCount++;

      // 2. Quantas estão agendadas para o futuro?
      if (consulta.status === 'AGENDADA' || consulta.status === 'PENDENTE') pendingCount++;

      // 3. Quantas foram canceladas?
      if (consulta.status === 'CANCELADA') cancelledCount++;
    });

    return {
      today: todayCount,
      week: consultasReais.length, // Consideramos o total da lista como as consultas da semana/mês
      pending: pendingCount,
      cancelled: cancelledCount,
    };
  }, [consultasReais]);

  // 3. Próximas Consultas (Resumo para a Home)
  const nextConsultas = useMemo(() => {
    if (!consultasReais) return [];

    // Filtra para mostrar apenas as consultas que ainda vão acontecer
    // e recorta (slice) para mostrar no máximo as 3 primeiras na tela Home!
    return consultasReais
      .filter(consulta => consulta.status === 'AGENDADA' || consulta.status === 'PENDENTE')
      .slice(0, 3);
  }, [consultasReais]);

  const statusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return '#34C759';
      case 'pendente':
        return '#FF9500';
      case 'cancelada':
        return '#FF3B30';
      default:
        return '#8E8E93';
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

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ProfessionalNotifications')}
        >
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
            <Ionicons name="stats-chart-outline" size={22} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.week}</Text>
            <Text style={styles.statLabel}>Semana</Text>
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
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfessionalAgenda')}>
            <Ionicons name="calendar" size={22} color="#007AFF" />
            <Text style={styles.actionText}>Agenda</Text>
          </TouchableOpacity>

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

        {/* Traz as consultas reais do profissional */}

        {loading ? (
           <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : nextConsultas?.length === 0 ? (
           <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Nenhuma consulta agendada para os próximos dias.</Text>
        ) : (
           nextConsultas?.map((consulta, index) => (
            <View key={consulta.id || index} style={styles.appointmentCard}>
              {/* ATENÇÃO AOS NOMES DAS VARIÁVEIS AQUI */}
              {/* Verifique se o Java devolve paciente.nome ou nomePaciente */}
              <Text style={styles.appointmentDetails}>
                📅 {consulta.dataConsulta} às ⏰ {consulta.horaConsulta} • {consulta.status}
              </Text>
            </View>

          ))
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  greeting: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#E8F4FF', marginTop: 4, fontSize: 13 },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute', top: 9, right: 10,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -28 },
  statCard: {
    width: '23.5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: { marginTop: 8, fontSize: 12, color: '#333', fontWeight: '600' },
  section: { marginTop: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  link: { color: '#007AFF', fontWeight: '600' },
  consultaCard: {
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
  consultaTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#007AFF',
    alignItems: 'center', justifyContent: 'center',
  },
  consultaInfo: { flex: 1, marginLeft: 12 },
  consultaName: { fontSize: 15, fontWeight: '600', color: '#333' },
  consultaMeta: { marginTop: 3, fontSize: 12, color: '#666' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
