
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando o Contexto de Autenticação
import { AuthProvider } from './src/contexts/AuthContext';

// Importando as Telas
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import HomeScreen from './src/screens/patient/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // O AuthProvider envolve o app para gerir quem está logado
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }} // Esconde aquela barra superior padrão
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          {/* Adicionamos a HomeScreen para testar o login com sucesso */}
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
