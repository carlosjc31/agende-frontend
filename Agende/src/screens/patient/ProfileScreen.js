// screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Switch, Alert, StatusBar, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const { signOut, user: authUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Estados do Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pacientes/${authUser.perfilId}`);
      setProfileData(response.data);
    } catch (error) {
      console.log("Erro ao carregar perfil do paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEdicao = () => {
    setEditForm({
      telefone: profileData?.telefone || '',
      cns: profileData?.cns || '',
      endereco: profileData?.endereco || '',
      cidade: profileData?.cidade || '',
      estado: profileData?.estado || '',
    });
    setIsEditModalVisible(true);
  };

  const salvarPerfil = async () => {
    try {
      setSaving(true);
      await api.put(`/pacientes/${authUser.perfilId}`, editForm);
      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
      setIsEditModalVisible(false);
      carregarPerfil(); // Puxa os dados novos
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => await signOut() },
    ]);
  };

  // Menu mantido igual ao seu original
  const menuSections = [
    {
      title: 'Minha Conta',
      items: [
        { icon: 'person-outline', label: 'Dados Pessoais', onPress: () => Alert.alert('Aviso', 'Utilize o ícone de lápis no topo para editar!') },
        { icon: 'card-outline', label: 'Cartões e Pagamentos', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
      ],
    },
    {
      title: 'Histórico Médico',
      items: [
        { icon: 'receipt-outline', label: 'Receitas Médicas', badge: 'Nova', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
        { icon: 'clipboard-outline', label: 'Prontuários', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
      ],
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Dados mesclados para exibição segura
  const displayName = profileData?.nomeCompleto || profileData?.nome || authUser?.nome || 'Paciente';
  const displayPhone = profileData?.telefone || '(00) 00000-0000';
  const displayBlood = profileData?.tipoSanguineo || 'Não inf.';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{authUser?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={abrirModalEdicao}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Informações Rápidas */}
        <View style={styles.quickInfoCard}>
          <View style={styles.quickInfoItem}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.quickInfoText}>{displayPhone}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Ionicons name="card-outline" size={20} color="#007AFF" />
            <Text style={styles.quickInfoText}>CNS: {profileData?.cns || 'Não inf.'}</Text>
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Notificações</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#E0E0E0', true: '#007AFF' }} thumbColor="#fff" />
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity key={itemIndex} style={[styles.menuItem, itemIndex !== section.items.length - 1 && styles.menuItemBorder]} onPress={item.onPress}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon} size={22} color="#007AFF" />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
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

        <Text style={styles.versionText}>Agende v1.0.0</Text>
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL DE EDIÇÃO DE PERFIL DO PACIENTE      */}
      {/* ========================================== */}
      <Modal visible={isEditModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={salvarPerfil} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#007AFF" /> : <Text style={styles.saveText}>Salvar</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Telefone de Contato</Text>
            <TextInput style={styles.input} placeholder="(00) 00000-0000" keyboardType="phone-pad" value={editForm.telefone} onChangeText={(text) => setEditForm({ ...editForm, telefone: text })} />

            <Text style={styles.label}>Cartão Nacional de Saúde (CNS)</Text>
            <TextInput style={styles.input} placeholder="Apenas números" keyboardType="numeric" value={editForm.cns} onChangeText={(text) => setEditForm({ ...editForm, cns: text })} />

            <Text style={styles.label}>Endereço Completo</Text>
            <TextInput style={styles.input} placeholder="Ex: Rua das Flores, 123" value={editForm.endereco} onChangeText={(text) => setEditForm({ ...editForm, endereco: text })} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 0.65, marginRight: 10 }}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.input} placeholder="Ex: São Paulo" value={editForm.cidade} onChangeText={(text) => setEditForm({ ...editForm, cidade: text })} />
              </View>
              <View style={{ flex: 0.35 }}>
                <Text style={styles.label}>UF</Text>
                <TextInput style={styles.input} placeholder="SP" maxLength={2} autoCapitalize="characters" value={editForm.estado} onChangeText={(text) => setEditForm({ ...editForm, estado: text })} />
              </View>
            </View>
            <View style={{ height: 40 }} /> {/* Espaço extra no final do scroll */}
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}

// OS ESTILOS ORIGINAIS + OS ESTILOS DO MODAL
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, marginBottom: 10 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  avatarText: { fontSize: 30, fontWeight: 'bold', color: '#007AFF' },
  profileInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#E8F4FF' },
  editButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  quickInfoCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginTop: 5, marginBottom: 20, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  quickInfoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  quickInfoText: { marginLeft: 8, fontSize: 14, color: '#666' },
  quickInfoDivider: { width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 12 },
  settingsSection: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, paddingHorizontal: 20 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { marginLeft: 12, fontSize: 15, color: '#333' },
  menuSection: { marginBottom: 24 },
  menuCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F8FF', justifyContent: 'center', alignItems: 'center' },
  menuItemLabel: { marginLeft: 12, fontSize: 15, color: '#333' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: '#FF3B30', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginHorizontal: 20, padding: 16, borderRadius: 12, marginTop: 12, marginBottom: 24 },
  logoutText: { marginLeft: 12, fontSize: 15, color: '#FF3B30', fontWeight: '600' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#999', marginBottom: 32 },

  // ESTILOS DO MODAL
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  saveText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  modalForm: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, color: '#333' },
});
