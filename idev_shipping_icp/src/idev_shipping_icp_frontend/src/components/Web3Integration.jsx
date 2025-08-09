import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Wallet, Link, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import web3Service from '../services/web3Service';
import icpService from '../services/icpService';

const Web3Integration = () => {
  const { t } = useTranslation();
  const [web3Connected, setWeb3Connected] = useState(false);
  const [icpConnected, setIcpConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [principal, setPrincipal] = useState('');
  const [balance, setBalance] = useState('0');
  const [networkName, setNetworkName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize Web3
      const web3Initialized = await web3Service.init();
      if (web3Initialized && web3Service.isConnected()) {
        setWeb3Connected(true);
        setAccount(web3Service.getAccount());
        setNetworkName(web3Service.getNetworkName());
        const balance = await web3Service.getBalance();
        setBalance(balance);
      }

      // Initialize ICP
      await icpService.init();
      if (icpService.isAuthenticated) {
        setIcpConnected(true);
        const principalId = icpService.getPrincipal();
        setPrincipal(principalId?.toString() || '');
      }
    } catch (error) {
      console.error('Failed to initialize services:', error);
      setError('Failed to initialize blockchain services');
    }
  };

  const connectWeb3 = async () => {
    setLoading(true);
    setError('');
    try {
      const account = await web3Service.connectWallet();
      setWeb3Connected(true);
      setAccount(account);
      setNetworkName(web3Service.getNetworkName());
      const balance = await web3Service.getBalance();
      setBalance(balance);
      setSuccess('Web3 wallet connected successfully!');
    } catch (error) {
      setError(`Failed to connect Web3 wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const connectICP = async () => {
    setLoading(true);
    setError('');
    try {
      await icpService.login();
      setIcpConnected(true);
      const principalId = icpService.getPrincipal();
      setPrincipal(principalId?.toString() || '');
      setSuccess('ICP Internet Identity connected successfully!');
    } catch (error) {
      setError(`Failed to connect ICP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWeb3 = async () => {
    setWeb3Connected(false);
    setAccount('');
    setBalance('0');
    setNetworkName('');
    setSuccess('Web3 wallet disconnected');
  };

  const disconnectICP = async () => {
    await icpService.logout();
    setIcpConnected(false);
    setPrincipal('');
    setSuccess('ICP Internet Identity disconnected');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {t('web3_integration')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('connect_blockchain_services')}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Web3 Connection Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              {t('web3_wallet')}
              {web3Connected && (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t('connected')}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {t('connect_metamask_wallet')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {web3Connected ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('account')}:
                  </p>
                  <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {formatAddress(account)}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('network')}:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {networkName}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('balance')}:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {parseFloat(balance).toFixed(4)} ETH
                  </p>
                </div>
                <Button 
                  onClick={disconnectWeb3}
                  variant="outline"
                  className="w-full"
                >
                  {t('disconnect')}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectWeb3}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wallet className="h-4 w-4 mr-2" />
                )}
                {t('connect_wallet')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ICP Connection Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-purple-600" />
              {t('icp_identity')}
              {icpConnected && (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t('connected')}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {t('connect_internet_identity')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {icpConnected ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('principal_id')}:
                  </p>
                  <p className="font-mono text-xs text-purple-600 dark:text-purple-400 break-all">
                    {principal}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('network')}:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Internet Computer
                  </p>
                </div>
                <Button 
                  onClick={disconnectICP}
                  variant="outline"
                  className="w-full"
                >
                  {t('disconnect')}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectICP}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {t('connect_identity')}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-center">
            {t('integration_status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                web3Connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Wallet className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Web3</p>
              <Badge variant={web3Connected ? 'success' : 'secondary'}>
                {web3Connected ? t('connected') : t('disconnected')}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                icpConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Link className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">ICP</p>
              <Badge variant={icpConnected ? 'success' : 'secondary'}>
                {icpConnected ? t('connected') : t('disconnected')}
              </Badge>
            </div>
          </div>
          
          {web3Connected && icpConnected && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                {t('full_blockchain_integration_active')}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                {t('platform_ready_for_decentralized_operations')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Web3Integration;

