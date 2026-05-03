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
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import PatientOnboardingStep1 from '../screens/auth/PatientOnboardingStep1';
import PatientOnboardingStep2 from '../screens/auth/PatientOnboardingStep2';
import ProfessionalOnboardingStep2 from '../screens/auth/ProfessionalOnboardingStep2';

// --- IMPORTAÇÃO DAS TELAS DO PACIENTE ---
import HomeScreen from '../screens/patient/HomeScreen';
import SearchDoctorsScreen from '../screens/patient/SearchDoctorsScreen';
import AppointmentsScreen from '../screens/patient/AppointmentsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import BookAppointmentScreen from '../screens/patient/BookAppointmentScreen';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';
import PatientNotificationsScreen from '../screens/patient/PatientNotificationsScreen';

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
import GerenciarPacientesScreen from '../screens/admin/GerenciarPacientesScreen';
import GerenciarProfissionaisScreen from '../screens/admin/GerenciarProfissionaisScreen';
import ConsultasDiaAdminScreen from '../screens/admin/ConsultasDiaAdminScreen';
import AdminPatientsScreen from '../screens/admin/AdminPatientsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//===========================================
// 1. ROTAS DE ONBOARDING (Deslogado)
// ==========================================
// Se o paciente tiver cadastro incompleto, manda ele para as telas de onboarding
function PatientOnboardingRoutes(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientOnboardingStep1" component={PatientOnboardingStep1} />
      <Stack.Screen name="PatientOnboardingStep2" component={PatientOnboardingStep2} />
    </Stack.Navigator>
  );
}
// Se o profissional tiver cadastro incompleto, manda ele para as telas de onboarding (pode ser a mesma do paciente, ou uma específica para profissionais, dependendo de como você quiser organizar)
function ProfessionalOnboardingRoutes(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfessionalOnboardingStep2" component={ProfessionalOnboardingStep2} />
    </Stack.Navigator>
  );
}

// ==========================================
// 1. ROTAS DE AUTENTICAÇÃO (Deslogado)
// ==========================================
function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* Telas de Recuperação de Senha */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: true, title: 'Criar Nova Senha' }} // Deixa o cabeçalho visível para o usuário conseguir voltar
      />
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
        tabBarStyle: {
          backgroundColor: '#4ECDC4', // 🎨 O fundo verde-água/ciano
          borderTopWidth: 0,          // Remove a linha divisória superior da barra
          elevation: 10,              // Adiciona uma sombra suave (Android)
          shadowOpacity: 0.1,         // Sombra suave (iOS)
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Appointments') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF', // 🎨 Ícone ativo fica totalmente branco
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // 🎨 Ícone inativo fica branco transparente
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
      <Stack.Screen name="PatientNotifications" component={PatientNotificationsScreen} />
      <Stack.Screen name="Appointment" component={BookAppointmentScreen} />
      <Tab.Screen name="ConsultaDetails" component={ConsultaDetailsScreen} options={{ headerShown: false }} />
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
      <Stack.Screen name="Main" component={ProfessionalTabs} />
      <Stack.Screen name="Notificações" component={NotificationsProfessionalScreen} />
      <Stack.Screen name="ConsultaDetails" component={ConsultaDetailsScreen} />
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
      <Stack.Screen name="GerenciarPacientes" component={GerenciarPacientesScreen} />
      <Stack.Screen name="GerenciarProfissionais" component={GerenciarProfissionaisScreen} />
      <Stack.Screen name="ConsultasDia" component={ConsultasDiaAdminScreen} />
      <Stack.Screen name="AdminPatients" component={AdminPatientsScreen} options={{ title: 'Gerenciar Pacientes' }} />
    </Stack.Navigator>
  );
}

// ==========================================
// O GUARDA DE TRÂNSITO (Gerenciador Principal)
// ==========================================
export default function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <AuthRoutes />
  }
  // Verifica se o paciente tem cadastro incompleto (ou seja, se ele não completou o onboarding), e se tiver, manda ele completar o cadastro antes de acessar as rotas normais
  const isPacienteIncompleto = user?.perfil === 'PACIENTE' && !user?.nomeCompleto;

  // Se o perfil do profissional estiver incompleto, manda ele completar o cadastro antes de acessar as rotas normais
  const isProfissionalIncompleto = user?.perfil === 'PROFISSIONAL' && !user?.nomeCompleto;

  // Se o paciente ou profissional tiver cadastro incompleto, manda ele para as telas de onboarding
  if (isPacienteIncompleto) { return <PatientOnboardingRoutes />;}

  // Se o profissional tiver cadastro incompleto, manda ele para as telas de onboarding (pode ser a mesma do paciente, ou uma específica para profissionais, dependendo de como você quiser organizar)
  if (isProfissionalIncompleto) { return <ProfessionalOnboardingRoutes />;}

  // Retorna as rotas de acordo com o perfil
  if (user?.perfil === 'ADMINISTRADOR') return <AdminRoutes />;
  if (user?.perfil === 'PROFISSIONAL') return <ProfessionalRoutes />;
  if (user?.perfil === 'PACIENTE') return <PatientRoutes />;

  // Se o perfil vier vazio ou corrompido, chuta o usuário por segurança!
  return <AuthRoutes />;
}
