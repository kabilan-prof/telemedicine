import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockMedicineStock } from '@/data/mockData';
import Toast from 'react-native-toast-message';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    stock: '',
    price: '',
    manufacturer: '',
    expiryDate: ''
  });

  const pharmacyStock = mockMedicineStock.filter(med => med.pharmacyId === user?.id);
  const lowStockCount = pharmacyStock.filter(med => med.stock < 10).length;
  const outOfStockCount = pharmacyStock.filter(med => med.stock === 0).length;
  const totalMedicines = pharmacyStock.length;

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.stock || !newMedicine.price) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Medicine Added',
      text2: `${newMedicine.name} has been added to your inventory.`,
    });

    setNewMedicine({
      name: '',
      stock: '',
      price: '',
      manufacturer: '',
      expiryDate: ''
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock < 10) return { label: 'Low Stock', color: '#f59e0b' };
    return { label: 'In Stock', color: '#10b981' };
  };

  const renderMedicineItem = ({ item }: { item: any }) => {
    const status = getStockStatus(item.stock);
    
    return (
      <View style={styles.medicineCard}>
        <View style={styles.medicineHeader}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>
        <View style={styles.medicineDetails}>
          <Text style={styles.medicineDetail}>Stock: {item.stock} units</Text>
          <Text style={styles.medicineDetail}>Price: ₹{item.price}</Text>
          <Text style={styles.medicineDetail}>Manufacturer: {item.manufacturer}</Text>
        </View>
        <View style={styles.medicineActions}>
          <TouchableOpacity style={styles.editBtn}>
            <Icon name="edit" size={16} color="#3b82f6" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alternativeBtn}>
            <Icon name="swap-horiz" size={16} color="#f59e0b" />
            <Text style={styles.alternativeBtnText}>Alternatives</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{user?.name}</Text>
        <Text style={styles.subtitleText}>Pharmacy Management</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="inventory" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{totalMedicines}</Text>
          <Text style={styles.statLabel}>Total Medicines</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="warning" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{lowStockCount}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="error" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{outOfStockCount}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color="#10b981" />
          <Text style={styles.statNumber}>₹45,280</Text>
          <Text style={styles.statLabel}>Monthly Sales</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="add" size={32} color="#3b82f6" />
            <Text style={styles.actionText}>Add New Medicine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="inventory" size={32} color="#10b981" />
            <Text style={styles.actionText}>Update Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="warning" size={32} color="#f59e0b" />
            <Text style={styles.actionText}>Low Stock Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="local-shipping" size={32} color="#8b5cf6" />
            <Text style={styles.actionText}>Delivery Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Medicine Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Medicine</Text>
        <View style={styles.addMedicineForm}>
          <TextInput
            style={styles.input}
            placeholder="Medicine Name *"
            value={newMedicine.name}
            onChangeText={(text) => setNewMedicine(prev => ({ ...prev, name: text }))}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Stock Quantity *"
              value={newMedicine.stock}
              onChangeText={(text) => setNewMedicine(prev => ({ ...prev, stock: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Price per Unit (₹) *"
              value={newMedicine.price}
              onChangeText={(text) => setNewMedicine(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Manufacturer"
            value={newMedicine.manufacturer}
            onChangeText={(text) => setNewMedicine(prev => ({ ...prev, manufacturer: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (YYYY-MM-DD)"
            value={newMedicine.expiryDate}
            onChangeText={(text) => setNewMedicine(prev => ({ ...prev, expiryDate: text }))}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddMedicine}>
            <Icon name="add" size={20} color="white" />
            <Text style={styles.addBtnText}>Add Medicine to Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medicine Inventory */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medicine Inventory</Text>
        <FlatList
          data={pharmacyStock}
          renderItem={renderMedicineItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Medicine Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medicine Requests</Text>
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestPatient}>Krishna</Text>
            <Text style={styles.requestTime}>2 hours ago</Text>
          </View>
          <Text style={styles.requestMedicine}>Requesting availability for: Azithromycin 250mg</Text>
          <View style={styles.requestActions}>
            <TouchableOpacity style={styles.availableBtn}>
              <Text style={styles.availableBtnText}>Available - 45 units</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Icon name="phone" size={16} color="#3b82f6" />
              <Text style={styles.contactBtnText}>Contact Patient</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deliveryBtn}>
              <Icon name="local-shipping" size={16} color="#10b981" />
              <Text style={styles.deliveryBtnText}>Arrange Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestPatient}>Meera Singh</Text>
            <Text style={styles.requestTime}>5 hours ago</Text>
          </View>
          <Text style={styles.requestMedicine}>Requesting availability for: Cetirizine 10mg</Text>
          <View style={styles.requestActions}>
            <TouchableOpacity style={styles.outOfStockBtn}>
              <Text style={styles.outOfStockBtnText}>Out of Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alternativeBtn}>
              <Icon name="swap-horiz" size={16} color="#f59e0b" />
              <Text style={styles.alternativeBtnText}>Suggest Alternative</Text>
            </TouchableOpacity>
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
  addMedicineForm: {
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  addBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  medicineCard: {
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
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  medicineDetails: {
    marginBottom: 10,
  },
  medicineDetail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  medicineActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 6,
  },
  editBtnText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  alternativeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
  },
  alternativeBtnText: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestPatient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  requestTime: {
    fontSize: 12,
    color: '#64748b',
  },
  requestMedicine: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  requestActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableBtn: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  availableBtnText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  outOfStockBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outOfStockBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 6,
  },
  contactBtnText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deliveryBtnText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default PharmacyDashboard;