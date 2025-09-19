import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return '#3b82f6';
      case 'patient':
        return '#10b981';
      case 'pharmacy':
        return '#f59e0b';
      case 'admin':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={60} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role || '') }]}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Icon name="email" size={20} color="#6b7280" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        
        {user?.phone && (
          <View style={styles.infoItem}>
            <Icon name="phone" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
        
        {user?.location && (
          <View style={styles.infoItem}>
            <Icon name="location-on" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
        )}
        
        {user?.specialization && (
          <View style={styles.infoItem}>
            <Icon name="local-hospital" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{user.specialization}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionItem}>
          <Icon name="settings" size={24} color="#6b7280" />
          <Text style={styles.actionText}>{t('settings')}</Text>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Icon name="help" size={24} color="#6b7280" />
          <Text style={styles.actionText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Icon name="info" size={24} color="#6b7280" />
          <Text style={styles.actionText}>About</Text>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionItem, styles.logoutItem]} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#ef4444" />
          <Text style={[styles.actionText, styles.logoutText]}>{t('logout')}</Text>
          <Icon name="chevron-right" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 {t('teleMedRural')}</Text>
        <Text style={styles.footerSubtext}>{t('bridgingHealthcare')}</Text>
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
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
  },
  actionsSection: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
    flex: 1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;