// ============================================
// TELA DE AGENDA DO PROFISSIONAL
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { profissionalAPI } from '../../services/api';

export default function ProfessionalAgendaScreen({ navigation }) {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const diasSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda-feira' },
    { id: 2, nome: 'Terça-feira' },
    { id: 3, nome: 'Quarta-feira' },
    { id: 4, nome: 'Quinta-feira' },
    { id: 5, nome: 'Sexta-feira' },
    { id: 6, nome: 'Sábado' },
  ];

  useEffect(() => {
    loadHorarios();
  }, []);

  const loadHorarios = async () => {
    setLoading(true);
    try {
      const response = await profissionalAPI.listarHorarios(user.perfilId);
      setHorarios(response);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar horários');
    } finally {
      setLoading(false);
    }
  };

  const toggleHorario = async (horarioId, ativo) => {
    try {
      await profissionalAPI.atualizarHorario(horarioId, { ativo: !ativo });
      loadHorarios();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar horário');
    }
  };

  const addHorario = () => {
    Alert.alert(
      'Adicionar Horário',
      'Esta funcionalidade permite configurar seus horários de atendimento',
      [{ text: 'OK' }]
    );
  };

  const getHorariosPorDia = (diaId) => {
    return horarios.filter(h => h.diaSemana === diaId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Agenda</Text>
        <TouchableOpacity onPress={addHorario}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Configure seus horários de atendimento. Os pacientes só poderão agendar
            nos horários marcados como disponíveis.
          </Text>
        </View>

        {diasSemana.map((dia) => {
          const horariosDia = getHorariosPorDia(dia.id);

          return (
            <View key={dia.id} style={styles.diaCard}>
              <View style={styles.diaHeader}>
                <Text style={styles.diaNome}>{dia.nome}</Text>
                {horariosDia.length > 0 && (
                  <Text style={styles.diaCount}>
                    {horariosDia.filter(h => h.ativo).length} horário(s) ativo(s)
                  </Text>
                )}
              </View>

              {horariosDia.length === 0 ? (
                <View style={styles.emptyDia}>
                  <Text style={styles.emptyText}>Nenhum horário configurado</Text>
                  <TouchableOpacity style={styles.addButton} onPress={addHorario}>
                    <Ionicons name="add" size={20} color="#007AFF" />
                    <Text style={styles.addButtonText}>Adicionar Horário</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                horariosDia.map((horario) => (
                  <View key={horario.id} style={styles.horarioItem}>
                    <View style={styles.horarioInfo}>
                      <Ionicons name="time-outline" size={20} color="#666" />
                      <Text style={styles.horarioText}>
                        {horario.horaInicio} - {horario.horaFim}
                      </Text>
                    </View>
                    <Switch
                      value={horario.ativo}
                      onValueChange={() => toggleHorario(horario.id, horario.ativo)}
                      trackColor={{ false: '#ccc', true: '#007AFF' }}
                      thumbColor={horario.ativo ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                ))
              )}
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  diaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  diaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  diaCount: {
    fontSize: 12,
    color: '#34C759',
  },
  emptyDia: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  horarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horarioText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  bottomPadding: {
    height: 20,
  },
});