import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminPatientsScreen({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // 1. Carregar os pacientes da API
  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes'); // Certifique-se que esta rota existe no Java
      const listaSegura = Array.isArray(response.data) ? response.data : (response.data?.content || []);

      // Ordena por nome
      listaSegura.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

      setPacientes(listaSegura);
    } catch (error) {
      console.log("Erro ao buscar pacientes:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPacientes();
    }, [])
  );

  // 2. Lógica de Busca (Filtro)
  const filtrados = pacientes.filter(p =>
    p.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  );

  // 3. Renderização de cada Card (Padronizado)
  const renderPaciente = ({ item }) => {
    const inicial = item.nomeCompleto.charAt(0).toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.pacienteInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.pacienteNome}>{item.nomeCompleto}</Text>
            <Text style={styles.pacienteSub}>🆔 CPF: {item.cpf}</Text>
            <Text style={styles.pacienteSub}>📧 {item.usuario?.email || 'Sem e-mail'}</Text>
          </View>
        </View>

        {/* Ação: Ver detalhes (opcional) */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert("Detalhes", `Telefone: ${item.telefone || 'Não informado'}`)}
        >
          <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER PADRONIZADO (Igual ao de Profissionais) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Pacientes</Text>
        <TouchableOpacity onPress={carregarPacientes}>
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* BARRA DE BUSCA PADRONIZADA (Igual ao de Profissionais) */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou CPF..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
          keyboardType="default"
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando pacientes...</Text>
        </View>
      ) : (
        <FlatList
          data={filtrados}
          renderItem={renderPaciente}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCenter}>
              <Ionicons name="people-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>
                {busca.length > 0 ? "Nenhum paciente corresponde à busca." : "Nenhum paciente cadastrado."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ESTILOS PADRONIZADOS (Reutilizando a estética de Profissionais)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 48,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3, // Sombra um pouco maior para destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  pacienteInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 48, // Aumentei um pouquinho para destacar
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F4FF', // Tom de azul claro para pacientes
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  avatarText: { color: '#007AFF', fontWeight: 'bold', fontSize: 20 },
  details: { flex: 1 },
  pacienteNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  pacienteSub: { fontSize: 13, color: '#666', marginTop: 3 },
  actionButton: { padding: 5, marginLeft: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 15, color: '#999', fontSize: 15, textAlign: 'center', paddingHorizontal: 40 }
});
