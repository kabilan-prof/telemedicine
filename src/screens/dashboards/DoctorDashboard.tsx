import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockAppointments } from '@/data/mockData';
import Toast from 'react-native-toast-message';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    notes: ''
  });

  const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === user?.id);
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = doctorAppointments.filter(apt => apt.status === 'approved').length;

  const handleApproveAppointment = (appointmentId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Appointment Approved',
      text2: 'Patient has been notified about the approved appointment.',
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    Toast.show({
      type: 'error',
      text1: 'Appointment Rejected',
      text2: 'Patient has been notified. Please suggest alternative dates if possible.',
    });
  };

  const handleAddPrescription = () => {
    if (!prescriptionForm.medicines.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add medicines to the prescription.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Prescription Added',
      text2: 'Prescription has been saved and patient has been notified.',
    });

    setPrescriptionForm({ patientId: '', medicines: '', notes: '' });
  };

  const startVideoCall = (appointmentId: string) => {
    Toast.show({
      type: 'info',
      text1: 'Video Call Started',
      text2: 'Connecting to patient... This is a demo simulation.',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Dr. {user?.name}</Text>
        <Text style={styles.subtitleText}>{t('providingCare')}</Text>
        <View style={styles.statusBadge}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Available for {t('consultation')}s</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="schedule" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="event" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{approvedCount}</Text>
          <Text style={styles.statLabel}>Today's {t('appointments')}</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="people" size={24} color="#10b981" />
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="video-call" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>{t('consultation')}s</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="check-circle" size={32} color="#10b981" />
            <Text style={styles.actionText}>Approve {t('appointments')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="description" size={32} color="#3b82f6" />
            <Text style={styles.actionText}>Write {t('prescription')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="video-call" size={32} color="#f59e0b" />
            <Text style={styles.actionText}>{t('startVideoCall')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="psychology" size={32} color="#8b5cf6" />
            <Text style={styles.actionText}>AI Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointment Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('appointments')} Requests</Text>
        {doctorAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.patientInfo}>
                <Icon name="person" size={20} color="#10b981" />
                <Text style={styles.patientName}>{appointment.patientName}</Text>
                <View style={styles.newPatientBadge}>
                  <Text style={styles.newPatientText}>New Patient</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: appointment.status === 'pending' ? '#fef3c7' : '#dcfce7' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: appointment.status === 'pending' ? '#d97706' : '#16a34a' }
                ]}>
                  {appointment.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailItem}>
                <Icon name="event" size={16} color="#64748b" />
                <Text style={styles.detailText}>{appointment.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="schedule" size={16} color="#64748b" />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
            </View>

            {appointment.symptoms && (
              <View style={styles.symptomsContainer}>
                <Text style={styles.symptomsLabel}>{t('symptoms')}:</Text>
                <Text style={styles.symptomsText}>{appointment.symptoms}</Text>
              </View>
            )}

            {appointment.status === 'pending' && (
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApproveAppointment(appointment.id)}
                >
                  <Icon name="check" size={16} color="white" />
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleRejectAppointment(appointment.id)}
                >
                  <Icon name="close" size={16} color="white" />
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}

            {appointment.status === 'approved' && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.videoBtn]}
                onPress={() => startVideoCall(appointment.id)}
              >
                <Icon name="video-call" size={16} color="white" />
                <Text style={styles.actionBtnText}>{t('startVideoCall')}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Add Prescription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add {t('prescription')}</Text>
        <View style={styles.prescriptionForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter patient name or ID"
            value={prescriptionForm.patientId}
            onChangeText={(text) => setPrescriptionForm(prev => ({ ...prev, patientId: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Paracetamol 500mg - Twice daily for 5 days"
            value={prescriptionForm.medicines}
            onChangeText={(text) => setPrescriptionForm(prev => ({ ...prev, medicines: text }))}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional instructions for the patient"
            value={prescriptionForm.notes}
            onChangeText={(text) => setPrescriptionForm(prev => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.prescriptionBtn} onPress={handleAddPrescription}>
            <Icon name="description" size={20} color="white" />
            <Text style={styles.prescriptionBtnText}>Add {t('prescription')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 15,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionButton: {
    width: '47%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  newPatientBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  newPatientText: {
    fontSize: 10,
    color: '#0284c7',
    fontWeight: '600',
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  symptomsContainer: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  symptomsText: {
    fontSize: 14,
    color: '#64748b',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  approveBtn: {
    backgroundColor: '#10b981',
  },
  rejectBtn: {
    backgroundColor: '#ef4444',
  },
  videoBtn: {
    backgroundColor: '#3b82f6',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  prescriptionForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prescriptionBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  prescriptionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DoctorDashboard;