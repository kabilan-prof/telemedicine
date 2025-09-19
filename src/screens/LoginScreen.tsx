import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Toast from 'react-native-toast-message';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoCredentials = [
    { role: 'Patient', email: 'patient@demo.com', icon: 'favorite', color: '#10b981' },
    { role: 'Doctor', email: 'doctor@demo.com', icon: 'local-hospital', color: '#3b82f6' },
    { role: 'Pharmacy', email: 'pharmacy@demo.com', icon: 'local-pharmacy', color: '#f59e0b' },
    { role: 'Admin', email: 'admin@demo.com', icon: 'admin-panel-settings', color: '#ef4444' },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        Toast.show({
          type: 'success',
          text1: t('login') + ' Successful',
          text2: 'Welcome to ' + t('teleMedRural') + '!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('login') + ' Failed',
          text2: 'Invalid credentials. Please use demo credentials.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('12345');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="local-hospital" size={32} color="#3b82f6" />
          <Text style={styles.headerTitle}>{t('teleMedRural')}</Text>
        </View>
        <View style={styles.headerRight}>
          <LanguageSelector />
          <ThemeSelector />
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>{t('connectingRural')}</Text>
        <Text style={styles.heroSubtitle}>
          Bridge the healthcare gap with our telemedicine platform. Get consultations,
          prescriptions, and medicine availability checks from the comfort of your village.
        </Text>

        {/* Feature highlights */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureTag, { backgroundColor: '#3b82f6' }]}>
            <Icon name="video-call" size={16} color="white" />
            <Text style={styles.featureText}>{t('videoConsultation')}</Text>
          </View>
          <View style={[styles.featureTag, { backgroundColor: '#10b981' }]}>
            <Icon name="local-pharmacy" size={16} color="white" />
            <Text style={styles.featureText}>Medicine Delivery</Text>
          </View>
          <View style={[styles.featureTag, { backgroundColor: '#f59e0b' }]}>
            <Icon name="access-time" size={16} color="white" />
            <Text style={styles.featureText}>24/7 Support</Text>
          </View>
        </View>
      </View>

      {/* Login Form */}
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>{t('login')} to {t('teleMedRural')}</Text>
        <Text style={styles.loginSubtitle}>
          Choose your role or use demo credentials to explore
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? t('loading') : t('signIn')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('demoAccess')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.demoCredentials}>
          {demoCredentials.map((cred) => (
            <TouchableOpacity
              key={cred.role}
              style={styles.demoButton}
              onPress={() => quickLogin(cred.email)}
            >
              <Icon name={cred.icon} size={24} color={cred.color} />
              <Text style={styles.demoButtonText}>{cred.role}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.demoNote}>
          Demo password for all accounts: <Text style={styles.demoPassword}>12345</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  featureText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  loginCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  demoCredentials: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  demoButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    color: '#374151',
  },
  demoNote: {
    fontSize: 12,
    textAlign: 'center',
    color: '#64748b',
  },
  demoPassword: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});

export default LoginScreen;