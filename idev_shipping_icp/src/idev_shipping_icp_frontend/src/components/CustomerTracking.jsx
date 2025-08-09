import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Phone,
  User,
  Calendar
} from 'lucide-react';
import '../App.css';

const CustomerTracking = () => {
  const { t } = useTranslation();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = () => {
    // Simulate tracking result
    if (trackingNumber) {
      setTrackingResult({
        id: trackingNumber,
        status: 'in-transit',
        statusText: t('on_the_way'),
        currentLocation: 'الرياض، طريق الملك فهد',
        estimatedDelivery: '2024-01-15 15:30',
        timeline: [
          {
            step: 1,
            title: t('step1_track'),
            description: t('step1_track_desc'),
            completed: true,
            time: '2024-01-14 09:00'
          },
          {
            step: 2,
            title: t('step2_track'),
            description: t('step2_track_desc'),
            completed: true,
            time: '2024-01-14 14:30'
          },
          {
            step: 3,
            title: t('step3_track'),
            description: t('step3_track_desc'),
            completed: false,
            time: '2024-01-15 15:30'
          }
        ]
      });
    }
  };

  return (
    <div className="space-y-6 arabic-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">{t('track_shipment')}</h1>
        <p className="text-muted-foreground text-lg">{t('enter_tracking_number')}</p>
      </div>

      {/* Tracking Input */}
      <Card className="glass-card shadow-xl border border-primary/20 max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder={t('enter_tracking_number')}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 bg-background/50 border-primary/30"
            />
            <Button 
              onClick={handleTrack}
              className="btn-primary px-8"
            >
              <Search className="h-4 w-4 ml-2" />
              {t('track')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Result */}
      {trackingResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Card */}
          <Card className="glass-card shadow-xl border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                {t('track_shipment')} {trackingResult.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {trackingResult.statusText}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الموقع الحالي</p>
                    <p className="font-medium">{trackingResult.currentLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('estimated_time')}</p>
                    <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-card shadow-xl border border-primary/20">
            <CardHeader>
              <CardTitle>{t('how_to_track_shipment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingResult.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      item.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-background border-muted-foreground text-muted-foreground'
                    }`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How to Track Guide */}
      {!trackingResult && (
        <Card className="glass-card shadow-xl border border-primary/20 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center gradient-text text-2xl">{t('how_to_track_shipment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('step1_track')}</h3>
                <p className="text-muted-foreground">{t('step1_track_desc')}</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('step2_track')}</h3>
                <p className="text-muted-foreground">{t('step2_track_desc')}</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('step3_track')}</h3>
                <p className="text-muted-foreground">{t('step3_track_desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerTracking;

