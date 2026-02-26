// screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const user = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '15/05/1990',
    bloodType: 'O+',
    image: 'https://via.placeholder.com/150',
  };

  const menuSections = [
    {
      title: 'Minha Conta',
      items: [
        { 
          icon: 'person-outline', 
          label: 'Dados Pessoais', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'card-outline', 
          label: 'Cartões e Pagamentos', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'medkit-outline', 
          label: 'Plano de Saúde', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'document-text-outline', 
          label: 'Documentos Médicos', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
      ],
    },
    {
      title: 'Histórico Médico',
      items: [
        { 
          icon: 'flask-outline', 
          label: 'Exames', 
          badge: '3',
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'receipt-outline', 
          label: 'Receitas Médicas', 
          badge: '2',
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'clipboard-outline', 
          label: 'Prontuários', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'trending-up-outline', 
          label: 'Indicadores de Saúde', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { 
          icon: 'help-circle-outline', 
          label: 'Central de Ajuda', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'chatbubble-outline', 
          label: 'Fale Conosco', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'document-outline', 
          label: 'Termos de Uso', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
        { 
          icon: 'shield-checkmark-outline', 
          label: 'Política de Privacidade', 
          onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') 
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // Limpar dados de autenticação e voltar para login
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Informações Rápidas */}
        <View style={styles.quickInfoCard}>
          <View style={styles.quickInfoItem}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.quickInfoText}>{user.phone}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Ionicons name="water-outline" size={20} color="#666" />
            <Text style={styles.quickInfoText}>Tipo: {user.bloodType}</Text>
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#007AFF" />
              <Text style={styles.settingLabel}>Notificações</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print-outline" size={22} color="#007AFF" />
              <Text style={styles.settingLabel}>Biometria</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon} size={22} color="#007AFF" />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Versão do App */}
        <Text style={styles.versionText}>Agende v1.0.0</Text>
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
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E8F4FF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  quickInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
  settingsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 32,
  },
});
