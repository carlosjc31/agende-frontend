// ============================================
// TELA DE VALIDAÇÃO DE PROFISSIONAIS (ADMIN)
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';

export default function ValidarProfissionaisScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [profissionais, setProfissionais] = useState([]);
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  useEffect(() => {
    loadPendentes();
  }, []);

  const loadPendentes = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.listarProfissionaisPendentes();
      setProfissionais(response);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar profissionais pendentes');
    } finally {
      setLoading(false);
    }
  };

  const aprovarProfissional = async (profissionalId) => {
    Alert.alert(
      'Aprovar Profissional',
      'Confirma a aprovação deste profissional?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            try {
              await adminAPI.aprovarProfissional(profissionalId);
              Alert.alert('Sucesso', 'Profissional aprovado!');
              loadPendentes();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao aprovar profissional');
            }
          },
        },
      ]
    );
  };

  const rejeitarProfissional = async () => {
    if (!motivoRejeicao.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o motivo da rejeição');
      return;
    }

    try {
      await adminAPI.rejeitarProfissional(selectedProfissional.id, motivoRejeicao);
      Alert.alert('Sucesso', 'Profissional rejeitado');
      setModalVisible(false);
      setMotivoRejeicao('');
      setSelectedProfissional(null);
      loadPendentes();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao rejeitar profissional');
    }
  };

  const openRejectModal = (profissional) => {
    setSelectedProfissional(profissional);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validar Profissionais</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPendentes} />
        }
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Valide os documentos e informações antes de aprovar profissionais.
            Profissionais aprovados poderão atender pacientes.
          </Text>
        </View>

        {profissionais.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum profissional pendente</Text>
            <Text style={styles.emptySubtext}>
              Todos os profissionais foram validados
            </Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {profissionais.map((profissional) => (
              <View key={profissional.id} style={styles.profissionalCard}>
                {/* Cabeçalho */}
                <View style={styles.cardHeader}>
                  <View style={styles.profileSection}>
                    {profissional.fotoUrl ? (
                      <Image
                        source={{ uri: profissional.fotoUrl }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={styles.profilePlaceholder}>
                        <Text style={styles.profilePlaceholderText}>
                          {profissional.nomeCompleto.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{profissional.nomeCompleto}</Text>
                      <Text style={styles.profileEspecialidade}>
                        {profissional.especialidade}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>PENDENTE</Text>
                  </View>
                </View>

                {/* Informações */}
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.infoLabel}>E-mail:</Text>
                    <Text style={styles.infoValue}>{profissional.email}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="card-outline" size={16} color="#666" />
                    <Text style={styles.infoLabel}>CRM:</Text>
                    <Text style={styles.infoValue}>{profissional.numeroRegistro}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.infoLabel}>UF:</Text>
                    <Text style={styles.infoValue}>{profissional.ufRegistro}</Text>
                  </View>

                  {profissional.telefone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                      <Text style={styles.infoLabel}>Telefone:</Text>
                      <Text style={styles.infoValue}>{profissional.telefone}</Text>
                    </View>
                  )}
                </View>

                {/* Documentos */}
                {profissional.documentoUrl && (
                  <TouchableOpacity style={styles.documentButton}>
                    <Ionicons name="document-text-outline" size={20} color="#007AFF" />
                    <Text style={styles.documentText}>Ver Documentos</Text>
                    <Ionicons name="open-outline" size={16} color="#007AFF" />
                  </TouchableOpacity>
                )}

                {/* Ações */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => openRejectModal(profissional)}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Rejeitar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => aprovarProfissional(profissional.id)}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Aprovar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal de Rejeição */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejeitar Profissional</Text>
            <Text style={styles.modalSubtitle}>
              Informe o motivo da rejeição para {selectedProfissional?.nomeCompleto}
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Descreva o motivo da rejeição..."
              placeholderTextColor="#999"
              value={motivoRejeicao}
              onChangeText={setMotivoRejeicao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setMotivoRejeicao('');
                  setSelectedProfissional(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={rejeitarProfissional}
              >
                <Text style={styles.modalConfirmText}>Confirmar Rejeição</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  profissionalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  profilePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profilePlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileEspecialidade: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 16,
  },
  documentText: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});