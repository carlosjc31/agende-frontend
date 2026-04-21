import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { maskDate } from '../../utils/masks';

export default function PatientOnboardingStep1({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleNext = () => {
    if (!nomeCompleto || dataNascimento.length < 10) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos para continuar.');
      return;
    }

    // Navega para o passo 2 passando os dados preenchidos aqui!
    navigation.navigate('PatientOnboardingStep2', {
      nomeCompleto,
      dataNascimento
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <View style={styles.header}>
        <Text style={styles.stepText}>Passo 1 de 2</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Vamos nos conhecer!</Text>
        <Text style={styles.subtitle}>Precisamos de alguns dados básicos para criar o seu prontuário.</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome igual ao documento"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChangeText={(Text) => setDataNascimento(maskDate(Text))}
          keyboardType="numeric"
          maxLength={10}
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Avançar</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
// Os estilos (styles) estão no final da próxima tela para você reaproveitar.
