// screens/BookAppointmentScreen.js
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

export default function AppointmentScreen({ navigation, route }) {
  const { doctor } = route.params;
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState('presencial');

  // Próximos 7 dias disponíveis
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Pula fins de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          day: date.getDate(),
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          weekDay: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          fullDate: date,
        });
      }
    }
    return dates;
  };

  const dates = generateDates();

  const timeSlots = {
    morning: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
    afternoon: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Por favor, selecione uma data e horário');
      return;
    }

    Alert.alert(
      'Confirmar Agendamento',
      `Deseja agendar consulta ${appointmentType} com ${doctor.name} para ${selectedDate.day} de ${selectedDate.month} às ${selectedTime}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Aqui você faria a chamada à API para agendar
            Alert.alert(
              'Sucesso!',
              'Sua consulta foi agendada com sucesso!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Main', { screen: 'Appointments' }),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informações do Médico */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{doctor.rating}</Text>
            </View>
          </View>
        </View>

        {/* Tipo de Consulta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Consulta</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'presencial' && styles.typeButtonActive,
              ]}
              onPress={() => setAppointmentType('presencial')}
            >
              <Ionicons
                name="business"
                size={24}
                color={appointmentType === 'presencial' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.typeText,
                  appointmentType === 'presencial' && styles.typeTextActive,
                ]}
              >
                Presencial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'online' && styles.typeButtonActive,
              ]}
              onPress={() => setAppointmentType('online')}
            >
              <Ionicons
                name="videocam"
                size={24}
                color={appointmentType === 'online' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.typeText,
                  appointmentType === 'online' && styles.typeTextActive,
                ]}
              >
                Telemedicina
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seleção de Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione a Data</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesScroll}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate?.day === date.day && styles.dateCardActive,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.weekDay,
                    selectedDate?.day === date.day && styles.dateTextActive,
                  ]}
                >
                  {date.weekDay}
                </Text>
                <Text
                  style={[
                    styles.day,
                    selectedDate?.day === date.day && styles.dateTextActive,
                  ]}
                >
                  {date.day}
                </Text>
                <Text
                  style={[
                    styles.month,
                    selectedDate?.day === date.day && styles.dateTextActive,
                  ]}
                >
                  {date.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Seleção de Horário */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione o Horário</Text>
            
            <Text style={styles.periodTitle}>Manhã</Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.morning.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.periodTitle}>Tarde</Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.afternoon.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Resumo */}
        {selectedDate && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo do Agendamento</Text>
            <View style={styles.summaryItem}>
              <Ionicons name="person" size={20} color="#666" />
              <Text style={styles.summaryText}>{doctor.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.summaryText}>
                {selectedDate.day} de {selectedDate.month}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.summaryText}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="cash" size={20} color="#666" />
              <Text style={styles.summaryText}>{doctor.price}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botão Confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  doctorCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  doctorInfo: {
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  typeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  typeTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  datesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  dateCard: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 70,
  },
  dateCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  weekDay: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  day: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  month: {
    fontSize: 12,
    color: '#666',
  },
  dateTextActive: {
    color: '#fff',
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSlotActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  timeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#666',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
