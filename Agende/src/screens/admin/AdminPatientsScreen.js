import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function AdminPatientsScreen() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes');
      setPacientes(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Filtro de busca em tempo real
  const filteredPatients = pacientes.filter(p =>
    p.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search)
  );

  const renderPaciente = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nomeCompleto.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.nomeCompleto}</Text>
        <Text style={styles.details}>📧 {item.usuario.email}</Text>
        <Text style={styles.details}>🆔 CPF: {item.cpf}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert("Opções", "Deseja editar ou excluir?")}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Buscar por nome ou CPF..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id}
          renderItem={renderPaciente}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum paciente encontrado.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  searchBar: { flexDirection: 'row', backgroundColor: '#fff', margin: 20, padding: 12, borderRadius: 10, alignItems: 'center', elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 1 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E8F4FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#007AFF', fontWeight: 'bold', fontSize: 18 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  details: { fontSize: 13, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});
