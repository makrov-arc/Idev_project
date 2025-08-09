import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  RotateCcw, 
  Package, 
  User, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare
} from 'lucide-react';
import '../App.css';

const ReturnsManagement = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedReturn, setSelectedReturn] = useState(null);

  const returnRequests = {
    pending: [
      {
        id: 'RT001',
        shipmentId: 'SH001',
        customer: 'أحمد محمد',
        reason: 'منتج معيب',
        description: 'المنتج وصل مكسور',
        requestDate: '2024-01-15',
        value: '250 ريال',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'RT002',
        shipmentId: 'SH002',
        customer: 'فاطمة أحمد',
        reason: 'لا يطابق الوصف',
        description: 'اللون مختلف عن المطلوب',
        requestDate: '2024-01-14',
        value: '180 ريال',
        status: 'pending',
        priority: 'medium'
      }
    ],
    approved: [
      {
        id: 'RT003',
        shipmentId: 'SH003',
        customer: 'محمد علي',
        reason: 'تغيير في الطلب',
        description: 'العميل غير رأيه',
        requestDate: '2024-01-13',
        value: '320 ريال',
        status: 'approved',
        approvedDate: '2024-01-14'
      }
    ],
    rejected: [
      {
        id: 'RT004',
        shipmentId: 'SH004',
        customer: 'سارة أحمد',
        reason: 'وصل متأخر',
        description: 'تأخر التوصيل يوم واحد',
        requestDate: '2024-01-12',
        value: '150 ريال',
        status: 'rejected',
        rejectionReason: 'التأخير ضمن المدة المقبولة'
      }
    ]
  };

  const stats = [
    {
      title: 'طلبات الإرجاع',
      value: returnRequests.pending.length,
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      title: 'تمت الموافقة',
      value: returnRequests.approved.length,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      title: 'تم الرفض',
      value: returnRequests.rejected.length,
      icon: XCircle,
      color: 'text-red-400'
    },
    {
      title: 'إجمالي القيمة',
      value: '750 ريال',
      icon: DollarSign,
      color: 'text-blue-400'
    }
  ];

  const handleApprove = (returnId) => {
    console.log('Approving return:', returnId);
    // Handle approval logic
  };

  const handleReject = (returnId) => {
    console.log('Rejecting return:', returnId);
    // Handle rejection logic
  };

  const ReturnDetails = ({ returnItem }) => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Package className="h-5 w-5" />
          تفاصيل طلب الإرجاع {returnItem.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-primary mb-2">معلومات العميل</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">الاسم:</span> {returnItem.customer}</p>
              <p><span className="text-muted-foreground">رقم الشحنة:</span> {returnItem.shipmentId}</p>
              <p><span className="text-muted-foreground">تاريخ الطلب:</span> {returnItem.requestDate}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-2">تفاصيل الإرجاع</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">السبب:</span> {returnItem.reason}</p>
              <p><span className="text-muted-foreground">القيمة:</span> {returnItem.value}</p>
              <p>
                <span className="text-muted-foreground">الأولوية:</span>
                <Badge className={`mr-2 ${
                  returnItem.priority === 'high' ? 'bg-red-500' :
                  returnItem.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                } text-white`}>
                  {returnItem.priority === 'high' ? 'عالية' :
                   returnItem.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </Badge>
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-primary mb-2">وصف المشكلة</h4>
          <p className="text-sm bg-card/50 p-3 rounded-lg">{returnItem.description}</p>
        </div>

        {returnItem.status === 'pending' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات الإدارة</label>
              <Textarea placeholder="أضف ملاحظاتك هنا..." />
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => handleApprove(returnItem.id)}
                className="bg-green-500 hover:bg-green-600 text-white flex-1"
              >
                <CheckCircle className="h-4 w-4 ml-2" />
                موافقة على الإرجاع
              </Button>
              <Button 
                onClick={() => handleReject(returnItem.id)}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 ml-2" />
                رفض الطلب
              </Button>
            </div>
          </div>
        )}

        {returnItem.status === 'approved' && (
          <div className="bg-green-500/20 p-4 rounded-lg">
            <p className="text-green-400 font-medium">
              ✅ تمت الموافقة على طلب الإرجاع في {returnItem.approvedDate}
            </p>
          </div>
        )}

        {returnItem.status === 'rejected' && (
          <div className="bg-red-500/20 p-4 rounded-lg">
            <p className="text-red-400 font-medium mb-2">❌ تم رفض طلب الإرجاع</p>
            <p className="text-sm text-muted-foreground">السبب: {returnItem.rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 arabic-text">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-4">إدارة المرتجعات</h1>
        <p className="text-muted-foreground">إدارة ومعالجة طلبات إرجاع الشحنات</p>
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
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={selectedTab === 'pending' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('pending')}
              className={selectedTab === 'pending' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Clock className="h-4 w-4 ml-2" />
              قيد الانتظار ({returnRequests.pending.length})
            </Button>
            <Button
              variant={selectedTab === 'approved' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('approved')}
              className={selectedTab === 'approved' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              تمت الموافقة ({returnRequests.approved.length})
            </Button>
            <Button
              variant={selectedTab === 'rejected' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('rejected')}
              className={selectedTab === 'rejected' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <XCircle className="h-4 w-4 ml-2" />
              تم الرفض ({returnRequests.rejected.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {returnRequests[selectedTab].map((returnItem) => (
              <div key={returnItem.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${
                      returnItem.status === 'pending' ? 'status-pending' :
                      returnItem.status === 'approved' ? 'status-delivered' :
                      'status-returned'
                    } text-white`}>
                      {returnItem.status === 'pending' ? 'قيد الانتظار' :
                       returnItem.status === 'approved' ? 'تمت الموافقة' : 'تم الرفض'}
                    </Badge>
                    {returnItem.priority && (
                      <Badge className={`${
                        returnItem.priority === 'high' ? 'bg-red-500' :
                        returnItem.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } text-white`}>
                        {returnItem.priority === 'high' ? 'عالية' :
                         returnItem.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{returnItem.value}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedReturn(returnItem)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">رقم الطلب:</p>
                    <p className="font-medium">{returnItem.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">العميل:</p>
                    <p className="font-medium">{returnItem.customer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">السبب:</p>
                    <p className="font-medium">{returnItem.reason}</p>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <p className="text-muted-foreground">الوصف:</p>
                  <p className="bg-card/30 p-2 rounded mt-1">{returnItem.description}</p>
                </div>

                {returnItem.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(returnItem.id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 ml-1" />
                      موافقة
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(returnItem.id)}
                    >
                      <XCircle className="h-4 w-4 ml-1" />
                      رفض
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-primary/20"
                    >
                      <MessageSquare className="h-4 w-4 ml-1" />
                      تواصل
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Return Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReturnDetails returnItem={selectedReturn} />
            <Button 
              onClick={() => setSelectedReturn(null)}
              className="w-full mt-4"
              variant="outline"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsManagement;

