import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PatientDashboard from '@/screens/dashboards/PatientDashboard';
import DoctorDashboard from '@/screens/dashboards/DoctorDashboard';
import PharmacyDashboard from '@/screens/dashboards/PharmacyDashboard';
import AdminDashboard from '@/screens/dashboards/AdminDashboard';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'patient':
        return PatientDashboard;
      case 'doctor':
        return DoctorDashboard;
      case 'pharmacy':
        return PharmacyDashboard;
      case 'admin':
        return AdminDashboard;
      default:
        return PatientDashboard;
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'dashboard';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8fafc',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardComponent}
        options={{ title: t('dashboard') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: t('profile') }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;