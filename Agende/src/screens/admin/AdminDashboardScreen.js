// ============================================
// TELA DASHBOARD DO ADMINISTRADOR
// ============================================

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function AdminDashboardScreen({ navigation }) {
  const { signOut } = useAuth();
  // Funcionalidades de Perfil
  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da área administrativa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => await signOut() },
    ]);
  };

  // Dentro de AdminDashboardScreen
  const [stats, setStats] = useState({
    consultasHoje: 0,
    pendentes: 0,
    totalPacientes: 0,
    totalProfissionais: 0,
  });


  const carregarDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.log("Erro ao carregar dashboard admin:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDashboard();
    }, [])
  );

  const cards = [
    { id: 'v', title: 'Validar profissionais', subtitle: 'Cadastros pendentes', icon: 'shield-checkmark-outline', color: '#007AFF', go: 'ValidarProfissional' },
    { id: 'p', title: 'Gerenciar pacientes', subtitle: 'Lista e ações', icon: 'people-outline', color: '#34C759', go: 'GerenciarPacientes' },
    { id: 'pr', title: 'Gerenciar profissionais', subtitle: 'Lista e ações', icon: 'medkit-outline', color: '#FF9500', go: 'GerenciarProfissionais' },
    { id: 'c', title: 'Consultas do dia', subtitle: 'Acompanhar agenda', icon: 'calendar-outline', color: '#AF52DE', go: 'ConsultasDia' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Admin</Text>
        <Text style={styles.subtitle}>Painel de controle</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.kpis}>
          <View style={styles.kpiCard}>
            <Ionicons name="alert-circle-outline" size={22} color="#FF3B30" />
            <Text style={styles.kpiNumber}>{stats.pendentes}</Text>
            <Text style={styles.kpiLabel}>Pendentes</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="people-outline" size={22} color="#007AFF" />
            <Text style={styles.kpiNumber}>{stats.totalPacientes}</Text>
            <Text style={styles.kpiLabel}>Pacientes</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="medkit-outline" size={22} color="#34C759" />
            <Text style={styles.kpiNumber}>{stats.profissionais}</Text>
            <Text style={styles.kpiLabel}>Profissionais</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="calendar-outline" size={22} color="#AF52DE" />
            <Text style={styles.kpiNumber}>{stats.consultasHoje}</Text>
            <Text style={styles.kpiLabel}>Hoje</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          {cards.map((c) => (
            <TouchableOpacity key={c.id} style={styles.card} onPress={() => navigation.navigate(c.go)}>
              <View style={[styles.iconWrap, { backgroundColor: '#F0F8FF' }]}>
                <Ionicons name={c.icon} size={22} color={c.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSub}>{c.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sair do Painel Admin</Text>
        </TouchableOpacity>

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
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  kpis: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  kpiCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiNumber: { marginTop: 8, fontSize: 20, fontWeight: '800', color: '#333' },
  kpiLabel: { marginTop: 4, fontSize: 12, color: '#666', fontWeight: '700' },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#333' },
  cardSub: { marginTop: 4, color: '#666', fontSize: 12 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: '800',
    marginLeft: 8,
    fontSize: 15,
  },
});
