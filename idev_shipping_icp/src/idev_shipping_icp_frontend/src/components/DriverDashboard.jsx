import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  User, 
  Star, 
  MapPin, 
  Clock, 
  Package, 
  Phone, 
  Navigation, 
  CheckCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import '../App.css';

const DriverDashboard = () => {
  const [currentDelivery, setCurrentDelivery] = useState({
    id: 'SH001',
    recipient: 'أحمد محمد',
    address: 'الرياض، حي النخيل، شارع الملك فهد',
    phone: '0509876543',
    estimatedTime: '15 دقيقة',
    packageType: 'إلكترونيات',
    weight: '2.5 كيلو',
    instructions: 'الاتصال قبل الوصول بـ 5 دقائق'
  });

  const availableOrders = [
    {
      id: 'SH001',
      pickup: 'الرياض، حي العليا',
      delivery: 'الرياض، حي النخيل',
      distance: '12 كم',
      payment: '45 ريال',
      packageType: 'إلكترونيات',
      weight: '2.5 كيلو',
      estimatedTime: '25 دقيقة'
    },
    {
      id: 'SH002',
      pickup: 'الرياض، حي الملقا',
      delivery: 'الرياض، حي السليمانية',
      distance: '8 كم',
      payment: '30 ريال',
      packageType: 'ملابس',
      weight: '0.5 كيلو',
      estimatedTime: '18 دقيقة'
    }
  ];

  const todayStats = {
    deliveries: 6,
    earnings: 450,
    rating: 4.8,
    distance: 85
  };

  return (
    <div className="space-y-6 arabic-text">
      {/* Driver Profile Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">محمد السائق</h2>
              <p className="text-muted-foreground">متاح للتوصيل</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{todayStats.rating}</span>
                <Badge variant="secondary" className="mr-2">متميز</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{todayStats.deliveries}</p>
            <p className="text-sm text-muted-foreground">في الانتظار</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">تم تسليم</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{todayStats.earnings}</p>
            <p className="text-sm text-muted-foreground">ريال اليوم</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{todayStats.distance}</p>
            <p className="text-sm text-muted-foreground">كم اليوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Delivery */}
      {currentDelivery && (
        <Card className="glass-card border-primary/50">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Package className="h-5 w-5" />
              التوصيل الحالي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{currentDelivery.recipient}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {currentDelivery.address}
                </p>
              </div>
              <Badge className="status-in-transit text-white">قيد التوصيل</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">الوقت المتوقع:</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentDelivery.estimatedTime}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">النوع:</p>
                <p className="font-medium">{currentDelivery.packageType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">الوزن:</p>
                <p className="font-medium">{currentDelivery.weight}</p>
              </div>
              <div>
                <p className="text-muted-foreground">الهاتف:</p>
                <p className="font-medium">{currentDelivery.phone}</p>
              </div>
            </div>
            
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">تعليمات خاصة:</p>
              <p className="text-sm">{currentDelivery.instructions}</p>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1 btn-primary">
                <Navigation className="h-4 w-4 ml-2" />
                التنقل
              </Button>
              <Button variant="outline" className="border-primary/20">
                <Phone className="h-4 w-4 ml-2" />
                اتصال
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle className="h-4 w-4 ml-2" />
                تأكيد التسليم
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Orders */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Package className="h-5 w-5" />
            الطلبات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableOrders.map((order) => (
            <div key={order.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{order.id}</h3>
                <Badge className="bg-green-500 text-white">{order.payment}</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-muted-foreground">الاستلام من:</span>
                  <span>{order.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span className="text-muted-foreground">التسليم إلى:</span>
                  <span>{order.delivery}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المسافة: {order.distance}</span>
                  <span className="text-muted-foreground">الوقت: {order.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">النوع: {order.packageType}</span>
                  <span className="text-muted-foreground">الوزن: {order.weight}</span>
                </div>
              </div>
              
              <Button className="w-full mt-3 btn-primary">
                قبول الطلب
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            أرباح اليوم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">450 ريال</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>8 توصيلات مكتملة</span>
              <span>•</span>
              <span>تقييم 4.8</span>
              <span>•</span>
              <span>85 كم</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;

