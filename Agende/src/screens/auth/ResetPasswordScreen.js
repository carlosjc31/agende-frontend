import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../../services/api';


export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !codigo || !novaSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      // Exemplo de chamada pra sua API:
      // await authAPI.resetPassword(email, codigo, novaSenha);

      Alert.alert('Sucesso', 'Sua senha foi alterada! Faça login com a nova senha.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Senha</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

      <Text style={styles.label}>Código de 6 dígitos</Text>
      <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} keyboardType="numeric" maxLength={6} />

      <Text style={styles.label}>Nova Senha</Text>
      <TextInput style={styles.input} value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
