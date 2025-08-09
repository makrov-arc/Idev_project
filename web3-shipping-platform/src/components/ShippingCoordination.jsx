import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Globe, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plane,
  Ship,
  Building
} from 'lucide-react';
import '../App.css';

const ShippingCoordination = () => {
  const [selectedView, setSelectedView] = useState('overview');

  const stats = [
    {
      title: 'الشحن الداخلي',
      value: '156',
      icon: Truck,
      change: '+12%',
      color: 'text-blue-400'
    },
    {
      title: 'الشحن الخارجي',
      value: '89',
      icon: Plane,
      change: '+8%',
      color: 'text-green-400'
    },
    {
      title: 'الشحن البحري',
      value: '23',
      icon: Ship,
      change: '+15%',
      color: 'text-purple-400'
    },
    {
      title: 'المراكز النشطة',
      value: '12',
      icon: Building,
      change: '+5%',
      color: 'text-cyan-400'
    }
  ];

  const internalShipments = [
    {
      id: 'INT001',
      route: 'الرياض → جدة',
      driver: 'أحمد محمد',
      packages: 15,
      status: 'in-transit',
      estimatedArrival: '2024-01-15 - 6:00 م',
      distance: '950 كم'
    },
    {
      id: 'INT002',
      route: 'الدمام → الرياض',
      driver: 'محمد علي',
      packages: 8,
      status: 'loading',
      estimatedArrival: '2024-01-15 - 8:00 م',
      distance: '400 كم'
    }
  ];

  const externalShipments = [
    {
      id: 'EXT001',
      destination: 'دبي، الإمارات',
      carrier: 'شركة الشحن الدولية',
      packages: 25,
      status: 'customs',
      estimatedArrival: '2024-01-17',
      method: 'جوي'
    },
    {
      id: 'EXT002',
      destination: 'الكويت',
      carrier: 'الخليج للشحن',
      packages: 12,
      status: 'shipped',
      estimatedArrival: '2024-01-16',
      method: 'بري'
    }
  ];

  const shippingCenters = [
    {
      id: 'CTR001',
      name: 'مركز الرياض الرئيسي',
      location: 'الرياض، حي الصناعية',
      capacity: '1000 طرد',
      currentLoad: '750 طرد',
      utilization: 75,
      status: 'active'
    },
    {
      id: 'CTR002',
      name: 'مركز جدة',
      location: 'جدة، المنطقة الصناعية',
      capacity: '800 طرد',
      currentLoad: '600 طرد',
      utilization: 75,
      status: 'active'
    },
    {
      id: 'CTR003',
      name: 'مركز الدمام',
      location: 'الدمام، المنطقة الشرقية',
      capacity: '600 طرد',
      currentLoad: '200 طرد',
      utilization: 33,
      status: 'low'
    }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>
                      <TrendingUp className="h-4 w-4 inline ml-1" />
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Shipping Centers Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">حالة مراكز الشحن</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingCenters.map((center) => (
              <div key={center.id} className="p-4 rounded-lg bg-card/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{center.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {center.location}
                    </p>
                  </div>
                  <Badge className={`${
                    center.status === 'active' ? 'status-delivered' :
                    center.status === 'low' ? 'status-pending' :
                    'status-returned'
                  } text-white`}>
                    {center.status === 'active' ? 'نشط' :
                     center.status === 'low' ? 'حمولة منخفضة' : 'غير نشط'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">السعة الكاملة:</p>
                    <p className="font-medium">{center.capacity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الحمولة الحالية:</p>
                    <p className="font-medium">{center.currentLoad}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>معدل الاستخدام</span>
                    <span>{center.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        center.utilization > 80 ? 'bg-red-500' :
                        center.utilization > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${center.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const InternalTab = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Truck className="h-5 w-5" />
          الشحن الداخلي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {internalShipments.map((shipment) => (
            <div key={shipment.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{shipment.id}</h3>
                  <p className="text-sm text-muted-foreground">{shipment.route}</p>
                </div>
                <Badge className={`${
                  shipment.status === 'in-transit' ? 'status-in-transit' :
                  shipment.status === 'loading' ? 'status-pending' :
                  'status-delivered'
                } text-white`}>
                  {shipment.status === 'in-transit' ? 'في الطريق' :
                   shipment.status === 'loading' ? 'قيد التحميل' : 'تم التسليم'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">السائق:</p>
                  <p className="font-medium">{shipment.driver}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">عدد الطرود:</p>
                  <p className="font-medium">{shipment.packages} طرد</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المسافة:</p>
                  <p className="font-medium">{shipment.distance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوصول المتوقع:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {shipment.estimatedArrival}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-primary/20">
                  تتبع الرحلة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تواصل مع السائق
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ExternalTab = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Globe className="h-5 w-5" />
          الشحن الخارجي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {externalShipments.map((shipment) => (
            <div key={shipment.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{shipment.id}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {shipment.destination}
                  </p>
                </div>
                <Badge className={`${
                  shipment.status === 'shipped' ? 'status-in-transit' :
                  shipment.status === 'customs' ? 'status-pending' :
                  'status-delivered'
                } text-white`}>
                  {shipment.status === 'shipped' ? 'تم الشحن' :
                   shipment.status === 'customs' ? 'في الجمارك' : 'تم التسليم'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">شركة الشحن:</p>
                  <p className="font-medium">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">عدد الطرود:</p>
                  <p className="font-medium">{shipment.packages} طرد</p>
                </div>
                <div>
                  <p className="text-muted-foreground">طريقة الشحن:</p>
                  <p className="font-medium">{shipment.method}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوصول المتوقع:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {shipment.estimatedArrival}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-primary/20">
                  تتبع الشحنة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تواصل مع الشركة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تحديث الحالة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 arabic-text">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-4">تنسيق عمليات الشحن</h1>
        <p className="text-muted-foreground">إدارة وتنسيق عمليات الشحن الداخلية والخارجية</p>
      </div>

      {/* Navigation Tabs */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={selectedView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('overview')}
              className={selectedView === 'overview' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Building className="h-4 w-4 ml-2" />
              نظرة عامة
            </Button>
            <Button
              variant={selectedView === 'internal' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('internal')}
              className={selectedView === 'internal' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Truck className="h-4 w-4 ml-2" />
              الشحن الداخلي
            </Button>
            <Button
              variant={selectedView === 'external' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('external')}
              className={selectedView === 'external' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Globe className="h-4 w-4 ml-2" />
              الشحن الخارجي
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Content */}
      {selectedView === 'overview' && <OverviewTab />}
      {selectedView === 'internal' && <InternalTab />}
      {selectedView === 'external' && <ExternalTab />}

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-blue-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إنشاء شحنة جديدة</h3>
                <p className="text-sm text-muted-foreground">أضف شحنة داخلية أو خارجية</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إدارة الشركاء</h3>
                <p className="text-sm text-muted-foreground">إدارة شركات الشحن الخارجية</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">تقارير الأداء</h3>
                <p className="text-sm text-muted-foreground">عرض تقارير مفصلة</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingCoordination;

