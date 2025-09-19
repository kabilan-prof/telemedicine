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
import { mockAppointments, mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import Toast from 'react-native-toast-message';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [medicineSearch, setMedicineSearch] = useState('');

  const patientAppointments = mockAppointments.filter(apt => apt.patientId === user?.id);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === user?.id);

  const searchMedicine = () => {
    if (!medicineSearch.trim()) return;
    
    const medicine = mockMedicineStock.find(med => 
      med.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    if (medicine) {
      Toast.show({
        type: medicine.stock > 0 ? 'success' : 'error',
        text1: medicine.stock > 0 ? 'Medicine Available!' : 'Out of Stock',
        text2: medicine.stock > 0 
          ? `${medicine.name} is available. Stock: ${medicine.stock} units, Price: ₹${medicine.price}`
          : `${medicine.name} is currently out of stock. We'll notify you when available.`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Medicine Not Found',
        text2: 'The requested medicine is not available in our database.',
      });
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will call emergency services (108). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {
          // In a real app, this would make an actual call
          Toast.show({
            type: 'info',
            text1: 'Emergency Call',
            text2: 'Calling emergency services...',
          });
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('welcome')}, {user?.name}!</Text>
        <Text style={styles.subtitleText}>{t('yourHealth')}</Text>
      </View>

      {/* Health Status Banner */}
      <View style={styles.healthBanner}>
        <View style={styles.healthBannerContent}>
          <Text style={styles.healthStatus}>{t('healthStatus')}: Good</Text>
          <Text style={styles.healthSubtext}>Last checkup: 2 weeks ago</Text>
        </View>
        <View style={styles.healthIcons}>
          <Icon name="favorite" size={32} color="white" />
          <Icon name="trending-up" size={32} color="white" />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="event" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{patientAppointments.length}</Text>
          <Text style={styles.statLabel}>{t('upcomingAppointments')}</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="description" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{patientPrescriptions.length}</Text>
          <Text style={styles.statLabel}>Active {t('prescription')}s</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>Good</Text>
          <Text style={styles.statLabel}>{t('healthStatus')} Score</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="event" size={32} color="#3b82f6" />
            <Text style={styles.actionText}>{t('bookAppointment')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="search" size={32} color="#10b981" />
            <Text style={styles.actionText}>{t('checkMedicine')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="video-call" size={32} color="#f59e0b" />
            <Text style={styles.actionText}>{t('videoCall')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.emergencyButton]}
            onPress={handleEmergencyCall}
          >
            <Icon name="warning" size={32} color="#ef4444" />
            <Text style={[styles.actionText, styles.emergencyText]}>Emergency (108)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medicine Search */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('medicineAvailability')}</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('search') + ' medicine name...'}
            value={medicineSearch}
            onChangeText={setMedicineSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchMedicine}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Popular medicines */}
        <Text style={styles.subsectionTitle}>Popular {t('medicines')}</Text>
        <View style={styles.popularMedicines}>
          {['Paracetamol', 'Azithromycin', 'Cetirizine', 'Amoxicillin'].map((medicine) => (
            <TouchableOpacity
              key={medicine}
              style={styles.medicineTag}
              onPress={() => setMedicineSearch(medicine)}
            >
              <Text style={styles.medicineTagText}>{medicine}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Prescription filled</Text>
              <Text style={styles.activityTime}>Paracetamol - 2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#3b82f6' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Appointment confirmed</Text>
              <Text style={styles.activityTime}>Dr. Rachit - Today 10:00 AM</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#f59e0b' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Health checkup reminder</Text>
              <Text style={styles.activityTime}>Due in 3 days</Text>
            </View>
          </View>
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
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748b',
  },
  healthBanner: {
    backgroundColor: '#10b981',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthBannerContent: {
    flex: 1,
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  healthSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  healthIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 15,
    marginBottom: 10,
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
  emergencyButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  emergencyText: {
    color: '#ef4444',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  popularMedicines: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  medicineTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  medicineTagText: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default PatientDashboard;