# 🩺 Agende — app mobile

Aplicativo em **React Native + Expo** para agendamento de consultas entre pacientes e profissionais de
saúde. Consome a API do [agende-backend](https://github.com/carlosjc31/agende-backend).

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo_54-000020?style=for-the-badge&logo=expo&logoColor=white)

## 📱 Telas

| Perfil | Telas |
|---|---|
| **Autenticação** | login, cadastro, onboarding em etapas, esqueci/redefinir senha |
| **Paciente** | início, busca de profissionais, perfil do profissional, agendamento, minhas consultas, notificações, perfil |
| **Profissional** | início, agenda, detalhes da consulta, notificações, perfil |
| **Administrador** | dashboard, validação de profissionais, gestão de pacientes e profissionais, consultas do dia |

## 🧱 Estrutura

```
Agende/src/
├── contexts/   # AuthContext: sessão e token JWT
├── routes/     # navegação por perfil (stack + abas)
├── screens/    # auth, patient, professional, admin
├── services/   # cliente HTTP (axios) para a API
└── utils/      # máscaras de CPF, telefone e data
```

## 🏃 Como executar

```bash
git clone https://github.com/carlosjc31/agende-frontend.git
cd agende-frontend/Agende
npm install
npx expo start
```

Ajuste a URL da API em `src/services/api.js` para o endereço onde o backend está rodando.

## 👤 Autor

**José Carlos Carneiro** — [LinkedIn](https://www.linkedin.com/in/jose-carlos-carneiro/)
