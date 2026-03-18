import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function ConsultasDiaAdminScreen({ navigation }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Carregar as consultas de hoje
  const carregarConsultasHoje = async () => {
    try {
      setLoading(true);
      // Rota que retorna as consultas do dia (hoje)
      const response = await api.get('/consultas/admin/consultas/hoje');
      setConsultas(response.data);
    } catch (error) {
      console.log("Erro ao carregar consultas do dia:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConsultasHoje();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return '#34C759';
      case 'AGENDADA': return '#FF9500';
      case 'CANCELADA': return '#FF3B30';
      case 'REALIZADA': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  // 2. O componente que será repetido para cada consulta
  const renderConsulta = ({ item }) => (
    <View style={styles.adminAppointmentCard}>
      <View style={styles.timeTag}>
        <Text style={styles.timeText}>{item.horaConsulta?.substring(0, 5)}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.patientName}>👤 Paciente: {item.pacienteNome}</Text>
        <Text style={styles.doctorName}>🩺 Médico: {item.profissionalNome}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Consultas do dia</Text>
        <TouchableOpacity onPress={carregarConsultasHoje}>
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConsulta}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma consulta realizada hoje.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 20 },
  adminAppointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timeTag: {
    backgroundColor: '#F0F8FF',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 55
  },
  timeText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14 },
  details: { flex: 1 },
  patientName: { fontSize: 14, fontWeight: '600', color: '#333' },
  doctorName: { fontSize: 13, color: '#666', marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});
