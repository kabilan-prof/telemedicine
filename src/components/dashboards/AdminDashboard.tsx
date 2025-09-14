import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, Activity, Building2, TrendingUp, Download, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers, mockAnalytics } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { OfflineService } from '@/services/offlineService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [govSchemes, setGovSchemes] = useState<any[]>([]);
  const offlineService = OfflineService.getInstance();

  useEffect(() => {
    // Initialize system alerts
    setSystemAlerts([
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

    // Initialize government schemes
    setGovSchemes([
      {
        id: '1',
        name: 'Ayushman Bharat',
        coverage: '₹5,00,000 per family',
        eligibility: 'BPL families',
        status: 'active'
      },
      {
        id: '2',
        name: 'Pradhan Mantri Jan Aushadhi',
        coverage: 'Generic medicines at 50-90% discount',
        eligibility: 'All citizens',
        status: 'active'
      }
    ]);
  }, []);

  const exportCSV = () => {
    toast({
      title: "Export Started",
      description: "Downloading system analytics as CSV file...",
    });
  };

  const handleEscalation = (alertId: string, action: string) => {
    toast({
      title: "Escalation Triggered",
      description: `${action} has been initiated for alert ${alertId}.`,
    });
    
    // Remove handled alert
    setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleCommunityAlert = () => {
    toast({
      title: "Community Alert Sent",
      description: "Health alert has been sent to all registered users in the community.",
    });
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--emergency))', 'hsl(var(--accent))'];

  const pieData = mockAnalytics.topMedicines.map((item, index) => ({
    name: item.name,
    value: item.requests,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <OfflineIndicator />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <Badge variant="secondary" className="text-emergency">
          {user?.name}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{mockAnalytics.activePatients}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockAnalytics.activeDoctors}</div>
                <p className="text-xs text-muted-foreground">+3 new this month</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partner Pharmacies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{mockAnalytics.totalPharmacies}</div>
                <p className="text-xs text-muted-foreground">2 pending approval</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emergency">{mockAnalytics.totalConsultations}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Weekly Consultations</CardTitle>
                <CardDescription>Number of consultations per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAnalytics.weeklyConsultations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Requested Medicines</CardTitle>
                <CardDescription>Most requested medicines this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overall platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-success">{mockAnalytics.fulfillmentRate}%</div>
                  <div className="text-sm text-muted-foreground">Request Fulfillment Rate</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">98.5%</div>
                  <div className="text-sm text-muted-foreground">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-warning">4.8/5</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* System Alerts */}
          {systemAlerts.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-warning">
                  <AlertCircle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
                <CardDescription>Critical issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                      <div>
                        <span className="font-medium">{alert.message}</span>
                        <span className="text-sm text-muted-foreground block">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEscalation(alert.id, 'Auto-resolve')}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'doctor' ? 'default' :
                          user.role === 'patient' ? 'secondary' :
                          user.role === 'pharmacy' ? 'outline' : 'destructive'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Patients</span>
                    <span className="font-medium text-success">+185 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Doctors</span>
                    <span className="font-medium text-primary">+12 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Pharmacies</span>
                    <span className="font-medium text-warning">+5 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Platform financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="font-medium text-success">₹2,45,680</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Consultation Fees</span>
                    <span className="font-medium text-primary">₹1,85,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pharmacy Commission</span>
                    <span className="font-medium text-warning">₹60,280</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Top Medicines by Demand</CardTitle>
              <CardDescription>Most requested medicines across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Total Requests</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg. Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnalytics.topMedicines.map((medicine, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.requests}</TableCell>
                      <TableCell>
                        <Badge variant="default">{85 + index * 2}%</Badge>
                      </TableCell>
                      <TableCell>₹{25 + index * 15}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Escalation Management</CardTitle>
              <CardDescription>Handle critical issues and system escalations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="emergency" className="w-full justify-start">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Send Community Health Alert
                    </Button>
                    <Button variant="warning" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Reassign Patients (Bulk)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Issue Pharmacy Notice
                    </Button>
                    <Button 
                      variant="success" 
                      className="w-full justify-start"
                      onClick={handleCommunityAlert}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Broadcast Health Update
                    </Button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Government Schemes</h4>
                  <div className="space-y-3">
                    {govSchemes.map((scheme) => (
                      <div key={scheme.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{scheme.name}</span>
                          <Badge variant="default">{scheme.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{scheme.coverage}</p>
                        <p className="text-xs text-muted-foreground">Eligibility: {scheme.eligibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Card className="bg-gradient-subtle">
                <CardHeader>
                  <CardTitle className="text-lg">Offline-First Sync Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {offlineService.isConnected() ? 'Online' : 'Offline'}
                      </div>
                      <div className="text-sm text-muted-foreground">System Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-sm text-muted-foreground">Pending Sync</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">
                        {offlineService.getNetworkQuality()}
                      </div>
                      <div className="text-sm text-muted-foreground">Network Quality</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Export platform data and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Button onClick={exportCSV} variant="medical" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>User Report</span>
                </Button>
                <Button onClick={exportCSV} variant="outline" className="h-20 flex-col space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Analytics Report</span>
                </Button>
                <Button onClick={exportCSV} variant="success" className="h-20 flex-col space-y-2">
                  <Activity className="h-6 w-6" />
                  <span>Consultation Report</span>
                </Button>
                <Button onClick={exportCSV} variant="outline" className="h-20 flex-col space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>Escalation Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="font-medium">Low Medicine Stock Alert</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 pharmacies reported low stock for Azithromycin. Consider reaching out to suppliers.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-success" />
                  <span className="font-medium">System Performance Normal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All systems are running smoothly. No issues detected in the last 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;