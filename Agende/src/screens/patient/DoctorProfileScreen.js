// src/screens/patient/DoctorProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profissionalAPI } from '../../services/api';

export default function DoctorProfileScreen({ route, navigation }) {

  const { doctorId } = route.params;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhesDoMedico();
  }, [doctorId]);
  // Função para carregar os detalhes do profissional
  const carregarDetalhesDoMedico = async () => {
    try {
      const data = await profissionalAPI.buscarPorId(doctorId);
      setDoctor(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados deste profissional.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>A carregar perfil...</Text>
      </View>
    );
  }

  if (!doctor) return null;

  // Dados para agendamento
  const doctorDataForAppointment = {
    id: doctor.id,
    name: doctor.nomeCompleto || doctor.nome,
    specialty: doctor.especialidade,
    rating: doctor.avaliacaoMedia || '5.0',
    price: doctor.valorConsulta ? `R$ ${doctor.valorConsulta}` : 'Sob Consulta',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Médico</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Cartão Principal do Médico */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: doctor.fotoUrl || 'https://via.placeholder.com/150' }}
            style={styles.doctorImage}
          />
          <Text style={styles.doctorName}>{doctor.nomeCompleto || doctor.nome}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.especialidade}</Text>
          <Text style={styles.doctorCrm}>{doctor.crm}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.statValue}>{doctor.avaliacaoMedia || '5.0'}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={20} color="#007AFF" />
              <Text style={styles.statValue}>{doctor.anosExperiencia || '0'} anos</Text>
              <Text style={styles.statLabel}>Experiência</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="cash" size={20} color="#34C759" />
              <Text style={styles.statValue}>{doctor.valorConsulta ? `R$ ${doctor.valorConsulta}` : '--'}</Text>
              <Text style={styles.statLabel}>Consulta</Text>
            </View>
          </View>
        </View>

        {/* Sobre o Médico (Vindo do Banco!) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Doutor(a)</Text>
          <Text style={styles.bioText}>
            {doctor.bio || 'Nenhuma biografia informada por este profissional.'}
          </Text>
        </View>

        {/* Local de Atendimento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local de Atendimento</Text>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{doctor.hospitalClinica || 'Clínica Particular'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{doctor.endereco || 'Endereço não informado'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão Fixo de Agendar no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          // Envia o objeto formatado para a tela de Agendamento
          onPress={() => navigation.navigate('Appointment', { doctor: doctorDataForAppointment })}
        >
          <Text style={styles.bookButtonText}>Agendar Consulta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollView: { flex: 1 },
  profileCard: { backgroundColor: '#fff', alignItems: 'center', padding: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, marginBottom: 16 },
  doctorImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, backgroundColor: '#e0e0e0' },
  doctorName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center' },
  doctorSpecialty: { fontSize: 16, color: '#007AFF', marginBottom: 4 },
  doctorCrm: { fontSize: 14, color: '#999', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  statDivider: { width: 1, height: '100%', backgroundColor: '#f0f0f0' },
  section: { backgroundColor: '#fff', padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  bioText: { fontSize: 15, color: '#666', lineHeight: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { marginLeft: 12, fontSize: 15, color: '#666', flex: 1 },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  bookButton: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
