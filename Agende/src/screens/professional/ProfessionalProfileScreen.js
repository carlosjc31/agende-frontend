// screens/DoctorProfileScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, StatusBar, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfessionalProfileScreen({ navigation }) {
  const { user: authUser, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dados reais puxados do Java
  const [profileData, setProfileData] = useState(null);

  // Estados do Modal de Edição
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(true);

  // Busca os dados do médico sempre que a tela abre
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profissionais/${authUser.perfilId}`);
      setProfileData(response.data);
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => await signOut() },
    ]);
  };

  const openEditModal = () => {
    // Preenche o formulário com os dados atuais
    setEditForm({
      telefone: profileData?.telefone || '',
      hospitalClinica: profileData?.hospitalClinica || '',
      valorConsulta: profileData?.valorConsulta ? profileData.valorConsulta.toString() : '',
      bio: profileData?.bio || '',
      endereco: profileData?.endereco || '',
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Converte a string do valor para número (caso o médico tenha digitado algo)
      const payload = { ...editForm };
      if (payload.valorConsulta) {
        payload.valorConsulta = parseFloat(payload.valorConsulta.replace(',', '.'));
      }

      await api.put(`/profissionais/${authUser.perfilId}`, payload);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditModalVisible(false);
      loadProfile(); // Recarrega os dados fresquinhos da API
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profileData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* CABEÇALHO COM DADOS REAIS */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF' }}>
              {profileData.nomeCompleto ? profileData.nomeCompleto.charAt(0).toUpperCase() : 'M'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profileData.nomeCompleto}</Text>
            <Text style={styles.meta}>{profileData.especialidade} • {profileData.crm}</Text>
            {/* O email geralmente fica em authUser.email */}
            <Text style={styles.meta}>{authUser.email || profileData.email || 'Email não informado'}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.item}>
            <Ionicons name="business-outline" size={20} color="#007AFF" />
            <Text style={styles.itemText}>Clínica: {profileData.hospitalClinica || 'Não informada'}</Text>
          </View>

          <View style={styles.item}>
            <Ionicons name="cash-outline" size={20} color="#007AFF" />
            <Text style={styles.itemText}>Valor da Consulta: R$ {profileData.valorConsulta ? profileData.valorConsulta.toFixed(2) : '0.00'}</Text>
          </View>

          <View style={styles.item}>
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.itemText}>Telefone: {profileData.telefone || 'Não informado'}</Text>
          </View>

          {profileData.bio && (
            <View style={[styles.item, { alignItems: 'flex-start' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
              <Text style={[styles.itemText, { flex: 1, lineHeight: 20 }]}>{profileData.bio}</Text>
            </View>
          )}
        </View>

        {/* ... (Manter os cartões de Configurações, Notificações e Logout originais) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#007AFF" />
              <Text style={styles.settingText}>Notificações</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#E0E0E0', true: '#007AFF' }} thumbColor="#fff" />
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL DE EDIÇÃO DE PERFIL                  */}
      {/* ========================================== */}
      <Modal visible={isEditModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={handleSaveProfile} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#007AFF" /> : <Text style={styles.saveText}>Salvar</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Text style={styles.label}>Hospital ou Clínica</Text>
            <TextInput style={styles.input} placeholder="Ex: Clínica Centro" value={editForm.hospitalClinica} onChangeText={(text) => setEditForm({ ...editForm, hospitalClinica: text })} />

            <Text style={styles.label}>Telefone de Contato</Text>
            <TextInput style={styles.input} placeholder="(00) 00000-0000" keyboardType="phone-pad" value={editForm.telefone} onChangeText={(text) => setEditForm({ ...editForm, telefone: text })} />

            <Text style={styles.label}>Valor da Consulta (R$)</Text>
            <TextInput style={styles.input} placeholder="Ex: 150.00" keyboardType="numeric" value={editForm.valorConsulta} onChangeText={(text) => setEditForm({ ...editForm, valorConsulta: text })} />

            <Text style={styles.label}>Endereço Completo</Text>
            <TextInput style={styles.input} placeholder="Ex: Rua das Flores, 123" value={editForm.endereco} onChangeText={(text) => setEditForm({ ...editForm, endereco: text })} />

            <Text style={styles.label}>Sobre você (Bio)</Text>
            <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Fale um pouco sobre a sua experiência..." multiline value={editForm.bio} onChangeText={(text) => setEditForm({ ...editForm, bio: text })} />
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}

// MANTENHA OS SEUS ESTILOS ORIGINAIS AQUI e ADICIONE os estilos do Modal abaixo:
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemText: { marginLeft: 10, color: '#666', fontWeight: '600' },
  setting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { marginLeft: 10, color: '#333', fontWeight: '700' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 14, marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '800', marginLeft: 10 },
  logoutButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30', marginTop: 15 },
  logoutButtonText: { color: '#FF3B30', fontWeight: '800', marginLeft: 10 },

  // ESTILOS NOVOS DO MODAL
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  saveText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  modalForm: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, color: '#333' },
});
