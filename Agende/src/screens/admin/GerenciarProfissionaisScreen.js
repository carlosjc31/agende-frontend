import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Switch, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function AdminProfessionalsScreen({ navigation }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profissionais');
      setMedicos(response.data);
    } catch (error) { console.log(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const filtrados = medicos.filter(m =>
    m.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) || m.crm.includes(busca)
  );

  const renderMedico = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.medicoInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nomeCompleto.charAt(0)}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.medicoNome}>Dr(a). {item.nomeCompleto}</Text>
          <Text style={styles.medicoSub}>{item.especialidade} • CRM {item.crm}</Text>
        </View>
      </View>

      <View style={styles.actionArea}>
        <Text style={[styles.statusLabel, { color: item.ativo ? '#34C759' : '#FF3B30' }]}>
          {item.ativo ? 'ATIVO' : 'BLOQUEADO'}
        </Text>
        <Switch
          value={item.ativo}
          onValueChange={() => {/* lógica de alternar status */}}
          trackColor={{ false: "#767577", true: "#34C759" }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER PADRONIZADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Profissionais</Text>
        <TouchableOpacity onPress={carregar}>
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* BARRA DE BUSCA PADRONIZADA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou CRM..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filtrados}
          renderItem={renderMedico}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EEE'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: 15, paddingHorizontal: 15, borderRadius: 10, height: 45,
    borderWidth: 1, borderColor: '#EEE'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3
  },
  medicoInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F0F8FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 12
  },
  avatarText: { color: '#007AFF', fontWeight: 'bold', fontSize: 18 },
  details: { flex: 1 },
  medicoNome: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  medicoSub: { fontSize: 12, color: '#666', marginTop: 2 },
  actionArea: { alignItems: 'center', marginLeft: 10 },
  statusLabel: { fontSize: 9, fontWeight: 'bold', marginBottom: 2 }
});
