// ============================================
// TELA DE AGENDA DO PROFISSIONAL
// ============================================

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AgendaScreen() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState('Hoje');
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(() => ['Hoje', 'Amanhã', 'Proximas'], []);
  // CARREGAMENTO DE DADOS DA AGENDA
  const carregarAgenda = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultas/profissional/${user.perfilId}`);
      const dados = response.data;
      setConsultas(Array.isArray(dados) ? dados : (dados?.content || []));
    } catch (error) {
      console.log("Erro ao buscar consultas do profissional:", error);
      Alert.alert('Erro', 'Nao foi possivel carregar as consultas.');
    } finally {
      setLoading(false);
    }
  };
  // Atualiza a agenda ao entrar na tela
  useFocusEffect(
    useCallback(() => {
      carregarAgenda();
    }, [])
  );
  // Processa os dados da agenda
  const slotsProcessados = useMemo(() => {
    const grupos = {
      'Hoje': [],
      'Amanhã': [],
      'Proximas': [],
    };

    // Função auxiliar para evitar bugs de fuso horário (formato YYYY-MM-DD)
    const formatarData = (d) => {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
    };

    // Formatando as datas
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    // Dia seguinte
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    // Proxima semana
    const hojeStr = formatarData(hoje);
    const amanhaStr = formatarData(amanha);


    // Processando as consultas
    consultas.forEach(consuta => {
      if (!consuta.dataConsulta) return;
      // Formatando a data
      const data = consuta.dataConsulta;
      // Formatando o horário
      const slotFormatado = {
        id: consuta.id,
        time: consuta.horaConsulta ? consuta.horaConsulta.substring(0, 5) : '--:--',
        status: consuta.status,
        paciente: consuta.pacienteNome || 'Paciente não encontrado',
        dataExibicao: consuta.dataConsulta.split('-').reverse().join('/'),
      };
      // Agrupando as consultas
      if (data === hojeStr){
        grupos['Hoje'].push(slotFormatado);
      }else if (data === amanhaStr) {
        grupos['Amanhã'].push(slotFormatado);
      } else if (data > amanhaStr) {
        grupos['Proximas'].push(slotFormatado);
      }
    });
    grupos['Hoje'].sort((a, b) => a.time.localeCompare(b.time));
    grupos['Amanhã'].sort((a, b) => a.time.localeCompare(b.time));

    grupos['Proximas'].sort((a, b) => {
      const dataA = a.dataExibicao.split('/').reverse().join('-');
      const dataB = b.dataExibicao.split('/').reverse().join('-');
      if (dataA === dataB) {
        return a.time.localeCompare(b.time);
      }
      return dataA.localeCompare(dataB);
    })

    return grupos;
  }, [consultas]
);
  // Cores dos status
  const color = (status) => {
    switch (status) {
      case 'AGENDADA':
        return '#007AFF';
      case 'CONFIRMADA':
        return '#34C759';
      case 'CANCELADA':
      case 'FALTOU':
        return '#FF3B30';
      case 'REALIZADA':
        return '#8E8E93';
      default:
        return '#FF9500';
    }
  };
  // Função para alternar o status da consulta
  const acaoConsulta = (slot) => {
    Alert.alert(
      'Detalhes da Consulta',
      `Paciente: ${slot.paciente}\nHorário: ${slot.time}\nStatus: ${slot.status}`,
      [{ text: 'Fechar', style: 'cancel' }]
    )
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#95E1D3" />

      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
        <Text style={styles.subtitle}>Acompanhe seus próximos atendimentos</Text>
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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: '#666' }}>Carregando agenda...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {slotsProcessados[selectedDay].length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-clear-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>Nenhuma consulta para este período.</Text>
            </View>
          ) : (
            slotsProcessados[selectedDay].map((slot) => (
              <TouchableOpacity key={slot.id} style={styles.slotCard} onPress={() => acaoConsulta(slot)}>
                <View style={styles.slotLeft}>
                  <Ionicons name="time-outline" size={24} color="#007AFF" />
                  <View style={{ marginLeft: 12 }}>
                    {selectedDay === 'Proximas' && (<Text style={{ fontSize: 12, color: '#007AFF', fontWeight: 'bold', marginBottom: 2 }}>{slot.dataExibicao}</Text>)}
                    <Text style={styles.slotTime}>{slot.time}</Text>
                    <Text style={styles.slotPaciente} numberOfLines={1}>{slot.paciente}</Text>
                  </View>
                </View>

                <View style={[styles.statusPill, { backgroundColor: color(slot.status) }]}>
                  <Text style={styles.statusText}>{slot.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#95E1D3',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 25, fontWeight: 'bold', color: '#333' },
  subtitle: { marginTop: 5, color: '#666',  },
  daysScroll: { backgroundColor: '#fff', flexGrow: 0 },
  daysContent: { paddingHorizontal: 10, paddingVertical: 10 },
  dayChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  dayChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dayChipText: { color: '#943131', fontWeight: '700' },
  dayChipTextActive: { color: '#fff' },
  scroll: { flex: 1, marginTop: 10 },
  scrollContent: { padding: 15, paddingBottom: 30 },
  slotCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  slotLeft: { flexDirection: 'row', alignItems: 'center' },
  slotTime: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: '#333' },
  statusPill: { paddingHorizontal: 20, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
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
