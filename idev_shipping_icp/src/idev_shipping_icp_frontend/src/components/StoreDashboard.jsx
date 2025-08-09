import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import '../App.css';

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const stats = [
    {
      title: 'إجمالي الشحنات',
      value: '156',
      icon: Package,
      change: '+12%',
      color: 'text-blue-400'
    },
    {
      title: 'قيد الانتظار',
      value: '23',
      icon: Clock,
      change: '+5%',
      color: 'text-yellow-400'
    },
    {
      title: 'تم التسليم',
      value: '128',
      icon: CheckCircle,
      change: '+8%',
      color: 'text-green-400'
    },
    {
      title: 'المرتجعات',
      value: '5',
      icon: AlertCircle,
      change: '-2%',
      color: 'text-red-400'
    }
  ];

  const recentShipments = [
    {
      id: 'SH001',
      recipient: 'أحمد محمد',
      address: 'الرياض، حي النخيل',
      status: 'delivered',
      statusText: 'تم التسليم',
      date: '2024-01-15',
      value: '250 ريال'
    },
    {
      id: 'SH002',
      recipient: 'فاطمة أحمد',
      address: 'جدة، حي الصفا',
      status: 'in-transit',
      statusText: 'في الطريق',
      date: '2024-01-14',
      value: '180 ريال'
    },
    {
      id: 'SH003',
      recipient: 'محمد علي',
      address: 'الدمام، حي الشاطئ',
      status: 'pending',
      statusText: 'قيد الانتظار',
      date: '2024-01-14',
      value: '320 ريال'
    }
  ];

  const CreateShipmentForm = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إنشاء شحنة جديدة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">بيانات المرسل</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="senderName">اسم المرسل</Label>
                <Input id="senderName" placeholder="أدخل اسم المرسل" />
              </div>
              <div>
                <Label htmlFor="senderPhone">رقم الهاتف</Label>
                <Input id="senderPhone" placeholder="05xxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="senderAddress">عنوان المرسل</Label>
                <Textarea id="senderAddress" placeholder="أدخل العنوان التفصيلي" />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">بيانات المستلم</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="recipientName">اسم المستلم</Label>
                <Input id="recipientName" placeholder="أدخل اسم المستلم" />
              </div>
              <div>
                <Label htmlFor="recipientPhone">رقم الهاتف</Label>
                <Input id="recipientPhone" placeholder="05xxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="recipientAddress">عنوان المستلم</Label>
                <Textarea id="recipientAddress" placeholder="أدخل العنوان التفصيلي" />
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">تفاصيل الطرد</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="packageType">نوع الطرد</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الطرد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">إلكترونيات</SelectItem>
                  <SelectItem value="clothing">ملابس</SelectItem>
                  <SelectItem value="books">كتب</SelectItem>
                  <SelectItem value="food">طعام</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">الوزن (كيلو)</Label>
              <Input id="weight" type="number" placeholder="2.5" />
            </div>
            <div>
              <Label htmlFor="value">قيمة الطرد (ريال)</Label>
              <Input id="value" type="number" placeholder="150" />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">خيارات التوصيل</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="deliveryType">نوع التوصيل</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التوصيل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">عادي (2-3 أيام)</SelectItem>
                  <SelectItem value="express">سريع (24 ساعة)</SelectItem>
                  <SelectItem value="same-day">نفس اليوم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredTime">الوقت المفضل</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت المفضل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">صباحاً (9-12)</SelectItem>
                  <SelectItem value="afternoon">بعد الظهر (12-5)</SelectItem>
                  <SelectItem value="evening">مساءً (5-9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod">طريقة الدفع</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقداً عند التسليم</SelectItem>
                  <SelectItem value="card">بطاقة ائتمان</SelectItem>
                  <SelectItem value="bank">تحويل بنكي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <Label htmlFor="instructions">تعليمات خاصة</Label>
          <Textarea 
            id="instructions" 
            placeholder="أي تعليمات خاصة للتوصيل..."
            className="min-h-[80px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button className="btn-primary flex-1">
            <Package className="h-4 w-4 ml-2" />
            إنشاء الشحنة
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateForm(false)}
            className="border-primary/20 hover:bg-primary/10"
          >
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 arabic-text">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">لوحة تحكم المتجر</h1>
          <p className="text-muted-foreground">إدارة شحناتك ومتابعة طلباتك</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 ml-2" />
          شحنة جديدة
        </Button>
      </div>

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

      {/* Create Shipment Form */}
      {showCreateForm && <CreateShipmentForm />}

      {/* Recent Shipments */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    shipment.status === 'delivered' ? 'status-delivered text-white' :
                    shipment.status === 'in-transit' ? 'status-in-transit text-white' :
                    'status-pending text-white'
                  }`}>
                    {shipment.statusText}
                  </div>
                  <div>
                    <p className="font-semibold">{shipment.id}</p>
                    <p className="text-sm text-muted-foreground">{shipment.recipient}</p>
                  </div>
                </div>
                
                <div className="text-center hidden md:block">
                  <p className="text-sm">{shipment.address}</p>
                  <p className="text-xs text-muted-foreground">{shipment.date}</p>
                </div>
                
                <div className="text-left">
                  <p className="font-semibold text-primary">{shipment.value}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreDashboard;

