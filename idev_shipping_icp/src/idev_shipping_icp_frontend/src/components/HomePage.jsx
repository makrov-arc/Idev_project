import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Package,
  Truck,
  Store,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import '../App.css';

const HomePage = ({ onViewChange }) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('total_shipments'),
      value: '1,234',
      icon: Package,
      change: '+12%',
      color: 'text-blue-400'
    },
    {
      title: t('active_drivers'),
      value: '89',
      icon: Truck,
      change: '+5%',
      color: 'text-green-400'
    },
    {
      title: t('registered_stores'),
      value: '156',
      icon: Store,
      change: '+8%',
      color: 'text-purple-400'
    },
    {
      title: t('customers'),
      value: '2,567',
      icon: Users,
      change: '+15%',
      color: 'text-cyan-400'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'delivery',
      message: t('shipment_delivered_successfully', { id: 'SH001' }),
      time: t('minutes_ago', { minutes: 5 }),
      status: 'success'
    },
    {
      id: 2,
      type: 'pickup',
      message: t('new_shipment_received', { id: 'SH002' }),
      time: t('minutes_ago', { minutes: 15 }),
      status: 'info'
    },
    {
      id: 3,
      type: 'return',
      message: t('return_request_for_shipment', { id: 'SH003' }),
      time: t('minutes_ago', { minutes: 30 }),
      status: 'warning'
    }
  ];

  const quickActions = [
    {
      title: t('create_new_shipment'),
      description: t('add_new_shipment_desc'),
      icon: Package,
      action: () => onViewChange('store'),
      color: 'bg-blue-500'
    },
    {
      title: t('track_shipments'),
      description: t('track_shipments_desc'),
      icon: Clock,
      action: () => onViewChange('tracking'),
      color: 'bg-green-500'
    },
    {
      title: t('manage_drivers'),
      description: t('manage_drivers_desc'),
      icon: Truck,
      action: () => onViewChange('driver'),
      color: 'bg-purple-500'
    }
  ];

  const platformFeatures = [
    t('instant_shipment_tracking'),
    t('comprehensive_returns_management'),
    t('shipping_operations_coordination'),
    t('easy_to_use_interface'),
    t('detailed_reports'),
    t('multi_platform_support')
  ];

  return (
    <div className="space-y-8 arabic-text relative z-10">
      {/* Welcome Section */}
      <div className="text-center py-12 relative overflow-hidden rounded-lg shadow-lg glass-card-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 opacity-70 z-0"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl font-extrabold gradient-text mb-4 animate-fade-in-up">
            {t('welcome_title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('welcome_subtitle')}
          </p>
          <Button
            className="mt-8 px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 animate-fade-in-up animation-delay-400"
            onClick={() => onViewChange('register')}
          >
            {t('start_now')}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card hover:scale-105 transition-transform duration-300 shadow-xl border border-primary/20 animate-fade-in-up animation-delay-${index * 100}">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className={`text-sm ${stat.color} flex items-center mt-2`}>
                      <TrendingUp className="h-4 w-4 inline ml-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')}/20`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="glass-card shadow-xl border border-primary/20 animate-fade-in-up animation-delay-500">
        <CardHeader>
          <CardTitle className="gradient-text text-3xl">{t('quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/20 border-primary/30 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                >
                  <div className={`p-4 rounded-full ${action.color} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl text-white">{action.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities & Platform Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card shadow-xl border border-primary/20 animate-fade-in-up animation-delay-600">
          <CardHeader>
            <CardTitle className="gradient-text text-3xl">{t('recent_activities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors duration-200">
                  <div className={`p-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500/30' :
                    activity.status === 'info' ? 'bg-blue-500/30' :
                    'bg-yellow-500/30'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : activity.status === 'info' ? (
                      <Package className="h-5 w-5 text-blue-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-white">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card className="glass-card shadow-xl border border-primary/20 animate-fade-in-up animation-delay-700">
          <CardHeader>
            <CardTitle className="gradient-text text-3xl">{t('platform_features')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

