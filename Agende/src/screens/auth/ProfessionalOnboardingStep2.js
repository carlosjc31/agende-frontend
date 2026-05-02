import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { maskPhone } from '../../utils/masks';

export default function ProfessionalOnboardingStep2({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useAuth(); // Precisamos atualizar o usuário no contexto

  const handleFinish = async () => {
    if (!nomeCompleto || !crm || !especialidade || !telefone) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Monta o pacote de dados EXATAMENTE como o DTO do Java espera
      const dadosProfissional = {
        nomeCompleto: nomeCompleto,
        crm: crm,
        especialidade: especialidade,
        telefone: telefone.replace(/\D/g, '') // Envia apenas os números
      };

      // 2. Chama a API para salvar o perfil do profissional
      const response = await authAPI.completarPerfilProfissional(dadosProfissional);

      // 3. Atualiza o Contexto do React Native com os novos dados do profissional
      const updatedUser = {
          ...user,
          nomeCompleto: dadosProfissional.nomeCompleto,
          perfilId: response.perfilId
      };

      setUser(updatedUser);
      await AsyncStorage.setItem('@agende:user', JSON.stringify(updatedUser));

      // Não precisa dar navigation.navigate()! O Routes.js vai ouvir a mudança do 'user' e fazer a mágica.

    } catch (error) {
      console.log("Erro ao completar perfil do profissional:", error.response?.data || error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.title}>Quase lá, Doutor(a)!</Text>
          <Text style={styles.subtitle}>Precisamos dos seus dados profissionais para liberar o seu acesso.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dr. João Silva"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
          />

          <Text style={styles.label}>CRM (com o Estado)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: CRM/SP 123456"
            value={crm}
            onChangeText={setCrm}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Especialidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cardiologia"
            value={especialidade}
            onChangeText={setEspecialidade}
          />

          <Text style={styles.label}>Telefone / WhatsApp da Clínica</Text>
          <TextInput style={styles.input} placeholder="(00) 00000-0000" value={telefone} onChangeText={(text) => setTelefone(maskPhone(text))} keyboardType="phone-pad" maxLength={15} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFinish} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 22 },
  form: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#DDD', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
