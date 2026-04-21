import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho
import { maskCPF, maskPhone } from '../../utils/masks';

export default function PatientOnboardingStep2({ route, navigation }) {
  // Recebendo os dados da Step1
  const { nomeCompleto, dataNascimento } = route.params;

  const [cpf, setCpf] = useState('');
  const [cns, setCns] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { completeProfile } = useAuth(); // Precisaremos criar essa função no AuthContext

  const handleFinish = async () => {
    const cpflimpo = cpf.replace(/\D/g, '');
    const telefonelimpo = telefone.replace(/\D/g, '');

    if (cpflimpo.length !== 11 || !cns || telefonelimpo.length < 10) {
      Alert.alert('Atenção', 'Preencha todos os documentos de saúde.');
      return;
    }

    setIsLoading(true);
    // Chama o contexto para enviar os dados para a sua API Spring Boot
    const result = await completeProfile({
      nomeCompleto: nomeCompleto, // Nome que veio da tela 1
      dataNascimento: dataNascimento,     // Data que veio da tela 1
      cpf: cpflimpo,
      cns: cns,
      telefone: telefonelimpo
    });
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Erro', result.message || 'Não foi possível salvar os dados.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.stepText}>Passo 2 de 2</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Documentos de Saúde</Text>
        <Text style={styles.subtitle}>Esses dados são criptografados (LGPD) e usados apenas para a clínica.</Text>

        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} placeholder="000.000.000-00" value ={maskCPF(cpf)} onChangeText={(text) => setCpf(text.replace(/\D/g, ''))} keyboardType="numeric" maxLength={14}/>

        <Text style={styles.label}>Cartão Nacional de Saúde (CNS)</Text>
        <TextInput style={styles.input} placeholder="Número do seu cartão SUS" value={cns} onChangeText={setCns} keyboardType="numeric" maxLength={15} />

        <Text style={styles.label}>Telefone (WhatsApp)</Text>
        <TextInput style={styles.input} placeholder="(00) 00000-0000" value={telefone} onChangeText={(text) => setTelefone(maskPhone(text))} keyboardType="phone-pad" maxLength={15} />

        {/* NOVA ÁREA DE BOTÕES LADO A LADO */}
        <View style={styles.buttonContainer}>
        {/* Botão Secundário: Voltar */}
        <TouchableOpacity style={[styles.button, styles.buttonBack]} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.buttonBackText}>Voltar</Text>
        </TouchableOpacity>

        {/* Botão Principal: Finalizar Cadastro */}
        <TouchableOpacity style={[styles.button, styles.buttonFinish]} onPress={handleFinish} disabled={isLoading}>
        {isLoading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Finalizar</Text>)}
        </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos comuns para as duas telas
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  stepText: { fontSize: 16, fontWeight: '600', color: '#666' },
  content: { paddingHorizontal: 30, paddingTop: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 30, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 30, flexDirection: 'row', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBack: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonBackText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonFinish: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
