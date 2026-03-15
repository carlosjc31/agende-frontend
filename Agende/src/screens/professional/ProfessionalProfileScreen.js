// screens/DoctorProfileScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfessionalProfileScreen({ navigation }) {

  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(true);

  const user = useMemo(
    () => ({
      name: 'Dra. Maria Santos',
      email: 'maria.santos@email.com',
      crm: 'CRM-SP 123456',
      specialty: 'Cardiologia',
      clinic: 'Clínica Centro',
    }),
    []
  );

  const handleEdit = () => Alert.alert('Em breve', 'Editar perfil (placeholder).');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#007AFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.meta}>{user.specialty} • {user.crm}</Text>
            <Text style={styles.meta}>{user.email}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.item}>
            <Ionicons name="business-outline" size={20} color="#007AFF" />
            <Text style={styles.itemText}>Clínica: {user.clinic}</Text>
          </View>

          <View style={styles.item}>
            <Ionicons name="medkit-outline" size={20} color="#007AFF" />
            <Text style={styles.itemText}>Especialidade: {user.specialty}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#007AFF" />
              <Text style={styles.settingText}>Notificações</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <Ionicons name="videocam-outline" size={20} color="#007AFF" />
              <Text style={styles.settingText}>Atendimento online</Text>
            </View>
            <Switch
              value={onlineEnabled}
              onValueChange={setOnlineEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfessionalNotifications')}>
          <Ionicons name="notifications" size={18} color="#fff" />
          <Text style={styles.buttonText}>Ver notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({


  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1, marginLeft: 14 },
  name: { color: '#fff', fontSize: 18, fontWeight: '800' },
  meta: { color: '#E8F4FF', marginTop: 3, fontSize: 12 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemText: { marginLeft: 10, color: '#666', fontWeight: '600' },
  setting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { marginLeft: 10, color: '#333', fontWeight: '700' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontWeight: '800', marginLeft: 10 },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 15,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: '800',
    marginLeft: 10
  },

});
