import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, AlertTriangle, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { OfflineService } from '@/services/offlineService';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
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
  const offlineService = OfflineService.getInstance();

  useEffect(() => {
    // Check for low stock alerts
    const alerts = pharmacyStock.filter(med => med.stock < 10).map(med => ({
      id: med.id,
      medicine: med.name,
      currentStock: med.stock,
      reorderLevel: 10,
      severity: med.stock === 0 ? 'critical' : 'warning'
    }));
    setLowStockAlerts(alerts);
  }, [pharmacyStock]);

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.stock || !newMedicine.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been added to your inventory.`,
    });

    setNewMedicine({
      name: '',
      stock: '',
      price: '',
      manufacturer: '',
      expiryDate: ''
    });
  };

  const handleUpdateStock = (medicineId: string, newStock: number) => {
    toast({
      title: "Stock Updated",
      description: `Medicine stock has been updated to ${newStock} units.`,
    });
  };

  const handleAlternativeSuggestion = async (medicineId: string) => {
    try {
      const alternatives = await offlineService.suggestAlternatives(medicineId);
      if (alternatives.length > 0) {
        toast({
          title: "Alternatives Available",
          description: `Found ${alternatives.length} alternative medicines.`,
        });
      } else {
        toast({
          title: "No Alternatives",
          description: "No alternative medicines found for this item.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to fetch alternatives at the moment.",
        variant: "destructive"
      });
    }
  };

  const handleDeliveryOrder = (prescriptionId: string) => {
    const newOrder = {
      id: Date.now().toString(),
      prescriptionId,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      paymentMethod: 'cod'
    };
    
    setDeliveryOrders(prev => [...prev, newOrder]);
    
    toast({
      title: "Delivery Order Created",
      description: "Order has been created and will be delivered within 24 hours.",
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      <OfflineIndicator />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
        <Badge variant="secondary" className="text-warning">
          {user?.name}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="add-medicine">Add Medicine</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalMedicines}</div>
                <p className="text-xs text-muted-foreground">In your inventory</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emergency">{outOfStockCount}</div>
                <p className="text-xs text-muted-foreground">Urgent restocking</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">₹45,280</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common pharmacy management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button variant="medical" className="h-20 flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add New Medicine</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Package className="h-6 w-6" />
                <span>Update Inventory</span>
              </Button>
              <Button variant="warning" className="h-20 flex-col space-y-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Low Stock Alert</span>
              </Button>
              <Button variant="success" className="h-20 flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Delivery Orders</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Low Stock Alerts */}
          {lowStockAlerts.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Stock Alerts</span>
                </CardTitle>
                <CardDescription>Medicines requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                      <div>
                        <span className="font-medium">{alert.medicine}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          Stock: {alert.currentStock}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlternativeSuggestion(alert.id)}
                        >
                          Suggest Alternatives
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Medicine Inventory</CardTitle>
              <CardDescription>Manage your medicine stock and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pharmacyStock.map((medicine) => {
                    const status = getStockStatus(medicine.stock);
                    return (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell>{medicine.stock}</TableCell>
                        <TableCell>{medicine.price}</TableCell>
                        <TableCell>{medicine.manufacturer}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleAlternativeSuggestion(medicine.id)}
                            >
                              Alternatives
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-medicine" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add New Medicine</CardTitle>
              <CardDescription>Add medicines to your pharmacy inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Medicine Name*</label>
                  <Input
                    placeholder="e.g., Paracetamol"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock Quantity*</label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={newMedicine.stock}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price per Unit (₹)*</label>
                  <Input
                    type="number"
                    placeholder="e.g., 25"
                    value={newMedicine.price}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Manufacturer</label>
                  <Input
                    placeholder="e.g., Sun Pharma"
                    value={newMedicine.manufacturer}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, manufacturer: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleAddMedicine} variant="medical" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine to Inventory
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Delivery Management</CardTitle>
              <CardDescription>Manage medicine deliveries and cash-on-delivery orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Delivery Options</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Same Day Delivery
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Express Delivery (2 hours)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Delivery
                    </Button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Payment Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="payment" id="online" />
                      <label htmlFor="online">Online Payment</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="payment" id="cod" defaultChecked />
                      <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="payment" id="credit" />
                      <label htmlFor="credit">Credit (for regular customers)</label>
                    </div>
                  </div>
                </div>
              </div>
              
              {deliveryOrders.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Active Delivery Orders</h4>
                  <div className="space-y-2">
                    {deliveryOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <span className="font-medium">Order #{order.id}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            Delivery: {order.estimatedDelivery}
                          </span>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Medicine Requests</CardTitle>
              <CardDescription>Patient queries about medicine availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Krishna</span>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Azithromycin 250mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="success">
                    Available - 45 units
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Patient
                  </Button>
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => handleDeliveryOrder('presc1')}
                  >
                    Arrange Delivery
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Meera Singh</span>
                  <Badge variant="secondary">5 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Cetirizine 10mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="emergency">
                    Out of Stock
                  </Button>
                  <Button size="sm" variant="outline">
                    Suggest Alternative
                  </Button>
                  <Button 
                    size="sm" 
                    variant="warning"
                    onClick={() => handleAlternativeSuggestion('stock3')}
                  >
                    Find Alternatives
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyDashboard;