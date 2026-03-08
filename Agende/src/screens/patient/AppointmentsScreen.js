// screens/AppointmentsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('proximas');

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dra. Maria Santos',
      specialty: 'Cardiologista',
      date: '02 Nov 2025',
      time: '14:30',
      type: 'presencial',
      location: 'Hospital São Lucas - Sala 305',
      status: 'confirmada',
    },
    {
      id: 2,
      doctor: 'Dr. Carlos Lima',
      specialty: 'Ortopedista',
      date: '05 Nov 2025',
      time: '10:00',
      type: 'online',
      status: 'pendente',
    },
    {
      id: 3,
      doctor: 'Dra. Ana Costa',
      specialty: 'Dermatologista',
      date: '08 Nov 2025',
      time: '16:00',
      type: 'presencial',
      location: 'Clínica Beleza & Saúde',
      status: 'confirmada',
    },
  ];

  const pastAppointments = [
    {
      id: 4,
      doctor: 'Dr. Pedro Alves',
      specialty: 'Pediatra',
      date: '20 Out 2025',
      time: '15:00',
      type: 'presencial',
      status: 'concluida',
      canReview: true,
    },
    {
      id: 5,
      doctor: 'Dra. Maria Santos',
      specialty: 'Cardiologista',
      date: '15 Set 2025',
      time: '14:30',
      type: 'online',
      status: 'concluida',
      reviewed: true,
    },
    {
      id: 6,
      doctor: 'Dr. João Mendes',
      specialty: 'Clínico Geral',
      date: '10 Set 2025',
      time: '09:00',
      type: 'presencial',
      status: 'cancelada',
    },
  ];

  const handleCancelAppointment = (appointment) => {
    Alert.alert(
      'Cancelar Consulta',
      `Deseja realmente cancelar a consulta com ${appointment.doctor}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sucesso', 'Consulta cancelada com sucesso');
          },
        },
      ]
    );
  };

  const handleReschedule = (appointment) => {
    navigation.navigate('Appointment', {
      doctor: {
        name: appointment.doctor,
        specialty: appointment.specialty
      }
    });
  };

  const handleJoinCall = (appointment) => {
    Alert.alert(
      'Telemedicina',
      'A videochamada será iniciada. Certifique-se de estar em um local adequado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar Chamada',
          onPress: () => {
            // Aqui iniciaria a videochamada
            console.log('Iniciando videochamada...');
          },
        },
      ]
    );
  };

  const handleReview = (appointment) => {
    Alert.alert(
      'Avaliar Consulta',
      `Avalie sua consulta com ${appointment.doctor}`,
      [
        { text: 'Agora não', style: 'cancel' },
        {
          text: 'Avaliar',
          onPress: () => {
            // Navegar para tela de avaliação
            console.log('Abrir tela de avaliação');
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return '#34C759';
      case 'pendente':
        return '#FF9500';
      case 'concluida':
        return '#007AFF';
      case 'cancelada':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendente':
        return 'Pendente';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const renderAppointmentCard = (appointment, isPast = false) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{appointment.doctor}</Text>
            <Text style={styles.specialty}>{appointment.specialty}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
        </View>
      </View>

      <View style={styles.appointmentInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{appointment.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{appointment.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name={appointment.type === 'online' ? 'videocam-outline' : 'business-outline'}
            size={18}
            color="#666"
          />
          <Text style={styles.infoText}>
            {appointment.type === 'online' ? 'Telemedicina' : 'Presencial'}
          </Text>
        </View>
        {appointment.location && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{appointment.location}</Text>
          </View>
        )}
      </View>

      {!isPast && (
        <View style={styles.cardActions}>
          {appointment.type === 'online' && appointment.status === 'confirmada' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.joinButton]}
              onPress={() => handleJoinCall(appointment)}
            >
              <Ionicons name="videocam" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Entrar na Chamada</Text>
            </TouchableOpacity>
          )}

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleReschedule(appointment)}
            >
              <Ionicons name="calendar-outline" size={18} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleCancelAppointment(appointment)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#FF3B30" />
              <Text style={[styles.secondaryButtonText, { color: '#FF3B30' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isPast && appointment.canReview && !appointment.reviewed && (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => handleReview(appointment)}
        >
          <Ionicons name="star-outline" size={18} color="#007AFF" />
          <Text style={styles.reviewButtonText}>Avaliar Consulta</Text>
        </TouchableOpacity>
      )}

      {isPast && appointment.reviewed && (
        <View style={styles.reviewedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={styles.reviewedText}>Consulta avaliada</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Consultas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'proximas' && styles.tabActive]}
          onPress={() => setActiveTab('proximas')}
        >
          <Text style={[styles.tabText, activeTab === 'proximas' && styles.tabTextActive]}>
            Próximas ({upcomingAppointments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'historico' && styles.tabActive]}
          onPress={() => setActiveTab('historico')}
        >
          <Text style={[styles.tabText, activeTab === 'historico' && styles.tabTextActive]}>
            Histórico ({pastAppointments.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'proximas' && upcomingAppointments.length > 0 && (
          <>
            {upcomingAppointments.map((appointment) =>
              renderAppointmentCard(appointment, false)
            )}
          </>
        )}

        {activeTab === 'proximas' && upcomingAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhuma consulta agendada</Text>
            <Text style={styles.emptyText}>
              Que tal agendar uma consulta com um especialista?
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.emptyButtonText}>Buscar Médicos</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'historico' && pastAppointments.length > 0 && (
          <>
            {pastAppointments.map((appointment) =>
              renderAppointmentCard(appointment, true)
            )}
          </>
        )}

        {activeTab === 'historico' && pastAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum histórico</Text>
            <Text style={styles.emptyText}>
              Suas consultas anteriores aparecerão aqui
            </Text>
          </View>
        )}
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
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  appointmentInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  reviewButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  reviewedText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#34C759',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
