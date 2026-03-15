// screens/SearchDoctorsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importando a nossa API
import { profissionalAPI } from '../../services/api';

export default function SearchDoctorsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  // Nossos novos estados dinâmicos
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const specialties = ['Todas', 'Cardiologia', 'Pediatria', 'Ortopedia', 'Dermatologia'];
  const filters = ['Todos', 'Maior Avaliação', 'Mais Próximo', 'Menor Preço'];

  // Busca os dados no momento em que a tela abre
  useEffect(() => {
    carregarProfissionais();
  }, []);

const carregarProfissionais = async () => {
    try {
      setLoading(true);

      // RASTREADOR 1: Garante que a função iniciou
      console.log("1. A iniciar a busca de médicos no IP da API...");

      const data = await profissionalAPI.listarTodos();

      // RASTREADOR 2: Garante que o Java respondeu
      console.log("2. O Java respondeu! Dados recebidos:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setDoctors(data);
      } else if (data && Array.isArray(data.content)) {
        setDoctors(data.content);
      } else if (data && Array.isArray(data.data)) {
        setDoctors(data.data);
      } else {
        setDoctors([]);
      }

    } catch (error) {
      // RASTREADOR 3: Mostra se a chamada falhou (ex: Timeout ou Network Error)
      console.log("3. Erro na ligação com o Java:", error.message);
      Alert.alert('Aviso', 'Não foi possível ligar ao servidor.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // CAMADA DE SEGURANÇA 2: Garante que doctors é sempre uma lista antes de filtrar
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const filteredDoctors = safeDoctors.filter(doctor => {
    const nome = doctor.nomeCompleto || doctor.nome || '';
    const especialidade = doctor.especialidade || '';

    const matchesSearch = nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         especialidade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'Todas' ||
                             especialidade === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Médicos</Text>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou especialidade"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filtro de Especialidades */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.filterChip,
                selectedSpecialty === specialty && styles.filterChipActive
              ]}
              onPress={() => setSelectedSpecialty(specialty)}
            >
              <Text style={[
                styles.filterChipText,
                selectedSpecialty === specialty && styles.filterChipTextActive
              ]}>
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filtros Adicionais (Mantidos intactos do seu design original!) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Ionicons
                name="funnel-outline"
                size={14}
                color={selectedFilter === filter ? '#007AFF' : '#666'}
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Médicos */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            {filteredDoctors.length} médico(s) encontrado(s)
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
          ) : (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorCard}
                // Agora envia o ID real do banco (UUID) para a tela de Perfil do Médico
                onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
              >
                <Image
                  source={{ uri: doctor.fotoUrl || 'https://via.placeholder.com/100' }}
                  style={styles.doctorImage}
                />
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorHeader}>
                    <Text style={styles.doctorName}>{doctor.nomeCompleto || doctor.nome}</Text>

                    {/* Alterado de "available" para "validado" do seu PostgreSQL */}
                    {doctor.validado && (
                      <View style={styles.availableBadge}>
                        <Text style={styles.availableText}>Disponível</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.doctorSpecialty}>{doctor.especialidade}</Text>
                  <Text style={styles.doctorHospital}>{doctor.hospitalClinica || 'Atendimento Particular'}</Text>

                  <View style={styles.doctorDetails}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.rating}>{doctor.avaliacaoMedia || '0.0'}</Text>
                      <Text style={styles.reviews}>({doctor.totalAvaliacoes || 0} avaliações)</Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        {/* Usamos a cidade do banco como "distância" temporária */}
                        <Text style={styles.detailText}>{doctor.cidade || 'Local'}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={14} color="#666" />
                        <Text style={styles.detailText}>
                          {doctor.valorConsulta ? `R$ ${doctor.valorConsulta}` : 'Sob Consulta'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  filtersScroll: {
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#007AFF',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  doctorHospital: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  doctorDetails: {
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 12,
    color: '#999',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
});
