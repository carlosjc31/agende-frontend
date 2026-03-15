// src/routes/index.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext'; // Importa useAuth do arquivo '../contexts/AuthContext';

// --- IMPORTAÇÃO DAS TELAS DE AUTENTICAÇÃO ---
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// --- IMPORTAÇÃO DAS TELAS DO PACIENTE ---
import HomeScreen from '../screens/patient/HomeScreen';
import SearchDoctorsScreen from '../screens/patient/SearchDoctorsScreen';
import AppointmentsScreen from '../screens/patient/AppointmentsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import BookAppointmentScreen from '../screens/patient/BookAppointmentScreen';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';

// --- IMPORTAÇÃO DAS TELAS DO PROFISSIONAL ---
import ProfessionalHomeScreen from '../screens/professional/ProfessionalHomeScreen';
import AgendaScreen from '../screens/professional/AgendaScreen';
import ConsultaScreen from '../screens/professional/ConsultaScreen';
import ProfessionalProfileScreen from '../screens/professional/ProfessionalProfileScreen'; // Ajuste o nome do arquivo se necessário
import ConsultaDetailsScreen from '../screens/professional/ConsultaDetailsScreen';
import NotificationsProfessionalScreen from '../screens/professional/NotificationsProfessionalScreen';

// --- IMPORTAÇÃO DAS TELAS DO ADMIN ---
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ValidarProfissionalScreen from '../screens/admin/ValidarProfissionalScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// 1. ROTAS DE AUTENTICAÇÃO (Deslogado)
// ==========================================
function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// ==========================================
// 2. ROTAS DO PACIENTE (Bottom Tabs + Stack)
// ==========================================
function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Appointments') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Search" component={SearchDoctorsScreen} options={{ tabBarLabel: 'Buscar' }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ tabBarLabel: 'Consultas' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

function PatientRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={PatientTabs} />
      <Stack.Screen name="Appointment" component={BookAppointmentScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    </Stack.Navigator>
  );
}

// ==========================================
// 3. ROTAS DO PROFISSIONAL
// ==========================================
function ProfessionalTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ProfHomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'ProfessionalAgenda') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'ProfessionalConsultas') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'ProfessionalProfile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="ProfHomeTab" component={ProfessionalHomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="ProfessionalAgenda" component={AgendaScreen} options={{ tabBarLabel: 'Agenda' }} />
      <Tab.Screen name="ProfessionalConsultas" component={ConsultaScreen} options={{ tabBarLabel: 'Consultas' }} />
      <Tab.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

function ProfessionalRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfMain" component={ProfessionalTabs} />
      <Stack.Screen name="ConsultaDetails" component={ConsultaDetailsScreen} />
      {/*<Stack.Screen name="ProfessionalNotifications" component={NotificationsProfessionalScreen} />*/}
    </Stack.Navigator>
  );
}

// ==========================================
// 4. ROTAS DO ADMINISTRADOR
// ==========================================
function AdminRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ValidarProfissional" component={ValidarProfissionalScreen} />
      {/* Adicione as outras telas do Admin aqui no futuro */}
    </Stack.Navigator>
  );
}

// ==========================================
// O GUARDA DE TRÂNSITO (Gerenciador Principal)
// ==========================================
export default function Routes() {
  const { signed, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (user?.perfil === 'ADMINISTRADOR') return <AdminRoutes />;
  if (user?.perfil === 'PROFISSIONAL') return <ProfessionalRoutes />;
  if (user?.perfil === 'PACIENTE') return <PatientRoutes />;

  // Se o perfil vier vazio ou corrompido, chuta o usuário por segurança!
  return <AuthRoutes />;
}
