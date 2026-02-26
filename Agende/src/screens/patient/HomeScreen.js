// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('João Silva');
  const [nextAppointment, setNextAppointment] = useState({
    doctor: 'Dra. Maria Santos',
    specialty: 'Cardiologista',
    date: '02 Nov 2025',
    time: '14:30',
    location: 'Consultório Centro',
  });

  const specialties = [
    { id: 1, name: 'Cardiologia', icon: 'heart', color: '#FF6B6B' },
    { id: 2, name: 'Pediatria', icon: 'medkit', color: '#4ECDC4' },
    { id: 3, name: 'Ortopedia', icon: 'fitness', color: '#FFD93D' },
    { id: 4, name: 'Dermatologia', icon: 'eye', color: '#95E1D3' },
  ];

  const recentDoctors = [
    {
      id: 1,
      name: 'Dr. Carlos Lima',
      specialty: 'Ortopedista',
      rating: 4.8,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Dra. Ana Costa',
      specialty: 'Dermatologista',
      rating: 4.9,
      image: 'https://via.placeholder.com/100',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
          <Text style={styles.subtitle}>Como podemos ajudar hoje?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Próxima Consulta */}
        {nextAppointment && (
          <View style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Próxima Consulta</Text>
              <Ionicons name="calendar" size={20} color="#007AFF" />
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.doctorInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={30} color="#fff" />
                </View>
                <View style={styles.doctorText}>
                  <Text style={styles.doctorName}>{nextAppointment.doctor}</Text>
                  <Text style={styles.doctorSpecialty}>{nextAppointment.specialty}</Text>
                </View>
              </View>
              <View style={styles.appointmentTime}>
                <View style={styles.timeRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.timeText}>{nextAppointment.date}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.timeText}>{nextAppointment.time}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.viewButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Especialidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.specialtiesScroll}
          >
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={styles.specialtyCard}
                onPress={() => navigation.navigate('Search', { specialty: specialty.name })}
              >
                <View style={[styles.specialtyIcon, { backgroundColor: specialty.color }]}>
                  <Ionicons name={specialty.icon} size={28} color="#fff" />
                </View>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Médicos Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Consultados Recentemente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAll}>Ver Todos</Text>
            </TouchableOpacity>
          </View>
          
          {recentDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorCard}
              onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
            >
              <Image 
                source={{ uri: doctor.image }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorCardInfo}>
                <Text style={styles.doctorCardName}>{doctor.name}</Text>
                <Text style={styles.doctorCardSpecialty}>{doctor.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{doctor.rating}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Exames</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medkit-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Receitas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="videocam-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Telemedicina</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  scrollView: {
    flex: 1,
  },
  appointmentCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorText: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  appointmentTime: {
    paddingLeft: 62,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  specialtiesScroll: {
    paddingLeft: 20,
  },
  specialtyCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  specialtyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  doctorCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  doctorCardSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
