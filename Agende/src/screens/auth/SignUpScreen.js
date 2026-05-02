// ============================================
// TELA DE CADASTRO - Integrada com API
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [perfil, setPerfil] = useState('PACIENTE'); // Padrão é paciente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Para mostrar/ocultar senha
  const { signUp } = useAuth(); // Sua função do contexto de autenticação

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);
    // Chama o registro lá no seu Contexto, passando o perfil
    const result = await signUp(email, password, perfil);
    setIsLoading(false);

    if (result.success) {
      // Como o JWT já foi salvo no signUp, o Routes.js vai assumir o controle
      // e mandar o usuário para a tela de Onboarding automaticamente!
    } else {
      Alert.alert('Erro', result.message || 'Não foi possível cadastrar.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#007AFF" />
      </TouchableOpacity>

      {/*Usando ScrollView para evitar que o teclado esconda os campos em telas menores*/}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>

      <View style={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Comece de forma rápida e segura</Text>

        {/* Seleção de Perfil (Botões Visuais) */}
        <Text style={styles.label}>Eu sou um:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, perfil === 'PACIENTE' && styles.roleButtonActive]}
            onPress={() => setPerfil('PACIENTE')}
          >
            <Ionicons name="person" size={22} color={perfil === 'PACIENTE' ? '#fff' : '#666'} />
            <Text style={[styles.roleText, perfil === 'PACIENTE' && styles.roleTextActive]}>Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, perfil === 'PROFISSIONAL' && styles.roleButtonActive]}
            onPress={() => setPerfil('PROFISSIONAL')}
          >
            <Ionicons name="medical" size={24} color={perfil === 'PROFISSIONAL' ? '#fff' : '#666'} />
            <Text style={[styles.roleText, perfil === 'PROFISSIONAL' && styles.roleTextActive]}>Profissional</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24} color="#999"
            />
          </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Avançar</Text>}
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  backButton: { marginTop: 40, marginLeft: 20 },
  content: { paddingHorizontal: 8, paddingTop: 20,  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 20, color: '#666', marginBottom: 30 },
  label: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginHorizontal: 5 },
  roleButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  roleText: { marginLeft: 8, fontSize: 16, color: '#666', fontWeight: '600' },
  roleTextActive: { color: '#fff' },

  form: { marginBottom: 50, paddingVertical: 20, paddingHorizontal: 10, backgroundColor: '#f9f9f9', borderRadius: 8, flexDiretion: 'row' },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});
