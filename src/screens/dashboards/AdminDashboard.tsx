import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { demoUsers, mockAnalytics } from '@/data/mockData';
import Toast from 'react-native-toast-message';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [systemAlerts] = useState([
    {
      id: '1',
      type: 'shortage',
      message: 'Medicine shortage reported in 3 pharmacies',
      severity: 'high',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'doctor_unavailable',
      message: 'Dr. Smith marked unavailable - 5 patients auto-redirected',
      severity: 'medium',
      timestamp: new Date()
    }
  ]);

  const exportCSV = () => {
    Toast.show({
      type: 'success',
      text1: 'Export Started',
      text2: 'Downloading system analytics as CSV file...',
    });
  };

  const handleCommunityAlert = () => {
    Toast.show({
      type: 'success',
      text1: 'Community Alert Sent',
      text2: 'Health alert has been sent to all registered users in the community.',
    });
  };

  const renderUserItem = ({ item }: { item: any }) => {
    const getRoleColor = (role: string) => {
      switch (role) {
        case 'doctor': return '#3b82f6';
        case 'patient': return '#10b981';
        case 'pharmacy': return '#f59e0b';
        case 'admin': return '#ef4444';
        default: return '#6b7280';
      }
    };

    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Icon name="person" size={24} color={getRoleColor(item.role)} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userLocation}>{item.location}</Text>
          </View>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
          <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Admin Dashboard</Text>
        <Text style={styles.subtitleText}>System Overview & Management</Text>
        <View style={styles.adminBadge}>
          <Icon name="admin-panel-settings" size={20} color="white" />
          <Text style={styles.adminText}>{user?.name}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="people" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{mockAnalytics.activePatients}</Text>
          <Text style={styles.statLabel}>Active Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="local-hospital" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{mockAnalytics.activeDoctors}</Text>
          <Text style={styles.statLabel}>Active Doctors</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="local-pharmacy" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{mockAnalytics.totalPharmacies}</Text>
          <Text style={styles.statLabel}>Partner Pharmacies</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{mockAnalytics.totalConsultations}</Text>
          <Text style={styles.statLabel}>Total Consultations</Text>
        </View>
      </View>

      {/* System Health */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Health</Text>
        <View style={styles.systemHealthCard}>
          <View style={styles.healthMetrics}>
            <View style={styles.healthMetric}>
              <Text style={styles.healthNumber}>{mockAnalytics.fulfillmentRate}%</Text>
              <Text style={styles.healthLabel}>Request Fulfillment Rate</Text>
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.healthNumber}>98.5%</Text>
              <Text style={styles.healthLabel}>System Uptime</Text>
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.healthNumber}>4.8/5</Text>
              <Text style={styles.healthLabel}>User Satisfaction</Text>
            </View>
          </View>
        </View>
      </View>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Alerts</Text>
          {systemAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Icon 
                  name="warning" 
                  size={20} 
                  color={alert.severity === 'high' ? '#ef4444' : '#f59e0b'} 
                />
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
              <View style={styles.alertFooter}>
                <Text style={styles.alertTime}>
                  {alert.timestamp.toLocaleString()}
                </Text>
                <View style={[
                  styles.severityBadge,
                  { backgroundColor: alert.severity === 'high' ? '#ef4444' : '#f59e0b' }
                ]}>
                  <Text style={styles.severityText}>{alert.severity}</Text>
                </View>
                <TouchableOpacity style={styles.resolveBtn}>
                  <Text style={styles.resolveBtnText}>Resolve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escalation Management</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.emergencyAction]}
            onPress={handleCommunityAlert}
          >
            <Icon name="campaign" size={32} color="#ef4444" />
            <Text style={styles.actionText}>Send Community Health Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="people" size={32} color="#f59e0b" />
            <Text style={styles.actionText}>Reassign Patients (Bulk)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="local-pharmacy" size={32} color="#3b82f6" />
            <Text style={styles.actionText}>Issue Pharmacy Notice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="notifications" size={32} color="#10b981" />
            <Text style={styles.actionText}>Broadcast Health Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <FlatList
          data={demoUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Reports */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate Reports</Text>
        <View style={styles.reportActions}>
          <TouchableOpacity style={styles.reportButton} onPress={exportCSV}>
            <Icon name="download" size={24} color="#3b82f6" />
            <Text style={styles.reportText}>User Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportButton} onPress={exportCSV}>
            <Icon name="trending-up" size={24} color="#10b981" />
            <Text style={styles.reportText}>Analytics Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportButton} onPress={exportCSV}>
            <Icon name="local-hospital" size={24} color="#f59e0b" />
            <Text style={styles.reportText}>Consultation Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportButton} onPress={exportCSV}>
            <Icon name="warning" size={24} color="#ef4444" />
            <Text style={styles.reportText}>Escalation Report</Text>
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
    backgroundColor: '#ef4444',
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  adminText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  systemHealthCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthMetric: {
    alignItems: 'center',
  },
  healthNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  healthLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertTime: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  resolveBtn: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveBtnText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '600',
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
  emergencyAction: {
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
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  reportButton: {
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
  reportText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AdminDashboard;