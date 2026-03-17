// ============================================
// TELA DE CADASTRO - Integrada com API
// ============================================

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import  api  from '../../services/api';

export default function SignUpScreen({ navigation }) {
  // Estado para controlar a aba ativa (Paciente ou Profissional)
  const [userType, setUserType] = useState('paciente');

  // Campos Comuns
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Campo Exclusivo Paciente
  const [dataNascimento, setDataNascimento] = useState('');

  // Campos Exclusivos Profissional
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth(); // Usaremos o signIn após o cadastro manual se quiser logar direto

  // ... (Mantenha as funções validateEmail, formatPhone, formatCPF, formatDate EXATAMENTE COMO ESTAVAM)
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 11) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    else if (cleaned.length >= 7) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    else if (cleaned.length >= 2) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return formatted;
  };
  const formatCPF = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 11) formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    else if (cleaned.length >= 9) formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    else if (cleaned.length >= 6) formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    return formatted;
  };
  const formatDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 8) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    else if (cleaned.length >= 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return formatted;
  };

  const handleSignUp = async () => {
    // 1. Validações Base (Exigidas tanto para Paciente quanto para Médico)
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // 2. Validações Específicas (O pulo do gato!)
    if (userType === 'paciente') {
      if (!cpf || !dataNascimento) {
        Alert.alert('Erro', 'Informe o CPF e a Data de Nascimento.');
        return;
      }
    } else if (userType === 'profissional') {
      if (!crm || !especialidade) {
        Alert.alert('Erro', 'Informe o CRM e a Especialidade.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let endpoint = '';
      let payload = {
        nomeCompleto: fullName,
        email,
        senha: password,
        telefone: phone,
      };

      if (userType === 'paciente') {
        endpoint = '/auth/register/paciente';
        const partesData = dataNascimento.split('/');
        payload.dataNascimento = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        // O CPF só vai no payload se for paciente!
        payload.cpf = cpf.replace(/\D/g, '');
      } else {
        endpoint = '/auth/register/profissional';
        payload.crm = crm;
        payload.especialidade = especialidade;
      }

      console.log(`Disparando para ${endpoint}...`);

      // Faz a chamada direta para a sua API!
      await api.post(endpoint, payload);

      Alert.alert(
        'Sucesso!',
        userType === 'profissional'
          ? 'Cadastro realizado! Aguarde a aprovação do Administrador para começar a atender.'
          : 'Conta criada com sucesso! Faça o login.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      const erroDoBackend = error.response?.data;
      console.log("MENSAGEM DE ERRO:", error.message);
      console.log("STATUS CODE:", error.response?.status);
      console.log("DADOS QUE TENTOU ENVIAR:", payload);
      Alert.alert('Erro ao Cadastrar', 'Verifique o terminal do Expo para ver o erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

          {/* AS ABAS DE TIPO DE USUÁRIO */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, userType === 'paciente' && styles.tabActive]}
              onPress={() => setUserType('paciente')}
            >
              <Text style={[styles.tabText, userType === 'paciente' && styles.tabTextActive]}>Sou Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, userType === 'profissional' && styles.tabActive]}
              onPress={() => setUserType('profissional')}
            >
              <Text style={[styles.tabText, userType === 'profissional' && styles.tabTextActive]}>Sou Profissional</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {/* Campos Comuns (Nome, Email, Telefone, CPF) */}
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput style={styles.input} placeholder="Digite seu nome completo" value={fullName} onChangeText={setFullName} editable={!isLoading} />

            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />

            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} placeholder="(00) 00000-0000" value={phone} onChangeText={(text) => setPhone(formatPhone(text))} keyboardType="phone-pad" maxLength={15} editable={!isLoading} />

            {userType === 'paciente' && (
              <>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={(text) => setCpf(formatCPF(text))}
                  keyboardType="number-pad"
                  maxLength={14}
                  editable={!isLoading}
                />
              </>
            )}

            {/* Condicional: Campo de Paciente */}
            {userType === 'paciente' && (
              <>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={dataNascimento} onChangeText={(text) => setDataNascimento(formatDate(text))} keyboardType="number-pad" maxLength={10} editable={!isLoading} />
              </>
            )}

            {/* Condicional: Campos de Médico */}
            {userType === 'profissional' && (
              <>
                <Text style={styles.label}>CRM</Text>
                <TextInput style={styles.input} placeholder="Ex: CRM-SP 123456" value={crm} onChangeText={setCrm} editable={!isLoading} />

                <Text style={styles.label}>Especialidade</Text>
                <TextInput style={styles.input} placeholder="Ex: Cardiologia" value={especialidade} onChangeText={setEspecialidade} editable={!isLoading} />
              </>
            )}

            {/* Senhas */}
            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" value={password} onChangeText={setPassword} secureTextEntry editable={!isLoading} />

            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput style={styles.input} placeholder="Digite a senha novamente" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry editable={!isLoading} />

            <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ADICIONE ESTES DOIS ESTILOS NOVOS NO SEU STYLESHEET LÁ EMBAIXO:
const styles = StyleSheet.create({
  // ... mantenha os seus estilos antigos todos, e cole estes novos:
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1, paddingVertical: 20 },
  content: { paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 20, textAlign: 'center' },

  // ESTILOS DAS ABAS:
  tabContainer: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 8, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, color: '#666', fontWeight: '600' },
  tabTextActive: { color: '#007AFF' },

  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonDisabled: { backgroundColor: '#ccc', opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 20 },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});
